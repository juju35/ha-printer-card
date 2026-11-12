import assert from "node:assert/strict";
import { test } from "node:test";
import { loadCard } from "./load.mjs";

const { PrinterCard, PrinterCardEditor, PrinterMiniCard, PrinterMiniCardEditor, hpHpInks, hpEsc, hpFill, hpPictureFor, hpSubDevices, hpFindIppSensor, hpBrandOf, hpDaysToEmpty, document: sandboxDocument, customElements, listeners } = loadCard("printer-card.js", [
  "document",
  "hpBrandOf",
  "PrinterCard",
  "PrinterCardEditor",
  "PrinterMiniCard",
  "PrinterMiniCardEditor",
  "hpPictureFor",
  "hpHpInks",
  "hpEsc",
  "hpFill",
  "hpSubDevices",
  "hpFindIppSensor",
  "hpDaysToEmpty",
]);

const st = (state, attributes = {}, extra = {}) => ({ state, attributes, ...extra });
const STATUS_OPTIONS = ["ready", "inpowersave", "processing", "scanprocessing", "stopped"];

// A HP Printer device (p) with one cartridge sub-device per color, without slot sensors.
function mockHass({ status = "ready", totalPages = "12345", lastChanged } = {}) {
  const states = {
    "sensor.printer_status": st(status, { options: STATUS_OPTIONS }, { last_changed: lastChanged }),
    "sensor.printer_total_pages": st(totalPages, { unit_of_measurement: "pages", state_class: "total_increasing" }),
  };
  const entities = {
    "sensor.printer_status": { entity_id: "sensor.printer_status", device_id: "p" },
    "sensor.printer_total_pages": { entity_id: "sensor.printer_total_pages", device_id: "p_counters" },
  };
  const devices = { p: { name: "OfficeJet", manufacturer: "HP" }, p_counters: { name: "OfficeJet Printer", via_device_id: "p" } };
  for (const color of ["yellow", "black", "cyan", "magenta"]) {
    const id = `sensor.${color}_level`;
    states[id] = st("50", { unit_of_measurement: "%" });
    entities[id] = { entity_id: id, device_id: `ink_${color}` };
    devices[`ink_${color}`] = { name: `OfficeJet ${color} cartridge`, via_device_id: "p" };
  }
  return { language: "en", states, entities, devices };
}

function render(hass, config = { device_id: "p" }, Card = PrinterCard) {
  const card = new Card();
  card.setConfig(config);
  card.hass = hass;
  return card;
}

test("black comes first when cartridges have no slot sensor", () => {
  const hass = mockHass();
  const inks = hpHpInks(hass, ["ink_yellow", "ink_black", "ink_cyan", "ink_magenta"]);
  assert.equal(inks.map((i) => i.color).join(","), "black,cyan,magenta,yellow");
});

test("a non-numeric total pages state is escaped", () => {
  const html = render(mockHass({ totalPages: "<b onmouseover=alert(1)>x</b>" })).shadowRoot.innerHTML;
  assert.doesNotMatch(html, /<b onmouseover/);
  assert.match(html, /&lt;b onmouseover=alert\(1\)&gt;x&lt;\/b&gt; pages printed/);
});

test("the 'last seen' text follows the clock while the printer is offline", (t) => {
  const t0 = Date.parse("2026-10-24T10:00:00Z");
  t.mock.timers.enable({ apis: ["Date"], now: t0 + 5 * 60000 });
  const card = render(mockHass({ status: "unavailable", lastChanged: new Date(t0).toISOString() }));
  assert.ok(card.shadowRoot.innerHTML.includes("5 minutes ago"), "5 minutes ago");
  t.mock.timers.setTime(t0 + 2 * 3600000);
  card._update(); // what the one-minute interval does
  assert.ok(card.shadowRoot.innerHTML.includes("2 hours ago"), "2 hours ago");
});

test("an online printer is not re-rendered by the clock alone", () => {
  const card = render(mockHass());
  const before = card.shadowRoot.innerHTML;
  card.shadowRoot.innerHTML = "untouched";
  card._update();
  assert.equal(card.shadowRoot.innerHTML, "untouched");
  assert.ok(before.length > 0);
});

test("discovery is reused until the registry changes", () => {
  const hass = mockHass();
  const card = render(hass);
  const first = card._resolve();
  card._hass = { ...hass, states: { ...hass.states } };
  assert.equal(card._resolve(), first);
  card._hass = { ...hass, entities: { ...hass.entities } };
  assert.notEqual(card._resolve(), first);
});

// The IPP integration may load after HP Printer: its sensor is missing, then unavailable, then ready.
function withIpp(hass, ippState) {
  const out = { ...hass, states: { ...hass.states }, entities: { ...hass.entities }, devices: { ...hass.devices } };
  out.devices.p = { ...out.devices.p, model: "OfficeJet Pro 9010" };
  out.devices.ipp_dev = { name: "OfficeJet IPP", model: "OfficeJet Pro 9010" };
  out.entities["sensor.ipp_printer"] = { entity_id: "sensor.ipp_printer", device_id: "ipp_dev" };
  if (ippState) out.states["sensor.ipp_printer"] = ippState;
  return out;
}
const IPP_READY = st("idle", { uri_supported: "ipp://printer.local/ipp/print", state_reason: "media-empty-error" });

for (const [label, first] of [["absent", undefined], ["unavailable", st("unavailable", {})]]) {
  test(`the IPP sensor is found once it becomes ready (${label} on the first render)`, () => {
    const base = withIpp(mockHass(), first);
    const card = render(base);
    assert.equal(card._resolve().ipp, undefined);
    assert.doesNotMatch(card.shadowRoot.innerHTML, /Paper tray empty/);
    // Only the IPP state changes: same registry objects.
    card.hass = { ...base, states: { ...base.states, "sensor.ipp_printer": IPP_READY } };
    assert.equal(card._resolve().ipp, "sensor.ipp_printer");
    assert.match(card.shadowRoot.innerHTML, /Paper tray empty/);
  });
}

// Two printers of the same model: the IPP sensor must belong to the right unit.
test("the IPP sensor of another printer of the same model is not attached", () => {
  const hass = withIpp(mockHass(), IPP_READY);
  // A second HP Printer device of the same model makes the pairing ambiguous: the hosts decide.
  hass.devices.p2 = { name: "Office 2", manufacturer: "HP", model: "OfficeJet Pro 9010" };
  hass.states["sensor.p2_status"] = st("ready", { options: STATUS_OPTIONS });
  hass.entities["sensor.p2_status"] = { entity_id: "sensor.p2_status", device_id: "p2" };
  hass.devices.p = { ...hass.devices.p, configuration_url: "http://printer-2.local/" };
  assert.equal(hpFindIppSensor(hass, "p"), undefined);
  hass.devices.p = { ...hass.devices.p, configuration_url: "http://PRINTER.local/" };
  assert.equal(hpFindIppSensor(hass, "p"), "sensor.ipp_printer");
  // The same name without its domain still matches.
  hass.devices.p = { ...hass.devices.p, configuration_url: "http://printer/" };
  assert.equal(hpFindIppSensor(hass, "p"), "sensor.ipp_printer");
});

// IP address on one side, mDNS name on the other: a single printer of that model still gets its IPP sensor.
test("a single printer of the model keeps its IPP sensor when the hosts are written differently", () => {
  const hass = withIpp(mockHass(), IPP_READY);
  hass.devices.p = { ...hass.devices.p, configuration_url: "http://192.168.1.30/" };
  assert.equal(hpFindIppSensor(hass, "p"), "sensor.ipp_printer");
});

// One HP Printer device and one IPP sensor of the same model can still be two printers (A followed by
// HP Printer only, B by IPP only): hosts of the same form that differ refuse the pairing.
test("a single HP and a single IPP printer of the same model with different IP addresses are not paired", () => {
  const hass = withIpp(mockHass(), st("idle", { uri_supported: "ipp://192.168.1.31/ipp/print" }));
  hass.devices.p = { ...hass.devices.p, configuration_url: "http://192.168.1.30/" };
  assert.equal(hpFindIppSensor(hass, "p"), undefined);
});

test("a single HP and a single IPP printer of the same model with different host names are not paired", () => {
  const hass = withIpp(mockHass(), IPP_READY);
  hass.devices.p = { ...hass.devices.p, configuration_url: "http://other-printer.local/" };
  assert.equal(hpFindIppSensor(hass, "p"), undefined);
  // The same name with or without its domain is the same printer.
  hass.devices.p = { ...hass.devices.p, configuration_url: "http://PRINTER/" };
  assert.equal(hpFindIppSensor(hass, "p"), "sensor.ipp_printer");
});

test("a single pair is matched on the IPP host of the same form when both forms are advertised", () => {
  const hass = withIpp(mockHass(), st("idle", { uri_supported: ["ipp://hp1234.local/ipp/print", "ipps://192.168.1.30/ipp/print"] }));
  hass.devices.p = { ...hass.devices.p, configuration_url: "http://192.168.1.30/" };
  assert.equal(hpFindIppSensor(hass, "p"), "sensor.ipp_printer");
  hass.devices.p = { ...hass.devices.p, configuration_url: "http://192.168.1.31/" };
  assert.equal(hpFindIppSensor(hass, "p"), undefined);
});

