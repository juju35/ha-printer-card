import assert from "node:assert/strict";
import { test } from "node:test";
import { loadCard } from "./load.mjs";

const { HpI18n, PrinterCard, PrinterCardEditor } = loadCard("printer-card.js", ["HpI18n", "PrinterCard", "PrinterCardEditor"]);
const placeholders = (s) => String(s).match(/\{\w+\}/g)?.sort() ?? [];

const NEW_LANGS = ["ro", "da", "sv", "bg", "ru", "uk", "hu", "sk", "cs", "sl", "lv", "el"];
const LANGS = ["de", "es", "sr", "sr-Latn", "it", "nl", "pt", "pl", ...NEW_LANGS];

test("I18N parity: every language has exactly the keys and placeholders of en, and no empty value", () => {
  const en = HpI18n.en;
  assert.deepEqual(Object.keys(HpI18n).sort(), ["en", "fr", ...LANGS].sort(), "unexpected language list");
  for (const lang of LANGS) {
    const strings = HpI18n[lang];
    assert.ok(strings, `${lang} is missing`);
    // Optional ph_* keys: the printhead's own form of a cs_* state, where the language needs another agreement.
    const own = Object.keys(strings).filter((k) => !k.startsWith("ph_")).sort();
    assert.deepEqual(own, Object.keys(en).sort(), `${lang} keys differ from en`);
    for (const key of Object.keys(strings).filter((k) => k.startsWith("ph_"))) {
      assert.ok(key.replace("ph_", "cs_") in en, `${lang}.${key} has no cs_ counterpart`);
      assert.ok(String(strings[key]).trim(), `${lang}.${key} is empty`);
    }
    for (const key of Object.keys(en)) {
      assert.equal(typeof strings[key], typeof en[key], `${lang}.${key} type differs from en`);
      if (Array.isArray(en[key])) assert.equal(strings[key].length, en[key].length, `${lang}.${key} length differs from en`);
      assert.deepEqual(placeholders(strings[key]), placeholders(en[key]), `${lang}.${key} placeholders differ from en`);
      assert.ok(String(strings[key]).trim(), `${lang}.${key} is empty`);
    }
  }
});

test("I18N: fr has the en keys and placeholders, plus its own cw_* adjective forms", () => {
  const en = HpI18n.en, fr = HpI18n.fr;
  const own = Object.keys(fr).filter((k) => !k.startsWith("cw_")).sort();
  assert.deepEqual(own, Object.keys(en).sort(), "fr keys differ from en");
  for (const key of Object.keys(en)) {
    assert.deepEqual(placeholders(fr[key]), placeholders(en[key]), `fr.${key} placeholders differ from en`);
    assert.ok(String(fr[key]).trim(), `fr.${key} is empty`);
  }
});

// Brands, product names, units and paths stay in Latin script in the Cyrillic dictionary.
const LATIN_OK = /Home Assistant|HP Printer|Brother|Epson|EcoTank|Expression|WorkForce|Canon|PIXMA|MAXIFY|MegaTank|i-SENSYS|imageCLASS|HL|DCP-L|MFC-L|MFC-J|DCP-J|G\)|OfficeJet|PageWide|LaserJet|DeskJet|ENVY|Smart Tank|ePrint|hp\.com|\/local\/printer\.png|URL|IPP|HP|\{\w+\}/g;

test("I18N: sr is written in Cyrillic and sr-Latn in Latin script", () => {
  for (const [key, value] of Object.entries(HpI18n.sr)) {
    assert.doesNotMatch(value.replace(LATIN_OK, ""), /[A-Za-z]/, `sr.${key} has Latin letters: ${value}`);
  }
  for (const [key, value] of Object.entries(HpI18n["sr-Latn"])) {
    assert.doesNotMatch(value, /[Ѐ-ӿ]/, `sr-Latn.${key} has Cyrillic letters: ${value}`);
  }
});

test("language resolution: full code, then the part before the dash, then en", () => {
  // pt-BR falls back to European Portuguese (pt), the only Portuguese dictionary.
  const cases = {
    "fr-FR": "fr", "sr-Latn": "sr-Latn", sr: "sr", de: "de",
    "it-IT": "it", "nl-BE": "nl", pt: "pt", "pt-BR": "pt", "pl-PL": "pl", ja: "en",
    "ro-RO": "ro", "da-DK": "da", "sv-SE": "sv", "bg-BG": "bg", "ru-RU": "ru", "uk-UA": "uk", "hu-HU": "hu",
    "sk-SK": "sk", "cs-CZ": "cs", "sl-SI": "sl", "lv-LV": "lv", "el-GR": "el",
  };
  for (const [language, expected] of Object.entries(cases)) {
    // Card: config.language, then the HA language.
    assert.equal(PrinterCard.prototype._lang.call({ _config: {}, _hass: { language } }), expected, `card, hass ${language}`);
    assert.equal(PrinterCard.prototype._lang.call({ _config: { language }, _hass: { language: "en" } }), expected, `card, config ${language}`);
    // Editor: same order.
    assert.equal(PrinterCardEditor.prototype._lang.call({ _config: {}, _hass: { language } }), expected, `editor, hass ${language}`);
  }
});

