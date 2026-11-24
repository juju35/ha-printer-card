// ── i18n ──────────────────────────────────────────────────────────────────────
import { HpI18n } from "./i18n/hpi18n.js";

// Full code when the dictionary has it (sr-Latn), else the part before the dash (fr-FR -> fr, pt-BR -> pt), else en.
export function hpLang(language) {
  var l = String(language || 'en');
  if (HpI18n[l]) return l;
  l = l.split('-')[0];
  return HpI18n[l] ? l : 'en';
}

// Locale for Intl and toLocaleString: Home Assistant's full locale when it resolves to the card's language
// (pt-BR, de-CH…), else the card's language (the `language` option wins). HA's plain `pt` is European
// Portuguese, as is the card's dictionary, so it is passed as pt-PT (Intl reads `pt` as Brazilian).
export function hpLocale(lang, hass) {
  var full = hass && (hass.locale?.language || hass.language);
  var loc = full && hpLang(full) === lang ? String(full) : lang;
  return loc === 'pt' ? 'pt-PT' : loc;
}

export function hpT(lang, key) {
  var strings = HpI18n[lang] || HpI18n.en;
  return strings[key] || HpI18n.en[key] || key;
}

export function hpEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function hpCap(s) {
  var t = String(s);
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function hpFill(str, vars) {
  return String(str).replace(/\{(\w+)\}/g, (m, k) => vars[k] != null ? vars[k] : m);
}
