// Entry point: the card's modules in their original order. scripts/bundle.mjs concatenates them in this order into the
// single classic script the card ships as.
import "./card-picker.js";
import "./i18n/hpi18n.js";
import "./i18n-helpers.js";
import "./illustrations.js";
import "./status.js";
import "./inks.js";
import "./discovery.js";
import "./illustrated-header.js";
import "./card.js";
import "./shadow-dom-patching.js";
import "./printer-mini-card.js";
import "./printer-card-editor.js";
