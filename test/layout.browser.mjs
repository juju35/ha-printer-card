// Layout in real containers, measured in Chromium: the cards neither collapse in an intrinsically sized parent
// (inline-block, `auto` grid column: layout-card, button-card) nor overflow a `1fr 1fr` grid (layout-card, grids
// whose columns keep min-width: auto), directly or wrapped in a <div>, in every view and state, offline included.
// Run with `npm run test:browser` (needs `npx playwright install chromium`); CI runs it in the screenshots job.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const SRC = readFileSync(fileURLToPath(new URL("../src/printer-card.js", import.meta.url)), "utf8");
const STUBS = `
customElements.define("ha-card", class extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }).innerHTML = "<style>:host{display:block;overflow:hidden}</style><slot></slot>"; }
});
customElements.define("ha-icon", class extends HTMLElement {
  connectedCallback() { this.style.display = "inline-flex"; this.innerHTML = '<svg viewBox="0 0 24 24" style="width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)"></svg>'; }
});`;

const CONTEXTS = [
  ["inline-block", "display:inline-block", 1],
  ["grid auto", "display:grid;grid-template-columns:auto 1fr;width:600px", 1],
  ...[320, 360, 500].map((w) => [`grid 1fr 1fr ${w}px`, `display:grid;grid-template-columns:1fr 1fr;gap:8px;width:${w}px`, 2]),
];
const VIEWS = ["printer-card", "printer-mini-card", "zoomed mini"];
// "unavailable" is the offline view: its "Last seen ..." line is the longest unbreakable text of the mini card.
const STATES = ["ready", "processing", "canceljob", "inpowersave", "unknown", "unavailable"];
// hu, bg and el: the longest labels of the newer languages (section titles, status pill, offline line).
const LANGS = ["en", "pl", "sr-Latn", "hu", "bg", "el"];

let browser;
let page;
before(async () => {
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  page = await browser.newPage({ viewport: { width: 900, height: 900 } });
  await page.setContent("<!doctype html><body style='margin:0;font-family:Roboto,Arial,sans-serif'></body>");
  await page.addScriptTag({ content: STUBS });
  await page.addScriptTag({ content: SRC });
});
after(async () => browser?.close());

// Renders one context and returns, per card, its width and how far it or its header sticks out.
function measure(page, args) {
  return page.evaluate(async ({ css, n, wrapDiv, view, state, lang }) => {
    const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const mk = () => {
      const devices = { hp: { id: "hp", name: "OfficeJet Pro 9010 series", manufacturer: "HP" } };
      const entities = { "sensor.s": { entity_id: "sensor.s", device_id: "hp" } };
      const states = {
        "sensor.s": {
          entity_id: "sensor.s",
          state,
          last_changed: new Date(Date.now() - 3 * 864e5).toISOString(),
          attributes: { options: ["ready", "inpowersave", "processing", "scanprocessing", "canceljob"] },
        },
      };
      for (const [c, l] of [["black", 50], ["cyan", 8]]) {
        devices[`ink_${c}`] = { id: `ink_${c}`, name: `${c} cartridge`, via_device_id: "hp" };
        entities[`sensor.${c}`] = { entity_id: `sensor.${c}`, device_id: `ink_${c}` };
        states[`sensor.${c}`] = { entity_id: `sensor.${c}`, state: String(l), attributes: { unit_of_measurement: "%" } };
      }
      const el = document.createElement(view === "zoomed mini" ? "printer-mini-card" : view);
      el.setConfig({ type: `custom:${el.localName}`, language: lang });
      el.hass = { states, entities, devices, language: lang, locale: { language: lang }, themes: {}, callService: async () => {}, callWS: async () => ({}) };
      return el;
    };
    const wrap = document.createElement("div");
    wrap.setAttribute("style", css);
    document.body.appendChild(wrap);
    const els = [];
    for (let i = 0; i < n; i++) {
      const el = mk();
      els.push(el);
      if (wrapDiv) wrap.appendChild(document.createElement("div")).appendChild(el);
      else wrap.appendChild(el);
    }
    await frame();
    if (view === "zoomed mini") {
      for (const el of els) el.shadowRoot.querySelector(".zoom").dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true, detail: 1 }));
      await frame();
    }
    const box = wrap.getBoundingClientRect();
    const cell = n === 2 ? (box.width - 8) / 2 : Infinity;
    const cards = els.map((el) => {
      const c = el.shadowRoot.querySelector("ha-card").getBoundingClientRect();
      let headerOut = 0;
      for (const e of el.shadowRoot.querySelectorAll(".header, .header *")) {
        const b = e.getBoundingClientRect();
        if (b.width) headerOut = Math.max(headerOut, b.right - c.right);
      }
      const line = el.shadowRoot.querySelector(".mini .line span");
      const ls = line && getComputedStyle(line);
      return {
        width: c.width,
        out: c.right - box.right,
        headerOut,
        line: line && { width: line.getBoundingClientRect().width, ellipsis: ls.textOverflow === "ellipsis", overflow: ls.overflow },
      };
    });
    const scroll = wrap.scrollWidth - wrap.clientWidth;
    wrap.remove();
    return { cell, cards, scroll };
  }, args);
}

for (const [label, css, n] of CONTEXTS) {
  for (const wrapDiv of [false, true]) {
    test(`containers: ${label}${wrapDiv ? ", card in a div" : ""}`, async () => {
      for (const view of VIEWS) {
        for (const state of STATES) {
          for (const lang of LANGS) {
            const where = `${view} ${state} ${lang}`;
            const { cell, cards, scroll } = await measure(page, { css, n, wrapDiv, view, state, lang });
            assert.ok(scroll <= 0, `${where}: the container scrolls by ${scroll}px`);
            for (const c of cards) {
              assert.ok(c.out <= 0.5, `${where}: the card overflows its container by ${c.out.toFixed(1)}px`);
              assert.ok(c.width <= cell + 0.5, `${where}: the card (${c.width.toFixed(1)}px) is wider than its column (${cell}px)`);
              // Intrinsic parents: a natural width, not the ~24px of the card's padding.
              assert.ok(c.width >= (n === 2 ? cell - 0.5 : 300), `${where}: the card collapsed to ${c.width.toFixed(1)}px`);
              assert.ok(c.headerOut <= 0.5, `${where}: the header sticks out of the card by ${c.headerOut.toFixed(1)}px`);
              // The offline line stays visible and ends with an ellipsis when it is too long.
              if (c.line) {
                assert.ok(c.line.width >= 30, `${where}: the "last seen" line shrank to ${c.line.width.toFixed(1)}px`);
                assert.ok(c.line.ellipsis && c.line.overflow === "hidden", `${where}: the "last seen" line is not ellipsized`);
              }
            }
          }
        }
      }
    });
  }
}
