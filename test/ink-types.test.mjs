import assert from "node:assert/strict";
import { test } from "node:test";
import { loadCard } from "./load.mjs";

const { PrinterCard, PrinterMiniCard, hpInkColor, HP_INK_COLORS, HpI18n } = loadCard("printer-card.js", ["PrinterCard", "PrinterMiniCard", "hpInkColor", "HP_INK_COLORS", "HpI18n"]);

const st = (state, attributes = {}) => ({ state, attributes });

test("hpInkColor: photo, light, matte and gray inks get their own color", () => {
  const cases = {
    "Black(BK)": "black",
    "Photo Black": "photo_black",
    PhotoBlack: "photo_black",
    "Matte Black(MBK)": "matte_black",
    "Gray(GY)": "gray",
    "Light Gray(LGY)": "light_gray",
    "Light Black": "gray",
    "Light Light Black": "light_gray",
    "Photo Cyan(PC)": "photo_cyan",
    "Light Cyan": "light_cyan",
    lightcyan: "light_cyan",
    "Photo Magenta(PM)": "photo_magenta",
    "Vivid Light Magenta": "light_magenta",
    "Vivid Magenta": "magenta",
    "yellow ink": "yellow",
    "tri-color ink": "tricolor",
    "Red(R)": "red",
    Orange: "orange",
    Green: "green",
    Blue: "blue",
    Violet: "violet",
    "Chroma Optimizer(CO)": "optimizer",
    "cartouche noire": "black",
    "Cartouche gris clair": "light_gray",
  };
  for (const [name, color] of Object.entries(cases)) assert.equal(hpInkColor(name), color, name);
});

test("hpInkColor: a model name is no cartridge color, short codes only count on the cartridge's own name", () => {
  assert.equal(hpInkColor("Photosmart 7520 black cartridge"), "black");
  assert.equal(hpInkColor("Something"), null);
  assert.equal(hpInkColor("PGBK"), null);
  assert.equal(hpInkColor("PGBK", true), "black");
  assert.equal(hpInkColor("LGY", true), "light_gray");
  assert.equal(hpInkColor("PM", true), "photo_magenta");
});

test("every cartridge color has a label in every language and a fill", () => {
  for (const color of Object.keys(HP_INK_COLORS)) {
    for (const [lang, strings] of Object.entries(HpI18n)) assert.ok(strings[`c_${color}`], `${lang}: c_${color}`);
  }
});

// Canon PIXMA PRO-100 through IPP (juju35/ha-printer-scanner-card#86): eight inks, two photo ones and two grays.
const PRO100 = [
  ["cyan", "Cyan(C)", "40"],
  ["black_bk", "Black(BK)", "80"],
  ["gray", "Gray(GY)", "60"],
  ["light_gray", "Light Gray(LGY)", "70"],
  ["yellow", "Yellow(Y)", "30"],
  ["magenta", "Magenta(M)", "50"],
  ["photo_magenta", "Photo Magenta(PM)", "20"],
  ["photo_cyan", "Photo Cyan(PC)", "90"],
];
function canonHass(inks = PRO100, deviceName = "Canon PRO-100 series") {
  const states = { "sensor.canon_pro_100_series": st("idle", { uri_supported: "ipp://canon.local/ipp/print", state_reason: "none", options: ["idle", "printing", "stopped"] }) };
  const entities = { "sensor.canon_pro_100_series": { entity_id: "sensor.canon_pro_100_series", device_id: "c" } };
  for (const [key, name, level] of inks) {
    const id = `sensor.canon_pro_100_series_${key}`;
    states[id] = st(level, { unit_of_measurement: "%", marker_type: "ink-cartridge", friendly_name: `${deviceName} ${name}` });
    entities[id] = { entity_id: id, device_id: "c" };
  }
  return { language: "en", states, entities, devices: { c: { name: deviceName, manufacturer: "Canon", model: "PRO-100 series" } } };
}
function render(hass, Card = PrinterCard, config = { device_id: "c" }) {
  const card = new Card();
  card.setConfig(config);
  card.hass = hass;
  return card.shadowRoot.innerHTML;
}

test("Canon PRO-100: eight inks with their photo and gray names, in color order, on two rows of four", () => {
  const html = render(canonHass());
  const labels = [...html.matchAll(/<div class="lbl">([^<]*)<\/div>/g)].map((m) => m[1]);
  assert.deepEqual(labels, ["Black", "Gray", "Light gray", "Cyan", "Photo cyan", "Magenta", "Photo magenta", "Yellow"]);
  assert.match(html, /class="inks" style="--n:4"/);
  // The photo inks are not drawn in the color of their plain counterpart.
  const fill = (pct) => new RegExp(`height:${pct}%;min-height:3px;background:([^"]+)"`).exec(html)[1];
  assert.notEqual(fill(90), fill(40));
  assert.notEqual(fill(20), fill(50));
  assert.notEqual(fill(60), fill(70));
});

