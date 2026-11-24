// ── printer-mini-card ────────────────────────────────────────────────────────
// Laid out like the Home Connect mini cards: logo, name and status, then the picture with one chip per cartridge and per alert.
// Its detail button (top right, `zoom: false` removes it) switches it to the full card and back;
// a click anywhere else brings it back too.
import { hpCap, hpEsc } from "./i18n-helpers.js";
import { HP_INK_COLORS } from "./inks.js";
import { hpInDialog } from "./illustrated-header.js";
import { HP_DEFAULTS } from "./card.js";
import { PrinterCard } from "./shadow-dom-patching.js";

export var HP_MINI_STYLES =
  '.zoom { all: unset; flex: none; cursor: pointer; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; color: var(--secondary-text-color); }' +
  '.zoom ha-icon { --mdc-icon-size: 16px; }' +
  '.zoom:hover { background: color-mix(in srgb, var(--secondary-text-color) 16%, transparent); color: var(--primary-text-color); }' +
  '.zoom:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
  '.header > .zoom { margin: -4px -4px -4px 0; }' +
  // Classic header: the detail button in the card's top right corner, out of the title row.
  '.hd:not(.banner) { position: relative; }' +
  '.hd:not(.banner) .header:has(> .zoom) { padding-right: 32px; }' +
  '.hd:not(.banner) .header > .zoom { position: absolute; top: 0; right: 0; margin: 0; box-shadow: inset 0 0 0 1px var(--divider-color, rgba(127,127,127,.3)); }' +
  // Compact view, like the Home Connect mini cards: header (logo, name, status, detail button), then picture and details.
  'ha-card.mini { gap: 10px; }' +
  '.st { display: inline-flex; align-items: center; gap: 4px; flex: 0 1 auto; min-width: 0; max-width: 50%; box-sizing: border-box; overflow: hidden;' +
    ' padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;' +
    ' white-space: nowrap; background: color-mix(in srgb, var(--hp-color) 15%, transparent); color: var(--hp-color); }' +
  '.st .dot { flex: none; width: 6px; height: 6px; border-radius: 50%; background: var(--hp-color); }' +
  '.st .tx { min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
  // Too narrow for a readable status: the dot only (the text stays in the pill's title and label).
  '@container printer-card (max-width: 200px) { .st { min-width: 14px; padding: 4px; } .st .tx { display: none; } }' +
  '.mini .content { display: flex; align-items: center; gap: 12px; }' +
  '.mini .pic { width: 56px; max-width: none; }' +
  '.mini .info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }' +
  // contain: inline-size: the line's text ("Last seen 3 days ago") never sets the card's min-content width, so the
  // offline mini card still shrinks in a `1fr 1fr` grid (layout-card) instead of overflowing it; the text ends with an ellipsis.
  '.line { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--secondary-text-color); min-width: 0; contain: inline-size; }' +
  '.line ha-icon { --mdc-icon-size: 14px; flex-shrink: 0; width: 14px; height: 14px; }' +
  '.line span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }' +
  '.rs { display: flex; flex-wrap: wrap; gap: 6px; }' +
  '.rs:empty { display: none; }' +
  '.r { --t: var(--secondary-text-color); display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px 1px 5px; border-radius: 12px;' +
    ' font-size: 11px; font-weight: 500; white-space: nowrap; color: var(--secondary-text-color); max-width: 100%; min-width: 0; box-sizing: border-box;' +
    ' background: var(--secondary-background-color, rgba(128,128,128,0.12)); }' +
  '.r ha-icon { --mdc-icon-size: 13px; flex: none; color: var(--t); width: 13px; height: 13px; }' +
  // A label wider than the card ends with an ellipsis instead of running out of it (the full text is in the title).
  '.r .tx { min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
  // A small tank, like the full card's ink levels: filled to the level, outlined when low or nearly empty.
  '.r .mt { position: relative; width: 10px; height: 14px; flex: none; border-radius: 3px; overflow: hidden;' +
    ' background: var(--secondary-background-color, rgba(128,128,128,0.12)); box-shadow: inset 0 0 0 1px var(--divider-color, rgba(128,128,128,0.25)); }' +
  '.r .mt > span { position: absolute; left: 0; right: 0; bottom: 0; }' +
  '.r.warn .mt, .r.error .mt { outline: 1.5px solid var(--t); outline-offset: 0.5px; }' +
  '.r.warn { --t: var(--warning-color, #ffa600); }' +
  '.r.error { --t: var(--error-color, #db4437); }' +
  '.r.warn, .r.error { color: var(--t); background: color-mix(in srgb, var(--t) 15%, transparent); }';

export class PrinterMiniCard extends PrinterCard {
  static defaults = Object.assign({}, HP_DEFAULTS, { zoom: true });

  static getConfigElement() {
    return document.createElement('printer-mini-card-editor');
  }

