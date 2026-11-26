// ── Shadow DOM patching ───────────────────────────────────────────────────────
// A render is applied to the nodes already there (text, attributes and classes updated in place) instead of
// replacing the whole shadow root: replaced nodes made the card lose about 12 px for a frame on every state update
// (icons empty until loaded, illustration rebuilt, animations restarted), and the dashboard's scroll anchoring then
// moved the page.
// A custom element (ha-icon, ha-card…) may set attributes on itself (a style, a state): it only loses those the
// previous render gave it (hpTplAttrs) and are no longer in this one.
import { hpCap, hpEsc, hpFill, hpLang, hpLocale, hpT } from "./i18n-helpers.js";
import { HP_ART, HP_ART_DEFS, HP_PICTURES, hpIsHpDevice, hpPictureFor } from "./illustrations.js";
import { HP_BUSY, HP_IPP_STATES, HP_LOCAL_STATES, HP_STATE_COLORS, HP_STATE_ICONS, hpBrotherInks, hpBrotherParts, hpBrotherState, hpBrotherText, hpIsBrotherStatus, hpIsLocalStatus, hpLocalCartridgeProblem, hpLocalInks } from "./status.js";
import { HP_INK_COLORS, hpCartridgeOk, hpCartridgeProblem } from "./inks.js";
import { HP_ACCENT, hpAdminUrl, hpBrandBadge, hpBrandOf, hpDeviceName, hpEntitiesOf, hpFindIppSensor, hpFindPrinters, hpHpInks, hpIppInks, hpIsHpStatus, hpIsIppStatus, hpPick, hpSubDevices, hpUnit } from "./discovery.js";
import { HP_BANNER_STYLES, hpIconColor, hpIsNight, hpOfficeScene } from "./illustrated-header.js";
import { HP_DEFAULTS, HP_FORECAST_DAYS, hpDaysToEmpty, hpFocusKey, hpIgnoredReasons, hpShortDuration } from "./card.js";
import { HpI18n } from "./i18n/hpi18n.js";

export var hpUid = 0;

export function hpIsCustom(el) { return el.localName.includes('-'); }
export const hpTplAttrs = new WeakMap();
export function hpMarkTemplate(n) {
  if (n.nodeType !== 1) return;
  for (const el of [n, ...n.querySelectorAll('*')]) if (hpIsCustom(el)) hpTplAttrs.set(el, new Set(el.getAttributeNames()));
}
export function hpPatchAttrs(cur, next) {
  const custom = hpIsCustom(cur);
  const owned = custom ? hpTplAttrs.get(cur) || new Set() : null;
  for (const name of cur.getAttributeNames()) if (!next.hasAttribute(name) && (!custom || owned.has(name))) cur.removeAttribute(name);
  for (const { name, value } of next.attributes) if (cur.getAttribute(name) !== value) cur.setAttribute(name, value);
  if (custom) hpTplAttrs.set(cur, new Set(next.getAttributeNames()));
  if (cur.localName === 'option' && cur.selected !== next.hasAttribute('selected')) cur.selected = next.hasAttribute('selected');
}
export function hpKeyOf(n) { return n.nodeType === 1 ? n.getAttribute('data-key') : null; }
export function hpSameNode(a, b) {
  // A picture is only reused for the same picture.
  return !!a && a.nodeType === b.nodeType && a.nodeName === b.nodeName && (a.localName !== 'img' || a.getAttribute('src') === b.getAttribute('src'));
}
export function hpPatchChildren(cur, next) {
  const old = [...cur.childNodes];
  const fresh = [...next.childNodes];
  const byKey = new Map();
  for (const o of old) {
    const k = hpKeyOf(o);
    if (k !== null && !byKey.has(k)) byKey.set(k, o);
  }
  const used = new Set();
  fresh.forEach((n, i) => {
    const k = hpKeyOf(n);
    let o = k !== null ? byKey.get(k) : old[i];
    if (!hpSameNode(o, n) || used.has(o) || (k === null && hpKeyOf(o) !== null)) o = null;
    const ref = cur.childNodes[i] ?? null;
    if (!o) {
      hpMarkTemplate(n);
      cur.insertBefore(n, ref);
      return;
    }
    used.add(o);
    if (o !== ref) cur.insertBefore(o, ref);
    if (n.nodeType === 1) {
      hpPatchAttrs(o, n);
      // A custom element the template leaves empty (ha-icon) draws its own children: they are kept.
      if (n.childNodes.length || !hpIsCustom(o)) hpPatchChildren(o, n);
    } else if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue;
  });
  while (cur.childNodes.length > fresh.length) cur.removeChild(cur.lastChild);
}
// Without a DOM (the unit tests' stand-in shadow root), the HTML is only written.
export function hpMorph(root, html) {
  if (!root.childNodes) {
    root.innerHTML = html;
    return;
  }
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  hpPatchChildren(root, tpl.content);
}

export class PrinterCard extends HTMLElement {
  static defaults = HP_DEFAULTS;

  constructor() {
    super();
    // Keeps the drawing's gradient ids of each card apart.
    this._uid = ++hpUid;
  }

  static getConfigElement() {
    return document.createElement('printer-card-editor');
  }

  static getStubConfig(hass) {
    var p = hpFindPrinters(hass)[0];
    return p ? { device_id: p.id } : {};
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');
    this._config = Object.assign({}, this.constructor.defaults, config);
    // show_title: the header's title, hidden by the stylesheet
    this.toggleAttribute?.("hide-title", config.show_title === false);
    // Not set, show_parts follows show_inks (so `show_inks: false` still hides the parts, as before 2.8.0).
    if (this._config.show_parts === undefined) this._config.show_parts = this._config.show_inks;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      // A chip opens the more-info dialog of its entity (`data-entity`), like a tile.
      this.shadowRoot.addEventListener('click', (ev) => this._chipClick(ev));
      // ...and from the keyboard: a chip is a button (Enter or Space).
      this.shadowRoot.addEventListener('keydown', (ev) => {
        if ((ev.key === 'Enter' || ev.key === ' ') && ev.target?.dataset?.entity) {
          ev.preventDefault();
          this._chipClick(ev);
        }
      });
    }
    this._sig = null;
    this._update();
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  connectedCallback() {
    Promise.resolve().then(() => this._fitAfterCard());
    // Keeps the time-dependent parts ("Last seen 5 minutes ago", expired cartridges) current:
    // _update() only re-renders when they actually change.
    clearInterval(this._timer);
    this._timer = setInterval(() => this._update(), 60000);
    // A new width (or the web font loaded): the status pill is fitted again, in the next frame.
    if (!this._ro && typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(() => {
        cancelAnimationFrame(this._fitFrame);
        this._fitFrame = requestAnimationFrame(() => this._fitPill());
      });
    }
    this._ro?.observe(this);
    document.fonts?.ready?.then(() => this._fitPill());
  }

  disconnectedCallback() {
    clearInterval(this._timer);
    this._ro?.disconnect();
    // Left (another view, a conditional card hidden): the popup closes without acting.
    if (this._confirm) {
      this._confirm = null;
      window.removeEventListener?.('keydown', this._onConfirmKey);
      this._sig = null;
    }
  }

  // The status pill goes right after the title only when the whole title and the whole label fit there; otherwise it
  // takes a line of its own under the subtitle (.pill-below, the subtitle kept to one line, its whole text in its tooltip).
  // When the label does not fit that line either, or the banner has no room for the lines above its ground strip, the
  // pill keeps its dot only (.pill-dot, back beside the title when the dot fits there). Measured after render, so that
  // it holds in every language.
  _fitPill() {
    const root = this.shadowRoot;
    if (!root?.querySelectorAll || typeof getComputedStyle !== "function") return;
    for (const t of root.querySelectorAll(".titles")) {
      const chip = t.querySelector(".trow > :not(.name)");
      t.classList.remove("pill-below", "pill-dot");
      if (!chip?.getClientRects().length) continue;
      const row = chip.parentElement;
      const name = row.querySelector(".name");
      const fits = () => {
        let title = 0;
        if (name && getComputedStyle(name).display !== "none") {
          const range = document.createRange();
          range.selectNodeContents(name);
          const cs = getComputedStyle(name);
          title = Math.max(name.scrollWidth, range.getBoundingClientRect().width) + (parseFloat(cs.marginLeft) || 0) + (parseFloat(cs.marginRight) || 0) +
            (parseFloat(getComputedStyle(row).columnGap) || 0);
        }
        return title + chip.getBoundingClientRect().width <= row.getBoundingClientRect().width + 0.5;
      };
      if (fits()) continue;
      t.classList.add("pill-below");
      for (const sub of t.querySelectorAll(".hsub")) sub.title = sub.scrollWidth > sub.clientWidth ? sub.textContent.trim() : "";
      const text = chip.querySelector(".tx, .status > span");
      const banner = t.closest(".banner");
      const tb = t.getBoundingClientRect();
      const bb = banner?.getBoundingClientRect();
      const ground = banner ? parseFloat(getComputedStyle(banner).getPropertyValue("--g")) || 0 : 0;
      const tall = !!bb && (tb.top < bb.top - 0.5 || tb.bottom > bb.bottom - ground + 0.5);
      if (!tall && !(text && text.scrollWidth > text.clientWidth + 0.5)) continue;
      t.classList.add("pill-dot");
      t.classList.remove("pill-below");
      if (!fits()) t.classList.add("pill-below");
    }
  }