test("a single pair is still matched when one side gives an IPv4 address and the other an IPv6 one", () => {
  const hass = withIpp(mockHass(), st("idle", { uri_supported: "ipp://[fe80::1]/ipp/print" }));
  hass.devices.p = { ...hass.devices.p, configuration_url: "http://192.168.1.30/" };
  assert.equal(hpFindIppSensor(hass, "p"), "sensor.ipp_printer");
});

test("the HP status sensor of the other printer missing from the states does not pair it", () => {
  const hass = withIpp(mockHass(), st("idle", { uri_supported: "ipp://192.168.1.31/ipp/print" }));
  hass.devices.p2 = { name: "Office 2", manufacturer: "HP", model: "OfficeJet Pro 9010" };
  hass.entities["sensor.p2_status"] = { entity_id: "sensor.p2_status", device_id: "p2" };
  hass.devices.p = { ...hass.devices.p, configuration_url: "http://192.168.1.30/" };
  assert.equal(hpFindIppSensor(hass, "p"), undefined);
});

test("with identical printers, any advertised host of the IPP sensor can match", () => {
  const hass = withIpp(mockHass(), st("idle", { uri_supported: ["ipp://hp1234.local/ipp/print", "ipps://192.168.1.30/ipp/print"] }));
  hass.devices.p2 = { name: "Office 2", manufacturer: "HP", model: "OfficeJet Pro 9010" };
  hass.states["sensor.p2_status"] = st("ready", { options: STATUS_OPTIONS });
  hass.entities["sensor.p2_status"] = { entity_id: "sensor.p2_status", device_id: "p2" };
  hass.devices.p = { ...hass.devices.p, configuration_url: "http://192.168.1.30/" };
  assert.equal(hpFindIppSensor(hass, "p"), "sensor.ipp_printer");
  hass.devices.p = { ...hass.devices.p, configuration_url: "http://192.168.1.31/" };
  assert.equal(hpFindIppSensor(hass, "p"), undefined);
});

test("an empty cartridge reported by IPP is not repeated when the cartridges are known", () => {
  for (const reason of ["marker-supply-empty-error", "toner-empty-error"]) {
    const html = render(withIpp(mockHass(), st("idle", { state_reason: reason }))).shadowRoot.innerHTML;
    assert.doesNotMatch(html, /Cartridge empty|Toner empty/, reason);
  }
  // Without any cartridge sensor, the IPP reason is the only signal: it is kept, translated.
  const bare = ippHass({ reason: "toner-empty-error" });
  delete bare.entities["sensor.brother_black_toner"];
  assert.match(render(bare, { device_id: "b" }).shadowRoot.innerHTML, /Toner empty/);
});

test("Spanish alerts write the cartridge color in lower case", () => {
  const hass = { ...levels(mockHass(), { black: 10 }), language: "es" };
  assert.match(render(hass).shadowRoot.innerHTML, /Tinta baja: negro/);
});

test("Serbian alerts write the cartridge color in lower case, in the script of the language", () => {
  const html = (language) => render({ ...levels(mockHass(), { black: 10 }), language }).shadowRoot.innerHTML;
  assert.match(html("sr"), /Низак ниво мастила: црна/);
  assert.match(html("sr-Latn"), /Nizak nivo mastila: crna/);
});

test("Italian, Dutch, Portuguese and Polish alerts write the cartridge color in lower case", () => {
  const html = (language) => render({ ...levels(mockHass(), { black: 10 }), language }).shadowRoot.innerHTML;
  assert.match(html("it"), /Inchiostro scarso: nero/);
  assert.match(html("nl"), /Inktniveau laag: zwart/);
  assert.match(html("pt"), /Pouca tinta: preto/);
  assert.match(html("pl-PL"), /Niski poziom tuszu: czarny/);
});

test("the 12 newer languages write the cartridge color in lower case in alerts", () => {
  const html = (language) => render({ ...levels(mockHass(), { black: 10 }), language }).shadowRoot.innerHTML;
  const expected = {
    ro: /Cerneală puțină: negru/, da: /Lavt blækniveau: sort/, sv: /Låg bläcknivå: svart/, bg: /Ниско ниво на мастилото: черна/,
    ru: /Низкий уровень чернил: чёрный/, uk: /Низький рівень чорнила: чорний/, hu: /Alacsony tintaszint: fekete/,
    sk: /Nízka hladina atramentu: čierna/, "cs-CZ": /Nízká hladina inkoustu: černá/,
    sl: /Malo črnila: črna/, lv: /Zems tintes līmenis: melna/, "el-GR": /Χαμηλή στάθμη μελανιού: μαύρη/,
  };
  for (const [lang, re] of Object.entries(expected)) assert.match(html(lang), re, lang);
});

