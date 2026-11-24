// ── Status ───────────────────────────────────────────────────────────────────
import { HP_INK_COLORS, HP_INK_ORDER, hpCartridgeOk, hpCartridgeProblem } from "./inks.js";

export var HP_STATE_COLORS = {
  ready: 'var(--success-color, #43a047)',
  // Overridable from a theme, like the other states which follow the HA status colors.
  inpowersave: 'var(--printer-card-sleep-color, #5c8fd6)',
  processing: 'var(--info-color, #039be5)',
  scanprocessing: 'var(--printer-card-scan-color, #8e24aa)',
  copying: 'var(--info-color, #039be5)',
  canceljob: 'var(--warning-color, #ffa600)',
  stopped: 'var(--error-color, #db4437)',
};

export var HP_STATE_ICONS = {
  ready: 'mdi:printer-check',
  inpowersave: 'mdi:power-sleep',
  processing: 'mdi:printer',
  scanprocessing: 'mdi:scanner',
  copying: 'mdi:content-copy',
  canceljob: 'mdi:cancel',
  stopped: 'mdi:printer-alert',
  offline: 'mdi:printer-off',
};

// States reported by the IPP integration, mapped onto the HP Printer ones.
export var HP_IPP_STATES = { idle: 'ready', printing: 'processing', stopped: 'stopped' };

// Brother integration (core, SNMP): the "Printer status" sensor (idle / printing / warmup / other), and the raw
// "Status" text the printer reports, in its own language ("ready", "sleep", "printing", "paper jam", "druk"…).
export var HP_BROTHER_STATES = { idle: 'ready', printing: 'processing', warmup: 'processing' };
// Raw texts of a printer that cannot print: jam, no paper, cover open, toner empty, error, "unable to print"…
export var HP_BROTHER_ERROR = new RegExp(['jam', 'stau', 'bourrage', 'atasco', 'incepp', 'zacię', 'no paper', 'out of paper', 'paper empty',
  'load paper', 'kein papier', 'pas de papier', 'sin papel', 'cover', 'door', 'capot', 'abdeckung', 'tapa', 'coperchio',
  'toner empty', 'toner end', 'replace toner', 'no toner', 'toner vide', 'error', 'erreur', 'fehler', 'errore', 'fout', 'błąd',
  'unable', 'impossible',
  // The drum at its end: "Replace Drum", "Drum Stop" (not "Drum End Soon", a warning).
  'replace drum', 'change drum', 'drum stop', 'trommel ersetzen', 'trommel wechseln', 'trommel stop', 'remplacer tambour',
  'arrêt tambour', 'tambour arrêt', 'cambiar tambor', 'sustituir tambor', 'tambor parado', 'sostituire tamburo', 'tamburo fermo',
  'drum vervangen', 'vervang drum'].join('|'));
