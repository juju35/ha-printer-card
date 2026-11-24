// ── Illustrated header ───────────────────────────────────────────────────────
// A 90px banner: an office wall (window, shelf with books and a plant, floor lamp) at the right, the printer's own
// drawing standing on a 10px desk strip edge to edge at the bottom, the title and the status on the wall at the left.
// Day or night: illustration_theme, else Home Assistant's dark mode alone (a light theme keeps the day picture after
// sunset).
import { HP_ACCENT } from "./discovery.js";

export function hpIsNight(hass, config) {
  var theme = config?.illustration_theme;
  if (theme === 'night') return true;
  if (theme === 'day') return false;
  return !!hass?.themes?.darkMode;
}
// The wall (200 × 80, drawn to the right edge, 1.1× from its bottom right): window with the sun or the moon, shelf, lamp.
export function hpOfficeScene(night) {
  var n = !!night;
  var win = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="${n ? '#1b2f52' : '#bfe0f7'}" stroke="${n ? '#4a5568' : '#fff'}" stroke-width="1.6"/>` +
    (n ? `<circle cx="${x + w * 0.7}" cy="${y + h * 0.3}" r="2.4" fill="#f3eed2"/>` : `<circle cx="${x + w * 0.7}" cy="${y + h * 0.35}" r="3" fill="#ffd65a"/>`) +
    `<line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="${n ? '#4a5568' : '#fff'}" stroke-width="1.2"/>`;
  return '<svg class="scene" viewBox="0 0 200 80" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">' +
    '<g transform="translate(200 80) scale(1.1) translate(-200 -80)">' +
    `<rect width="200" height="80" fill="${n ? '#262c3a' : '#eef1f6'}"/>${win(14, 10, 34, 28)}` +
    `<rect x="60" y="26" width="60" height="2.4" fill="${n ? '#3c4558' : '#c9b79c'}"/>` +
    '<rect x="64" y="14" width="5" height="12" fill="#e57373"/><rect x="70" y="16" width="4" height="10" fill="#64b5f6"/><rect x="75" y="13" width="5" height="13" fill="#81c784"/>' +
    `<circle cx="100" cy="20" r="5" fill="${n ? '#5c8a5a' : '#7cb87a'}"/><rect x="97" y="20" width="6" height="6" fill="#b0855a"/>` +
    (n ? '<circle class="halo" cx="150" cy="30" r="16" fill="#ffcf6e" opacity=".12"/>' : '') +
    `<rect x="148" y="30" width="2" height="38" fill="#777"/><path d="M144 30 h10 l-2 -6 h-6z" fill="${n ? '#ffcf6e' : '#ddd'}"/>` +
    '</g></svg>';
}
// The header icon's colour follows the status: running (ready, printing, scanning, copying) in the state colour,
// asleep or offline grey, a warning amber, an error red.
export var HP_ICON_GREY = 'var(--state-inactive-color, #9e9e9e)';
export var HP_ICON_WARN = 'var(--warning-color, #ffa600)';
export var HP_ICON_ERROR = 'var(--error-color, #db4437)';
export function hpIconColor(state, alerts, color) {
  if (state === 'offline' || state === 'unknown' || state === 'inpowersave') return HP_ICON_GREY;
  if (state === 'stopped' || alerts.some((a) => a.level === 'error')) return HP_ICON_ERROR;
  if (state === 'canceljob' || alerts.some((a) => a.level === 'warn')) return HP_ICON_WARN;
  return color;
}
export var HP_BANNER_STYLES =
  // Edge to edge at the top of the card (and at its bottom when nothing follows), 90px on both cards.
  '.hd.banner { position: relative; height: 90px; margin: -12px -12px 0; overflow: hidden; --g: 10px; --scene-w: min(200px, 54cqw, max(100cqw - 240px, 40cqw));' +
    ' border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;' +
    ' background: #eef1f6; --sky-text: #0d2a45; --sky-muted: #3b5b78; }' +
  '.hd.banner.night { background: #262c3a; --sky-text: #fff; --sky-muted: rgba(255,255,255,.78); }' +
  '.hd.banner:last-child { margin-bottom: -12px; border-radius: var(--ha-card-border-radius, 12px); }' +
  '.banner .scene { position: absolute; right: 0; bottom: 10px; height: 80px; width: var(--scene-w); }' +
  '.banner .header { position: absolute; z-index: 1; left: 0; top: 0; bottom: 10px; right: var(--scene-w); padding: 8px 8px 8px 14px; color: var(--sky-text); }' +
  '.banner .titles { display: flex; flex-direction: column; gap: 1px; }' +
  '.banner .name { color: var(--sky-text); }' +
  '.banner .hsub { font-size: 13px; line-height: 1.3; color: var(--sky-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
  '.banner .logo.mark { background: rgba(255,255,255,.62); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--hp-icon, ' + HP_ACCENT + ') 22%, transparent); }' +
  '.banner.night .logo.mark { background: rgba(255,255,255,.12); }' +
  // Brand logo on a small white tile, readable on the day and the night wall.
  '.banner .hp-badge { width: 18px; height: 18px; left: auto; right: -4px; bottom: -4px; transform: none; padding: 2px; box-sizing: border-box;' +
    ' border-radius: 5px; background: #fff; box-shadow: 0 0 0 1px rgba(13,42,69,.16), 0 1px 3px rgba(13,42,69,.18); }' +
  '.banner .hp-badge.hp { padding: 0; border-radius: 50%; box-shadow: 0 0 0 1.5px #fff, 0 1px 3px rgba(13,42,69,.25); }' +
  // The printer stands on the desk, at the right of the wall (its box in the 200 × 80 scene: x 103.9-196, y 8-80).
  '.hd.banner .pic { position: absolute; z-index: 0; bottom: 10px; right: calc(var(--scene-w) * 0.02); width: calc(var(--scene-w) * 0.4605);' +
    ' max-width: none; aspect-ratio: 92.1 / 72; }' +
  '.banner .pic svg.art, .banner .pic img { width: 100%; height: 100%; }' +
  // Offline: grey, but opaque enough to hide the wall behind it.
  '.hd.banner .pic.off { opacity: 0.85; }' +
  '.banner .pic img { object-fit: contain; object-position: 50% 100%; }' +
  '.banner .ground { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background: #b98a5c; box-shadow: inset 0 2px 0 #d4a878; }' +
  '.banner.night .ground { background: #4a3a2c; box-shadow: inset 0 2px 0 #5c4836; }' +
  // Title row (both headers): the name, then the status pill right after it, only when the whole name and the whole
  // label fit there (measured by _fitPill); else the pill takes a line of its own under the subtitle (.pill-below),
  // and when even that does not fit, only its dot or icon stays (.pill-dot, its label in its title and for screen readers).
  '.banner .titles { flex: 1 1 0; min-width: 0; overflow: visible; }' +
  '.bst { --c: var(--hp-icon, ' + HP_ACCENT + '); display: inline-flex; align-items: center; gap: 4px; flex: none; box-sizing: border-box;' +
    ' overflow: hidden; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; line-height: 16px; white-space: nowrap;' +
    ' color: color-mix(in srgb, var(--c) 45%, #0d2a45); background: color-mix(in srgb, var(--c) 18%, rgba(255,255,255,.78)); }' +
  '.banner.night .bst { color: color-mix(in srgb, var(--c) 35%, #ffffff); background: color-mix(in srgb, var(--c) 30%, rgba(8,18,38,.55)); }' +
  '.bst .dot { flex: none; width: 7px; height: 7px; border-radius: 50%; background: var(--c); }' +
  '.bst .tx { min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
  '.titles.pill-dot .bst { padding: 0; width: 16px; height: 16px; justify-content: center; } .titles.pill-dot .bst .tx { display: none; }' +
  '@container printer-card (max-width: 200px) { .bst { padding: 0; width: 16px; height: 16px; justify-content: center; } .bst .tx { display: none; } }' +
  // Detail button (mini card): a small frosted round button in the banner's top right corner.
  '.banner > .zoom { position: absolute; z-index: 2; top: 5px; right: 5px; width: 24px; height: 24px; margin: 0; color: #33506b;' +
    ' background: rgba(255,255,255,.55); box-shadow: inset 0 0 0 1px rgba(255,255,255,.7); backdrop-filter: blur(4px); }' +
  '.banner > .zoom:hover { background: rgba(255,255,255,.75); color: #33506b; }' +
  '.banner.night > .zoom { color: #fff; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }' +
  '.banner.night > .zoom:hover { background: rgba(255,255,255,.22); color: #fff; }' +
  // Too narrow for the printer beside the title: the wall alone stays.
  '@container printer-card (max-width: 230px) { .banner .scene, .banner .pic { display: none; } .banner .header { right: 30px; } }' +
  '.below { display: flex; flex-direction: column; gap: 4px; }';

// A click inside a dialog (more-info opened from the card, say) is not a click outside the card.
export function hpInDialog(ev) {
  return ev.composedPath().some((n) => ['ha-more-info-dialog', 'ha-dialog', 'dialog'].indexOf(n.localName) >= 0);
}
