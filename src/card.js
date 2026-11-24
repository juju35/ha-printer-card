// ── Card ─────────────────────────────────────────────────────────────────────
// The card's focusable controls, by the selector that identifies each across renders.
export var HP_FOCUSABLE = ['a.pic', 'button.zoom'];
export function hpFocusKey(el) {
  if (!el?.matches) return '';
  // A chip: by its tag, classes and entity.
  if (el.dataset?.entity) return `${el.localName}${[...el.classList].map((c) => `.${c}`).join('')}[data-entity="${el.dataset.entity}"]`;
  return HP_FOCUSABLE.find((sel) => el.matches(sel)) || '';
}

// Days before a cartridge or part is empty, from its daily mean levels ({ t, v }, oldest first) and its level now:
// the drop per day since the last refill (a rise of 20 points or more), over at least a week. Null when it is not
// used up (a flat or rising level) or there is too little history.
export var HP_REFILL_JUMP = 20;
export var HP_FORECAST_DAYS = 90;
export function hpDaysToEmpty(points, current) {
  if (!Array.isArray(points) || Number.isNaN(current)) return null;
  var start = 0;
  for (var i = 1; i < points.length; i++) if (points[i].v - points[i - 1].v >= HP_REFILL_JUMP) start = i;
  var seg = points.slice(start);
  if (seg.length < 2) return null;
  var first = seg[0];
  var last = seg[seg.length - 1];
  var days = (last.t - first.t) / 86400000;
  if (days < 7) return null;
  var perDay = (first.v - last.v) / days;
  if (!(perDay > 0.02)) return null;
  return current / perDay;
}

// "≈ 6 weeks", "≈ 3 months": the forecast under a tank, in the card's language. Whole words: the narrow forms
// ("4m") read as minutes as well as months.
export function hpShortDuration(locale, days) {
  var unit = days < 14 ? 'day' : days < 63 ? 'week' : 'month';
  var n = Math.max(1, Math.round(days / (unit === 'day' ? 1 : unit === 'week' ? 7 : 30.44)));
  try {
    return '≈ ' + new Intl.NumberFormat(locale, { style: 'unit', unit: unit, unitDisplay: 'long' }).format(n);
  } catch (_e) {
    return '≈ ' + n + ' ' + unit.charAt(0);
  }
}

// `ignore_reasons`: IPP state reasons to leave out, by name with or without their -error / -warning / -report suffix
// (`wifi-not-configured` and `wifi-not-configured-report` alike); a list, or one string with commas.
export function hpIgnoredReasons(list) {
  var items = Array.isArray(list) ? list : String(list || '').split(',');
  var out = {};
  items.forEach((x) => {
    var k = String(x).trim().toLowerCase().replace(/-(error|warning|report)$/, '');
    if (k) out[k] = true;
  });
  return out;
}

export var HP_DEFAULTS = {
  show_title: true, show_image: true, show_inks: true, show_alerts: true, show_stats: true, show_eprint: true, show_expired: false, show_forecast: true, show_scan: true, low_threshold: 15, picture: 'auto',
  show_reports: false, illustration: true, illustration_theme: 'auto',
};
