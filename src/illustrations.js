// ── Illustrations ────────────────────────────────────────────────────────────
// Drawn pictures (160 × 120): one per HP range and a generic printer for the other brands (IPP).
// Their `.screen` (control panel) lights up in the status color.
import { hpBrandOf } from "./discovery.js";

export var HP_ART_DEFS = '<defs>' +
  '<linearGradient id="pc-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5f7f9"/><stop offset="1" stop-color="#cdd3da"/></linearGradient>' +
  '<linearGradient id="pc-dark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#525965"/><stop offset="1" stop-color="#2a2e35"/></linearGradient>' +
  '<linearGradient id="pc-paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e6e9ee"/></linearGradient>' +
  '</defs><ellipse cx="80" cy="111" rx="64" ry="5" fill="#000" opacity="0.13"/>';

export var HP_ART = {
  generic:
    '<rect x="42" y="6" width="76" height="40" rx="2" fill="url(#pc-paper)" stroke="#c3c9d1"/>' +
    '<path d="M52 16h56M52 23h56M52 30h38" stroke="#c9ced6" stroke-width="2.5" stroke-linecap="round"/>' +
    '<rect x="14" y="34" width="132" height="58" rx="14" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<rect x="20" y="37" width="120" height="8" rx="4" fill="#fff" opacity="0.6"/>' +
    '<rect x="100" y="50" width="34" height="14" rx="4" fill="#23272e"/><rect class="screen" x="103" y="53" width="28" height="8" rx="2"/>' +
    '<circle cx="28" cy="57" r="3.5" fill="#8a929c"/>' +
    '<rect x="28" y="74" width="104" height="8" rx="4" fill="url(#pc-dark)"/>' +
    '<path d="M36 78h88l-6 28H42z" fill="url(#pc-paper)" stroke="#c3c9d1"/>',
  officejet:
    '<rect x="62" y="4" width="56" height="14" rx="1" fill="url(#pc-paper)" stroke="#c3c9d1"/>' +
    '<path d="M38 28L50 12H128L138 28z" fill="url(#pc-dark)"/>' +
    '<rect x="16" y="26" width="128" height="16" rx="5" fill="url(#pc-dark)"/>' +
    '<rect x="16" y="40" width="128" height="62" rx="8" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<rect x="26" y="49" width="38" height="18" rx="3" fill="#23272e"/><rect class="screen" x="29" y="52" width="32" height="12" rx="2"/>' +
    '<rect x="36" y="78" width="88" height="7" rx="3.5" fill="url(#pc-dark)"/>' +
    '<path d="M44 82h72l5 15H39z" fill="url(#pc-paper)" stroke="#c3c9d1"/>' +
    '<path d="M17 96h126" stroke="#aab2bc"/>',
  laserjet:
    '<rect x="22" y="12" width="116" height="94" rx="8" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<path d="M22 20a8 8 0 0 1 8-8h100a8 8 0 0 1 8 8v14H22z" fill="url(#pc-dark)"/>' +
    '<path d="M38 18h84l-6 11H44z" fill="#16191d"/><rect x="50" y="22" width="60" height="5" rx="1" fill="url(#pc-paper)"/>' +
    '<rect x="30" y="42" width="42" height="18" rx="4" fill="#23272e"/><rect class="screen" x="33" y="45" width="36" height="12" rx="2"/>' +
    '<circle cx="126" cy="51" r="3.5" fill="#8a929c"/>' +
    '<path d="M23 72h114M23 84h114" stroke="#aab2bc"/>' +
    '<rect x="64" y="92" width="32" height="5" rx="2.5" fill="#8a929c"/>',
  deskjet:
    '<path d="M46 6h68l4 48H42z" fill="url(#pc-paper)" stroke="#c3c9d1"/>' +
    '<rect x="14" y="48" width="132" height="46" rx="16" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<rect x="22" y="51" width="116" height="8" rx="4" fill="#fff" opacity="0.6"/>' +
    '<rect x="102" y="62" width="30" height="8" rx="4" fill="#23272e"/><rect class="screen" x="104" y="64" width="26" height="4" rx="2"/>' +
    '<rect x="34" y="76" width="92" height="7" rx="3.5" fill="url(#pc-dark)"/>' +
    '<path d="M42 80h76l8 22H34z" fill="url(#pc-paper)" stroke="#c3c9d1"/>',
  smart_tank:
    '<rect x="16" y="24" width="128" height="16" rx="5" fill="url(#pc-dark)"/>' +
    '<rect x="16" y="38" width="128" height="64" rx="8" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<rect x="22" y="46" width="30" height="48" rx="4" fill="#dde1e6" stroke="#b5bcc6"/>' +
    '<rect x="25" y="50" width="5" height="40" rx="1.5" fill="#fff"/><rect x="25" y="62" width="5" height="28" rx="1.5" fill="#2b2f36"/>' +
    '<rect x="32" y="50" width="5" height="40" rx="1.5" fill="#fff"/><rect x="32" y="66" width="5" height="24" rx="1.5" fill="#00a6d6"/>' +
    '<rect x="39" y="50" width="5" height="40" rx="1.5" fill="#fff"/><rect x="39" y="58" width="5" height="32" rx="1.5" fill="#d6197c"/>' +
    '<rect x="46" y="50" width="4" height="40" rx="1.5" fill="#fff"/><rect x="46" y="70" width="4" height="20" rx="1.5" fill="#f5c400"/>' +
    '<rect x="98" y="46" width="38" height="14" rx="4" fill="#23272e"/><rect class="screen" x="101" y="49" width="32" height="8" rx="2"/>' +
    '<rect x="60" y="76" width="72" height="7" rx="3.5" fill="url(#pc-dark)"/>' +
    '<path d="M66 80h60l4 16H62z" fill="url(#pc-paper)" stroke="#c3c9d1"/>',
  // Brother: compact mono laser (HL / DCP-L / MFC-L) and inkjet all-in-one with a dark scanner lid (MFC-J / DCP-J).
  brother_laser:
    '<rect x="24" y="16" width="112" height="88" rx="6" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<path d="M24 22a6 6 0 0 1 6-6h100a6 6 0 0 1 6 6v18H24z" fill="url(#pc-dark)"/>' +
    '<path d="M40 22h64l-4 12H44z" fill="#16191d"/><rect x="50" y="25" width="44" height="4" rx="1" fill="url(#pc-paper)"/>' +
    '<rect x="110" y="24" width="20" height="10" rx="3" fill="#23272e"/><rect class="screen" x="112" y="26" width="16" height="6" rx="1.5"/>' +
    '<path d="M25 58h110" stroke="#aab2bc"/><rect x="30" y="66" width="100" height="26" rx="3" fill="#e9ecf0" stroke="#c3c9d1"/>' +
    '<rect x="66" y="76" width="28" height="4" rx="2" fill="#8a929c"/>',
  brother_inkjet:
    '<rect x="18" y="20" width="124" height="18" rx="5" fill="url(#pc-dark)"/>' +
    '<rect x="18" y="36" width="124" height="66" rx="8" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<path d="M22 42h40l-4 16H26z" fill="#23272e"/><rect class="screen" x="28" y="45" width="28" height="10" rx="2"/>' +
    '<rect x="34" y="72" width="92" height="7" rx="3.5" fill="url(#pc-dark)"/>' +
    '<path d="M42 76h76l4 18H38z" fill="url(#pc-paper)" stroke="#c3c9d1"/>' +
    '<path d="M19 96h122" stroke="#aab2bc"/>',
  // Epson: EcoTank with its ink tanks on the front right, and a compact dark Expression / WorkForce inkjet.
  ecotank:
    '<rect x="14" y="22" width="132" height="16" rx="5" fill="url(#pc-dark)"/>' +
    '<rect x="14" y="36" width="104" height="66" rx="7" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<rect x="116" y="36" width="30" height="66" rx="6" fill="#dde1e6" stroke="#b5bcc6"/>' +
    '<rect x="120" y="44" width="5" height="50" rx="1.5" fill="#fff"/><rect x="120" y="56" width="5" height="38" rx="1.5" fill="#2b2f36"/>' +
    '<rect x="126" y="44" width="5" height="50" rx="1.5" fill="#fff"/><rect x="126" y="62" width="5" height="32" rx="1.5" fill="#00a6d6"/>' +
    '<rect x="132" y="44" width="5" height="50" rx="1.5" fill="#fff"/><rect x="132" y="52" width="5" height="42" rx="1.5" fill="#d6197c"/>' +
    '<rect x="138" y="44" width="4" height="50" rx="1.5" fill="#fff"/><rect x="138" y="68" width="4" height="26" rx="1.5" fill="#f5c400"/>' +
    '<rect x="22" y="44" width="34" height="12" rx="3" fill="#23272e"/><rect class="screen" x="25" y="47" width="28" height="6" rx="1.5"/>' +
    '<rect x="26" y="74" width="80" height="7" rx="3.5" fill="url(#pc-dark)"/>' +
    '<path d="M32 78h68l4 18H28z" fill="url(#pc-paper)" stroke="#c3c9d1"/>',
  epson_inkjet:
    '<rect x="54" y="18" width="52" height="16" rx="1" fill="url(#pc-paper)" stroke="#c3c9d1"/>' +
    '<rect x="16" y="30" width="128" height="62" rx="9" fill="url(#pc-dark)"/>' +
    '<rect x="16" y="30" width="128" height="10" rx="5" fill="#626a76"/>' +
    '<path d="M24 48h44l-3 14H27z" fill="#16191d"/><rect class="screen" x="29" y="51" width="34" height="8" rx="2"/>' +
    '<circle cx="128" cy="55" r="3.5" fill="#8a929c"/>' +
    '<rect x="34" y="74" width="92" height="7" rx="3.5" fill="#16191d"/>' +
    '<path d="M42 78h76l6 26H36z" fill="url(#pc-paper)" stroke="#c3c9d1"/>',
  // Canon: low PIXMA / MAXIFY inkjet, MegaTank (PIXMA G) with its front tanks, and an i-SENSYS / imageCLASS laser.
  pixma:
    '<rect x="14" y="40" width="132" height="54" rx="12" fill="url(#pc-dark)"/>' +
    '<rect x="20" y="43" width="120" height="7" rx="3.5" fill="#6b7380" opacity="0.7"/>' +
    '<rect x="100" y="56" width="32" height="12" rx="3" fill="#16191d"/><rect class="screen" x="103" y="59" width="26" height="6" rx="1.5"/>' +
    '<rect x="30" y="74" width="100" height="7" rx="3.5" fill="#16191d"/>' +
    '<path d="M38 78h84l8 24H30z" fill="url(#pc-paper)" stroke="#c3c9d1"/>',
  megatank:
    '<rect x="14" y="30" width="132" height="16" rx="5" fill="url(#pc-dark)"/>' +
    '<rect x="14" y="44" width="132" height="58" rx="8" fill="#3a4049"/>' +
    '<rect x="20" y="52" width="30" height="42" rx="4" fill="#5b636e"/>' +
    '<rect x="23" y="56" width="5" height="34" rx="1.5" fill="#cfd5dc"/><rect x="23" y="66" width="5" height="24" rx="1.5" fill="#1c1f24"/>' +
    '<rect x="30" y="56" width="5" height="34" rx="1.5" fill="#cfd5dc"/><rect x="30" y="70" width="5" height="20" rx="1.5" fill="#00a6d6"/>' +
    '<rect x="37" y="56" width="5" height="34" rx="1.5" fill="#cfd5dc"/><rect x="37" y="62" width="5" height="28" rx="1.5" fill="#d6197c"/>' +
    '<rect x="44" y="56" width="4" height="34" rx="1.5" fill="#cfd5dc"/><rect x="44" y="74" width="4" height="16" rx="1.5" fill="#f5c400"/>' +
    '<rect x="100" y="52" width="36" height="12" rx="3" fill="#16191d"/><rect class="screen" x="103" y="55" width="30" height="6" rx="1.5"/>' +
    '<rect x="62" y="76" width="72" height="7" rx="3.5" fill="#16191d"/>' +
    '<path d="M68 80h60l4 16H64z" fill="url(#pc-paper)" stroke="#c3c9d1"/>',
  canon_laser:
    '<rect x="22" y="14" width="116" height="92" rx="7" fill="url(#pc-body)" stroke="#b5bcc6"/>' +
    '<path d="M36 20h88l-8 16H44z" fill="url(#pc-dark)"/><rect x="54" y="24" width="52" height="5" rx="1" fill="url(#pc-paper)"/>' +
    '<rect x="30" y="44" width="26" height="14" rx="3" fill="#23272e"/><rect class="screen" x="33" y="47" width="20" height="8" rx="1.5"/>' +
    '<rect x="64" y="46" width="66" height="10" rx="5" fill="#e3e7ec"/>' +
    '<path d="M23 66h114" stroke="#aab2bc"/><rect x="28" y="72" width="104" height="28" rx="3" fill="#e9ecf0" stroke="#c3c9d1"/>' +
    '<rect x="64" y="84" width="32" height="4" rx="2" fill="#8a929c"/>',
};

