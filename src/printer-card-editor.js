// ── printer-card-editor (visual editor, built on HA's ha-form) ───────────────
import { PRINTER_CARD_VERSION, pickerDefine } from "./card-picker.js";
import { hpLang, hpT } from "./i18n-helpers.js";
import { HP_PICTURES } from "./illustrations.js";
import { HP_DEFAULTS } from "./card.js";
import { PrinterCard } from "./shadow-dom-patching.js";
import { PrinterMiniCard } from "./printer-mini-card.js";

export class PrinterCardEditor extends HTMLElement {
  static defaults = HP_DEFAULTS;

  setConfig(config) {
    this._config = Object.assign({}, config);
    this._render();
  }

  set hass(hass) {
    var prevLang = this._hass?.language;
    this._hass = hass;
    if (this._form && prevLang === (hass?.language)) {
      this._form.hass = hass;
    } else {
      this._render();
    }
  }

  _lang() {
    return hpLang((this._config?.language) || (this._hass?.language));
  }

  _schema() {
    var t = (k) => hpT(this._lang(), k);
    return [
      { name: 'device_id', selector: { device: { filter: [{ integration: 'hp' }, { integration: 'hpprinter' }, { integration: 'brother' }, { integration: 'ipp' }] } } },
      { name: 'name', selector: { text: {} } },
      {
        type: 'grid', name: '', schema: [
          { name: 'illustration', selector: { boolean: {} } },
          { name: 'show_title', selector: { boolean: {} } },
          { name: 'show_image', selector: { boolean: {} } },
          { name: 'show_inks', selector: { boolean: {} } },
          { name: 'show_parts', selector: { boolean: {} } },
          { name: 'show_alerts', selector: { boolean: {} } },
          { name: 'show_reports', selector: { boolean: {} } },
          { name: 'show_stats', selector: { boolean: {} } },
          { name: 'show_eprint', selector: { boolean: {} } },
          { name: 'show_forecast', selector: { boolean: {} } },
          { name: 'show_scan', selector: { boolean: {} } },
        ],
      },
      {
        name: 'illustration_theme',
        selector: { select: { mode: 'dropdown', options: ['auto', 'day', 'night'].map((v) => ({ value: v, label: t(`theme_${v}`) })) } },
      },
      { name: 'low_threshold', selector: { number: { min: 0, max: 50, step: 1, mode: 'slider', unit_of_measurement: '%' } } },
      { name: 'show_expired', selector: { boolean: {} } },
      { name: 'admin_url', selector: { text: { type: 'url' } } },
      { name: 'power_entity', selector: { entity: { domain: ['switch', 'light', 'input_boolean'] } } },
      {
        name: 'picture',
        selector: { select: { mode: 'dropdown', options: HP_PICTURES.map((v) => ({ value: v, label: t(`pic_${v}`) })) } },
      },
      { name: 'image', selector: { text: {} } },
      {
        name: 'language',
        selector: { select: { mode: 'dropdown', options: [{ value: '', label: t('ed_lang_auto') }, { value: 'fr', label: 'Français' }, { value: 'en', label: 'English' }, { value: 'de', label: 'Deutsch' }, { value: 'es', label: 'Español' }, { value: 'sr', label: 'Српски' }, { value: 'sr-Latn', label: 'Srpski (latinica)' }, { value: 'it', label: 'Italiano' }, { value: 'nl', label: 'Nederlands' }, { value: 'pt', label: 'Português (Portugal)' }, { value: 'pl', label: 'Polski' }, { value: 'ro', label: 'Română' }, { value: 'da', label: 'Dansk' }, { value: 'sv', label: 'Svenska' }, { value: 'bg', label: 'Български' }, { value: 'ru', label: 'Русский' }, { value: 'uk', label: 'Українська' }, { value: 'hu', label: 'Magyar' }, { value: 'sk', label: 'Slovenčina' }, { value: 'cs', label: 'Čeština' }, { value: 'sl', label: 'Slovenščina' }, { value: 'lv', label: 'Latviešu' }, { value: 'el', label: 'Ελληνικά' }] } },
      },
      {
        type: 'expandable', name: 'entities', title: t('ed_entities'), flatten: false,
        schema: [
          { name: 'status', selector: { entity: { domain: 'sensor' } } },
          { name: 'ipp', selector: { entity: { domain: 'sensor' } } },
          { name: 'total_pages', selector: { entity: { domain: 'sensor' } } },
          { name: 'eprint', selector: { entity: { domain: 'binary_sensor' } } },
          { name: 'eprint_registration', selector: { entity: { domain: 'binary_sensor' } } },
        ],
      },
    ];
  }

