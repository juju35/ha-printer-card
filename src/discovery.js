// ── Discovery ────────────────────────────────────────────────────────────────
import { hpIsHpDevice } from "./illustrations.js";
import { hpIsBrotherStatus, hpIsLocalStatus } from "./status.js";
import { HP_INK_ORDER, hpInkColor, hpStripPrefix } from "./inks.js";

export function hpIsHpStatus(s) {
  var o = (s?.attributes.options) || [];
  return o.indexOf('inpowersave') >= 0 || (o.indexOf('ready') >= 0 && o.indexOf('scanprocessing') >= 0);
}

export function hpIsIppStatus(s) {
  var a = (s?.attributes) || {};
  var o = a.options || [];
  return a.uri_supported !== undefined || (o.indexOf('idle') >= 0 && o.indexOf('printing') >= 0 && o.indexOf('stopped') >= 0);
}

// Registry entries grouped by device, built once per `hass.entities` object (it only changes with the registry).
export var hpRegistryIndex = new WeakMap();
export function hpRegistryByDevice(reg) {
  var index = hpRegistryIndex.get(reg);
  if (!index) {
    index = new Map();
    Object.values(reg).forEach((e) => {
      if (!e.device_id || e.hidden) return;
      if (!index.has(e.device_id)) index.set(e.device_id, []);
      index.get(e.device_id).push(e);
    });
    hpRegistryIndex.set(reg, index);
  }
  return index;
}

export function hpEntitiesOf(hass, deviceIds) {
  if (!hass?.entities) return [];
  var index = hpRegistryByDevice(hass.entities);
  var out = [];
  deviceIds.forEach((id) => { (index.get(id) || []).forEach((e) => { if (hass.states[e.entity_id]) out.push(e); }); });
  return out;
}

export function hpDeviceName(hass, id) {
  var d = hass?.devices?.[id];
  return d ? String(d.name_by_user || d.name || '').trim() : '';
}

// Printers: devices carrying an HP Printer status sensor or an IPP printer sensor.
// Sensors attached to a device, listed once per `hass.entities` object; states are read on each call.
export var hpSensorIndex = new WeakMap();
export function hpDeviceSensors(reg) {
  var list = hpSensorIndex.get(reg);
  if (!list) {
    list = Object.values(reg).filter((e) => e.device_id && e.entity_id.indexOf('sensor.') === 0);
    hpSensorIndex.set(reg, list);
  }
  return list;
}

export function hpFindPrinters(hass) {
  if (!hass?.entities) return [];
  var out = [];
  hpDeviceSensors(hass.entities).forEach((e) => {
    var s = hass.states[e.entity_id];
    var kind = hpIsLocalStatus(e) ? 'hp_local' : hpIsHpStatus(s) ? 'hp' : hpIsBrotherStatus(e) ? 'brother' : (hpIsIppStatus(s) ? 'ipp' : null);
    if (kind && !out.some((p) => p.id === e.device_id)) out.push({ id: e.device_id, kind: kind });
  });
  // HP Printer (ha-hp, then elad-bar's HP Printer), then Brother, first: they carry richer data than IPP.
  var rank = { hp_local: 0, hp: 0, brother: 1, ipp: 2 };
  return out.sort((a, b) => rank[a.kind] - rank[b.kind]);
}

// The HP Printer integration splits a printer into one device per part
// (cartridges, printhead, printer counters…) linked to the main one.
export function hpSubDevices(hass, mainId) {
  if (!hass?.devices) return [];
  var main = hass.devices[mainId];
  var mainName = hpDeviceName(hass, mainId);
  return Object.keys(hass.devices).filter((id) => {
    if (id === mainId) return false;
    var d = hass.devices[id];
    if (d.via_device_id === mainId) return true;
    // Name-prefix fallback: never absorb a device linked to another parent, nor another
    // printer ("OfficeJet 2" when the main one is "OfficeJet"). The cheap manufacturer / name
    // test comes first: the printer check scans every sensor, so it only runs on the few matches.
    if (d.via_device_id || !mainName || !main || d.manufacturer !== main.manufacturer) return false;
    if (String(d.name || '').indexOf(`${String(main.name || '')} `) !== 0) return false;
    return !hpIsPrinterDevice(hass, id);
  });
}