export var HP_PICTURES = ['auto', 'officejet', 'laserjet', 'deskjet', 'smart_tank', 'brother_laser', 'brother_inkjet', 'ecotank', 'epson_inkjet',
  'pixma', 'megatank', 'canon_laser', 'generic'];

export function hpIsHpDevice(device) {
  var maker = String(device?.manufacturer || '').toLowerCase();
  var model = `${device?.model || ''} ${device?.name || ''}`.toLowerCase().trim();
  return /\bhp\b|hewlett/.test(maker) || /^hp\b/.test(model);
}

// Picture matching a device: the drawing of its HP range, or the generic printer for the other brands.
export function hpPictureFor(device, kind) {
  var model = `${device?.model || ''} ${device?.name || ''}`.toLowerCase();
  var brand = hpBrandOf(device);
  if (brand === 'brother') return /\b(mfc|dcp)-?j|inkjet/.test(model) ? 'brother_inkjet' : 'brother_laser';
  if (brand === 'epson') return /ecotank|\b(et|l)-?\d{3,5}/.test(model) ? 'ecotank' : 'epson_inkjet';
  if (brand === 'canon') {
    if (/megatank|\bg\d{3,4}\b/.test(model)) return 'megatank';
    return /i-sensys|imageclass|imagerunner|\b(lbp|mf)\s?\d|laser/.test(model) ? 'canon_laser' : 'pixma';
  }
  if (kind !== 'hp' && brand !== 'hp') return 'generic';
  if (/laserjet|neverstop/.test(model)) return 'laserjet';
  if (/smart tank|ink tank/.test(model)) return 'smart_tank';
  if (/deskjet|envy|tango/.test(model)) return 'deskjet';
  return 'officejet';
}