  _render() {
    if (!this._config || !this._hass) return;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.addEventListener('value-changed', (ev) => this._valueChanged(ev));
      this.appendChild(this._form);
    }
    var lang = this._lang();
    this._form.hass = this._hass;
    this._form.schema = this._schema();
    this._form.computeLabel = (s) => {
      if (['status', 'ipp', 'total_pages', 'eprint', 'eprint_registration'].indexOf(s.name) >= 0) return hpT(lang, `en_${s.name}`);
      return hpT(lang, `ed_${s.name}`);
    };
    this._form.computeHelper = (s) => {
      var key = `ed_${s.name}_helper`;
      var txt = hpT(lang, key);
      return txt === key ? undefined : txt;
    };
    // No language option: the dropdown shows Automatic (dropped again from the YAML on change).
    this._form.data = Object.assign({ language: '' }, this.constructor.defaults, this._config);
    if (this._form.data.show_parts === undefined) this._form.data.show_parts = this._form.data.show_inks;
  }

  _valueChanged(ev) {
    ev.stopPropagation();
    var value = Object.assign({}, ev.detail.value);
    // Keep the YAML short: drop options left empty or at their default.
    Object.keys(value).forEach((key) => {
      if (value[key] === '' || value[key] === null || value[key] === undefined) delete value[key];
    });
    // show_parts at the value of show_inks is its default.
    if (value.show_parts === (value.show_inks !== false)) delete value.show_parts;
    var defaults = this.constructor.defaults;
    Object.keys(defaults).forEach((key) => {
      if (value[key] === defaults[key]) delete value[key];
    });
    if (value.entities) {
      var e = Object.assign({}, value.entities);
      Object.keys(e).forEach((k) => { if (!e[k]) delete e[k]; });
      if (Object.keys(e).length) value.entities = e; else delete value.entities;
    }
    if (this._config.type) value = Object.assign({ type: this._config.type }, value);
    var lang = this._lang();
    this._config = value;
    // A new language option relabels the form.
    if (lang !== this._lang()) this._render();
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: value }, bubbles: true, composed: true }));
  }
}

// The mini card's editor: the full card's options (shown once zoomed in) and the detail button.
export class PrinterMiniCardEditor extends PrinterCardEditor {
  static defaults = PrinterMiniCard.defaults;

  _schema() {
    var schema = super._schema();
    schema.splice(2, 0, { name: 'zoom', selector: { boolean: {} } });
    return schema;
  }
}

if (!customElements.get('printer-card-editor')) {
  pickerDefine('printer-card-editor', PrinterCardEditor);
}
if (!customElements.get('printer-mini-card-editor')) {
  pickerDefine('printer-mini-card-editor', PrinterMiniCardEditor);
}

window.customCards = window.customCards || [];
if (!customElements.get('printer-card')) {
  pickerDefine('printer-card', PrinterCard);
  window.customCards.push({
    type: 'printer-card',
    name: 'Printer Card',
    description: 'Status, ink or toner levels and alerts for printers (HP Printer and IPP integrations)',
    preview: true,
    documentationURL: 'https://github.com/juju35/ha-printer-scanner-card',
  });
}
if (!customElements.get('printer-mini-card')) {
  pickerDefine('printer-mini-card', PrinterMiniCard);
  window.customCards.push({
    type: 'printer-mini-card',
    name: 'Printer Mini Card',
    description: 'Compact printer card: status, ink or toner levels and alerts on two lines, with a button showing the full card',
    preview: true,
    documentationURL: 'https://github.com/juju35/ha-printer-scanner-card',
  });
}

console.info(`%c PRINTER-CARD %c v${PRINTER_CARD_VERSION} `, 'color:#fff;background:#0096d6;font-weight:700', 'color:#0096d6;background:#fff');
