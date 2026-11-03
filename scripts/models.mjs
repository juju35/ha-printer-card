// Renders the galleries of drawn printer pictures shown in the README, one per brand, from the card's own drawing code
// (images/models-<brand>.svg).
// Usage: node scripts/models.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadCard } from "../test/load.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const { HP_ART, HP_ART_DEFS } = loadCard("printer-card.js", ["HP_ART", "HP_ART_DEFS"]);

// [picture, label] per brand, in the order of the editor's picture list.
const GALLERIES = {
  hp: [
    ["officejet", "OfficeJet / PageWide"],
    ["laserjet", "LaserJet"],
    ["deskjet", "DeskJet / ENVY"],
    ["smart_tank", "Smart Tank"],
  ],
  brother: [
    ["brother_laser", "HL / DCP-L / MFC-L"],
    ["brother_inkjet", "MFC-J / DCP-J"],
  ],
  epson: [
    ["ecotank", "EcoTank"],
    ["epson_inkjet", "Expression / WorkForce"],
  ],
  canon: [
    ["pixma", "PIXMA / MAXIFY"],
    ["megatank", "MegaTank (PIXMA G)"],
    ["canon_laser", "i-SENSYS / imageCLASS"],
  ],
  generic: [["generic", "Other brands (IPP)"]],
};

const CELL = 170;
const W = 130;
const H = (W * 120) / 160;
for (const [brand, pictures] of Object.entries(GALLERIES)) {
  const cells = pictures.map(([key, label], i) => {
    // Nested pictures share one document: their gradient ids get a per-picture suffix. The screen shows lit green.
    const art = (HP_ART_DEFS + HP_ART[key])
      .replace(/id="([\w-]+)"/g, `id="$1-${i}"`)
      .replace(/url\(#([\w-]+)\)/g, `url(#$1-${i})`)
      .replace(/class="screen"/g, 'fill="#43a047" opacity="0.85"');
    return `<svg x="${i * CELL + (CELL - W) / 2}" y="0" width="${W}" height="${H}" viewBox="0 0 160 120">${art}</svg>` +
      `<text x="${i * CELL + CELL / 2}" y="${H + 20}" text-anchor="middle">${label}</text>`;
  });
  const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pictures.length * CELL} ${H + 28}"><style>text{font:12px -apple-system,Segoe UI,Roboto,sans-serif;fill:#8b949e}</style>${cells.join("")}</svg>\n`;
  writeFileSync(`${root}images/models-${brand}.svg`, out);
  console.log(`images/models-${brand}.svg`);
}
