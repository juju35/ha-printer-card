import assert from "node:assert/strict";
import { test } from "node:test";
import { loadCard } from "./load.mjs";

const { HpI18n, PrinterCard, PrinterCardEditor } = loadCard("printer-card.js", ["HpI18n", "PrinterCard", "PrinterCardEditor"]);
const placeholders = (s) => String(s).match(/\{\w+\}/g)?.sort() ?? [];

const LANGS = ["de", "es", "sr", "sr-Latn", "it", "nl", "pt", "pl"];

test("I18N parity: every language has exactly the keys and placeholders of en, and no empty value", () => {
  const en = HpI18n.en;
  assert.deepEqual(Object.keys(HpI18n).sort(), ["en", "fr", ...LANGS].sort(), "unexpected language list");
  for (const lang of LANGS) {
    const strings = HpI18n[lang];
    assert.ok(strings, `${lang} is missing`);
    assert.deepEqual(Object.keys(strings).sort(), Object.keys(en).sort(), `${lang} keys differ from en`);
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
const LATIN_OK = /Home Assistant|HP Printer|OfficeJet|PageWide|LaserJet|DeskJet|ENVY|Smart Tank|ePrint|hp\.com|\/local\/printer\.png|URL|IPP|HP|\{\w+\}/g;

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

test("editor language options: one per dictionary, Italian, Dutch, Portuguese and Polish included", () => {
  const schema = PrinterCardEditor.prototype._schema.call({ _lang: () => "en", _config: {} });
  const field = schema.find((s) => s.name === "language");
  const options = field.selector.select.options;
  assert.deepEqual(Array.from(options, (o) => o.value).sort(), Object.keys(HpI18n).sort());
  const labels = Object.fromEntries(options.map((o) => [o.value, o.label]));
  assert.equal(labels.it, "Italiano");
  assert.equal(labels.nl, "Nederlands");
  assert.equal(labels.pt, "Português");
  assert.equal(labels.pl, "Polski");
});
