// ── Inks ─────────────────────────────────────────────────────────────────────
// Theme black: near black on light themes, light on dark ones.
export var HP_BLACK = 'color-mix(in srgb, var(--primary-text-color, #212121) 88%, transparent)';
export var HP_INK_COLORS = {
  black: HP_BLACK,
  // Photo black shines (a light streak), matte black is duller: both stay apart from the plain black.
  photo_black: `linear-gradient(135deg, ${HP_BLACK} 0 55%, color-mix(in srgb, var(--primary-text-color, #212121) 55%, transparent) 75%, ${HP_BLACK})`,
  matte_black: 'color-mix(in srgb, var(--primary-text-color, #212121) 82%, transparent)',
  // Grays keep the same tone on every theme (only black follows it), light gray always paler than gray: on a light
  // theme between black and the empty tank, on a dark one between the empty tank and the light-drawn black.
  gray: '#6b6b6b',
  light_gray: '#a6a6a6',
  cyan: '#00a6d6',
  // Photo and light inks: the paler tone of their color (a printer has one or the other).
  photo_cyan: '#7fd8f2',
  light_cyan: '#7fd8f2',
  magenta: '#d6197c',
  photo_magenta: '#f08cc2',
  light_magenta: '#f08cc2',
  yellow: '#f5c400',
  red: '#e53935',
  orange: '#fb8c00',
  green: '#2e9d4a',
  blue: '#1e5fd6',
  violet: '#8e44ad',
  tricolor: 'linear-gradient(90deg, #00a6d6 0 33%, #d6197c 33% 66%, #f5c400 66%)',
  // Chroma / gloss optimizer: a clear liquid.
  optimizer: 'linear-gradient(135deg, #cfd8dc, #eceff1 50%, #cfd8dc)',
  ink: '#9e9e9e',
};

// Display order of the cartridges, when the printer does not report their station.
export var HP_INK_ORDER = Object.fromEntries(Object.keys(HP_INK_COLORS).map((k, i) => [k, i]));

// Color of a cartridge from its name ("Photo Cyan(PC)", "Light Light Black", "magenta ink", "tri-color", "Gray"…),
// null when the name tells none. Words are matched whole, so "Photosmart" in a model name is not "photo".
// `codes`: the name is the cartridge's own (no model in it), so its short codes count too ("BK", "PGBK", "LGY").
export var HP_INK_CODES = {
  k: 'black', bk: 'black', pgbk: 'black', pbk: 'photo_black', pk: 'photo_black', mbk: 'matte_black', mk: 'matte_black',
  gy: 'gray', dgy: 'gray', lk: 'gray', lgy: 'light_gray', llk: 'light_gray',
  c: 'cyan', pc: 'photo_cyan', lc: 'light_cyan', m: 'magenta', vm: 'magenta', pm: 'photo_magenta', lm: 'light_magenta', vlm: 'light_magenta',
  y: 'yellow', r: 'red', o: 'orange', or: 'orange', g: 'green', b: 'blue', pb: 'blue', v: 'violet', co: 'optimizer', go: 'optimizer',
};
export function hpInkColor(text, codes) {
  var w = ` ${String(text || '').replace(/([a-z])([A-Z])/g, '$1 $2').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;
  var t = w.replace(/ /g, '');
  var word = (re) => new RegExp(` (${re}) `).test(w);
  if (/cyanmagentayellow|tricolou?r|couleur/.test(t)) return 'tricolor';
  if (/(chroma|gloss)optimi|optimi[sz]er/.test(t)) return 'optimizer';
  // Qualifiers, as a word or glued to the color ("PhotoBlack", "lightcyan").
  var hue = '(black|noir|schwarz|cyan|magenta|gr[ae]y|gris)';
  var photo = word('photo|foto') || new RegExp(`(photo|foto)${hue}`).test(t);
  var light = word('light|lt|clair|claire|hell|claro|chiaro') || new RegExp(`(light|hell)${hue}`).test(t);
  if (word('gr[ae]y|gris|grise|grau|grijs|grigio')) return light ? 'light_gray' : 'gray';
  if (/cyan/.test(t)) return photo ? 'photo_cyan' : light ? 'light_cyan' : 'cyan';
  if (/magenta/.test(t)) return photo ? 'photo_magenta' : light ? 'light_magenta' : 'magenta';
  if (/yellow|jaune|gelb/.test(t)) return 'yellow';
  if (/black|noir|schwarz/.test(t)) {
    // Epson: light black is its gray, light light black its light gray.
    if (/light ?light ?black|lightlightblack/.test(w)) return 'light_gray';
    if (light) return 'gray';
    if (word('matte?|mat|matt')) return 'matte_black';
    return photo ? 'photo_black' : 'black';
  }
  if (word('red|rouge|rot')) return 'red';
  if (word('orange')) return 'orange';
  if (word('green|vert|verte|grun')) return 'green';
  if (word('blue|bleu|bleue|blau')) return 'blue';
  if (word('violet|purple|violett')) return 'violet';
  if (!codes) return null;
  var hit = w.trim().split(' ').find((tok) => HP_INK_CODES[tok]);
  return hit ? HP_INK_CODES[hit] : null;
}

// Name `name` without the leading `prefix` (a device name), when it starts with it.
export function hpStripPrefix(name, prefix) {
  var n = String(name || ''), p = String(prefix || '').trim();
  return p && n.toLowerCase().startsWith(p.toLowerCase()) && n.length > p.length ? n.slice(p.length).trim() : n;
}

// Cartridge states that are fine: ok, newGenuineHP, usedGenuineHP, genuineHP…
export function hpCartridgeOk(state) {
  var s = String(state || '').toLowerCase();
  return !s || s === 'ok' || s === 'unknown' || s.indexOf('genuine') >= 0 && s.indexOf('non') < 0;
}

export function hpCartridgeProblem(state) {
  var s = String(state || '').toLowerCase();
  if (/missing|absent/.test(s)) return 'cs_missing';
  if (/empty|depleted|verylow/.test(s)) return 'cs_empty';
  if (/counterfeit/.test(s)) return 'cs_counterfeit';
  if (/nongenuine|nonhp|non_hp|refill/.test(s)) return 'cs_nongenuine';
  if (/incompatible|wrong/.test(s)) return 'cs_incompatible';
  if (/damage|fail|error/.test(s)) return 'cs_damaged';
  if (/used/.test(s)) return 'cs_used';
  return 'cs_problem';
}