test("up to six cartridges stay on one row", () => {
  assert.match(render(canonHass(PRO100.slice(0, 6))), /class="inks" style="--n:6"/);
  assert.match(render(canonHass(PRO100.slice(0, 7))), /class="inks" style="--n:4"/);
});

test("the mini card tints each chip with the cartridge's own color", () => {
  const html = render(canonHass(), PrinterMiniCard);
  assert.ok(html.includes(`background:${HP_INK_COLORS.photo_cyan}`));
  assert.ok(html.includes(`background:${HP_INK_COLORS.light_gray}`));
});

test("a photo printer model does not make its black a photo black", () => {
  const html = render(canonHass([["black", "Black", "80"]], "Canon PIXMA Photo TS8350"));
  assert.match(html, /<div class="lbl">Black<\/div>/);
});

test("two blacks of a Canon PIXMA (PGBK and BK) are told apart by their code, also in alerts", () => {
  const hass = canonHass([["black_pgbk", "Black(PGBK)", "50"], ["black_bk", "Black(BK)", "3"], ["cyan", "Cyan(C)", "50"]]);
  const html = render(hass);
  assert.match(html, /<div class="lbl">Black PGBK<\/div>/);
  assert.match(html, /<div class="lbl">Black BK<\/div>/);
  assert.match(html, /<div class="lbl">Cyan<\/div>/);
  hass.language = "fr";
  assert.match(render(hass), /noire BK/);
});

// juju35/ha-printer-scanner-card#92: the PRO-100 reports its photo magenta and light gray as plain "Magenta" and "Gray",
// only their entity IDs tell them apart; the device was renamed, so the friendly names no longer carry its original name.
test("Canon PRO-100: a marker named like its plain color takes the variant its entity ID names", () => {
  const hass = canonHass([
    ["black_bk", "Black(BK)", "10"], ["gray", "Gray", "70"], ["light_gray", "Gray", "100"], ["cyan", "Cyan", "40"],
    ["photo_cyan", "Photo Cyan", "40"], ["magenta", "Magenta", "100"], ["photo_magenta", "Magenta", "99"], ["yellow", "Yellow", "10"],
  ]);
  hass.devices.c.name_by_user = "Canon Pro-100";
  for (const id of Object.keys(hass.states)) {
    const fn = hass.states[id].attributes.friendly_name;
    if (fn) hass.states[id].attributes.friendly_name = fn.replace("Canon PRO-100 series", "Canon Pro-100");
  }
  const html = render(hass);
  const labels = [...html.matchAll(/<div class="lbl">([^<]*)<\/div>/g)].map((m) => m[1]);
  assert.deepEqual(labels, ["Black", "Gray", "Light gray", "Cyan", "Photo cyan", "Magenta", "Photo magenta", "Yellow"]);
  const fill = (pct) => new RegExp(`height:${pct}%;min-height:3px;background:([^"]+)"`).exec(html)[1];
  assert.equal(fill(99), HP_INK_COLORS.photo_magenta);
  assert.ok(html.includes(`background:${HP_INK_COLORS.light_gray}`));
});

test("a model word in a renamed device's entity IDs does not change the marker's color", () => {
  const hass = canonHass([["black", "Black", "80"]], "Canon PIXMA Photo TS8350");
  const id = "sensor.canon_pixma_photo_ts8350_black";
  hass.states[id] = hass.states["sensor.canon_pro_100_series_black"];
  hass.entities[id] = { entity_id: id, device_id: "c" };
  delete hass.states["sensor.canon_pro_100_series_black"];
  delete hass.entities["sensor.canon_pro_100_series_black"];
  hass.devices.c.name_by_user = "Office printer";
  hass.states[id].attributes.friendly_name = "Office printer Black";
  assert.match(render(hass), /<div class="lbl">Black<\/div>/);
});

test("grays keep the same fixed color on every theme, light gray paler than gray; only the blacks follow the theme", () => {
  const lum = (hex) => Number.parseInt(hex.slice(1, 3), 16);
  for (const k of ["gray", "light_gray"]) assert.match(HP_INK_COLORS[k], /^#[0-9a-f]{6}$/i, k);
  assert.ok(lum(HP_INK_COLORS.light_gray) > lum(HP_INK_COLORS.gray));
  for (const k of ["black", "photo_black", "matte_black"]) assert.match(HP_INK_COLORS[k], /--primary-text-color/, k);
});

test("an optimizer alert does not call it ink, in French and English", () => {
  const hass = canonHass([["chroma_optimizer", "Chroma Optimizer(CO)", "10"], ["black", "Black(BK)", "80"]]);
  let html = render(hass);
  assert.match(html, /Optimizer low \(10 %\)/);
  assert.doesNotMatch(html, /Optimizer ink/i);
  hass.language = "fr";
  html = render(hass);
  assert.match(html, /Optimiseur faible \(10 %\)/);
  assert.doesNotMatch(html, /Encre optimiseur/i);
});