test("total pages: HA's full locale when it matches the card's language, pt read as European Portuguese", () => {
  const html = (hass, config) => render({ ...mockHass(), ...hass }, { device_id: "p", ...config }).shadowRoot.innerHTML;
  // Grouping with a (narrow no-break) space in pt-PT, a dot in pt-BR.
  assert.match(html({ language: "pt" }), /12\s345 páginas/u);
  assert.match(html({ language: "pt", locale: { language: "pt-BR" } }), /12\.345 páginas/);
  assert.match(html({ language: "pt-BR" }), /12\.345 páginas/);
  // The language option wins over a locale in another language.
  assert.match(html({ language: "en", locale: { language: "en-US" } }, { language: "pt" }), /12\s345 páginas/u);
  assert.match(html({ language: "de-CH" }), /12(&#39;|’)345 Seiten/);
});

test("without any host to compare, the same-model IPP sensor is still attached", () => {
  assert.equal(hpFindIppSensor(withIpp(mockHass(), IPP_READY), "p"), "sensor.ipp_printer");
});

test("a second printer named after the first is not absorbed as a sub-device", () => {
  const hass = mockHass();
  hass.devices.p2 = { name: "OfficeJet 2", manufacturer: "HP" };
  hass.states["sensor.printer_2_status"] = st("ready", { options: STATUS_OPTIONS });
  hass.entities["sensor.printer_2_status"] = { entity_id: "sensor.printer_2_status", device_id: "p2" };
  // Its cartridge sub-devices (linked by via_device_id) stay with it too.
  hass.devices.p2_ink = { name: "OfficeJet 2 black cartridge", manufacturer: "HP", via_device_id: "p2" };
  // A plain accessory without via_device_id is still found by the name fallback.
  hass.devices.p_scanner = { name: "OfficeJet Scanner", manufacturer: "HP" };
  assert.deepEqual([...hpSubDevices(hass, "p")].sort(), ["ink_black", "ink_cyan", "ink_magenta", "ink_yellow", "p_counters", "p_scanner"]);
});

test("a printer without IPP sensor does not redo the whole discovery on each update", () => {
  const hass = mockHass();
  const card = render(hass);
  const first = card._resolve();
  card._hass = { ...hass, states: { ...hass.states } };
  assert.equal(card._resolve(), first);
});

test("hpEsc escapes HTML text and attributes", () => {
  assert.equal(hpEsc(`<"'&>`), "&lt;&quot;&#39;&amp;&gt;");
});

test("admin_url only becomes a link with an http(s) scheme", () => {
  const html = (admin_url) => render(mockHass(), { device_id: "p", admin_url }).shadowRoot.innerHTML;
  assert.match(html("http://printer.local/"), /<a class="pic[^"]*" href="http:\/\/printer\.local\/"/);
  assert.doesNotMatch(html("javascript:alert(1)"), /javascript:/);
});

test("hpFill replaces placeholders of any length", () => {
  assert.equal(hpFill("{n} of {total}", { n: 1, total: 3 }), "1 of 3");
  assert.equal(hpFill("{missing}", {}), "{missing}");
});

test("editor labels follow the language option", () => {
  const label = (config, language = "en") => {
    const ed = new PrinterCardEditor();
    ed.setConfig(config);
    ed.hass = { language };
    return ed._form.computeLabel({ name: "name" });
  };
  assert.equal(label({}), "Name");
  assert.equal(label({ language: "fr" }), "Nom");
  assert.equal(label({ language: "en" }, "fr"), "Name");
});

// A focused control (picture link, mini-card detail button) keeps the keyboard
// focus when innerHTML rebuilds the card.
const fakeEl = (tag, classes) => ({
  tagName: tag.toUpperCase(),
  matches: (sel) => classes.split(" ").some((k) => sel === `${tag}.${k}`),
});
for (const [tag, cls, Card] of [["a", "pic", PrinterCard], ["button", "zoom", PrinterMiniCard]]) {
  test(`the focused ${cls} ${tag === "a" ? "link" : "button"} keeps the focus after a re-render`, () => {
    const hass = mockHass();
    const card = render(hass, { device_id: "p", admin_url: "http://printer.local" }, Card);
    const root = card.shadowRoot;
    root.activeElement = fakeEl(tag, `${cls} busy`);
    const focused = [];
    root.querySelector = (sel) => (sel === `${tag}.${cls}` ? { focus: (o) => focused.push([sel, o]), addEventListener() {} } : null);
    card.hass = { ...hass, states: { ...hass.states, "sensor.printer_status": st("processing", { options: STATUS_OPTIONS }) } };
    assert.match(root.innerHTML, /Printing|processing/i);
    assert.deepEqual(JSON.parse(JSON.stringify(focused)), [[`${tag}.${cls}`, { preventScroll: true }]]);
  });
}

test("an unfocused card does not take the focus on a re-render", () => {
  const hass = mockHass();
  const card = render(hass, { device_id: "p", admin_url: "http://printer.local" });
  let called = false;
  card.shadowRoot.querySelector = () => ({ focus: () => { called = true; } });
  card.hass = { ...hass, states: { ...hass.states, "sensor.printer_status": st("processing", { options: STATUS_OPTIONS }) } };
  assert.equal(called, false);
});

// IPP-only printer of another brand: a printer sensor and one sensor per toner cartridge.
function ippHass({ state = "idle", reason = "none", manufacturer = "Brother", model = "HL-L2350DW" } = {}) {
  const states = {
    "sensor.brother_printer": st(state, { uri_supported: "ipp://brother.local/ipp/print", state_reason: reason, options: ["idle", "printing", "stopped"] }),
    "sensor.brother_black_toner": st("42", { unit_of_measurement: "%", marker_type: "toner-cartridge", friendly_name: "Black toner" }),
  };
  const entities = {
    "sensor.brother_printer": { entity_id: "sensor.brother_printer", device_id: "b" },
    "sensor.brother_black_toner": { entity_id: "sensor.brother_black_toner", device_id: "b" },
  };
  return { language: "en", states, entities, devices: { b: { name: "Brother HL-L2350DW", manufacturer, model } } };
}

test("an IPP printer of another brand gets its brand picture, its toner, the printer icon and the brand badge", () => {
  const html = render(ippHass(), { device_id: "b" }).shadowRoot.innerHTML;
  assert.match(html, /class="art art-brother_laser"/);
  assert.match(html, /class="hp-badge brother"/);
  assert.match(html, /Toner levels/);
  assert.match(html, /42<small>%<\/small>/);
  assert.match(html, /class="logo mark"/);
});

test("IPP states and state reasons drive the status and alerts", () => {
  const html = render(ippHass({ state: "printing", reason: "media-jam-error" }), { device_id: "b" }).shadowRoot.innerHTML;
  assert.match(html, /Printing/);
  assert.match(html, /Paper jam/);
  assert.match(html, /class="pic busy"|class="pic busy /);
});

test("an HP printer through IPP only gets the HP picture and the printer icon", () => {
  const html = render(ippHass({ manufacturer: "HP", model: "LaserJet Pro M404dn" }), { device_id: "b" }).shadowRoot.innerHTML;
  assert.match(html, /class="logo mark"/);
  assert.doesNotMatch(html, /hp\.com/);
  assert.match(html, /art-laserjet/);
});

test("the picture follows the model", () => {
  const pic = (model, manufacturer = "HP", kind = "hp") => hpPictureFor({ manufacturer, model }, kind);
  assert.equal(pic("HP OfficeJet Pro 9012"), "officejet");
  assert.equal(pic("OfficeJet Pro 8020"), "officejet");
  assert.equal(pic("Color LaserJet Pro MFP M479fdw"), "laserjet");
  assert.equal(pic("DeskJet 2720e"), "deskjet");
  assert.equal(pic("Smart Tank 7305"), "smart_tank");
  assert.equal(pic("ET-2850", "EPSON", "ipp"), "ecotank");
  assert.equal(pic("XP-3200", "EPSON", "ipp"), "epson_inkjet");
  assert.equal(pic("HL-L2350DW", "Brother", "ipp"), "brother_laser");
  assert.equal(pic("MFC-J5340DW", "Brother", "brother"), "brother_inkjet");
  assert.equal(pic("PIXMA TS5350", "Canon", "ipp"), "pixma");
  assert.equal(pic("PIXMA G650", "Canon", "ipp"), "megatank");
  assert.equal(pic("i-SENSYS MF445dw", "Canon", "ipp"), "canon_laser");
  assert.equal(pic("WF-7840", "Kyocera", "ipp"), "generic");
});

test("every printer gets the tinted printer icon of the showcase site, with the HP logo badge for an HP printer", () => {
  const hass = mockHass();
  const icon = /<span class="logo mark" aria-hidden="true"><ha-icon icon="mdi:printer"><\/ha-icon><span class="hp-badge hp"><svg viewBox="0 0 1280 1280">/;
  const card = render(hass);
  assert.match(card.shadowRoot.innerHTML, icon);
  assert.match(render(hass, { device_id: "p", picture: "generic" }).shadowRoot.innerHTML, icon);
  assert.doesNotMatch(card.shadowRoot.innerHTML, /hp\.com/);
  assert.match(card.shadowRoot.innerHTML, /\.logo\.mark \{[^}]*#0096d6/);
});

test("the picture option overrides detection, and a custom image overrides both", () => {
  const hass = mockHass();
  assert.match(render(hass, { device_id: "p", picture: "generic" }).shadowRoot.innerHTML, /art-generic/);
  const custom = render(hass, { device_id: "p", picture: "generic", image: "/local/p.png" }).shadowRoot.innerHTML;
  assert.match(custom, /<img src="\/local\/p.png"/);
  assert.doesNotMatch(custom, /class="art/);
});


test("the card and its editor are registered under their new names only", () => {
  assert.equal(customElements.get("printer-card"), PrinterCard);
  assert.ok(customElements.get("printer-card-editor"));
  assert.equal(customElements.get("hp-printer-card"), undefined);
  assert.equal(customElements.get("printer-mini-card"), PrinterMiniCard);
  assert.equal(customElements.get("printer-mini-card-editor"), PrinterMiniCardEditor);
});

// ── Mini card ────────────────────────────────────────────────────────────────
const mini = (hass, config = {}) => render(hass, { device_id: "p", ...config }, PrinterMiniCard);
const levels = (hass, values) => {
  const states = { ...hass.states };
  for (const [color, v] of Object.entries(values)) states[`sensor.${color}_level`] = st(String(v), { unit_of_measurement: "%" });
  return { ...hass, states };
};
// Clicks the detail button: the card wires it on each render through shadowRoot.querySelector(".zoom").
function clickZoom(card, detail = 1) {
  let onClick;
  const focused = [];
  card.shadowRoot.querySelector = (sel) =>
    sel === ".zoom" ? { addEventListener: (_t, fn) => { onClick = fn; }, focus: (o) => focused.push(o ? `${sel} ${JSON.stringify(o)}` : sel) } : null;
  card._sig = null;
  card._update();
  const ev = { detail, stopped: false, stopPropagation() { this.stopped = true; } };
  onClick(ev);
  return { ev, focused };
}
const documentClick = (path) => {
  for (const [type, fn, capture] of listeners) if (type === "click" && capture) fn({ composedPath: () => path });
};

test("the mini card is laid out like the Home Connect mini cards, with one small tank per cartridge, tinted when low", () => {
  const html = mini(levels(mockHass(), { yellow: 3, cyan: 12 })).shadowRoot.innerHTML;
  assert.match(html, /<ha-card class="mini">/);
  assert.match(html, /<div class="header">.*<div class="titles"><div class="name">OfficeJet<\/div><\/div><span class="st" role="img" title="Ready" aria-label="Ready"><span class="dot"><\/span><span class="tx">Ready<\/span><\/span>/);
  assert.match(html, /<div class="content">.*<div class="info">/);
  assert.equal((html.match(/class="mt"/g) || []).length, 4);
  assert.match(html, /<span class="r error"[^>]*><span class="mt"><span style="height:3%;[^"]*"><\/span><\/span>3 %/);
  assert.match(html, /<span class="r warn"[^>]*><span class="mt"><span style="height:12%;[^"]*"><\/span><\/span>12 %/);
  assert.match(html, /<span class="r"[^>]*><span class="mt"><span style="height:50%;[^"]*"><\/span><\/span>50 %/);
  // Neither the full card's sections nor an ink alert chip repeating the cartridge.
  assert.doesNotMatch(html, /Ink levels|class="tank"|ink low/);
});

test("the mini card shows a chip per active alert", () => {
  const html = mini(withIpp(mockHass(), IPP_READY)).shadowRoot.innerHTML;
  assert.match(html, /<span class="r error" title="Paper tray empty" data-entity="sensor.ipp_printer" role="button" tabindex="0"><ha-icon icon="mdi:paper-roll-outline"><\/ha-icon><span class="tx">Paper tray empty<\/span><\/span>/);
});

// Clicks the element carrying data-entity="id": returns the events the card dispatched.
function clickChip(card, id) {
  const fired = [];
  card.dispatchEvent = (e) => fired.push(e);
  const ev = { stopped: false, stopPropagation() { this.stopped = true; }, composedPath: () => [{}, { dataset: { entity: id } }, card] };
  card._chipClick(ev);
  assert.equal(ev.stopped, true);
  return fired;
}

test("chips open the more-info dialog of their entity", () => {
  const hass = withIpp(levels(mockHass(), { yellow: 3 }), IPP_READY);
  const small = mini(hass);
  const html = small.shadowRoot.innerHTML;
  assert.match(html, /<span class="r error" title="Yellow · 3 %" data-entity="sensor.yellow_level" role="button" tabindex="0">/);
  assert.match(html, /<span class="r error" title="Paper tray empty" data-entity="sensor.ipp_printer" role="button" tabindex="0">/);
  const fired = clickChip(small, "sensor.yellow_level");
  assert.equal(fired.length, 1);
  assert.equal(fired[0].type, "hass-more-info");
  assert.deepEqual({ ...fired[0].detail }, { entityId: "sensor.yellow_level" });
  assert.equal(fired[0].bubbles, true);
  assert.equal(fired[0].composed, true);
  // Full card: a count opens the entity of its first alert, the ePrint chip its binary sensor.
  const ep = { ...hass, states: { ...hass.states, "binary_sensor.printer_eprint_status": st("on", { device_class: "connectivity" }) },
    entities: { ...hass.entities, "binary_sensor.printer_eprint_status": { entity_id: "binary_sensor.printer_eprint_status", device_id: "p" } } };
  const full = render(ep).shadowRoot.innerHTML;
  assert.match(full, /<span class="chip error" data-entity="sensor.yellow_level" role="button" tabindex="0">/);
  assert.match(full, /<span class="chip on" data-entity="binary_sensor.printer_eprint_status" role="button" tabindex="0">/);
  // A click elsewhere in the card fires nothing.
  const card = render(hass);
  const other = [];
  card.dispatchEvent = (e) => other.push(e);
  card._chipClick({ composedPath: () => [{}, card], stopPropagation() {} });
  assert.equal(other.length, 0);
});

test("chips work from the keyboard: Enter or Space opens the more-info dialog, other keys do nothing", () => {
  const card = mini(withIpp(levels(mockHass(), { yellow: 3 }), IPP_READY));
  const fired = [];
  card.dispatchEvent = (e) => fired.push(e);
  const [onKey] = card.shadowRoot.handlers.keydown;
  const press = (key, entity) => {
    const target = { dataset: entity ? { entity } : {} };
    const ev = { key, target, prevented: false, preventDefault() { this.prevented = true; }, stopPropagation() {}, composedPath: () => [target, card] };
    onKey(ev);
    return ev.prevented;
  };
  assert.equal(press("Enter", "sensor.yellow_level"), true);
  assert.equal(press(" ", "sensor.ipp_printer"), true);
  assert.equal(press("a", "sensor.yellow_level"), false);
  assert.equal(press("Enter"), false);
  assert.deepEqual(fired.map((e) => e.detail.entityId), ["sensor.yellow_level", "sensor.ipp_printer"]);
});

test("the mini card says offline, without chips, when the printer is off", () => {
  const html = mini(mockHass({ status: "unavailable" })).shadowRoot.innerHTML;
  assert.match(html, /<ha-card class="offline mini">/);
  assert.match(html, /Offline/);
  assert.doesNotMatch(html, /class="mt"/);
});

test("the mini card shows the same printer icon as the full card", () => {
  assert.match(mini(mockHass()).shadowRoot.innerHTML, /class="logo mark"/);
  assert.match(mini(mockHass(), { picture: "generic" }).shadowRoot.innerHTML, /class="logo mark"/);
});

test("the detail button shows the full card, then the compact view again", () => {
  const card = mini(mockHass());
  assert.match(card.shadowRoot.innerHTML, /<button class="zoom" title="Show the full card"><ha-icon icon="mdi:arrow-expand">/);
  assert.equal(card.getCardSize(), 2);
  const { ev } = clickZoom(card);
  assert.equal(ev.stopped, true);
  const full = card.shadowRoot.innerHTML;
  // The full card's content: picture, status, ink tanks, alerts, and the button back.
  assert.match(full, /class="art art-officejet"/);
  assert.match(full, /Ready/);
  assert.match(full, /Ink levels/);
  assert.equal((full.match(/class="tank"/g) || []).length, 4);
  assert.match(full, /Alerts/);
  assert.match(full, /12,345 pages printed/);
  assert.match(full, /<button class="zoom" title="Back to the compact view"><ha-icon icon="mdi:arrow-collapse">/);
  assert.doesNotMatch(full, /class="mini"/);
  assert.equal(card.getCardSize(), 5);
  // The grid stays the compact one: HA does not read it again on zoom, rows: 'auto' lets the card grow.
  assert.deepEqual({ ...card.getGridOptions() }, { columns: 6, min_columns: 6, rows: "auto" });
  clickZoom(card);
  assert.match(card.shadowRoot.innerHTML, /<ha-card class="mini">/);
  assert.match(card.shadowRoot.innerHTML, /mdi:arrow-expand/);
});

test("the full view is the same markup as the full card, plus the button", () => {
  const hass = mockHass();
  const card = mini(hass);
  clickZoom(card);
  const strip = (html) => html.replace(/<button class="zoom"[\s\S]*?<\/button>/, "").replace(/<style>[\s\S]*<\/style>/, "");
  assert.equal(strip(card.shadowRoot.innerHTML), strip(render(hass).shadowRoot.innerHTML));
});

test("a keyboard press on the detail button keeps the focus on it", () => {
  const card = mini(mockHass());
  // preventScroll: the zoomed card grows or shrinks around the button, the page must not jump to it.
  assert.deepEqual(clickZoom(card, 0).focused, ['.zoom {"preventScroll":true}']);
  assert.deepEqual(clickZoom(card, 1).focused, []);
});

test("a click outside the card brings back the compact view, not one inside it or in a dialog", () => {
  const card = mini(mockHass());
  card.connectedCallback();
  try {
    clickZoom(card);
    documentClick([{ localName: "div" }, card, { localName: "body" }]);
    assert.match(card.shadowRoot.innerHTML, /Ink levels/, "inside the card");
    documentClick([{ localName: "mwc-button" }, { localName: "ha-more-info-dialog" }, { localName: "body" }]);
    documentClick([{ localName: "dialog" }]);
    assert.match(card.shadowRoot.innerHTML, /Ink levels/, "in a dialog");
    documentClick([{ localName: "div" }, { localName: "body" }]);
    assert.match(card.shadowRoot.innerHTML, /<ha-card class="mini">/, "outside");
  } finally {
    card.disconnectedCallback();
  }
  assert.equal(listeners.filter(([type]) => type === "click").length, 0, "listener removed");
});

test("zoom: false removes the detail button", () => {
  assert.doesNotMatch(mini(mockHass(), { zoom: false }).shadowRoot.innerHTML, /class="zoom"/);
  assert.doesNotMatch(render(mockHass()).shadowRoot.innerHTML, /class="zoom"/, "never on the full card");
});

test("the mini card editor offers zoom and keeps it out of the YAML at its default", () => {
  const ed = new PrinterMiniCardEditor();
  ed.setConfig({ type: "custom:printer-mini-card" });
  ed.hass = { language: "fr" };
  assert.ok(ed._form.schema.some((s) => s.name === "zoom"));
  assert.equal(ed._form.computeLabel({ name: "zoom" }), "Bouton de détail");
  assert.ok(ed._form.computeHelper({ name: "zoom" }));
  assert.equal(ed._form.data.zoom, true);
  const sent = [];
  ed.dispatchEvent = (e) => sent.push(e);
  ed._valueChanged({ stopPropagation() {}, detail: { value: { zoom: true, show_inks: true } } });
  assert.deepEqual({ ...ed._config }, { type: "custom:printer-mini-card" });
  ed._valueChanged({ stopPropagation() {}, detail: { value: { zoom: false } } });
  assert.equal(ed._config.zoom, false);
  assert.ok(!new PrinterCardEditor()._schema.call({ _lang: () => "en" }).some((s) => s.name === "zoom"));
});

test("the editor offers show_parts and an Automatic language, both kept out of the YAML", () => {
  const ed = new PrinterCardEditor();
  ed.setConfig({ type: "custom:printer-card" });
  ed.hass = { language: "fr" };
  const names = ed._form.schema.flatMap((s) => (s.schema ? s.schema.map((x) => x.name) : [s.name]));
  assert.ok(names.includes("show_parts"));
  assert.equal(ed._form.computeLabel({ name: "show_parts" }), "Pièces d'usure");
  assert.equal(ed._form.data.show_parts, true);
  const lang = ed._form.schema.find((s) => s.name === "language").selector.select.options[0];
  assert.deepEqual({ ...lang }, { value: "", label: "Automatique" });
  assert.equal(ed._form.data.language, "");
  const sent = [];
  ed.dispatchEvent = (e) => sent.push(e);
  ed._valueChanged({ stopPropagation() {}, detail: { value: { language: "", show_parts: true } } });
  assert.deepEqual({ ...ed._config }, { type: "custom:printer-card" });
  ed._valueChanged({ stopPropagation() {}, detail: { value: { language: "de", show_parts: false } } });
  assert.equal(ed._config.show_parts, false);
  assert.equal(ed._config.language, "de");
  // Its default is the value of show_inks: kept only when it differs.
  ed.setConfig({ type: "custom:printer-card", show_inks: false });
  assert.equal(ed._form.data.show_parts, false);
  ed._valueChanged({ stopPropagation() {}, detail: { value: { show_inks: false, show_parts: false } } });
  assert.deepEqual({ ...ed._config }, { type: "custom:printer-card", show_inks: false });
  ed._valueChanged({ stopPropagation() {}, detail: { value: { show_inks: false, show_parts: true } } });
  assert.equal(ed._config.show_parts, true);
});

// ── Review pass 8 ──────────────────────────────────────────────────────────
const styleOf = (card) => card.shadowRoot.innerHTML.match(/<style>([\s\S]*)<\/style>/)[1];
const reducedMotion = (css) => css.match(/@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?\})\s*\}/)?.[1] || "";

test("with reduced motion, the busy screen no longer pulses and nothing slides or fades", () => {
  for (const card of [render(mockHass({ status: "processing" })), mini(mockHass({ status: "processing" }))]) {
    const css = styleOf(card);
    // The screen still pulses for everyone else.
    assert.match(css, /\.pic\.busy \.screen \{ animation: hp-glow/);
    const rm = reducedMotion(css);
    assert.match(rm, /\.pic\.busy \.screen, \.spin \{ animation: none; \}/);
    for (const sel of [".pic", ".level"]) assert.ok(rm.includes(sel), `${sel} transition kept with reduced motion`);
    assert.match(rm, /transition: none/);
  }
});

test("every status color goes through a theme variable", () => {
  for (const status of ["ready", "inpowersave", "processing", "scanprocessing", "copying", "canceljob", "stopped"]) {
    const css = styleOf(render(mockHass({ status })));
    const color = css.match(/--hp-color: ([^;]*);/)[1];
    assert.match(color, /^var\(--[\w-]+, #[0-9a-f]{6}\)$/, `${status}: ${color}`);
  }
  assert.match(styleOf(render(mockHass({ status: "inpowersave" }))), /--hp-color: var\(--printer-card-sleep-color, #5c8fd6\)/);
  assert.match(styleOf(render(mockHass({ status: "scanprocessing" }))), /--hp-color: var\(--printer-card-scan-color, #8e24aa\)/);
});

test("a low cartridge is outlined outside its tank, so a low yellow level stays visible", () => {
  for (const card of [render(mockHass()), mini(mockHass())]) {
    const css = styleOf(card);
    assert.doesNotMatch(css, /\.ink\.low \.tank[^{]*\{ box-shadow: inset 0 0 0 2px/);
    assert.doesNotMatch(css, /\.r\.warn \.mt[^{]*\{ box-shadow: inset 0 0 0 1\.5px/);
    assert.match(css, /\.ink\.low \.tank, \.ink\.bad \.tank \{ outline: 2px solid var\(--warning-color, #ffa600\); outline-offset: 1px; \}/);
    assert.match(css, /\.ink\.bad \.tank, \.ink\.crit \.tank \{ outline-color: var\(--error-color, #db4437\); \}/);
  }
  assert.match(styleOf(mini(mockHass())), /\.r\.warn \.mt, \.r\.error \.mt \{ outline: 1\.5px solid var\(--t\); outline-offset: 0\.5px; \}/);
});

test("a nearly empty cartridge keeps a visible level, an empty or unknown one shows none", () => {
  const hass = levels(mockHass(), { yellow: 1, cyan: 0, magenta: "unknown" });
  const full = render(hass).shadowRoot.innerHTML;
  assert.match(full, /<div class="level" style="height:1%;min-height:3px;background:#f5c400"/);
  assert.match(full, /<div class="level" style="height:0%;background:/);
  assert.equal((full.match(/min-height/g) || []).length, 2, "yellow 1 % and black 50 % only");
  const small = mini(hass).shadowRoot.innerHTML;
  assert.match(small, /<span class="mt"><span style="height:1%;min-height:2px;background:#f5c400"><\/span><\/span>1 %/);
  assert.match(small, /<span class="mt"><span style="height:0%;background:[^"]*"><\/span><\/span>0 %/);
  assert.match(small, /<span class="mt"><span style="height:0%;background:[^"]*"><\/span><\/span>—/);
});

// ── Review pass 9 ──────────────────────────────────────────────────────────
// A printhead (and the black cartridge) reporting a problem through their HP status binary sensors.
function withProblems(hass, { printhead, black }) {
  const out = { ...hass, states: { ...hass.states }, entities: { ...hass.entities }, devices: { ...hass.devices } };
  out.devices.ph = { name: "OfficeJet printhead", via_device_id: "p" };
  out.states["sensor.printhead_type"] = st("printhead", { options: ["ink", "printhead"] });
  out.entities["sensor.printhead_type"] = { entity_id: "sensor.printhead_type", device_id: "ph" };
  out.states["binary_sensor.printhead_status"] = st("off", { state: printhead });
  out.entities["binary_sensor.printhead_status"] = { entity_id: "binary_sensor.printhead_status", device_id: "ph" };
  if (black) {
    out.states["binary_sensor.black_status"] = st("off", { state: black });
    out.entities["binary_sensor.black_status"] = { entity_id: "binary_sensor.black_status", device_id: "ink_black" };
  }
  return out;
}
const alertsOf = (hass, language) => {
  const html = render({ ...hass, language }).shadowRoot.innerHTML;
  return Array.from(html.matchAll(/<div class="alert error"><ha-icon[^>]*><\/ha-icon><span>([^<]*)<\/span>/g), (m) => m[1]);
};

// The printhead (głowica, cabeça, глава / glava, головка, ras) is feminine, skrivehoved / skrivhuvud neuter: its states
// agree with it, not with the cartridge.
const PRINTHEAD_CASES = {
  pl: { used: "Głowica drukująca: Już używana", nongenuine: "Głowica drukująca: Nieoryginalna HP" },
  pt: { used: "Cabeça de impressão: Já utilizada", counterfeit: "Cabeça de impressão: Contrafeita" },
  da: { empty: "Skrivehoved: Tomt", nongenuine: "Skrivehoved: Ikke originalt HP", incompatible: "Skrivehoved: Inkompatibelt" },
  sv: { empty: "Skrivhuvud: Tomt", used: "Skrivhuvud: Redan använt", damaged: "Skrivhuvud: Skadat" },
  ru: { empty: "Печатающая головка: Пуста", damaged: "Печатающая головка: Повреждена" },
  uk: { missing: "Друкувальна головка: Відсутня", damaged: "Друкувальна головка: Пошкоджена" },
  sr: {
    empty: "Глава за штампање: Празна", used: "Глава за штампање: Већ коришћена", counterfeit: "Глава за штампање: Фалсификована",
    nongenuine: "Глава за штампање: Није оригинална HP", incompatible: "Глава за штампање: Некомпатибилна", damaged: "Глава за штампање: Оштећена",
  },
  "sr-Latn": {
    empty: "Glava za štampanje: Prazna", used: "Glava za štampanje: Već korišćena", counterfeit: "Glava za štampanje: Falsifikovana",
    nongenuine: "Glava za štampanje: Nije originalna HP", incompatible: "Glava za štampanje: Nekompatibilna", damaged: "Glava za štampanje: Oštećena",
  },
};

test("printhead problems agree with the printhead in da, sv, pl, pt, ru, uk, sr and sr-Latn", () => {
  for (const [lang, cases] of Object.entries(PRINTHEAD_CASES)) {
    for (const [problem, expected] of Object.entries(cases)) {
      const alerts = alertsOf(withProblems(mockHass(), { printhead: problem }), lang);
      assert.ok(alerts.some((a) => a.toLowerCase() === expected.toLowerCase()), `${lang} ${problem}: ${alerts.join(" | ")}`);
    }
  }
});

test("cartridge problems keep their own (masculine) forms next to a printhead problem", () => {
  const hass = withProblems(mockHass(), { printhead: "damaged", black: "damaged" });
  const expected = {
    sr: ["Глава за штампање: Оштећена", "Кертриџ (црна): Оштећен"],
    "sr-Latn": ["Glava za štampanje: Oštećena", "Kertridž (crna): Oštećen"],
    pl: ["Głowica drukująca: Uszkodzenie"],
    fr: ["Tête d'impression : Endommagée"],
    en: ["Printhead: Damaged", "Black cartridge: Damaged"],
  };
  for (const [lang, texts] of Object.entries(expected)) {
    const alerts = alertsOf(hass, lang).map((a) => a.replace(/&#39;/g, "'"));
    for (const t of texts) assert.ok(alerts.some((a) => a.toLowerCase() === t.toLowerCase()), `${lang}: ${t} not in ${alerts.join(" | ")}`);
  }
  // pt and pl cartridges: "Tinteiro" and "Wkład" are masculine.
  const pt = withProblems(mockHass(), { printhead: "used", black: "used" });
  assert.ok(alertsOf(pt, "pt").some((a) => /^Tinteiro \(.*\): já utilizado$/i.test(a)), alertsOf(pt, "pt").join(" | "));
  assert.ok(alertsOf(pt, "pl").some((a) => /^Wkład \(.*\): już używany$/i.test(a)), alertsOf(pt, "pl").join(" | "));
  // ru and uk cartridges are masculine, da and sv ones of common gender.
  const dmg = withProblems(mockHass(), { printhead: "damaged", black: "damaged" });
  assert.ok(alertsOf(dmg, "ru").includes("Картридж (чёрный): повреждён"), alertsOf(dmg, "ru").join(" | "));
  assert.ok(alertsOf(dmg, "uk").includes("Картридж (чорний): пошкоджений"), alertsOf(dmg, "uk").join(" | "));
  assert.ok(alertsOf(dmg, "sv").includes("Bläckpatron (svart): skadad"), alertsOf(dmg, "sv").join(" | "));
});

// Narrow header (min_columns of the Sections view, ~156-250px): the name never collapses to 0px and
// neither the status pill nor the detail button leaves the card. Measured in Chromium for the PR;
// node has no layout engine, so this checks the CSS rules that guarantee it.
const rule = (css, sel) => css.match(new RegExp(`(?:^|\\})\\s*${sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`))?.[1] || "";

test("narrow header: the title shrinks with an ellipsis but keeps a few characters", () => {
  for (const card of [render(mockHass()), mini(mockHass())]) {
    const css = styleOf(card);
    // Basis 0, not auto: with auto the name and the pill shrink in proportion to their natural widths, so a
    // short "Ready" pill was cut ("Re…") at 320px next to a long name. The name takes what the pill leaves.
    assert.match(rule(css, ".titles"), /flex: 1 1 0;/);
    assert.match(rule(css, ".titles"), /min-width: \d+ch;/);
    assert.match(rule(css, ".name"), /text-overflow: ellipsis/);
  }
});

test("narrow header: the status pill shrinks and truncates, then shows only its dot or icon", () => {
  const full = styleOf(render(mockHass()));
  const small = styleOf(mini(mockHass()));
  for (const [css, sel, text] of [[full, ".status", ".status span"], [small, ".st", ".st .tx"]]) {
    const r = rule(css, sel);
    assert.match(r, /flex: 0 1 auto;/, `${sel} flex`);
    assert.match(r, /min-width: 0;/, `${sel} min-width`);
    assert.match(r, /max-width: 50%;/, `${sel} max-width`);
    assert.doesNotMatch(r, /flex: none/, `${sel} must shrink`);
    assert.match(rule(css, text), /overflow: hidden;.*text-overflow: ellipsis;/, `${text} ellipsis`);
    assert.match(css, new RegExp(`@container printer-card \\(max-width: \\d+px\\) \\{[^@]*${text.replace(/\./g, "\\.")} \\{ display: none; \\}`), `${text} hidden when narrow`);
  }
  // The size container is a wrapper of the header, not ha-card: an inline-size container has no intrinsic
  // width, so ha-card itself as container collapsed to its padding in a max-content parent (layout-card).
  assert.doesNotMatch(rule(full, "ha-card"), /container/);
  for (const css of [full, small]) assert.match(rule(css, ".hd"), /container: printer-card \/ inline-size;/);
  for (const card of [render(mockHass()), mini(mockHass())]) assert.match(card.shadowRoot.innerHTML, /<ha-card[^>]*><div class="hd"><div class="header">/);
  assert.match(rule(full, ".status ha-icon"), /flex: none;/);
  assert.match(rule(small, ".st .dot"), /flex: none;/);
  assert.match(rule(small, ".zoom"), /flex: none;/);
  // Narrow: the icon or dot is never cut, and the gaps leave room for the name and the detail button.
  assert.match(full, /@container printer-card \(max-width: 200px\) \{[^@]*\.status \{ min-width: 22px; padding: 2px 4px; \}/);
  assert.match(full, /@container printer-card \(max-width: 200px\) \{ \.header \{ gap: 4px; \}/);
  // The header icon stays 40 px (24 px icon, full-size badge) even there.
  const narrow = (css) => css.match(/@container printer-card \(max-width: 200px\) \{([^@]*)/)[1];
  for (const css of [full, small]) assert.doesNotMatch(narrow(css), /\.logo|\.hp-badge/);
  assert.match(small, /@container printer-card \(max-width: 200px\) \{ \.st \{ min-width: 14px; padding: 4px; \}/);
  // The mini card keeps the full card's header icon (40 px, 24 px icon).
  assert.doesNotMatch(small, /\.mini \.logo/);
  assert.match(rule(small, ".logo"), /width: 40px; height: 40px;/);
});

test("intrinsic width: the card keeps a natural width but asks for no minimum", () => {
  for (const card of [render(mockHass()), mini(mockHass())]) {
    const css = styleOf(card);
    // In an inline-block or an `auto` grid column the card is as wide as its widest line: the hidden line gives it
    // ~300px instead of collapsing to its padding (24px)...
    const after = rule(css, "ha-card::after");
    assert.match(after, /content: "(\\a0){30,}";/);
    assert.match(after, /overflow-wrap: anywhere;/);
    assert.match(after, /height: 0;.*visibility: hidden;/);
    // ...but a `1fr 1fr` grid or a horizontal stack must still shrink it: no px minimum and no intrinsic size,
    // which would make the card overflow its column.
    for (const sel of [":host", "ha-card"]) {
      assert.doesNotMatch(rule(css, sel), /min-width: \d+px|contain-intrinsic/, sel);
    }
  }
  // The offline mini card's "Last seen ..." line (nowrap) must not set the card's min-content width either, or the
  // card overflows a `1fr 1fr` grid by up to 230px: its width comes from the card, its text ends with an ellipsis.
  const small = styleOf(mini(mockHass()));
  assert.match(rule(small, ".line"), /min-width: 0;.*contain: inline-size;/);
  assert.match(rule(small, ".line span"), /overflow: hidden; text-overflow: ellipsis; white-space: nowrap;/);
  // Measured in Chromium by test/layout.browser.mjs (npm run test:browser), offline included.
});

test("narrow header: the status text stays available as the pill's title and label", () => {
  const html = render(mockHass({ status: "canceljob" }), { device_id: "p", language: "pl" }).shadowRoot.innerHTML;
  assert.match(html, /<div class="status" role="img" title="Anulowanie zadania" aria-label="Anulowanie zadania"><ha-icon/);
  const small = mini(mockHass({ status: "canceljob" }), { language: "pl" }).shadowRoot.innerHTML;
  assert.match(small, /<span class="st" role="img" title="Anulowanie zadania" aria-label="Anulowanie zadania"><span class="dot"><\/span><span class="tx">Anulowanie zadania<\/span><\/span>/);
});

test("the mini card asks for at least 6 Sections columns, where its header fits", () => {
  const g = new PrinterMiniCard().getGridOptions();
  assert.equal(g.columns, 6);
  assert.equal(g.min_columns, 6);
  assert.equal(g.rows, "auto");
  assert.equal(new PrinterCard().getGridOptions().min_columns, 6);
});

test("hpBrandOf: the badge brand from the device maker or model", () => {
  assert.equal(hpBrandOf({ manufacturer: "HP", model: "OfficeJet Pro 9010" }), "hp");
  assert.equal(hpBrandOf({ manufacturer: "Brother", model: "HL-L2350DW" }), "brother");
  assert.equal(hpBrandOf({ manufacturer: "EPSON", model: "ET-2850 Series" }), "epson");
  assert.equal(hpBrandOf({ manufacturer: "Canon", model: "PIXMA G650" }), "canon");
  assert.equal(hpBrandOf({ manufacturer: "Kyocera", model: "ECOSYS P2040dn" }), null);
});

// Brother integration (core, SNMP): sensors identified by their translation key.
function brotherHass({ status = "idle", key = "printer_status", text, parts = [] } = {}) {
  const raw = [
    ["sensor.mfc_status", key, status, {}],
    ...(text === undefined ? [] : [["sensor.mfc_status_text", "status", text, {}]]),
    ...parts,
    ["sensor.mfc_page_counter", "page_counter", "5120", {}],
    ["sensor.mfc_black_toner_remaining", "black_toner_remaining", "64", { unit_of_measurement: "%" }],
    ["sensor.mfc_cyan_toner_remaining", "cyan_toner_remaining", "12", { unit_of_measurement: "%" }],
    ["sensor.mfc_drum_remaining_life", "drum_remaining_life", "80", { unit_of_measurement: "%" }],
  ];
  const states = {}, entities = {};
  for (const [id, translation_key, state, attributes] of raw) {
    states[id] = st(state, attributes);
    entities[id] = { entity_id: id, device_id: "bro", platform: "brother", translation_key };
  }
  return { language: "en", states, entities, devices: { bro: { id: "bro", name: "MFC-L3770CDW", manufacturer: "Brother", model: "MFC-L3770CDW" } } };
}

test("Brother integration: found automatically, its printer status, toners (the drum apart) and the Brother badge", () => {
  const html = render(brotherHass(), {}).shadowRoot.innerHTML;
  assert.match(html, /Ready/);
  assert.match(html, /Toner levels/);
  assert.match(html, /64<small>%<\/small>/);
  assert.match(html, /12<small>%<\/small>/);
  // The drum is a part, in its own section after the toners, not a toner.
  const [toners, parts] = html.split("Parts</div>");
  assert.doesNotMatch(toners, /80<small>%<\/small>/);
  assert.match(parts, /80<small>%<\/small><\/div><div class="lbl">Drum<\/div>/);
  assert.match(html, /class="hp-badge brother"/);
  assert.match(html, /class="art art-brother_laser"/);
  assert.match(render(brotherHass({ status: "printing" }), {}).shadowRoot.innerHTML, /Printing/);
});

test("Brother integration: the raw status text when the printer status sensor is missing", () => {
  assert.match(render(brotherHass({ key: "status", status: "sleep" }), {}).shadowRoot.innerHTML, /Sleeping|Sleep|Power save/i);
  assert.match(render(brotherHass({ key: "status", status: "printing" }), {}).shadowRoot.innerHTML, /Printing/);
});

test("Brother integration: an error in the status text stops the printer, with that text as an error alert", () => {
  for (const text of ["paper jam", "cover is open", "no paper", "replace toner", "error 46", "unable to print 2a", "bourrage papier"]) {
    const html = render(brotherHass({ status: "idle", text }), {}).shadowRoot.innerHTML;
    assert.match(html, /aria-label="Stopped"/, text);
    const cap = text[0].toUpperCase() + text.slice(1);
    assert.ok(html.includes(`<div class="alert error"><ha-icon icon="mdi:printer-alert"></ha-icon><span>${cap}</span></div>`), text);
    assert.doesNotMatch(html, /The printer is stopped/);
  }
  // A text without an error: the printer status rules, and "toner low" is not a stop.
  assert.match(render(brotherHass({ status: "idle", text: "toner low" }), {}).shadowRoot.innerHTML, /aria-label="Ready"/);
  assert.match(render(brotherHass({ status: "printing", text: "printing" }), {}).shadowRoot.innerHTML, /aria-label="Printing"/);
  // The drum at its end stops the printer; "Drum End Soon" is only a warning.
  for (const text of ["Replace Drum", "Drum Stop", "Trommel ersetzen", "Remplacer tambour", "Sostituire tamburo"]) {
    assert.match(render(brotherHass({ status: "idle", text }), {}).shadowRoot.innerHTML, /aria-label="Stopped"/, text);
  }
  assert.match(render(brotherHass({ status: "idle", text: "Drum End Soon" }), {}).shadowRoot.innerHTML, /aria-label="Ready"/);
  // Only the status text sensor: the error is read there too.
  assert.match(render(brotherHass({ key: "status", status: "paper jam" }), {}).shadowRoot.innerHTML, /aria-label="Stopped"[\s\S]*Paper jam/);
});

test("Brother integration: `other` takes the state of the status text, else is unknown", () => {
  assert.match(render(brotherHass({ status: "other" }), {}).shadowRoot.innerHTML, /aria-label="Unknown state"/);
  assert.match(render(brotherHass({ status: "other", text: "something odd" }), {}).shadowRoot.innerHTML, /aria-label="Unknown state"/);
  assert.match(render(brotherHass({ status: "other", text: "sleep" }), {}).shadowRoot.innerHTML, /aria-label="Sleeping|aria-label="Power save/);
  assert.match(render(brotherHass({ status: "other", text: "ready" }), {}).shadowRoot.innerHTML, /aria-label="Ready"/);
});

test("Brother integration: drum, belt, fuser and paper feed kits are parts, with alerts at the low threshold", () => {
  const part = (key, value) => [`sensor.mfc_${key}`, key, value, { unit_of_measurement: "%" }];
  const hass = brotherHass({
    parts: [
      part("fuser_remaining_life", "55"), part("cyan_drum_remaining_life", "4"), part("belt_unit_remaining_life", "12"),
      part("pf_kit_mp_remaining_life", "90"), part("pf_kit_1_remaining_life", "70"), part("laser_remaining_life", "3"),
    ],
  });
  const html = render(hass, {}).shadowRoot.innerHTML;
  const section = html.split("Parts</div>")[1].split('<div class="section">')[0];
  const labels = [...section.matchAll(/<div class="lbl">([^<]*)<\/div>/g)].map((m) => m[1]);
  assert.deepEqual(labels, ["Drum", "Drum", "Belt unit", "Fuser", "Paper feed kit 1", "Paper feed kit MP"]);
  assert.match(section, /title="Drum \(Cyan\) · 4 %"/);
  assert.match(section, /<div class="ink low crit" title="Drum \(Cyan\) · 4 %"/);
  assert.match(html, /<div class="alert error"><ha-icon icon="mdi:wrench-clock"><\/ha-icon><span>Drum \(Cyan\): replace soon \(4 %\)<\/span>/);
  assert.match(html, /<div class="alert warn"><ha-icon icon="mdi:wrench-clock"><\/ha-icon><span>Belt unit: 12 % of life left<\/span>/);
  assert.doesNotMatch(html, /Fuser:|Paper feed kit 1:/);
  // The threshold is the card's low_threshold.
  assert.doesNotMatch(render(hass, { low_threshold: 10 }).shadowRoot.innerHTML, /Belt unit:/);
  // show_inks and show_parts are apart: each hides its own section only; the part alerts stay.
  const noInks = render(hass, { show_inks: false, show_parts: true }).shadowRoot.innerHTML;
  assert.match(noInks, /Parts<\/div>/);
  assert.doesNotMatch(noInks, /Toner levels/);
  // Not set, show_parts follows show_inks: `show_inks: false` alone hides both, as before show_parts existed.
  const noInksAlone = render(hass, { show_inks: false }).shadowRoot.innerHTML;
  assert.doesNotMatch(noInksAlone, /Parts<\/div>/);
  assert.match(noInksAlone, /Belt unit: 12 %/);
  const noParts = render(hass, { show_parts: false }).shadowRoot.innerHTML;
  assert.doesNotMatch(noParts, /Parts<\/div>/);
  assert.match(noParts, /Toner levels/);
  assert.match(noParts, /Belt unit: 12 %/);
  assert.match(render(hass, {}, PrinterMiniCard).shadowRoot.innerHTML, /<span class="r warn" title="Belt unit: 12 % of life left" data-entity="sensor.mfc_belt_unit_remaining_life"/);
});


const DAY = 86400000;
const dailyLevels = (values, end = Date.now()) => values.map((v, i) => ({ t: end - (values.length - 1 - i) * DAY, v }));

test("days to empty: the drop per day since the last refill, over at least a week", () => {
  // 1 point a day for 20 days, from 70 to 50: empty in 50 days.
  assert.equal(Math.round(hpDaysToEmpty(dailyLevels(Array.from({ length: 21 }, (_, i) => 70 - i)), 50)), 50);
  // A refill restarts the count: only the drop after it.
  const refilled = dailyLevels([30, 25, 20, 100, 98, 96, 94, 92, 90, 88, 86]);
  assert.equal(Math.round(hpDaysToEmpty(refilled, 86)), 43);
  // Too little history, or not used up.
  assert.equal(hpDaysToEmpty(dailyLevels([60, 59, 58]), 58), null);
  assert.equal(hpDaysToEmpty(dailyLevels(Array(15).fill(40)), 40), null);
  assert.equal(hpDaysToEmpty(undefined, 40), null);
});

test("the forecast under each tank, from one daily statistics query", async () => {
  const hass = mockHass();
  const calls = [];
  hass.callWS = (msg) => {
    calls.push(msg);
    const out = {};
    for (const id of msg.statistic_ids) out[id] = dailyLevels(Array.from({ length: 29 }, (_, i) => 78 - i)).map((p) => ({ start: p.t, mean: p.v }));
    return Promise.resolve(out);
  };
  const card = render(hass, { device_id: "p", language: "en" });
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(calls.length, 1);
  assert.equal(calls[0].period, "day");
  assert.equal(calls[0].statistic_ids.length, 4);
  const html = card.shadowRoot.innerHTML;
  // 1 point a day, 50 % left: 50 days, about 7 weeks.
  // Whole words under the tank ("7w" also read as 7 minutes or months), the date it runs out in the tooltip.
  assert.match(html, /<div class="eta">≈ 7 weeks<\/div>/);
  const on = new Intl.DateTimeFormat("en", { day: "numeric", month: "short" }).format(new Date(Date.now() + 50 * 86400000));
  assert.ok(html.includes(`Empty in 7 weeks (${on})`), html.match(/title="[^"]*Empty[^"]*"/)?.[0]);
  // Off: no query, no forecast.
  const off = mockHass();
  off.callWS = () => {
    throw new Error("no query expected");
  };
  assert.doesNotMatch(render(off, { device_id: "p", show_forecast: false }).shadowRoot.innerHTML, /class="eta"/);
});

// ha-hp (domain "hp"): one device, entities found by platform and translation key.
function hpLocalHass({ status = "ready", message = "Ready", black = {}, statusExtra = {} } = {}) {
  const states = {
    "sensor.oj_status": st(status, { message, options: ["ready", "processing", "off", "tray_empty", "other"] }, statusExtra),
    "sensor.oj_printed_pages": st("1234", { state_class: "total_increasing" }),
    "sensor.oj_black_level": st("42", { unit_of_measurement: "%", state: "ok", installed: true, cartridge: "963", ...black }),
    "sensor.oj_cyan_level": st("4", { unit_of_measurement: "%", state: "very_low", installed: true }),
    "sensor.oj_tri_color_level": st("60", { unit_of_measurement: "%" }),
    "sensor.oj_black_pages_remaining": st("380", {}),
    "binary_sensor.oj_hp_cloud_services": st("on", {}),
    "binary_sensor.oj_hp_cloud_registered": st("on", {}),
  };
  const keys = {
    "sensor.oj_status": "status",
    "sensor.oj_printed_pages": "total_pages",
    "sensor.oj_black_level": "black_level",
    "sensor.oj_cyan_level": "cyan_level",
    "sensor.oj_tri_color_level": "tri_color_level",
    "sensor.oj_black_pages_remaining": "black_pages_remaining",
    "binary_sensor.oj_hp_cloud_services": "cloud_services",
    "binary_sensor.oj_hp_cloud_registered": "cloud_registered",
  };
  const entities = Object.fromEntries(
    Object.entries(keys).map(([id, key]) => [id, { entity_id: id, device_id: "h", platform: "hp", translation_key: key }]),
  );
  return { language: "en", states, entities, devices: { h: { name: "HP OfficeJet Pro 9010 series", manufacturer: "HP", model: "HP OfficeJet Pro 9010 series" } } };
}

test("ha-hp printers are found and read from their own device", () => {
  const card = render(hpLocalHass(), {});
  const r = card._resolve();
  assert.equal(r.kind, "hp_local");
  assert.equal(r.status, "sensor.oj_status");
  assert.equal(r.inks.map((i) => i.color).join(","), "black,cyan,tricolor");
  assert.equal(r.inks[0].pages_left, "sensor.oj_black_pages_remaining");
  assert.equal(r.total_pages, "sensor.oj_printed_pages");
  assert.equal(r.eprint, "binary_sensor.oj_hp_cloud_services");
  assert.equal(card._state(r), "ready");
  assert.match(card.shadowRoot.innerHTML, /1,234 pages printed/);
});

test("ha-hp states map onto the card's, off being offline", () => {
  const states = { processing: "processing", scan_processing: "scanprocessing", in_power_save: "inpowersave", tray_empty: "stopped", off: "offline", other: "unknown" };
  for (const [status, expected] of Object.entries(states)) {
    const card = render(hpLocalHass({ status }), {});
    assert.equal(card._state(card._resolve()), expected, status);
  }
});

test("ha-hp: a stopped printer shows its own message, a removed cartridge is an alert", () => {
  const card = render(hpLocalHass({ status: "tray_empty", message: "Out of paper", black: { installed: false } }), {});
  const html = card.shadowRoot.innerHTML;
  assert.match(html, /Out of paper/);
  assert.match(html, /missing/i);
});

test("ha-hp: a very low cartridge is a level alert, not a cartridge problem", () => {
  const card = render(hpLocalHass(), {});
  const alerts = card._alerts(card._resolve(), "ready");
  assert.equal(alerts.filter((a) => a.entity === "sensor.oj_cyan_level").length, 1);
  assert.equal(alerts[0].level, "error");
});

// ha-hp scanner: scan buttons, settings selects and last scan sensor on the printer's device.
function hpScanHass(lastScan = {}) {
  const hass = hpLocalHass();
  const add = (id, key, state, attributes = {}) => {
    hass.states[id] = st(state, attributes);
    hass.entities[id] = { entity_id: id, device_id: "h", platform: "hp", translation_key: key };
  };
  add("button.oj_scan", "scan", "unknown");
  add("button.oj_scan_and_add_page", "scan_add_page", "unknown");
  add("select.oj_scan_source", "scan_source", "flatbed", { options: ["flatbed", "feeder", "feeder_duplex"] });
  add("select.oj_scan_format", "scan_format", "pdf", { options: ["pdf", "jpeg", "png"] });
  add("select.oj_scan_resolution", "scan_resolution", "300", { options: ["75", "200", "300", "600"] });
  add("sensor.oj_last_scan", "last_scan", lastScan.time || "unknown", { files: [], media_ids: [], ...lastScan.attributes });
  const calls = [];
  hass.callService = (domain, service, data) => calls.push({ domain, service, data });
  hass.callWS = async (msg) => {
    // The forecast's statistics query is not what these tests look at.
    if (msg.type === "recorder/statistics_during_period") return {};
    calls.push(msg);
    if (msg.type === "media_source/resolve_media") return { url: `/media/local/hp/${msg.media_content_id.split("/").pop()}?authSig=x`, mime_type: "application/pdf" };
    if (hass.failScan && msg.type === "call_service") throw { code: "home_assistant_error", message: "The document feeder is empty." };
    return { response: { files: ["/media/hp/scan.pdf"] } };
  };
  hass.hassUrl = (path) => `http://ha.local:8123${path}`;
  return { hass, calls };
}

// The test DOM has no elements: a clicked control is its dataset, as the card reads it.
const click = (card, dataset) => {
  card._chipClick({ composedPath: () => [{ dataset, disabled: false }], stopPropagation() {} });
};

test("ha-hp: the scan section offers source, format and resolution, and the scan buttons", () => {
  const { hass } = hpScanHass();
  const html = render(hass, {}).shadowRoot.innerHTML;
  assert.match(html, /data-scan-set="source" data-value="flatbed" aria-pressed="true"/);
  assert.match(html, />Feeder, 2-sided</);
  assert.match(html, /data-scan-set="format" data-value="png"/);
  assert.match(html, />600 dpi</);
  assert.match(html, /data-scan-go="new"/);
  assert.match(html, /data-scan-go="add"/);
  assert.doesNotMatch(render(hass, { show_scan: false }).shadowRoot.innerHTML, /data-scan-go/);
});

test("ha-hp: choosing a setting changes the integration's select", () => {
  const { hass, calls } = hpScanHass();
  const card = render(hass, {});
  click(card, { scanSet: "source", value: "feeder" });
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
    { domain: "select", service: "select_option", data: { entity_id: "select.oj_scan_source", option: "feeder" } },
  ]);
});

test("ha-hp: Scan runs hp.scan on the printer and shows the progress, then the error if any", async () => {
  const { hass, calls } = hpScanHass();
  const card = render(hass, {});
  click(card, { scanGo: "add" });
  assert.match(card.shadowRoot.innerHTML, /Scanning…/);
  assert.match(card.shadowRoot.innerHTML, /data-scan-go="new" disabled/);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0])), {
    type: "call_service", domain: "hp", service: "scan", service_data: { device_id: "h", append: true }, return_response: true,
  });
  assert.doesNotMatch(card.shadowRoot.innerHTML, /Scanning…/);

  hass.failScan = true;
  click(card, { scanGo: "new" });
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.match(card.shadowRoot.innerHTML, /Scan failed: The document feeder is empty\./);
});

test("ha-hp: the last scan gets a download link per file, resolved when clicked", async () => {
  const { hass, calls } = hpScanHass({
    time: new Date().toISOString(),
    attributes: { files: ["/media/hp/scan_1.pdf"], media_ids: ["media-source://media_source/local/hp/scan_1.pdf"], pages: 3 },
  });
  const card = render(hass, {});
  const html = card.shadowRoot.innerHTML;
  assert.match(html, /scan_1\.pdf/);
  assert.match(html, /data-scan-dl="media-source:\/\/media_source\/local\/hp\/scan_1\.pdf" data-name="scan_1\.pdf"/);
  assert.match(html, /3 pages/);
  const clicked = [];
  const doc = sandboxDocument;
  const origCreate = doc.createElement;
  doc.body = { appendChild() {} };
  doc.createElement = (tag) => ({ tagName: tag, click() { clicked.push({ href: this.href, download: this.download }); }, remove() {} });
  try {
    click(card, { scanDl: "media-source://media_source/local/hp/scan_1.pdf", name: "scan_1.pdf" });
    await new Promise((resolve) => setTimeout(resolve, 0));
  } finally {
    doc.createElement = origCreate;
    delete doc.body;
  }
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0])), { type: "media_source/resolve_media", media_content_id: "media-source://media_source/local/hp/scan_1.pdf" });
  assert.deepEqual(clicked, [{ href: "http://ha.local:8123/media/local/hp/scan_1.pdf?authSig=x", download: "scan_1.pdf" }]);
});