// A device carrying its own printer status sensor (HP Printer or IPP) is a printer, not a sub-device.
export function hpIsPrinterDevice(hass, id) {
  if (!hass?.entities) return false;
  return hpDeviceSensors(hass.entities).some((e) => {
    if (e.device_id !== id) return false;
    var s = hass.states[e.entity_id];
    return hpIsLocalStatus(e) || hpIsHpStatus(s) || hpIsIppStatus(s);
  });
}

export function hpUnit(s) { return s?.attributes.unit_of_measurement; }

export function hpPick(list, hass, test) {
  var hit = list.find((e) => test(e.entity_id, hass.states[e.entity_id]));
  return hit ? hit.entity_id : undefined;
}

// Builds the cartridge list of a HP Printer device: one entry per consumable sub-device.
export function hpHpInks(hass, subIds) {
  var inks = [];
  subIds.forEach((id) => {
    var list = hpEntitiesOf(hass, [id]);
    var level = hpPick(list, hass, (eid, s) => eid.indexOf('sensor.') === 0 && hpUnit(s) === '%');
    var typeId = hpPick(list, hass, (eid, s) => {
      var o = (s.attributes.options || []);
      return eid.indexOf('sensor.') === 0 && o.indexOf('printhead') >= 0 && o.indexOf('ink') >= 0;
    });
    var type = typeId ? hass.states[typeId].state : '';
    var status = hpPick(list, hass, (eid, s) => eid.indexOf('binary_sensor.') === 0 && s.attributes.state !== undefined && /(statut|status|state|etat)$/.test(eid));
    if (!level && type !== 'printhead' && !(status && /printhead|tete/i.test(status))) return;
    var name = hpDeviceName(hass, id);
    // The cartridge's own words, without the printer's name ("ENVY Photo 7830 black cartridge" is not photo black).
    var own = hpStripPrefix(name, hpDeviceName(hass, hass.devices?.[id]?.via_device_id));
    inks.push({
      device: id,
      name: name,
      printhead: type === 'printhead' || (!level && /printhead|tete/i.test(name)),
      color: hpInkColor(own) || hpInkColor(level) || 'ink',
      level: level,
      status: status,
      station: hpPick(list, hass, (eid) => /(_emplacement|_station|_slot)$/.test(eid)),
      expiry: hpPick(list, hass, (eid, s) => s.attributes.device_class === 'timestamp' && /(expiration|expiry|warranty|garantie)/.test(eid)),
      pages_left: hpPick(list, hass, (_eid, s) => hpUnit(s) === 'pages' && s.attributes.state_class === 'measurement'),
    });
  });
  return inks.sort((a, b) => {
    var sa = a.station ? Number(hass.states[a.station].state) : NaN;
    var sb = b.station ? Number(hass.states[b.station].state) : NaN;
    if (!Number.isNaN(sa) && !Number.isNaN(sb) && sa !== sb) return sa - sb;
    return (HP_INK_ORDER[a.color] ?? 9) - (HP_INK_ORDER[b.color] ?? 9);
  });
}

// `name` without the first of `prefixes` it starts with.
export function hpStripPrefixes(name, prefixes) {
  for (var p of prefixes) {
    var n = hpStripPrefix(name, p);
    if (n !== String(name || '')) return n;
  }
  return String(name || '');
}

// Color of an IPP marker: from its name, else from its entity ID. The entity ID wins when it names a variant of the
// same color (a marker reported as plain "Magenta" or "Gray" whose ID reads photo_magenta or light_gray, as on a
// Canon PRO-100: juju35/ha-printer-scanner-card#92).
export function hpIppInkColor(own, objectId) {
  var byName = hpInkColor(own, true);
  var byId = hpInkColor(objectId);
  if (byName && byId && byId !== byName && byId.endsWith(`_${byName}`)) return byId;
  return byName || byId || 'ink';
}