  // Masonry rows of 50 px: the drawn height once the card is on the page (hidden sections, no ink, no
  // alert…), 5 before it is.
  getCardSize() {
    var h = this.shadowRoot?.querySelector('ha-card')?.offsetHeight;
    return h > 0 ? Math.max(2, Math.ceil(h / 50)) : 5;
  }

  _chipClick(ev) {
    if (this._powerClick(ev)) return;
    if (this._scanClick(ev)) return;
    var chip = ev.composedPath().find((n) => n.dataset?.entity);
    if (!chip) return;
    ev.stopPropagation();
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: chip.dataset.entity }, bubbles: true, composed: true }));
  }

  // `data-entity` attribute of a chip that opens the more-info dialog of its entity ('' without one), focusable as a button.
  _ent(id) { return id ? ` data-entity="${hpEsc(id)}" role="button" tabindex="0"` : ''; }

  getGridOptions() { return { columns: 12, min_columns: 6 }; }

  _lang() {
    return hpLang((this._config?.language) || (this._hass?.language) || document.documentElement.lang);
  }

  _t(k, vars) { var s = hpT(this._lang(), k); return vars ? hpFill(s, vars) : s; }

  // Discovery is reused until the registry, the config or the availability of the printer's
  // entities changes (an entity coming back online brings the attributes discovery relies on).
  // An incomplete result (states not loaded yet) is searched again on the next update, and so is a
  // missing IPP sensor (the IPP integration may load after HP Printer): its lookup reads the states.
  _resolve() {
    var hass = this._hass, m = this._memo;
    if (m && m.entities === hass.entities && m.devices === hass.devices && m.config === this._config &&
      m.avail === this._availSig(m.devs)) {
      if ((m.r.kind === 'hp' || m.r.kind === 'hp_local' || m.r.kind === 'brother') && !m.r.ipp) {
        var ipp = hpFindIppSensor(hass, m.r.deviceId);
        if (ipp) m.r = Object.assign({}, m.r, { ipp: ipp });
      }
      return m.r;
    }
    var r = this._discover();
    var devs = [r.deviceId].concat(r.kind === 'hp' ? r.subs || [] : []);
    this._memo = r.status && hass.states[r.status]
      ? { entities: hass.entities, devices: hass.devices, config: this._config, devs: devs, avail: this._availSig(devs), r: r }
      : null;
    return r;
  }

  _availSig(devs) {
    var hass = this._hass;
    return hpEntitiesOf(hass, devs).map((e) => (hass.states[e.entity_id].state === 'unavailable' ? 0 : 1)).join('');
  }

  _discover() {
    var hass = this._hass, c = this._config, over = c.entities || {};
    var deviceId = c.device_id;
    if (!deviceId && c.entity && hass.entities?.[c.entity]) deviceId = hass.entities[c.entity].device_id;
    if (!deviceId && over.status && hass.entities?.[over.status]) deviceId = hass.entities[over.status].device_id;
    if (!deviceId) { var p = hpFindPrinters(hass)[0]; deviceId = p?.id; }

    var main = hpEntitiesOf(hass, [deviceId]);
    var status = over.status || hpPick(main, hass, (eid, s) => eid.indexOf('sensor.') === 0 && hpIsHpStatus(s));
    var r = { deviceId: deviceId, kind: 'hp', isHp: true, status: status, inks: [], ipp: over.ipp, total_pages: over.total_pages,
      eprint: over.eprint, eprint_registration: over.eprint_registration };

    var local = main.find(hpIsLocalStatus);
    if (local && (!over.status || over.status === local.entity_id)) {
      // ha-hp: everything on the printer's device, cartridge details as attributes of the level sensors.
      var hp = main.filter((e) => e.platform === 'hp');
      var key = (k) => hp.find((e) => e.translation_key === k)?.entity_id;
      r.kind = 'hp_local';
      r.status = local.entity_id;
      r.inks = hpLocalInks(hp);
      if (!r.eprint) r.eprint = key('cloud_services');
      if (!r.eprint_registration) r.eprint_registration = key('cloud_registered');
      if (!r.total_pages) r.total_pages = key('total_pages');
      if (!r.ipp) r.ipp = hpFindIppSensor(hass, deviceId);
      // Its scanner: the Scan buttons, the settings shared with them, and the last scan with its files.
      if (key('scan')) {
        r.scan = { button: key('scan'), source: key('scan_source'), format: key('scan_format'),
          resolution: key('scan_resolution'), color: key('scan_color_mode'), last: key('last_scan') };
      }
    } else if (status && hpIsHpStatus(hass.states[status])) {
      var subs = hpSubDevices(hass, deviceId);
      r.subs = subs;
      r.inks = hpHpInks(hass, subs);
      // ePrint (HP cloud printing): "ePrint status" (connectivity) and "ePrint registered" binary sensors.
      var ep = main.filter((e) => e.entity_id.indexOf('binary_sensor.') === 0 && /eprint/.test(e.entity_id));
      if (!r.eprint) {
        r.eprint = hpPick(ep, hass, (_eid, s) => s.attributes.device_class === 'connectivity') ||
          hpPick(ep, hass, (eid) => /(statut|status)/.test(eid));
      }
      if (!r.eprint_registration) {
        r.eprint_registration = hpPick(ep, hass, (eid, s) => eid !== r.eprint && (/(registr|enregistr)/.test(eid) || /registered/.test(String(s.attributes.state))));
      }
      if (!r.ipp) r.ipp = hpFindIppSensor(hass, deviceId);
      if (!r.total_pages) {
        var all = hpEntitiesOf(hass, subs);
        r.total_pages = hpPick(all, hass, (eid) => /_printer_total_pages$/.test(eid)) ||
          hpPick(all, hass, (eid, s) => hpUnit(s) === 'pages' && s.attributes.state_class === 'total_increasing' && /total_(pages|impressions)$/.test(eid));
      }
    } else if (!status && main.some(hpIsBrotherStatus)) {
      // Brother integration: its status and ink / toner sensors, plus the IPP sensor of the same model for the
      // paper and cover alerts, when the printer is also set up with IPP.
      r.kind = 'brother';
      r.isHp = false;
      var bro = main.filter((e) => e.platform === 'brother');
      // `raw`: the "Status" text sensor, which tells the errors (jam, no paper…) the printer status does not.
      r.raw = bro.find((e) => e.translation_key === 'status')?.entity_id;
      r.status = (bro.find((e) => e.translation_key === 'printer_status') || bro.find((e) => e.translation_key === 'status')).entity_id;
      r.inks = hpBrotherInks(bro);
      r.parts = hpBrotherParts(bro);
      if (!r.ipp) r.ipp = hpFindIppSensor(hass, deviceId);
      if (!r.total_pages) r.total_pages = bro.find((e) => e.translation_key === 'page_counter')?.entity_id;
    } else {
      // IPP-only printer (or status forced to an IPP sensor).
      r.kind = 'ipp';
      r.isHp = hpIsHpDevice(hass.devices?.[deviceId]);
      r.status = status || hpPick(main, hass, (eid, s) => eid.indexOf('sensor.') === 0 && hpIsIppStatus(s));
      r.ipp = r.ipp || r.status;
      r.inks = hpIppInks(hass, main);
    }
    return r;
  }

  _ids(r) {
    var ids = [r.status, r.raw, r.ipp, r.total_pages, r.eprint, r.eprint_registration, this._powerId()];
    if (r.scan) ids.push(r.scan.source, r.scan.format, r.scan.resolution, r.scan.color, r.scan.last);
    r.inks.forEach((i) => { ids.push(i.level, i.status, i.expiry, i.pages_left); });
    (r.parts || []).forEach((p) => { ids.push(p.level); });
    return ids.filter(Boolean);
  }

  // What the card shows that changes with time alone: the "last seen" text and the expired cartridges.
  _timeSig(r) {
    var st = this._hass.states[r.status];
    var out = [];
    if (this._state(r) === 'offline' && st?.last_changed) {
      var since = new Date(st.last_changed);
      if (!Number.isNaN(since.getTime())) out.push(st.last_changed, this._relative(since));
    }
    if (this._config.show_expired) {
      r.inks.forEach((ink) => {
        var d = ink.expiry && this._avail(ink.expiry) ? new Date(this._val(ink.expiry)).getTime() : NaN;
        out.push(!Number.isNaN(d) && d < Date.now());
      });
    }
    return out;
  }

  _update() {
    if (!this._config || !this._hass || !this.shadowRoot) return;
    var r = this._resolve();
    var hass = this._hass;
    var sig = JSON.stringify([this._lang(), this._config, r.deviceId, this._config.illustration !== false && hpIsNight(hass, this._config), this._timeSig(r), this._scanState || null, this._confirm || null, this._ids(r).map((id) => {
      var s = hass.states[id];
      return s ? [id, s.state, s.attributes.state, s.attributes.state_reason, s.attributes.state_message, s.attributes.message, s.attributes.installed] : null;
    })]);
    if (sig === this._sig) return;
    this._sig = sig;
    this._render(r);
  }

  _val(id) { var s = id && this._hass.states[id]; return s ? s.state : undefined; }

  _avail(id) { var v = this._val(id); return v !== undefined && v !== 'unavailable' && v !== 'unknown'; }

  _num(id) { return this._avail(id) ? Number(this._val(id)) : NaN; }

  _state(r) {
    var v = this._val(r.status);
    if (v === undefined || v === 'unavailable' || v === 'off') return 'offline';
    if (r.kind === 'ipp') return HP_IPP_STATES[v] || 'unknown';
    if (r.kind === 'hp_local') return HP_LOCAL_STATES[v] || 'unknown';
    if (r.kind === 'brother') return hpBrotherState(r.raw === r.status ? undefined : v, this._val(r.raw));
    return HP_STATE_COLORS[v] ? v : 'unknown';
  }

  // Color name of a cartridge, with its code when another cartridge has the same color ("Black PGBK").
  _inkLabel(ink) {
    return this._t(`c_${ink.color}`) + (ink.tag ? ` ${ink.tag}` : '');
  }

  // Name of a wearing part: "Drum (Cyan)", "Belt unit", "Paper feed kit MP"; `short` leaves out the color.
  _partLabel(part, short) {
    var l = this._t(`pt_${part.kind}`);
    if (part.suffix) return `${l} ${part.suffix}`;
    return part.color && !short ? `${l} (${this._inkLabel(part)})` : l;
  }

  // Label used inside a sentence: lower case in every language but English and German, whose colors keep their
  // capital as nouns ("encre jaune", "cartucho negro", "црна", "zwart", "чёрный", "μαύρη").
  // A cartridge's code stays as written ("noir PGBK").
  _inkWord(ink) {
    var l = ink.printhead ? this._t('printhead') : this._t(`c_${ink.color}`);
    var tag = !ink.printhead && ink.tag ? ` ${ink.tag}` : '';
    if (['es', 'sr', 'sr-Latn', 'it', 'nl', 'pt', 'pl', 'ro', 'da', 'sv', 'bg', 'ru', 'uk', 'hu', 'sk', 'cs', 'sl', 'lv', 'el'].indexOf(this._lang()) >= 0) return l.toLowerCase() + tag;
    if (this._lang() !== 'fr') return l + tag;
    // "encre noire", "cartouche noire": the adjective agrees with the feminine noun.
    var w = hpT('fr', `cw_${ink.color}`);
    return (w === `cw_${ink.color}` || ink.printhead ? l.toLowerCase() : w) + tag;
  }

  _alerts(r, state) {
    var c = this._config, out = [];
    var low = Number(c.low_threshold);
    if (Number.isNaN(low)) low = 15;
    var critical = Math.min(low, 5);
    r.inks.forEach((ink) => {
      var label = this._inkWord(ink);
      if (!ink.printhead) {
        var p = this._num(ink.level);
        if (!Number.isNaN(p) && p <= low) {
          // `ink`: shown by the cartridge itself (tank or chip), not repeated as a chip in the mini card.
          out.push({ level: p <= critical ? 'error' : 'warn', icon: 'mdi:water-alert', ink: true, entity: ink.level,
            // An optimizer is no ink: "Optimizer low", not "Optimizer ink low".
            text: this._t(`al_${ink.color === 'optimizer' ? 'opt_' : ''}${p <= critical ? 'empty' : 'low'}`, { c: label, p: Math.round(p) }) });
        }
      }
      var st = ink.status && this._hass.states[ink.status];
      if (st && st.state === 'off' && !hpCartridgeOk(st.attributes.state)) {
        var key = hpCartridgeProblem(st.attributes.state);
        // A printhead uses its own ph_* form when its language has one (printhead and cartridge of another gender).
        var problem = (ink.printhead && (HpI18n[this._lang()] || {})[key.replace('cs_', 'ph_')]) || this._t(key);
        out.push({ level: 'error', icon: ink.printhead ? 'mdi:printer-alert' : 'mdi:alert-circle', entity: ink.status,
          text: ink.printhead ? this._t('al_printhead', { s: problem }) : this._t('al_cartridge', { c: label, s: problem }) });
      }
      var localProblem = ink.local && this._avail(ink.level) && hpLocalCartridgeProblem(this._hass.states[ink.level]?.attributes);
      if (localProblem) {
        out.push({ level: 'error', icon: 'mdi:alert-circle', entity: ink.level, text: this._t('al_cartridge', { c: label, s: this._t(localProblem) }) });
      }
      if (c.show_expired && ink.expiry && this._avail(ink.expiry)) {
        var d = new Date(this._val(ink.expiry));
        if (!Number.isNaN(d.getTime()) && d.getTime() < Date.now()) {
          out.push({ level: 'info', icon: 'mdi:calendar-alert', entity: ink.expiry, text: this._t('al_expired', { c: label }) });
        }
      }
    });
    (r.parts || []).forEach((part) => {
      var p = this._num(part.level);
      if (!Number.isNaN(p) && p <= low) {
        out.push({ level: p <= critical ? 'error' : 'warn', icon: 'mdi:wrench-clock', entity: part.level,
          text: this._t(p <= critical ? 'al_part_end' : 'al_part_low', { c: this._partLabel(part), p: Math.round(p) }) });
      }
    });
    if (state === 'stopped') {
      // Brother: the printer's own words ("paper jam", "cover is open"…) rather than a bare "stopped".
      var raw = r.kind === 'brother' && hpBrotherText(this._val(r.raw)) === 'stopped' ? this._val(r.raw) : '';
      // ha-hp: the message the printer shows ("Out of paper"…), else the generic text.
      if (r.kind === 'hp_local') raw = String(this._hass.states[r.status]?.attributes.message || '');
      out.push({ level: 'error', icon: 'mdi:printer-alert', entity: raw && r.kind === 'brother' ? r.raw : r.status, text: raw || this._t('al_stopped') });
    }
    out = out.concat(this._ippAlerts(r));
    var rank = { error: 0, warn: 1, info: 2 };
    return out.sort((a, b) => rank[a.level] - rank[b.level]);
  }

  // IPP "printer-state-reasons": media-empty-error, media-jam-warning, door-open…
  _ippAlerts(r) {
    var s = r.ipp && this._hass.states[r.ipp];
    if (!s || s.state === 'unavailable') return [];
    var raw = s.attributes.state_reason;
    var reasons = Array.isArray(raw) ? raw : String(raw || '').split(',');
    var seen = {};
    var out = [];
    var ignored = hpIgnoredReasons(this._config.ignore_reasons);
    reasons.map((x) => String(x).trim()).forEach((reason) => {
      if (!reason || reason === 'none' || reason === 'None') return;
      var level = /-error$/.test(reason) ? 'error' : (/-report$/.test(reason) ? 'info' : 'warn');
      var base = reason.replace(/-(error|warning|report)$/, '');
      // Reasons expected on this printer (`ignore_reasons`), and the informational `-report` ones (RFC 8011: the
      // least severe level, nothing to act on) unless `show_reports` asks for them.
      if (ignored[base.toLowerCase()]) return;
      if (level === 'info' && !this._config.show_reports) return;
      // Ink levels are already covered by the cartridges.
      if (/^(marker-supply-low|marker-supply-empty|toner-low|toner-empty|marker-waste)/.test(base) && r.inks.length) return;
      var key = `ipp_${base.replace(/-/g, '_')}`;
      var text = this._t(key);
      if (text === key) text = base.replace(/-/g, ' ').replace(/^./, (ch) => ch.toUpperCase());
      if (seen[text]) return;
      seen[text] = true;
      out.push({ level: level, report: level === 'info', icon: level === 'info' ? 'mdi:information-outline' : (/media|paper|tray/.test(base) ? 'mdi:paper-roll-outline' : 'mdi:alert'), entity: r.ipp, text: text });
    });
    return out;
  }

  _relative(date) {
    var secs = Math.round((date.getTime() - Date.now()) / 1000);
    var units = [['day', 86400], ['hour', 3600], ['minute', 60]];
    try {
      var rtf = new Intl.RelativeTimeFormat(hpLocale(this._lang(), this._hass), { numeric: 'auto' });
      for (var i = 0; i < units.length; i++) {
        if (Math.abs(secs) >= units[i][1]) return rtf.format(Math.round(secs / units[i][1]), units[i][0]);
      }
      return rtf.format(0, 'minute');
    } catch (_e) {
      return date.toLocaleString(hpLocale(this._lang(), this._hass));
    }
  }

  // Drawing set by the `picture` option, else detected from the device.
  _pictureKey(r) {
    var pic = this._config.picture;
    return HP_PICTURES.indexOf(pic) < 1 ? hpPictureFor(this._hass.devices?.[r.deviceId], r.kind) : pic;
  }

  // Custom image, else the configured or detected drawing.
  _picture(r, custom) {
    if (custom) return `<img src="${hpEsc(custom)}" alt="">`;
    var pic = this._pictureKey(r);
    var uid = (s) => s.replace(/(id="|url\(#)pc-(body|dark|paper)/g, `$1pc-$2-${this._uid}`);
    return `<svg class="art art-${pic}" viewBox="0 0 160 120" aria-hidden="true">${uid(HP_ART_DEFS)}${uid(HP_ART[pic])}</svg>`;
  }

  // What both cards show: name, state and its color, alerts, picture and header icon.
  _view(r) {
    var c = this._config, hass = this._hass;
    var deviceName = hpDeviceName(hass, r.deviceId);
    var state = this._state(r);
    var offline = state === 'offline';
    var v = {
      name: c.name || deviceName.replace(/\s*\([\d.]+\)\s*$/, '') || this._t('printer'),
      state: state,
      offline: offline,
      color: offline ? 'var(--disabled-text-color, #9e9e9e)' : (HP_STATE_COLORS[state] || 'var(--secondary-text-color)'),
      alerts: offline ? [] : this._alerts(r, state),
      imageHtml: '',
      logoHtml: `<span class="logo mark" aria-hidden="true"><ha-icon icon="mdi:printer"></ha-icon>${hpBrandBadge(hpBrandOf(this._hass.devices?.[r.deviceId]))}</span>`,
    };

    // Picture, with the control panel lit in the status color.
    // Clicking it opens the printer's web admin page, when its address is known.
    v.icon = hpIconColor(state, v.alerts, v.color);
    if (c.show_image) {
      var custom = c.image && String(c.image).trim();
      // Only http(s) addresses become a link, like the detected configuration URL.
      var custAdmin = c.admin_url && String(c.admin_url).trim();
      var admin = (custAdmin && /^https?:\/\//i.test(custAdmin) ? custAdmin : '') || hpAdminUrl(hass, r);
      var picTag = admin ? 'a' : 'div';
      v.imageHtml = '<' + picTag + ' class="pic' + (offline ? ' off' : '') + (HP_BUSY.indexOf(state) >= 0 ? ' busy' : '') + '"' +
        (admin ? ` href="${hpEsc(admin)}" target="_blank" rel="noopener noreferrer" title="${hpEsc(this._t('open_admin'))}"` : '') + '>' +
        this._picture(r, custom) +
      '</' + picTag + '>';
    }
    return v;
  }

  _statusPill(v) {
    var label = hpEsc(this._t(`st_${v.state}`));
    return `<div class="status" role="img" title="${label}" aria-label="${label}"><ha-icon icon="${HP_STATE_ICONS[v.state] || 'mdi:printer'}"></ha-icon><span>${
      label}</span></div>`;
  }

  // "Last seen 5 minutes ago" while the printer is offline, '' when unknown.
  _lastSeen(r) {
    var st = this._hass.states[r.status];
    var since = st?.last_changed ? new Date(st.last_changed) : null;
    return since && !Number.isNaN(since.getTime()) ? hpEsc(this._t('last_seen', { t: this._relative(since) })) : '';
  }

  // Level of a cartridge and how it is flagged: low (at or below the threshold), nearly empty, faulty.
  // Daily mean levels of the cartridges and parts over HP_FORECAST_DAYS, from the recorder's long-term statistics:
  // fetched again every 6 hours, rendered again when they arrive.
  _fetchLevels(ids) {
    var hass = this._hass;
    var key = ids.join(',');
    if (!key || !hass.callWS || this._config.show_forecast === false || this._levelsBusy) return;
    if (this._levelsKey === key && Date.now() - (this._levelsAt || 0) < 6 * 3600000) return;
    this._levelsBusy = true;
    this._levelsKey = key;
    this._levelsAt = Date.now();
    hass.callWS({ type: 'recorder/statistics_during_period', statistic_ids: ids, period: 'day', types: ['mean'],
      start_time: new Date(Date.now() - HP_FORECAST_DAYS * 86400000).toISOString() })
      .then((x) => {
        var out = {};
        ids.forEach((id) => {
          out[id] = (x?.[id] || []).map((p) => ({ t: typeof p.start === 'number' ? p.start : Date.parse(p.start), v: Number(p.mean) }))
            .filter((p) => Number.isFinite(p.t) && Number.isFinite(p.v));
        });
        this._levels = out;
      })
      .catch(() => { this._levels = this._levels || {}; })
      .finally(() => {
        this._levelsBusy = false;
        this._sig = null;
        this._update();
      });
  }

  // Days before `ink` (a cartridge or a part) is empty, or null (see hpDaysToEmpty).
  _daysToEmpty(ink) {
    if (this._config.show_forecast === false || !ink.level) return null;
    return hpDaysToEmpty(this._levels?.[ink.level], this._num(ink.level));
  }

  _inkInfo(ink, label) {
    var low = Number(this._config.low_threshold);
    if (Number.isNaN(low)) low = 15;
    var p = this._num(ink.level);
    var known = !Number.isNaN(p);
    var left = Number(this._val(ink.pages_left));
    var empty = this._daysToEmpty(ink);
    var locale = hpLocale(this._lang(), this._hass);
    var when = '';
    if (empty !== null) {
      var unit = empty < 14 ? 'day' : empty < 63 ? 'week' : 'month';
      var n = Math.max(1, Math.round(empty / (unit === 'day' ? 1 : unit === 'week' ? 7 : 30.44)));
      when = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(n, unit);
      // The date it should run out, in the tooltip: "in 4 months (12 Mar)".
      var on = new Date(Date.now() + empty * 86400000);
      when += ' (' + new Intl.DateTimeFormat(locale, empty > 300 ? { day: 'numeric', month: 'short', year: 'numeric' } : { day: 'numeric', month: 'short' }).format(on) + ')';
    }
    return {
      p: p,
      eta: empty === null ? '' : hpShortDuration(locale, empty),
      pct: known ? Math.max(0, Math.min(100, p)) : 0,
      low: known && p <= low,
      crit: known && p <= Math.min(low, 5),
      bad: (!!ink.status && this._val(ink.status) === 'off' && !hpCartridgeOk(this._hass.states[ink.status]?.attributes.state)) ||
        (!!ink.local && !!hpLocalCartridgeProblem(this._hass.states[ink.level]?.attributes)),
      title: (label || this._inkLabel(ink)) + (known ? ` · ${Math.round(p)} %` : '') +
        (this._avail(ink.pages_left) && !Number.isNaN(left) ? ` · ${this._t('pages_left', { n: left })}` : '') +
        (when ? ` · ${this._t('empty_in', { when: when })}` : ''),
    };
  }

  // Extra control at the top right of the header: none here, the mini card's zoom button.
  _corner() { return ''; }

  // power_entity: the printer's smart plug (switch, light or input boolean). A round power button in the header, shown
  // even while the printer is off or offline so it can be turned back on: on at once, off only once confirmed (a job
  // under way is lost).
  _powerId() {
    var c = this._config || {};
    return c.power_entity || c.entities?.power || '';
  }

  _powerHtml() {
    var id = this._powerId();
    var s = id && this._hass?.states?.[id];
    if (!s) return '';
    var on = s.state === 'on';
    var label = hpEsc(this._t(on ? 'pw_turn_off' : 'pw_turn_on'));
    var dis = s.state === 'unavailable' ? ' disabled' : '';
    return `<button type="button" class="pw${on ? ' on' : ''}" data-power="${hpEsc(id)}" title="${label}" aria-label="${label}" aria-pressed="${on}"${dis}><ha-icon icon="mdi:power"></ha-icon></button>`;
  }

  _confirmHtml() {
    var c = this._confirm;
    if (!c) return '';
    return `<div class="backdrop" data-confirm="backdrop"><div class="modal" role="dialog" aria-modal="true" aria-label="${hpEsc(c.text)}">` +
      `<div class="msg">${hpEsc(c.text)}</div><div class="modal-actions">` +
      `<button type="button" class="mbtn" data-confirm="cancel">${hpEsc(this._t('pw_cancel'))}</button>` +
      `<button type="button" class="mbtn primary" data-confirm="ok">${hpEsc(this._t('pw_turn_off'))}</button></div></div></div>`;
  }

  _closeConfirm() {
    this._confirm = null;
    window.removeEventListener?.('keydown', this._onConfirmKey);
    this._update();
    // The focus goes back to the power button the popup came from.
    this.shadowRoot.querySelector('button.pw')?.focus?.({ preventScroll: true });
  }

  // A click on the power button, or on the popup (its buttons, its backdrop). True when handled.
  _powerClick(ev) {
    var path = ev.composedPath();
    if (this._confirm) {
      var el = path.find((n) => n?.dataset?.confirm);
      ev.stopPropagation();
      if (!el) return true;
      var what = el.dataset.confirm;
      if (what === 'ok') {
        var id = this._confirm.entity;
        this._closeConfirm();
        this._hass.callService(id.split('.')[0], 'turn_off', { entity_id: id });
      } else if (what === 'cancel' || (what === 'backdrop' && path[0] === el)) this._closeConfirm();
      return true;
    }
    var btn = path.find((n) => n?.dataset?.power);
    if (!btn) return false;
    ev.stopPropagation();
    var entity = btn.dataset.power;
    if (this._hass.states[entity]?.state !== 'on') {
      this._hass.callService(entity.split('.')[0], 'turn_on', { entity_id: entity });
      return true;
    }
    var r = this._resolve();
    var name = this._config.name || this._view(r).name || '';
    var busy = HP_BUSY.indexOf(this._state(r)) >= 0;
    this._confirm = { entity: entity, text: this._t(busy ? 'pw_confirm_job' : 'pw_confirm', { name: name }) };
    this._onConfirmKey ??= (e) => {
      if (e.key === 'Escape' && this._confirm) this._closeConfirm();
    };
    window.addEventListener?.('keydown', this._onConfirmKey);
    this._update();
    this.shadowRoot.querySelector('.modal .primary')?.focus({ preventScroll: true });
    return true;
  }

  // The illustrated header (illustration: false keeps the classic one): the office wall, the printer's drawing on
  // the desk, the status-coloured icon with its brand badge, the name and "Status · ink N %".
  _banner(r, v) {
    var c = this._config;
    var night = hpIsNight(this._hass, c);
    // The status in a pill right after the name, in the header icon's colour; the lowest ink level under it.
    var label = hpEsc(this._t(`st_${v.state}`));
    var pill = `<span class="bst" role="img" title="${label}" aria-label="${label}"><span class="dot"></span><span class="tx">${label}</span></span>`;
    var sub = '';
    var levels = c.show_inks && !v.offline ? r.inks.filter((i) => !i.printhead && i.level) : [];
    var nums = levels.map((i) => this._num(i.level)).filter((p) => !Number.isNaN(p));
    if (nums.length) {
      sub = this._t(levels.every((i) => i.toner) ? 'hd_toner' : 'hd_ink', { p: Math.round(Math.min.apply(null, nums)) });
      sub = sub.charAt(0).toUpperCase() + sub.slice(1);
    }
    return '<div class="hd banner' + (night ? ' night' : '') + '">' + hpOfficeScene(night) + v.imageHtml +
      '<div class="header">' + v.logoHtml +
        '<div class="titles"><div class="trow"><div class="name">' + hpEsc(v.name) + '</div>' + pill + '</div>' +
          (sub ? '<div class="hsub">' + hpEsc(sub) + '</div>' : '') + '</div>' +
      '</div>' + this._powerHtml() + this._corner() + '<div class="ground"></div></div>';
  }

  _render(r) {
    if (!r.deviceId || !r.status) {
      hpMorph(this.shadowRoot, `${this._styles()}<ha-card><div class="empty"><ha-icon icon="mdi:printer-off"></ha-icon>${this._t('no_device')}</div></ha-card>`);
      return;
    }
    var v = this._view(r);
    this._paint(v, this._full(r, v));
  }

  _paint(v, inner, cls) {
    var focused = hpFocusKey(this.shadowRoot.activeElement);
    var classes = [v.offline ? 'offline' : '', cls || '', this._confirm ? 'dialog-open' : ''].filter(Boolean).join(' ');
    hpMorph(this.shadowRoot, `${this._styles(v.color, v.icon)}<ha-card class="${classes}">${inner}${this._confirmHtml()}</ha-card>`);
    this._fitPill();
    this._fitAfterCard();
    // A control the patch could not keep (another layout): its counterpart gets the focus, so keyboard navigation keeps its place.
    if (focused) this.shadowRoot.querySelector(focused)?.focus({ preventScroll: true });
  }

  // <ha-card> (Lit) draws its slot a microtask after it is created: until then the card's content has no size, and the
  // status pill measured then would take the wrong line (the card then changed height once measured again). A new
  // <ha-card> is measured once more as soon as it has rendered, before the frame is painted.
  // Rendered before the card is on the page, <ha-card> is only upgraded once connected: called again then (see
  // connectedCallback).
  _fitAfterCard() {
    const card = this.shadowRoot?.querySelector?.('ha-card');
    if (!card?.updateComplete || card === this._fitCard) return;
    this._fitCard = card;
    card.updateComplete?.then?.(() => this._fitPill());
  }

  // The full card: header (logo, name, status), picture with its chips, ink levels and alerts.
  _full(r, v) {
    var c = this._config;
    var offline = v.offline, alerts = v.alerts;

    var chips = [];
    if (!offline && c.show_alerts) {
      var errors = alerts.filter((a) => a.level === 'error').length;
      var warns = alerts.filter((a) => a.level === 'warn').length;
      // A count opens the entity of its first (most important) alert.
      var first = (lvl) => this._ent(alerts.find((a) => a.level === lvl)?.entity);
      if (errors) chips.push(`<span class="chip error"${first('error')}><ha-icon icon="mdi:alert-circle"></ha-icon>${errors}</span>`);
      if (warns) chips.push(`<span class="chip warn"${first('warn')}><ha-icon icon="mdi:alert"></ha-icon>${warns}</span>`);
    }
    if (!offline && c.show_eprint && this._avail(r.eprint)) {
      var epOn = this._val(r.eprint) === 'on';
      var epReg = !r.eprint_registration || !this._avail(r.eprint_registration) || this._val(r.eprint_registration) === 'on';
      var epKey = !epReg ? 'ep_unregistered' : (epOn ? 'ep_on' : 'ep_off');
      chips.push('<span class="chip ' + (epOn && epReg ? 'on' : 'muted') + '"' + this._ent(epReg ? r.eprint : r.eprint_registration) + '><ha-icon icon="' +
        (epOn && epReg ? 'mdi:cloud-print-outline' : 'mdi:cloud-off-outline') + '"></ha-icon>' + this._t(epKey) + '</span>');
    }

    var sub = '';
    if (offline) {
      var seen = this._lastSeen(r);
      sub = `<div class="sub">${this._t('offline_text')}${seen ? `<br><span class="muted">${seen}</span>` : ''}</div>`;
    } else if (c.show_stats && this._avail(r.total_pages)) {
      var n = Number(this._val(r.total_pages));
      sub = '<div class="sub muted"><ha-icon icon="mdi:file-document-multiple-outline"></ha-icon>' +
        hpEsc(this._t('pages', { n: Number.isNaN(n) ? this._val(r.total_pages) : n.toLocaleString(hpLocale(this._lang(), this._hass)) })) + '</div>';
    }

    // Like the Home Connect cards: logo, name and status pill on top, then the picture with the chips.
    var head = c.illustration !== false
      ? this._banner(r, v) + (chips.length || sub ? '<div class="below">' + (chips.length ? `<div class="chips">${chips.join('')}</div>` : '') + sub + '</div>' : '')
      : '<div class="hd"><div class="header">' + v.logoHtml +
      '<div class="titles"><div class="trow"><div class="name">' + hpEsc(v.name) + '</div>' + this._statusPill(v) + '</div></div>' + this._powerHtml() + this._corner() + '</div></div>' +
      '<div class="head">' + v.imageHtml +
      '<div class="meta">' +
        (chips.length ? `<div class="chips">${chips.join('')}</div>` : '') +
        sub +
      '</div></div>';

    var inksHtml = '';
    // Offline, the levels the integration kept (ha-hp keeps them while the printer is off) are still shown.
    var cartridges = this._shownLevels(r.inks.filter((i) => !i.printhead && i.level), offline);
    var parts = this._shownLevels(r.parts || [], offline);
    this._fetchLevels([...cartridges, ...parts].map((i) => i.level).filter(Boolean));
    if (c.show_inks && cartridges.length) {
      var toner = cartridges.every((i) => i.toner);
      inksHtml = this._tanks(toner ? 'mdi:invert-colors' : 'mdi:water-outline', this._t(toner ? 'toner' : 'inks'),
        cartridges.map((ink) => this._tank(this._inkInfo(ink), HP_INK_COLORS[ink.color], this._inkLabel(ink))));
    }
    // Brother: drum, belt unit, fuser and paper feed kits, by remaining life, drawn like the cartridges.
    if (c.show_parts && parts.length) {
      inksHtml += this._tanks('mdi:cog-outline', this._t('parts'),
        parts.map((part) => this._tank(this._inkInfo(part, this._partLabel(part)), HP_INK_COLORS[part.color || 'ink'], this._partLabel(part, true))));
    }

    var alertsHtml = '';
    if (!offline && c.show_alerts) {
      alertsHtml = '<div class="section"><div class="section-title"><ha-icon icon="mdi:alert-outline"></ha-icon>' + this._t('alerts') + '</div>' +
        // Informational IPP reports (`show_reports`) as muted lines after the real alerts, never instead of them.
        (alerts.some((a) => !a.report)
          ? `<div class="alerts">${alerts.filter((a) => !a.report).map((a) => `<div class="alert ${a.level}"><ha-icon icon="${a.icon}"></ha-icon><span>${hpEsc(hpCap(a.text))}</span></div>`).join('')}</div>`
          : `<div class="alert ok"><ha-icon icon="mdi:check-circle"></ha-icon><span>${this._t('no_alerts')}</span></div>`) +
        (alerts.some((a) => a.report)
          ? `<div class="alerts reports">${alerts.filter((a) => a.report).map((a) => `<div class="alert info report"><ha-icon icon="${a.icon}"></ha-icon><span>${hpEsc(hpCap(a.text))}</span></div>`).join('')}</div>`
          : '') +
      '</div>';
    }

    return head + inksHtml + this._scanHtml(r, offline) + alertsHtml;
  }

  // Cartridges or parts to show: all of them online, offline only those whose level is still known.
  _shownLevels(list, offline) {
    return offline ? list.filter((i) => !Number.isNaN(this._num(i.level))) : list;
  }

  // ── Scan (ha-hp) ─────────────────────────────────────────────────────────
  // Source, format and resolution (the integration's select entities, shared with its Scan button), the Scan and
  // Add a page buttons, then the scan in progress, its error, or the last scan with a download link per file.
  _scanHtml(r, offline) {
    var sc = r.scan;
    if (!sc || offline || this._config.show_scan === false) return '';
    var hass = this._hass, st = this._scanState || {};
    var busy = !!st.busy || this._val(r.status) === 'scan_processing';
    var dis = busy ? ' disabled' : '';
    var label = (kind, o) => {
      if (kind === 'source') return this._t({ flatbed: 'sc_glass', feeder: 'sc_feeder', feeder_duplex: 'sc_duplex' }[o] || o);
      if (kind === 'resolution') return `${o} dpi`;
      if (kind === 'color') return this._t({ color: 'sc_color', grayscale: 'sc_gray', black_and_white: 'sc_bw' }[o] || o);
      return String(o).toUpperCase();
    };
    var row = (kind, title) => {
      var s = hass.states[sc[kind]];
      var options = s?.attributes.options || [];
      if (options.length < 2) return '';
      return `<div class="scan-row"><span class="scan-lbl">${this._t(title)}</span><div class="seg">` +
        options.map((o) => `<button type="button" class="seg-b${o === s.state ? ' on' : ''}" data-scan-set="${kind}" data-value="${hpEsc(o)}"` +
          ` aria-pressed="${o === s.state}"${dis}>${hpEsc(label(kind, o))}</button>`).join('') + '</div></div>';
    };
    var pdf = this._val(sc.format) === 'pdf';
    var actions = '<div class="scan-actions">' +
      `<button type="button" class="scan-btn primary" data-scan-go="new"${dis}><ha-icon icon="${busy ? 'mdi:loading' : 'mdi:scanner'}"${busy ? ' class="spin"' : ''}></ha-icon>${this._t(busy ? 'sc_scanning' : 'sc_scan')}</button>` +
      (pdf ? `<button type="button" class="scan-btn" data-scan-go="add" title="${hpEsc(this._t('sc_add_hint'))}"${dis}><ha-icon icon="mdi:file-document-plus-outline"></ha-icon>${this._t('sc_add')}</button>` : '') +
      '</div>';
    var out = '';
    if (st.error) {
      out = `<div class="alert error"><ha-icon icon="mdi:alert-circle"></ha-icon><span>${hpEsc(this._t('sc_failed', { e: st.error }))}</span></div>`;
    } else if (!busy) {
      out = this._scanLast(sc);
    }
    return `<div class="section scan"><div class="section-title"><ha-icon icon="mdi:scanner"></ha-icon>${this._t('sc_title')}</div>` +
      row('source', 'sc_source') + row('format', 'sc_format') + row('resolution', 'sc_resolution') + row('color', 'sc_color_mode') +
      actions + out + '</div>';
  }

  // The last scan: when, its pages, and a download link per file in a media folder.
  _scanLast(sc) {
    var s = this._hass.states[sc.last];
    var a = s?.attributes || {};
    var files = a.files || [];
    if (!files.length) return '';
    // ha-hp 1.2: its own download paths (the media view serves no PDF); before, media source IDs (images only).
    var paths = a.download_paths || [];
    var ids = a.media_ids || [];
    var when = s.state && !Number.isNaN(new Date(s.state).getTime()) ? this._relative(new Date(s.state)) : '';
    var pages = Number(a.pages) > 1 ? ` · ${this._t('sc_pages', { n: a.pages })}` : '';
    return `<div class="scan-last"><div class="scan-meta muted">${this._t('sc_last')}${when ? ` · ${hpEsc(when)}` : ''}${pages}</div>` +
      files.map((file, i) => {
        var name = String(file).split('/').pop();
        var icon = /\.pdf$/i.test(name) ? 'mdi:file-pdf-box' : 'mdi:file-image-outline';
        return `<div class="scan-file"><ha-icon icon="${icon}"></ha-icon><span class="scan-name" title="${hpEsc(file)}">${hpEsc(name)}</span>` +
          (paths[i] || ids[i]
            ? `<button type="button" class="scan-dl" data-scan-dl="${hpEsc(paths[i] || ids[i])}" data-name="${hpEsc(name)}"><ha-icon icon="mdi:download"></ha-icon>${this._t('sc_download')}</button>`
            : '') +
          '</div>';
      }).join('') + '</div>';
  }

  // A click in the scan section; true when it was one.
  _scanClick(ev) {
    var el = ev.composedPath().find((n) => n.dataset && (n.dataset.scanSet || n.dataset.scanGo || n.dataset.scanDl));
    if (!el) return false;
    ev.stopPropagation();
    if (el.disabled) return true;
    var r = this._resolve();
    if (!r.scan) return true;
    if (el.dataset.scanSet) {
      if (this._scanState?.error) this._setScan(null);
      this._hass.callService('select', 'select_option', { entity_id: r.scan[el.dataset.scanSet], option: el.dataset.value });
    } else if (el.dataset.scanGo) {
      this._scan(r, el.dataset.scanGo === 'add');
    } else {
      this._download(el.dataset.scanDl, el.dataset.name);
    }
    return true;
  }

  _setScan(state) {
    this._scanState = state;
    this._update();
  }

  // Runs hp.scan on this printer (its settings come from the select entities); the files then come with the
  // Last scan sensor, shown with their download links.
  async _scan(r, append) {
    if (this._scanState?.busy) return;
    this._setScan({ busy: true });
    try {
      await this._hass.callWS({ type: 'call_service', domain: 'hp', service: 'scan',
        service_data: { device_id: r.deviceId, append: append }, return_response: true });
      this._setScan(null);
    } catch (err) {
      this._setScan({ error: String(err?.message || err?.code || err || '') });
    }
  }

  // The link is signed and short-lived, so it is made on click: an ha-hp download path is signed, a media source ID
  // resolved (which only works for images: Home Assistant's media view serves no PDF).
  async _download(target, name) {
    try {
      var url = target.indexOf('media-source://') === 0
        ? (await this._hass.callWS({ type: 'media_source/resolve_media', media_content_id: target })).url
        : (await this._hass.callWS({ type: 'auth/sign_path', path: target, expires: 60 })).path;
      var a = document.createElement('a');
      a.href = this._hass.hassUrl ? this._hass.hassUrl(url) : url;
      a.download = name || '';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      this._setScan({ error: String(err?.message || err || '') });
    }
  }

  // A section of level tanks (cartridges, parts): icon and title, then the tanks.
  _tanks(icon, title, tanks) {
    // Up to 6 tanks on one row, more on two rows (8 cartridges: two rows of 4).
    var cols = tanks.length > 6 ? Math.ceil(tanks.length / 2) : tanks.length;
    return `<div class="section"><div class="section-title"><ha-icon icon="${icon}"></ha-icon>${title}</div><div class="inks" style="--n:${cols}">${
      tanks.join('')}</div></div>`;
  }

  // One tank filled to its level (`k` from _inkInfo), flagged when low or faulty.
  _tank(k, fill, label) {
    return '<div class="ink' + (k.low ? ' low' : '') + (k.crit ? ' crit' : '') + (k.bad ? ' bad' : '') + '" title="' + hpEsc(k.title) + '">' +
      '<div class="tank"><div class="level" style="height:' + k.pct + '%;' + (k.pct > 0 ? 'min-height:3px;' : '') + 'background:' + fill + '"></div>' +
        (k.low || k.bad ? '<ha-icon class="flag" icon="mdi:alert"></ha-icon>' : '') + '</div>' +
      '<div class="pct">' + (Number.isNaN(k.p) ? '—' : `${Math.round(k.p)}<small>%</small>`) + '</div>' +
      '<div class="lbl">' + hpEsc(label) + '</div>' +
      (k.eta ? '<div class="eta">' + hpEsc(k.eta) + '</div>' : '') +
    '</div>';
  }

  _styles(color, icon) {
    return '<style>' +
      ':host { display: block; height: 100%; --hp-color: ' + (color || 'var(--disabled-text-color, #9e9e9e)') + ';' + (icon ? ' --hp-icon: ' + icon + ';' : '') + ' }' +
      'ha-card { height: 100%; box-sizing: border-box; padding: 12px; display: flex; flex-direction: column; gap: 10px; }' +
      // The header's wrapper is its size container (at the narrowest widths the status pill keeps only its icon or dot).
      // Not ha-card: an inline-size container has no intrinsic width, so in a max-content parent (layout-card, an
      // inline-block) the whole card collapsed to its padding; this wrapper only drops the header's own share...
      '.hd { container: printer-card / inline-size; margin-bottom: -2px; }' +
      // ...so the card would shrink to its body. This invisible line gives it back a natural width of ~300px (as wide
      // as a usual header) in such parents, while it can still shrink: it breaks anywhere, so it asks for no minimum.
      'ha-card::after { content: "\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0\\a0"; font: 10px monospace; overflow-wrap: anywhere; height: 0; overflow: hidden; visibility: hidden; margin-top: -10px; }' +
      '.empty { display: flex; align-items: center; gap: 10px; color: var(--secondary-text-color); }' +
      // The body starts 8px under the header (the card gap is 10px between body blocks: see .hd).
      '.header { display: flex; align-items: center; gap: 10px; }' +
      // The name gives way first, with an ellipsis, but always keeps a few characters; the buttons never shrink.
      // Basis 0: the name only gets what the pill leaves, so the pill is cut only when even 5ch of name do not fit
      // beside it (with a basis of auto both shrank in proportion, and "Ready" became "Re…" at 320px).
      '.titles { flex: 1 1 0; min-width: 5ch; }' +
      ':host([hide-title]) .titles .name { display: none; }' +
      '.logo { flex: none; display: block; width: 40px; height: 40px; line-height: 0; }' +
      // A printer in a round badge, tinted with the accent of the showcase site.
      // Its colour follows the status (hpIconColor).
      '.logo.mark { position: relative; display: grid; place-items: center; border-radius: 50%; background: color-mix(in srgb, var(--hp-icon, ' + HP_ACCENT + ') 16%, transparent); color: var(--hp-icon, ' + HP_ACCENT + '); }' +
      '.logo.mark ha-icon { --mdc-icon-size: 24px; }' +
      '.hp-badge { position: absolute; right: -4px; bottom: -4px; width: 18px; height: 18px; border-radius: 50%; line-height: 0;' +
        ' box-shadow: 0 0 0 2px var(--card-background-color, #fff); }' +
      '.hp-badge svg, .hp-badge img { width: 100%; height: 100%; object-fit: contain; }' +
      // Wordmarks: a white pill wider than the round HP mark, still clear of the name.
      '.hp-badge.brother, .hp-badge.epson, .hp-badge.canon { width: 44px; height: 15px; right: auto; left: 50%; bottom: -9px; transform: translateX(-50%);' +
        ' padding: 2px 4px; box-sizing: border-box;' +
        ' border-radius: 4px; background: #fff; box-shadow: 0 0 0 1px var(--divider-color, rgba(0,0,0,.12)), 0 0 0 3px var(--card-background-color, #fff); }' +
      '.head { display: flex; align-items: center; gap: 12px; }' +
      'a.pic { cursor: pointer; }' +
      'a.pic:hover img { filter: brightness(1.06); }' +
      '.pic { display: block; position: relative; width: 28%; max-width: 120px; flex-shrink: 0; transition: filter 0.4s, opacity 0.4s; }' +
      '.pic img { display: block; width: 100%; height: auto; }' +
      '.pic svg.art { display: block; width: 100%; height: auto; overflow: visible; }' +
      '.screen { fill: var(--hp-color); opacity: 0.85; filter: drop-shadow(0 0 6px var(--hp-color)); }' +
      '.pic.busy .screen { animation: hp-glow 1.6s ease-in-out infinite; }' +
      '@keyframes hp-glow { 0%, 100% { opacity: 0.95; } 50% { opacity: 0.45; } }' +
      '.pic.off { filter: grayscale(1); opacity: 0.55; }' +
      '.pic.off .screen { display: none; }' +
      '.meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }' +
      '.name { font-size: 16px; font-weight: 500; color: var(--primary-text-color); line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
      '.status { display: inline-flex; align-items: center; gap: 6px; flex: 0 1 auto; min-width: 0; max-width: 50%; box-sizing: border-box; overflow: hidden;' +
        ' white-space: nowrap; font-size: 12px; font-weight: 500; color: var(--hp-color);' +
        ' padding: 2px 10px 2px 6px; border-radius: 12px; background: color-mix(in srgb, var(--hp-color) 15%, transparent); }' +
      '.status ha-icon { --mdc-icon-size: 14px; flex: none; width: 14px; height: 14px; }' +
      // Title row (both headers): the pill right after the name only when both fit whole (measured by _fitPill).
      '.trow { display: flex; align-items: center; gap: 8px; min-width: 0; }' +
      '.trow > .name { flex: 0 1 auto; min-width: 4ch; }' +
      '.trow > .bst, .trow > .status, .trow > .st { flex: none; max-width: none; }' +
      '.titles.pill-below { display: flex; flex-direction: column; gap: 1px; }' +
      '.titles.pill-below .trow { display: contents; } .titles.pill-below .hsub { order: 1; }' +
      ' .titles.pill-below .trow > :not(.name) { order: 2; align-self: flex-start; max-width: 100%; margin-top: 2px; }' +
      '.titles.pill-dot .status { min-width: 22px; padding: 2px 4px; } .titles.pill-dot .status span { display: none; }' +
      '.titles.pill-dot .st { min-width: 14px; padding: 4px; } .titles.pill-dot .st .tx { display: none; }' +
      '.status span { min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
      // Too narrow for a readable status: its icon only, never cut (the text stays in the pill's title and label),
      // with tighter gaps (the 40px logo is never shrunk), so the name and the detail button of a zoomed mini card still fit at 6 columns.
      '@container printer-card (max-width: 200px) { .header { gap: 4px; }' +
        ' .status { min-width: 22px; padding: 2px 4px; } .status span { display: none; } }' +
      '.chips { display: flex; flex-wrap: wrap; gap: 6px; }' +
      // The power button (power_entity): round, never filled — tinted in green while the printer is powered.
      '.pw { all: unset; flex: none; box-sizing: border-box; cursor: pointer; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center;' +
        ' color: var(--secondary-text-color); box-shadow: inset 0 0 0 1px var(--divider-color, rgba(127,127,127,.3)); }' +
      '.pw ha-icon { --mdc-icon-size: 16px; }' +
      '.pw.on { color: var(--success-color, #43a047); background: color-mix(in srgb, var(--success-color, #43a047) 14%, transparent); box-shadow: none; }' +
      '.pw:not([disabled]):hover { background: color-mix(in srgb, var(--secondary-text-color) 16%, transparent); }' +
      '.pw.on:not([disabled]):hover { background: color-mix(in srgb, var(--success-color, #43a047) 24%, transparent); }' +
      '.pw[disabled] { opacity: .45; cursor: default; }' +
      '.pw:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
      // The confirmation popup, at the top of the card (it stays in view when the card is long).
      'ha-card.dialog-open { position: relative; min-block-size: 150px; }' +
      '.backdrop { position: absolute; inset: 0; z-index: 9; display: flex; align-items: flex-start; justify-content: center; padding-top: 12px; box-sizing: border-box;' +
        ' background: rgba(0,0,0,.45); border-radius: inherit; }' +
      '.modal { width: min(92%, 340px); box-sizing: border-box; border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 12px;' +
        ' background: var(--card-background-color, #1c1c1c); color: var(--primary-text-color); box-shadow: 0 8px 30px rgba(0,0,0,.4); }' +
      '.modal .msg { font-size: 14px; line-height: 1.4; }' +
      '.modal-actions { display: flex; justify-content: flex-end; gap: 8px; }' +
      '.mbtn { all: unset; cursor: pointer; padding: 6px 14px; border-radius: 10px; font-size: 13px; font-weight: 500;' +
        ' background: var(--secondary-background-color, rgba(127,127,127,.12)); color: var(--primary-text-color); }' +
      '.mbtn.primary { background: color-mix(in srgb, var(--error-color, #db4437) 16%, transparent); color: var(--error-color, #db4437); }' +
      '.mbtn:hover { filter: brightness(1.08); }' +
      '.mbtn:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }' +
      '.chip { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; padding: 1px 8px 1px 5px; border-radius: 12px; }' +
      '.chip ha-icon { --mdc-icon-size: 13px; flex: none; width: 13px; height: 13px; }' +
      '[data-entity] { cursor: pointer; }' +
      '[data-entity]:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
      '.chip.error { background: color-mix(in srgb, var(--error-color, #db4437) 15%, transparent); color: var(--error-color, #db4437); }' +
      '.chip.warn { background: color-mix(in srgb, var(--warning-color, #ffa600) 15%, transparent); color: var(--warning-color, #ffa600); }' +
      '.chip.on { background: color-mix(in srgb, var(--info-color, #039be5) 15%, transparent); color: var(--info-color, #039be5); }' +
      '.chip.muted { background: var(--secondary-background-color, rgba(128,128,128,0.12)); color: var(--secondary-text-color); }' +
      '.sub { font-size: 11px; color: var(--secondary-text-color); line-height: 1.4; display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }' +
      '.sub ha-icon { --mdc-icon-size: 15px; }' +
      '.muted { color: var(--secondary-text-color); opacity: 0.85; }' +
      '.section { display: flex; flex-direction: column; gap: 6px; }' +
      '.section-title { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; text-transform: uppercase;' +
        ' letter-spacing: .04em; color: var(--secondary-text-color); }' +
      '.section-title ha-icon { --mdc-icon-size: 16px; flex: none; width: 16px; height: 16px; }' +
      '.inks { display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 8px; }' +
      '.ink { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 0; }' +
      '.tank { position: relative; width: 100%; max-width: 40px; height: 44px; border-radius: 8px; overflow: hidden;' +
        ' background: var(--secondary-background-color, rgba(128,128,128,0.12)); box-shadow: inset 0 0 0 1px var(--divider-color, rgba(128,128,128,0.25)); }' +
      '.level { position: absolute; left: 0; right: 0; bottom: 0; border-radius: 0 0 8px 8px; transition: height 0.6s ease; }' +
      // Low / nearly empty: outlined outside the tank, so the frame never hides a low level (a low yellow next to an orange frame).
      '.ink.low .tank, .ink.bad .tank { outline: 2px solid var(--warning-color, #ffa600); outline-offset: 1px; }' +
      '.ink.bad .tank, .ink.crit .tank { outline-color: var(--error-color, #db4437); }' +
      '.flag { position: absolute; top: 4px; left: 50%; transform: translateX(-50%); --mdc-icon-size: 16px; color: var(--warning-color, #ffa600); }' +
      '.ink.bad .flag, .ink.crit .flag { color: var(--error-color, #db4437); }' +
      '.pct { font-size: 13px; font-weight: 500; color: var(--primary-text-color); }' +
      '.pct small { font-size: 11px; font-weight: 500; margin-left: 1px; color: var(--secondary-text-color); }' +
      '.lbl { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }' +
      '.eta { font-size: 10px; color: var(--secondary-text-color); white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }' +
      '.ink.low .eta, .ink.crit .eta { color: var(--primary-text-color); font-weight: 500; }' +
      '.alerts { display: flex; flex-direction: column; gap: 6px; }' +
      '.alert { display: flex; align-items: center; gap: 8px; font-size: 12px; padding: 6px 8px; border-radius: 10px;' +
        ' background: var(--secondary-background-color, rgba(128,128,128,0.1)); color: var(--primary-text-color); }' +
      '.alert ha-icon { --mdc-icon-size: 18px; flex-shrink: 0; width: 18px; height: 18px; }' +
      '.alert.error { background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent); } .alert.error ha-icon { color: var(--error-color, #db4437); }' +
      '.alert.warn { background: color-mix(in srgb, var(--warning-color, #ffa600) 12%, transparent); } .alert.warn ha-icon { color: var(--warning-color, #ffa600); }' +
      '.alert.info ha-icon { color: var(--secondary-text-color); }' +
      '.alerts.reports { margin-top: 6px; } .alert.report { color: var(--secondary-text-color); padding-top: 2px; padding-bottom: 2px; }' +
      '.alert.ok { color: var(--secondary-text-color); } .alert.ok ha-icon { color: var(--success-color, #43a047); }' +
      // Scan section: segmented choices and buttons tinted, never filled (like the other ha-* cards).
      '.scan-row { display: flex; align-items: center; gap: 8px; margin: 4px 0; flex-wrap: wrap; }' +
      '.scan-lbl { font-size: 12px; color: var(--secondary-text-color); min-width: 72px; }' +
      '.seg { display: inline-flex; flex-wrap: wrap; gap: 4px; }' +
      '.seg-b, .scan-btn, .scan-dl { font: inherit; font-size: 12px; cursor: pointer; border-radius: 14px; padding: 3px 10px; color: var(--primary-text-color);' +
        ' border: 1px solid var(--divider-color, rgba(128,128,128,0.3)); background: transparent; display: inline-flex; align-items: center; gap: 4px; }' +
      '.seg-b.on { border-color: transparent; background: color-mix(in srgb, var(--primary-color, #03a9f4) 18%, transparent);' +
        ' color: var(--primary-color, #03a9f4); font-weight: 500; }' +
      '.seg-b:disabled, .scan-btn:disabled { opacity: .5; cursor: default; }' +
      '.scan-actions { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }' +
      '.scan-btn { padding: 5px 12px; font-weight: 500; }' +
      '.scan-btn.primary { border-color: transparent; background: color-mix(in srgb, var(--primary-color, #03a9f4) 15%, transparent); color: var(--primary-color, #03a9f4); }' +
      '.scan-btn ha-icon, .scan-dl ha-icon { --mdc-icon-size: 16px; }' +
      '.spin { animation: hp-spin 1s linear infinite; } @keyframes hp-spin { to { transform: rotate(360deg); } }' +
      '.scan-last { margin-top: 8px; display: flex; flex-direction: column; gap: 4px; }' +
      '.scan-meta { font-size: 12px; }' +
      '.scan-file { display: flex; align-items: center; gap: 6px; font-size: 13px; min-width: 0; }' +
      '.scan-file > ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color); flex: none; }' +
      '.scan-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }' +
      '.scan-dl { flex: none; color: var(--primary-color, #03a9f4); border-color: transparent; background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent); }' +
      // The screen keeps the status color but stops pulsing; levels and hovers change without motion.
      '@media (prefers-reduced-motion: reduce) { .pic.busy .screen, .spin { animation: none; } .pic, .level { transition: none; } }' +
      (this._config?.illustration === false ? '' : HP_BANNER_STYLES) +
    '</style>';
  }
}
