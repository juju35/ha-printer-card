// Layout shift on state updates, measured in Chromium (`npm run test:browser`, run by CI in the screenshots job): Home Assistant pushes a new hass on every state change of the instance. An update of an entity the card does
// not show changes nothing in its shadow DOM; an update of its own entities is patched in place (no node replaced:
// icons, the illustration and the printer's picture stay the same nodes, so nothing reloads or restarts) and the card keeps its height on
// every frame, so that the dashboard does not move.
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { chromium } from "playwright";
import { source } from "./source.mjs";


let browser;
before(async () => {
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
});
after(() => browser?.close());

// ha-card as in Home Assistant (Lit): its slot is only drawn a microtask after it is connected, so that its content has
// no size until then. ha-icon: empty (no size) until its icon is loaded, a little later.
const STUBS = `customElements.define("ha-card", class extends HTMLElement { constructor() { super(); this.attachShadow({ mode: "open" });
  this.updateComplete = new Promise((res) => { this._done = res; }); }
  connectedCallback() { if (this._drawn) return; this._drawn = true; Promise.resolve().then(() => {
    this.shadowRoot.innerHTML = "<style>:host{display:block;border:1px solid #ddd}</style><slot></slot>"; this._done(true); }); } });
customElements.define("ha-icon", class extends HTMLElement { constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { setTimeout(() => { this.shadowRoot.innerHTML = '<span style="display:inline-block;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)"></span>'; }, 16); } });`;

// An HP printer (HP Printer integration): a main device, one sub-device per cartridge, and its IPP device.
const entities = {};
const states = {};
const devices = {
  hp: { id: "hp", name: "OfficeJet Pro 9010 series", manufacturer: "HP", model: "OfficeJet Pro 9010" },
  ipp: { id: "ipp", name: "HP OfficeJet Pro 9010 (IPP)", manufacturer: "HP", model: "OfficeJet Pro 9010" },
};
const add = (device, id, state, attributes = {}) => {
  entities[id] = { entity_id: id, device_id: device };
  states[id] = { entity_id: id, state, last_changed: new Date().toISOString(), attributes: { friendly_name: id, ...attributes } };
};
add("hp", "sensor.officejet_status", "ready", { options: ["ready", "inpowersave", "processing", "scanprocessing", "copying", "canceljob", "stopped"] });
add("hp", "binary_sensor.officejet_eprint", "on", { device_class: "connectivity" });
add("hp", "sensor.officejet_printer_total_pages", "2148", { unit_of_measurement: "pages" });
[["black", 50], ["cyan", 50], ["magenta", 50], ["yellow", 12]].forEach(([color, level], i) => {
  const dev = `ink_${color}`;
  devices[dev] = { id: dev, name: `${color[0].toUpperCase() + color.slice(1)} cartridge`, via_device_id: "hp", manufacturer: "HP" };
  add(dev, `sensor.${color}_cartridge_level`, String(level), { unit_of_measurement: "%" });
  add(dev, `sensor.${color}_cartridge_station`, String(i + 1));
});
add("ipp", "sensor.officejet_ipp", "idle", { uri_supported: "ipp://192.0.2.30/ipp/print", options: ["idle", "printing", "stopped"], state_reason: "media-empty-error" });

// Own entities changed one after another (status, ink levels, page count).
const CHANGES = [
  ["sensor.officejet_status", "processing"],
  ["sensor.black_cartridge_level", "49"],
  ["sensor.officejet_printer_total_pages", "2149"],
  ["sensor.yellow_cartridge_level", "11"],
  ["sensor.officejet_status", "ready"],
];
const CARDS = [
  ["printer-card", {}],
  ["printer-card", { illustration: false }],
  ["printer-mini-card", {}],
  ["printer-mini-card", { illustration: false }],
];

for (const [type, extra] of CARDS) {
  test(`${type}${extra.illustration === false ? " (classic header)" : ""}: state updates neither replace nodes nor change the height`, async () => {
    const page = await browser.newPage({ viewport: { width: 1000, height: 900 } });
    try {
      await page.setContent('<!doctype html><body style="margin:0;font-family:Arial,sans-serif"></body>');
      await page.addScriptTag({ content: STUBS });
      await page.addScriptTag({ content: source });
      const r = await page.evaluate(
        async ({ type, extra, data, CHANGES }) => {
          const frame = () => new Promise((res) => requestAnimationFrame(res));
          const hassOf = (s) => ({ states: s, entities: data.entities, devices: data.devices, language: "en", locale: { language: "en" }, themes: {}, callService() {}, callWS: async () => ({}) });
          const outer = document.body.appendChild(document.createElement("div"));
          outer.style.width = "400px";
          const card = document.createElement(type);
          card.setConfig({ type: `custom:${type}`, ...extra });
          let s = { ...data.states };
          card.hass = hassOf(s);
          outer.appendChild(card);
          await new Promise((res) => setTimeout(res, 300));
          for (let i = 0; i < 5; i++) await frame();
          let count = { removed: 0, other: 0 };
          const tally = (ms) => {
            for (const m of ms) m.type === "childList" ? (count.removed += m.removedNodes.length) : count.other++;
          };
          const mo = new MutationObserver(tally);
          mo.observe(card.shadowRoot, { subtree: true, childList: true, attributes: true, characterData: true });
          const heights = new Set();
          let on = true;
          (async () => {
            while (on) {
              heights.add(Math.round(card.getBoundingClientRect().height));
              await frame();
            }
          })();
          const settle = async () => {
            for (let i = 0; i < 3; i++) await frame();
            tally(mo.takeRecords());
            const c = count;
            count = { removed: 0, other: 0 };
            return c;
          };
          const unrelated = [];
          const own = [];
          for (const [id, state] of CHANGES) {
            s = { ...s, "sensor.unrelated": { entity_id: "sensor.unrelated", state: String(Math.random()), attributes: {} } };
            card.hass = hassOf(s);
            unrelated.push(await settle());
            s = { ...s, [id]: { ...s[id], state } };
            card.hass = hassOf(s);
            own.push(await settle());
          }
          on = false;
          mo.disconnect();
          return { unrelated, own, heights: [...heights] };
        },
        { type, extra, data: { states, entities, devices }, CHANGES },
      );
      assert.deepEqual(r.unrelated, CHANGES.map(() => ({ removed: 0, other: 0 })), "an unrelated update mutated the card");
      assert.ok(r.own.some((c) => c.other), "the card's own updates were not shown");
      assert.deepEqual(r.own.map((c) => c.removed), CHANGES.map(() => 0), "an update replaced nodes instead of patching them");
      assert.equal(r.heights.length, 1, `the height changed: ${r.heights}`);
    } finally {
      await page.close();
    }
  });
}