// IPP integration: one sensor per marker, on the same device, named after the marker ("Photo Cyan(PC)", "black ink"…).
// Its color comes from the marker's own name (the friendly name without the device's), else from the entity ID.
// Two cartridges of the same color (Canon's pigment and dye blacks, PGBK and BK) are told apart by their code.
export function hpIppInks(hass, list) {
  var inks = list.filter((e) => {
    var s = hass.states[e.entity_id];
    return e.entity_id.indexOf('sensor.') === 0 && s.attributes.marker_type !== undefined;
  }).map((e) => {
    var s = hass.states[e.entity_id];
    var d = hass.devices?.[e.device_id] || {};
    // The device may have been renamed: its entity IDs keep the original name, its friendly names take the new one.
    var names = [d.name_by_user, d.name].map((n) => String(n || '').trim()).filter(Boolean);
    var own = hpStripPrefixes(s.attributes.friendly_name, names);
    var objectId = hpStripPrefixes(e.entity_id.slice(e.entity_id.indexOf('.') + 1),
      names.map((n) => `${n.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}_`));
    var code = /\(\s*([A-Za-z]{1,5})\s*\)/.exec(own)?.[1];
    return { name: s.attributes.friendly_name, color: hpIppInkColor(own, objectId), code: code?.toUpperCase(),
      level: e.entity_id, low: s.attributes.marker_low_level, toner: /toner/i.test(String(s.attributes.marker_type || '')) };
  }).sort((a, b) => HP_INK_ORDER[a.color] - HP_INK_ORDER[b.color]);
  inks.forEach((ink) => {
    if (ink.code && inks.some((o) => o !== ink && o.color === ink.color)) ink.tag = ink.code;
  });
  return inks;
}

// IPP printer sensor matching a HP Printer device (same model), for paper/cover alerts.
// The candidates (sensors of another device of the same model) come from the registry and are cached
// with it; their states are checked on each call, so a sensor that shows up later is still found.
export var hpModelIndex = new WeakMap();
export function hpSensorsByModel(hass) {
  var cached = hpModelIndex.get(hass.entities);
  if (!cached || cached.devices !== hass.devices) {
    var byModel = new Map();
    hpDeviceSensors(hass.entities).forEach((e) => {
      var model = hass.devices[e.device_id]?.model;
      if (!model) return;
      if (!byModel.has(model)) byModel.set(model, []);
      byModel.get(model).push(e);
    });
    cached = { devices: hass.devices, byModel: byModel };
    hpModelIndex.set(hass.entities, cached);
  }
  return cached.byModel;
}

// Host part of a URL (http(s), ipp(s)…), lowercased, without the final dot of a fully qualified
// name (HP1234.local. → hp1234.local); '' when there is none.
export function hpUrlHost(url) {
  var m = /^[a-z][a-z0-9+.-]*:\/\/(\[[^\]]+\]|[^/:?#]+)/i.exec(String(url || '').trim());
  return m ? m[1].toLowerCase().replace(/\.$/, '') : '';
}

// Hosts advertised by an IPP printer sensor (every uri_supported entry: IP address, mDNS name…)
// and by its device's configuration URL.
export function hpIppHosts(hass, e) {
  var uris = hass.states[e.entity_id]?.attributes.uri_supported;
  uris = Array.isArray(uris) ? uris.slice() : String(uris || '').split(',');
  uris.push(hass.devices?.[e.device_id]?.configuration_url);
  var out = [];
  uris.forEach((u) => {
    var h = hpUrlHost(u);
    if (h && out.indexOf(h) < 0) out.push(h);
  });
  return out;
}

// Form of a host: 'v4' or 'v6' (in brackets) address, 'mdns' name (*.local), 'dns' name (other
// domain) or 'bare' name (no domain).
export function hpHostForm(h) {
  if (/^\[.*\]$/.test(h)) return 'v6';
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) return 'v4';
  if (h.indexOf('.') < 0) return 'bare';
  return /\.local$/.test(h) ? 'mdns' : 'dns';
}

// Two hosts can tell two printers apart only when written in the same form. A mDNS name and a DNS
// name are not comparable (HPABC123.local and officejet.lan can be the same printer); a name
// without domain is resolved through the DNS search domain, so it is compared with DNS names only
// (officejet and HPABC123.local can be the same printer).
export function hpComparable(a, b) {
  var fa = hpHostForm(a);
  var fb = hpHostForm(b);
  if (fa === fb) return true;
  return (fa === 'bare' && fb === 'dns') || (fa === 'dns' && fb === 'bare');
}