  constructor() {
    super();
    // A click outside the card (and outside a dialog opened from it) brings back the compact view.
    const outside = (ev) => !ev.composedPath().includes(this) && !hpInDialog(ev);
    this._onOutside = (ev) => {
      if (!this._zoomed || !outside(ev)) return;
      this._zoomed = false;
      this._sig = null;
      this._update();
    };
    // On iOS (Safari and the companion app) a tap on something that is not clickable sends no click to the page: a
    // press and a release both outside the card count too (a scroll cancels the pointer, so it does not).
    this._onOutsideDown = (ev) => {
      this._downOutside = outside(ev);
    };
    this._onOutsideUp = (ev) => {
      if (this._downOutside) this._onOutside(ev);
      this._downOutside = false;
    };
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._onOutside, true);
    document.addEventListener('pointerdown', this._onOutsideDown, true);
    document.addEventListener('pointerup', this._onOutsideUp, true);
    // Back on the page: drawn again, in the compact view.
    if (this._hass && this._config) this._update();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._onOutside, true);
    document.removeEventListener('pointerdown', this._onOutsideDown, true);
    document.removeEventListener('pointerup', this._onOutsideUp, true);
    // Left (another dashboard view, a conditional card hidden): back to the compact view.
    if (this._zoomed) {
      this._zoomed = false;
      this._sig = null;
    }
  }

  getCardSize() { return this._zoomed ? super.getCardSize() : 2; }

  // Home Assistant reads the grid options when it lays out the Sections view, not when the card is
  // zoomed: the mini card always asks for the compact grid, and rows: 'auto' lets the full view grow.
  // At 4 columns (~100-160px) the header cannot hold the logo, a readable name and the detail button.
  getGridOptions() { return { columns: 6, min_columns: 6, rows: 'auto' }; }

  _styles(color, icon) {
    return super._styles(color, icon).replace('</style>', `${HP_MINI_STYLES}</style>`);
  }

  _corner() {
    if (this._config.zoom === false) return '';
    return `<button class="zoom" title="${hpEsc(this._t(this._zoomed ? 'zoom_out' : 'zoom_in'))}"><ha-icon icon="${
      this._zoomed ? 'mdi:arrow-collapse' : 'mdi:arrow-expand'}"></ha-icon></button>`;
  }

  _render(r) {
    if (this._zoomed || !r.deviceId || !r.status) super._render(r);
    else {
      var v = this._view(r);
      var seen = v.offline ? this._lastSeen(r) : '';
      var label = hpEsc(this._t(`st_${v.state}`));
      var rs = this._chips(r, v);
      if (this._config.illustration !== false) {
        this._paint(v, this._banner(r, v) + (seen || rs ? '<div class="info">' +
          (seen ? `<div class="line"><ha-icon icon="mdi:clock-outline"></ha-icon><span>${seen}</span></div>` : '') +
          (rs ? `<div class="rs">${rs}</div>` : '') + '</div>' : ''), 'mini');
      } else this._paint(v, '<div class="hd"><div class="header">' + v.logoHtml +
          '<div class="titles"><div class="trow"><div class="name">' + hpEsc(v.name) + '</div>' +
          `<span class="st" role="img" title="${label}" aria-label="${label}"><span class="dot"></span><span class="tx">${label}</span></span></div></div>` + this._corner() +
        '</div></div>' +
        '<div class="content">' + v.imageHtml + '<div class="info">' +
          (seen ? `<div class="line"><ha-icon icon="mdi:clock-outline"></ha-icon><span>${seen}</span></div>` : '') +
          '<div class="rs">' + rs + '</div>' +
        '</div></div>', 'mini');
    }
    this.shadowRoot.querySelector('.zoom')?.addEventListener('click', (ev) => this._toggleZoom(ev));
  }

  // The detail button: full card, or back to the compact view.
  _toggleZoom(ev) {
    ev.stopPropagation(); // a click on the button is never a click on the header
    this._zoomed = !this._zoomed;
    this._sig = null;
    this._update();
    // Keyboard use (Enter / Space: no click count) keeps the focus on the button that replaced this one.
    if (ev.detail === 0) this.shadowRoot.querySelector('.zoom')?.focus({ preventScroll: true });
  }

  // One chip per cartridge (dot in its color and level), then one per alert the cartridges do not already show.
  _chips(r, v) {
    var c = this._config;
    var out = [];
    if (c.show_inks) {
      this._shownLevels(r.inks.filter((i) => !i.printhead && i.level), v.offline).forEach((ink) => {
        var k = this._inkInfo(ink);
        out.push('<span class="r' + (k.crit || k.bad ? ' error' : (k.low ? ' warn' : '')) + '" title="' + hpEsc(k.title) + '"' + this._ent(ink.level) + '>' +
          '<span class="mt"><span style="height:' + k.pct + '%;' + (k.pct > 0 ? 'min-height:2px;' : '') + 'background:' + HP_INK_COLORS[ink.color] + '"></span></span>' + (Number.isNaN(k.p) ? '—' : `${Math.round(k.p)} %`) + '</span>');
      });
    }
    if (c.show_alerts) {
      // Informational IPP reports stay off the mini card: its chips are for things to act on.
      v.alerts.filter((a) => !a.ink && !a.report).forEach((a) => {
        var txt = hpEsc(hpCap(a.text));
        out.push(`<span class="r ${a.level}" title="${txt}"${this._ent(a.entity)}><ha-icon icon="${a.icon}"></ha-icon><span class="tx">${txt}</span></span>`);
      });
    }
    return out.join('');
  }
}