test("relative times follow the script: Latin for sr-Latn, Cyrillic for sr", () => {
  const date = new Date(Date.now() - 3 * 3600 * 1000);
  const latn = PrinterCard.prototype._relative.call({ _lang: () => "sr-Latn" }, date);
  const cyrl = PrinterCard.prototype._relative.call({ _lang: () => "sr" }, date);
  assert.doesNotMatch(latn, /[Ѐ-ӿ]/, latn);
  assert.match(latn, /[a-z]/, latn);
  assert.match(cyrl, /[Ѐ-ӿ]/, cyrl);
});

test("editor language options: one per dictionary, with their native names", () => {
  const schema = PrinterCardEditor.prototype._schema.call({ _lang: () => "en", _config: {} });
  const field = schema.find((s) => s.name === "language");
  // Automatic first (empty value: follows Home Assistant), then one per dictionary.
  assert.deepEqual({ ...field.selector.select.options[0] }, { value: "", label: "Automatic" });
  const options = field.selector.select.options.slice(1);
  assert.deepEqual(Array.from(options, (o) => o.value).sort(), Object.keys(HpI18n).sort());
  const labels = Object.fromEntries(options.map((o) => [o.value, o.label]));
  assert.equal(labels.it, "Italiano");
  assert.equal(labels.nl, "Nederlands");
  assert.equal(labels.pt, "Português (Portugal)");
  assert.equal(labels.pl, "Polski");
  const native = {
    ro: "Română", da: "Dansk", sv: "Svenska", bg: "Български", ru: "Русский", uk: "Українська", hu: "Magyar",
    sk: "Slovenčina", cs: "Čeština", sl: "Slovenščina", lv: "Latviešu", el: "Ελληνικά",
  };
  for (const [lang, label] of Object.entries(native)) assert.equal(labels[lang], label, `${lang} label`);
  // Same order as the README table: the 12 new languages follow Polski.
  const values = Array.from(options, (o) => o.value);
  assert.deepEqual(values.slice(values.indexOf("pl") + 1), NEW_LANGS);
});

test("I18N: the printhead has its own forms where its gender differs from the cartridge's", () => {
  const withPh = Object.keys(HpI18n).filter((lang) => Object.keys(HpI18n[lang]).some((k) => k.startsWith("ph_"))).sort();
  // Feminine printhead next to a masculine cartridge (pl, pt, sr, ru, uk), neuter next to a common-gender one (da, sv).
  assert.deepEqual(withPh, ["da", "pl", "pt", "ru", "sr", "sr-Latn", "sv", "uk"]);
  // Same keys in both Serbian scripts.
  const ph = (lang) => Object.keys(HpI18n[lang]).filter((k) => k.startsWith("ph_")).sort();
  assert.deepEqual(ph("sr"), ph("sr-Latn"));
});

// Only Serbian is bound to one script: the other Cyrillic (bg, ru, uk) and the Greek dictionaries keep Latin brands,
// and no Latin-script dictionary carries a Cyrillic or Greek letter.
test("I18N: bg, ru and uk are written in Cyrillic, el in Greek, the others in Latin script", () => {
  const scripts = { bg: /[Ѐ-ӿ]/, ru: /[Ѐ-ӿ]/, uk: /[Ѐ-ӿ]/, el: /[Ͱ-Ͽἀ-῿]/ };
  for (const lang of NEW_LANGS) {
    for (const [key, value] of Object.entries(HpI18n[lang])) {
      const rest = value.replace(LATIN_OK, "");
      if (scripts[lang]) {
        assert.doesNotMatch(rest, /[A-Za-z]/, `${lang}.${key} has Latin letters: ${value}`);
        if (rest.trim() && /\p{L}/u.test(rest)) assert.match(rest, scripts[lang], `${lang}.${key} is not in its script: ${value}`);
      } else {
        assert.doesNotMatch(value, /[Ѐ-ӿͰ-Ͽ]/, `${lang}.${key} has Cyrillic or Greek letters: ${value}`);
      }
    }
  }
});

test("relative times follow the language: Cyrillic for bg, ru and uk, Greek for el", () => {
  const date = new Date(Date.now() - 3 * 3600 * 1000);
  for (const lang of ["bg", "ru", "uk"]) assert.match(PrinterCard.prototype._relative.call({ _lang: () => lang }, date), /[Ѐ-ӿ]/, lang);
  assert.match(PrinterCard.prototype._relative.call({ _lang: () => "el" }, date), /[Ͱ-Ͽ]/);
});