// Same host: identical, or the same name with and without its domain (hp1234 / hp1234.local), or
// under the mDNS and a DNS domain (hp1234.local / hp1234.lan). Two DNS names must be identical
// (printer.office1.lan is not printer.office2.lan).
export function hpSameHost(a, b) {
  if (a === b) return true;
  var fa = hpHostForm(a);
  var fb = hpHostForm(b);
  if (fa === 'v4' || fa === 'v6' || fb === 'v4' || fb === 'v6' || (fa === 'dns' && fb === 'dns')) return false;
  return a.split('.')[0] === b.split('.')[0];
}

// What the hosts say about an IPP sensor for the HP device's host: 'match' (a host is the same),
// 'mismatch' (hosts of the same form exist and all differ: another printer) or 'unknown' (a side
// has no host, or no host is comparable).
export function hpHostVerdict(mainHost, hosts) {
  if (!mainHost || !hosts.length) return 'unknown';
  if (hosts.some((h) => hpSameHost(h, mainHost))) return 'match';
  return hosts.some((h) => hpComparable(h, mainHost)) ? 'mismatch' : 'unknown';
}

// Reference cases: test/ipp-pairing.test.mjs (every case must keep passing).
export function hpFindIppSensor(hass, mainId) {
  var main = hass.devices?.[mainId];
  if (!main?.model || !hass.entities) return undefined;
  var sensors = hpSensorsByModel(hass).get(main.model) || [];
  var candidates = sensors.filter((e) => e.device_id !== mainId && hpIsIppStatus(hass.states[e.entity_id]));
  if (!candidates.length) return undefined;
  var mainHost = hpUrlHost(main.configuration_url);
  var hosts = candidates.map((e) => hpIppHosts(hass, e));
  var verdicts = hosts.map((h) => hpHostVerdict(mainHost, h));
  // A matching host always wins, whatever the order of the candidates.
  var hit = verdicts.indexOf('match');
  if (hit >= 0) return candidates[hit].entity_id;
  // This HP device has no host: a sensor whose host matches another device of the model (the other
  // HP device of identical printers, even with its status sensor missing) belongs to that device.
  // The single sensor left, if any, is this one's.
  if (!mainHost) {
    var own = candidates.map((e) => e.device_id);
    var others = sensors.map((e) => e.device_id).filter((id, i, a) => id !== mainId && own.indexOf(id) < 0 && a.indexOf(id) === i)
      .map((id) => hpUrlHost(hass.devices[id]?.configuration_url)).filter((h) => h);
    var left = candidates.filter((_e, i) => !others.some((h) => hpHostVerdict(h, hosts[i]) === 'match'));
    return left.length === 1 ? left[0].entity_id : undefined;
  }
  var printers = sensors.filter((e) => hpIsHpStatus(hass.states[e.entity_id]))
    .map((e) => e.device_id).filter((id, i, a) => a.indexOf(id) === i);
  // A single IPP sensor and a single HP Printer device of this model: paired unless hosts of the same
  // form differ (A may be followed by HP Printer only and B, of the same model, by IPP only).
  if (candidates.length === 1 && printers.length <= 1) return verdicts[0] === 'unknown' ? candidates[0].entity_id : undefined;
  // Identical printers: hosts of different forms cannot tell them apart; only a sensor without any
  // host is accepted, as before.
  var free = candidates.findIndex((_e, i) => !hosts[i].length);
  return free >= 0 ? candidates[free].entity_id : undefined;
}

// Printer web page: the device's configuration URL, else the host of the IPP sensor's URI.
export function hpAdminUrl(hass, r) {
  var ids = [r.deviceId];
  var ippEnt = r.ipp && hass.entities?.[r.ipp];
  if (ippEnt?.device_id) ids.push(ippEnt.device_id);
  for (var i = 0; i < ids.length; i++) {
    var d = hass.devices?.[ids[i]];
    if (d?.configuration_url && /^https?:\/\//i.test(d.configuration_url)) return d.configuration_url;
  }
  var s = r.ipp && hass.states[r.ipp];
  var uris = s?.attributes.uri_supported;
  uris = Array.isArray(uris) ? uris : String(uris || '').split(',');
  for (var j = 0; j < uris.length; j++) {
    var m = /^ipps?:\/\/(\[[^\]]+\]|[^/:]+)/i.exec(String(uris[j]).trim());
    if (m) return `http://${m[1]}`;
  }
  return '';
}