// State told by the raw text, null when the text is not recognized.
export function hpBrotherText(text) {
  var t = String(text || '').toLowerCase();
  if (!t || t === 'unknown' || t === 'unavailable') return null;
  if (HP_BROTHER_ERROR.test(t)) return 'stopped';
  if (/print|druk|impr|stampa|drukowa|печат|štamp/.test(t)) return 'processing';
  if (/sleep|veille|ruhe|reposo|riposo|slaap|uśpi|спава|spava|deep/.test(t)) return 'inpowersave';
  if (/ready|pr[eê]t|bereit|listo|pronto|gereed|gotow|готов|spreman|klar/.test(t)) return 'ready';
  return null;
}
// `status`: the printer status (undefined without that sensor), `text`: the raw status text. An error in the text
// stops the printer whatever the printer status says; `other` takes the text's state, else is unknown.
export function hpBrotherState(status, text) {
  var fromText = hpBrotherText(text);
  if (fromText === 'stopped') return 'stopped';
  if (HP_BROTHER_STATES[status]) return HP_BROTHER_STATES[status];
  if (status === undefined) return fromText || 'ready';
  return fromText || 'unknown';
}
// Status entity of a Brother printer (the normalized one first) and its ink / toner sensors, by translation key.
export function hpIsBrotherStatus(e) {
  return e?.platform === 'brother' && (e.translation_key === 'printer_status' || e.translation_key === 'status');
}
export function hpBrotherInks(list) {
  return list.map((e) => {
    var m = /^(black|cyan|magenta|yellow)_(toner|ink)_remaining$/.exec(e.platform === 'brother' ? e.translation_key || '' : '');
    return m && { name: e.entity_id, color: m[1], level: e.entity_id, toner: m[2] === 'toner' };
  }).filter(Boolean).sort((a, b) => HP_INK_ORDER[a.color] - HP_INK_ORDER[b.color]);
}
// HP Printer of ha-hp (domain "hp", one device per printer): its status sensor, and its ink / toner level sensors
// (black_level, tri_color_level…) carrying the cartridge state, installation and number as attributes.
// Its status keeps the values of the core hp_printer integration; those that stop the printer turn "stopped".
export var HP_LOCAL_STATES = {
  ready: 'ready', processing: 'processing', copying: 'copying', scan_processing: 'scanprocessing', cancel_job: 'canceljob',
  in_power_save: 'inpowersave', initializing: 'processing', shutting_down: 'processing',
  tray_empty: 'stopped', paper_jam: 'stopped', close_door_or_cover: 'stopped',
};
export function hpIsLocalStatus(e) {
  return e?.platform === 'hp' && e.translation_key === 'status';
}
export function hpLocalInks(list) {
  var byKey = (key) => list.find((e) => e.translation_key === key)?.entity_id;
  return list.map((e) => {
    // Any cartridge color of the card (photo_black_level, light_cyan_level…), tri_color being its tricolor.
    var m = /^([a-z_]+)_level$/.exec(e.platform === 'hp' ? e.translation_key || '' : '');
    var color = m && (m[1] === 'tri_color' ? 'tricolor' : m[1]);
    if (!color || color === 'ink' || !(color in HP_INK_COLORS)) return null;
    return { name: e.entity_id, color: color, level: e.entity_id, local: true, pages_left: byKey(`${m[1]}_pages_remaining`) };
  }).filter(Boolean).sort((a, b) => HP_INK_ORDER[a.color] - HP_INK_ORDER[b.color]);
}
// Problem of a cartridge of ha-hp, from its level sensor's attributes: taken out, or a state other than ok / low
// (a low level is told by the level itself). Null when fine.
export function hpLocalCartridgeProblem(attributes) {
  var a = attributes || {};
  if (a.installed === false) return 'cs_missing';
  var s = String(a.state || '').toLowerCase().replace(/_/g, '');
  if (!s || /^(ok|low|verylow)$/.test(s) || hpCartridgeOk(s)) return null;
  return hpCartridgeProblem(s);
}

// Its parts that wear out, by remaining life (%): drum (or one per color), belt unit, fuser, paper feed kits.
export var HP_PART_ORDER = { drum: 0, belt: 1, fuser: 2, pf_kit: 3 };
export function hpBrotherParts(list) {
  return list.map((e) => {
    var m = /^(?:(?:(black|cyan|magenta|yellow)_)?(drum)|(belt)_unit|(fuser)|(pf_kit)_(1|mp))_remaining_life$/.exec(e.platform === 'brother' ? e.translation_key || '' : '');
    return m && { kind: m[2] || m[3] || m[4] || m[5], color: m[1], suffix: m[6]?.toUpperCase(), level: e.entity_id };
  }).filter(Boolean).sort((a, b) => HP_PART_ORDER[a.kind] - HP_PART_ORDER[b.kind] ||
    (HP_INK_ORDER[a.color] ?? -1) - (HP_INK_ORDER[b.color] ?? -1) || String(a.suffix).localeCompare(String(b.suffix)));
}

export var HP_BUSY = ['processing', 'scanprocessing', 'copying'];