// Header icon: the tinted round printer of the project page on the showcase site, for every printer.
// Brand logo, as a badge on the header printer icon, embedded: HP (round mark), Brother, Epson and Canon (wordmarks,
// images/*.svg). Other brands get the icon alone.
export var HP_BRAND_LOGOS = {
  hp: '<svg viewBox="0 0 1280 1280"><defs><clipPath id="hp-logo-clip"><circle cx="640" cy="640" r="640"/></clipPath></defs>' +
  '<circle cx="640" cy="640" r="640" fill="#024ad8"/><g clip-path="url(#hp-logo-clip)" fill="#fff">' +
  '<path d="M485-20H619L482 360H597Q645 360 670 393Q695 427 676 477L515 918H380L552 444H451L277 918H142L349 360Z"/>' +
  '<path fill-rule="evenodd" d="M819 358H1070Q1118 358 1143 391Q1168 424 1151 470L1009 866Q1000 890 977 905Q956 918 932 918H752L614 1300H485ZM924 441H1026L883 832H781Z"/></g></svg>',
  brother: '<svg fill="#005cab" fill-rule="evenodd" viewBox="0 0 2.65 0.64"><path d="M2.565.138c-.146 0-.224.082-.227.188a.23.23 0 0 0-.233-.19.23.23 0 0 0-.23.188.186.186 0 0 0-.183-.188.16.16 0 0 0-.115.047V.035h-.11v.33l-.001.033C1.459.466 1.413.5 1.363.5c-.052 0-.1-.024-.1-.102L1.26.37V.247h.171V.143h-.17V.035H1.15v.29A.235.235 0 0 0 .738.222V.138H.725C.582.138.505.218.5.32A.22.22 0 0 0 .282.138a.2.2 0 0 0-.137.056v-.16H.038V.37C.04.5.13.604.27.604.39.604.477.526.5.422v.171h.11V.35C.613.282.655.243.723.242a.235.235 0 1 0 .428.172c0 .114.09.19.2.19.046 0 .086-.02.117-.052v.04h.11V.346c.003-.075.047-.107.095-.107s.09.032.09.106l.001.018v.23h.112V.42c.02.112.116.185.23.185a.216.216 0 0 0 .221-.169h-.108a.12.12 0 0 1-.113.078c-.06 0-.111-.04-.124-.108h.357v.188h.11V.38L2.45.35c.002-.067.046-.106.116-.106h.012V.138zM.269.498A.127.127 0 0 1 .141.37C.141.3.197.242.27.242S.398.298.398.37a.127.127 0 0 1-.129.128m.65 0A.127.127 0 0 1 .793.37C.792.3.847.242.92.242s.128.056.128.128A.127.127 0 0 1 .92.498m1.067-.18a.125.125 0 0 1 .119-.09c.07 0 .11.056.119.09zm.539.227c0 .03.025.055.055.055a.055.055 0 1 0 0-.11.055.055 0 0 0-.055.055m.007 0a.048.048 0 1 1 .096 0 .048.048 0 0 1-.096 0" /><path d="M2.565.52h.022q.013 0 .012.011 0 .012-.012.012h-.022zm0 .03h.022q.01 0 .01.013V.57L2.6.578h.01V.577L2.606.569V.56Q2.604.55 2.598.546q.01-.003.01-.017 0-.016-.02-.018h-.032v.066h.009z" /></svg>',
  epson: '<svg fill="#003f98" viewBox="0 0 300 73.749"><path d="M207.281 60.68c-12.828 0-17.772-11.808-17.772-23.808s4.944-23.8 17.772-23.8c12.815 0 17.772 11.8 17.772 23.8S220.096 60.68 207.28 60.68m0-59.68c-20.2 0-31.864 15.135-31.864 35.872 0 20.744 11.664 35.876 31.864 35.876 20.19 0 31.85-15.132 31.85-35.876C239.13 16.135 227.47 1 207.28 1M1 3.013h50.616v12.074H15.079v15.017H49.15v11.769H15.08v16.796h36.537v12.069H1zm83.472 35.338H71.725v-23.28h12.747c8.86 0 14.752 3.855 14.752 11.643S93.33 38.35 84.472 38.35m-26.82 32.384h14.073v-20.32h12.747c17.251 0 28.828-8.474 28.828-23.701s-11.577-23.7-28.828-23.7h-26.82zM258.905 3.013H244.45v67.725h13.803V43.305c0-7.508-.268-14.168-.523-20.058 1.627 3.39 6.57 13.577 8.85 17.404l17.965 30.087H299V3.013h-13.803V29.76c0 7.5.276 14.86.523 20.736-1.627-3.39-6.557-13.572-8.87-17.393zM129.289 48.33c0 9.101 7.572 12.639 15.624 12.639 5.257 0 13.793-1.525 13.793-8.515 0-7.383-10.429-8.778-20.492-11.457-10.552-2.793-20.715-6.751-20.715-19.3C117.5 7.706 130.732 1 143.092 1c14.27 0 27.396 6.228 27.396 22.034h-14.082c-.478-8.237-6.801-10.35-13.987-10.35-4.794 0-10.83 2.014-10.83 7.77 0 5.266 3.445 6.078 20.583 10.49 4.989 1.247 20.618 4.264 20.618 19.778 0 12.557-9.869 21.937-28.465 21.937-15.128 0-29.307-7.467-29.12-24.329z"/></svg>',
  canon: '<svg viewBox="0 0 118 25"><g fill="#C00"><path d="M19.56 22.251c-5.464 0-9.895-4.4-9.895-9.83s4.43-9.83 9.896-9.83c1.927 0 3.724.547 5.245 1.493L19.56 12.42l9.874-5.663c-1.072-1.699-2.611-3.163-4.476-4.273C22.595 1.08 19.303.208 15.662.208c-5.196 0-9.752 1.872-12.294 4.68-1.88 2.076-3 4.691-3 7.533s1.12 5.457 3 7.533c2.548 2.815 7.036 4.68 12.144 4.68s9.595-1.867 12.146-4.68q.21-.231.405-.47l-.387-1.436a9.9 9.9 0 0 1-8.115 4.203m20.092-.596c-1.987 0-3.599-1.6-3.599-3.574s1.612-3.574 3.599-3.574 3.599 1.6 3.599 3.574-1.612 3.574-3.599 3.574m12.64 2.384L48.151 8.684a5.84 5.84 0 0 0-5.65-4.306c-.702 0-1.376.124-2 .35L31.58 7.952h9.177l1.568 5.815a8.7 8.7 0 0 0-5.67-2.092c-4.307 0-7.798 2.868-7.798 6.405s3.491 6.404 7.797 6.404a9.3 9.3 0 0 0 7.531-3.821l.91 3.375zM69.191 4.378c-.543 0-1.058.12-1.52.335l-5.726 2.652a3.59 3.59 0 0 0-3.55-2.987c-.543 0-1.058.12-1.52.335l-6.994 3.24h4.916v16.086h7.197V9.74c0-.987.806-1.787 1.8-1.787.993 0 1.799.8 1.799 1.787v14.3h7.196V7.953c0-1.974-1.61-3.575-3.598-3.575m45.132 0c-.543 0-1.058.12-1.52.335l-5.726 2.652a3.59 3.59 0 0 0-3.55-2.987c-.543 0-1.058.12-1.52.335l-6.994 3.24h4.916v16.086h7.197V9.74c0-.987.806-1.787 1.8-1.787.993 0 1.799.8 1.799 1.787v14.3h7.197V7.953c0-1.974-1.61-3.575-3.599-3.575"/><path d="M86.41 7.455a2.25 2.25 0 0 0-2.754-1.58 2.23 2.23 0 0 0-1.59 2.736l3.493 12.948a2.25 2.25 0 0 0 2.754 1.58 2.23 2.23 0 0 0 1.59-2.737zm9.77 7.052c0 5.593-4.564 10.127-10.195 10.127S75.789 20.1 75.789 14.507 80.353 4.378 85.985 4.378c5.63 0 10.196 4.535 10.196 10.129"/></g></svg>',
};
export function hpBrandOf(device) {
  if (hpIsHpDevice(device)) return 'hp';
  var id = `${device?.manufacturer || ''} ${device?.model || ''} ${device?.name || ''}`.toLowerCase();
  return /\bbrother\b/.test(id) ? 'brother' : /\bepson\b/.test(id) ? 'epson' : /\bcanon\b/.test(id) ? 'canon' : null;
}
export var hpBrandBadge = (brand) => (HP_BRAND_LOGOS[brand] ? `<span class="hp-badge ${brand}">${HP_BRAND_LOGOS[brand]}</span>` : '');
export var HP_ACCENT = '#0096d6';
