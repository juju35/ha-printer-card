# ha-printer-card

[![Marketplace](https://img.shields.io/badge/Marketplace-Custom-41BDF5.svg)](https://www.home-assistant.io/integrations/marketplace/)
[![HACS Validation](https://github.com/juju35/ha-printer-card/actions/workflows/hacs.yml/badge.svg)](https://github.com/juju35/ha-printer-card/actions/workflows/hacs.yml)
[![Validate](https://github.com/juju35/ha-printer-card/actions/workflows/validate.yml/badge.svg)](https://github.com/juju35/ha-printer-card/actions/workflows/validate.yml)
[![Lint](https://github.com/juju35/ha-printer-card/actions/workflows/lint.yml/badge.svg)](https://github.com/juju35/ha-printer-card/actions/workflows/lint.yml)
[![Release](https://img.shields.io/github/v/release/juju35/ha-printer-card)](https://github.com/juju35/ha-printer-card/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/juju35/ha-printer-card/blob/main/LICENSE)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/julienstep9)

<p align="center">
  <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/hp.svg" alt="HP" height="56">&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/brother.svg" alt="Brother" height="28">&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/epson.svg" alt="Epson" height="28">&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/canon.svg" alt="Canon" height="28">
</p>

Custom Lovelace card for printers in Home Assistant: **HP** printers with the [HP Printer](https://github.com/elad-bar/ha-hpprinter) integration (`hpprinter`), **Brother** printers with the core [Brother](https://www.home-assistant.io/integrations/brother/) integration, and **any IPP printer** (Epson, Canon, Brother, Xerox…) through the core [IPP](https://www.home-assistant.io/integrations/ipp/) integration. HP, Brother, Epson and Canon printers get their brand logo and a drawing of their range.

> Formerly `ha-hp-printer-card`: since 2.0.1, cards must use `type: custom:printer-card` (`custom:hp-printer-card` is no longer registered).

When the printer is off, the card simply says it's **offline**. Otherwise it shows the **status**, the **ink or toner levels** and the **alerts**.

Pick the printer, the card finds all its entities by itself. A compact **Printer Mini Card** shows the same printer on two lines, and its detail button opens the full card in place.

[![Open your Home Assistant instance and open a repository inside the Marketplace.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=juju35&repository=ha-printer-card&category=plugin)

| <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/hp.svg" alt="HP" height="20"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/brother.svg" alt="Brother" height="14"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/epson.svg" alt="Epson" height="14"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/canon.svg" alt="Canon" height="14"> |
|---|---|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/card.png" alt="HP printer card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/ipp.png" alt="Brother printer card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/epson.png" alt="Epson printer card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/canon.png" alt="Canon printer card" width="400"> |
| <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/mini-card.png" alt="HP printer mini card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/mini-ipp.png" alt="Brother printer mini card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/mini-epson.png" alt="Epson printer mini card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/mini-canon.png" alt="Canon printer mini card" width="400"> |

## Features

- **Offline state**: when the printer is turned off or unreachable, the picture turns grey and the card only shows *Offline* with the last time it was seen
- **Status** with color: ready, sleeping, printing, scanning, copying, cancelling, stopped. The printer's control panel lights up in the status color and pulses while it works (steady when the system asks for reduced motion)
- **Ink or toner levels**: one tank per cartridge, in the printer's slot order, with a warning below a configurable threshold
- **Empty forecast**: under each cartridge and part, about how long it lasts at the pace of the last 90 days (*≈ 7 weeks*; *Empty in 7 weeks (12 Mar)* on hover, with the date it runs out), from the recorder's daily statistics, a refill starting the count over
- **Brother parts** (Brother integration): drum (or one per color), belt unit, fuser and paper feed kits by remaining life, in a *Parts* section, with an alert at the low threshold
- **Any IPP printer**: status, ink or toner levels and paper / cover alerts for printers of any brand through the IPP integration
- **Pictures**: a drawing per range for HP (OfficeJet, LaserJet, DeskJet / ENVY, Smart Tank), Brother (laser, inkjet), Epson (EcoTank, Expression / WorkForce) and Canon (PIXMA / MAXIFY, MegaTank, i-SENSYS), and a generic printer for the other brands, picked from the device model or chosen in the editor
- **Brand logo** (HP, Brother, Epson or Canon) as a badge on the header printer icon
- **Alerts**: low or nearly empty ink, missing / used / non-HP / damaged cartridge, printhead problem, and, through the IPP integration, empty paper tray, paper jam, open cover…
- **ePrint status**: on, off or not registered (HP cloud printing)
- **Clickable chips**: a chip opens the more-info dialog of its entity (cartridge level, IPP printer sensor, ePrint sensor…), also from the keyboard (Tab, then Enter or Space)
- Page counter
- **Mini card**, laid out like the Home Connect mini cards: icon, name and status on top, then the picture with one chip per cartridge (a small tank at its level, outlined orange when low, red when nearly empty) and per alert
- **Detail button** on the mini card (top right): shows the full card in place, with everything it shows; the button, or a click anywhere else, goes back to the compact view. `zoom: false` removes it
- Automatic entity discovery from the device (works with English or French entity IDs), status, IPP sensor, ePrint sensors and page counter can be overridden
- Visual editor in the dashboard UI (no YAML needed)
- English, French, German, Spanish, Serbian (Cyrillic and Latin), Italian, Dutch, European Portuguese, Polish, Romanian, Danish, Swedish, Bulgarian, Russian, Ukrainian, Hungarian, Slovak, Czech, Slovenian, Latvian and Greek, follows the Home Assistant language
- Light and dark theme compatible
- Single file, no dependencies, ready for the Marketplace

## Scanning

With [HP Printer (ha-hp)](https://github.com/juju35/ha-hp) and a printer that scans, the card has a **Scan** section:

- **Source**: glass, document feeder or double-sided feeder; **Format**: PDF, JPEG or PNG; **Resolution**: those the scanner offers; **Color mode**: color, grayscale or black and white (those the scanner offers). They are the integration's select entities, so its own Scan button uses the same settings
- **Scan** starts a new file; **Add a page** (PDF) scans the page on the glass and adds it to the last PDF, for a document scanned page by page
- While it scans, the buttons wait and show the progress; an error (feeder empty, scanner busy…) is shown in the card
- At the end, the file appears with a **Download** link (one per page in JPEG or PNG), signed when clicked; once downloaded, ha-hp deletes the file and it leaves the card. The download needs ha-hp 1.2 or later (Home Assistant's media view does not serve PDFs)

`show_scan: false` hides the section.

## Supported integrations

| Integration | Printers | What the card shows |
|---|---|---|
| [HP Printer (ha-hp)](https://github.com/juju35/ha-hp) (Marketplace, recommended for HP) | HP OfficeJet, LaserJet, DeskJet / ENVY, Smart Tank | Status (kept while the printer is off), ink or toner levels, pages remaining, cartridge alerts (taken out, problem), the printer's own message when it stops (out of paper, jam, open door), HP cloud status, page counter |
| [HP Printer](https://github.com/elad-bar/ha-hpprinter) (Marketplace) | HP OfficeJet, LaserJet, DeskJet / ENVY, Smart Tank | Status, ink or toner levels per cartridge, cartridge and printhead alerts, ePrint status, page counter |
| [Brother](https://www.home-assistant.io/integrations/brother/) (built in) | Brother laser and inkjet printers (SNMP) | Status (printer status, else the raw status text), ink or toner levels, page counter |
| [IPP](https://www.home-assistant.io/integrations/ipp/) (built in) | Any brand: Epson, Canon, Brother… | Status, ink or toner levels, paper and cover alerts (empty tray, jam, open cover…) |

With an HP Printer integration or Brother and IPP both set up for the same printer, the card uses HP Printer or Brother for the status and the inks and picks up the IPP printer sensor by itself for the paper and cover alerts. Epson and Canon printers have no dedicated Home Assistant integration: they go through IPP.

## Prerequisites

- Home Assistant 2024.8 or later with [HP Printer (ha-hp)](https://github.com/juju35/ha-hp) (recommended for HP printers), elad-bar's [HP Printer](https://github.com/elad-bar/ha-hpprinter), [Brother](https://www.home-assistant.io/integrations/brother/) or the [IPP](https://www.home-assistant.io/integrations/ipp/) integration (any brand) set up
- With both integrations set up for the same printer, the card uses HP Printer for status and inks and picks up the IPP printer sensor by itself for paper and cover alerts

## Installation

### Via the Marketplace (recommended)

Click the button below to add the repository directly:

[![Add to the Marketplace](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=juju35&repository=ha-printer-card&category=plugin)

Or manually:

1. Open **Settings → Marketplace → Add from link** (top right; this needs a GitHub account connected)
2. Add `https://github.com/juju35/ha-printer-card` — Type: **Dashboard**
3. Open **Printer Card** and click **Install**
4. Clear your browser cache and refresh

The Marketplace registers the dashboard resource for you.

### Manual

1. Download `printer-card.js` and the `printer-card.i18n.*.js` translation files from the [latest release](https://github.com/juju35/ha-printer-card/releases/latest)
2. Copy them all to `/config/www/` (without the translation files, the cards show in English)
3. Go to **Settings → Dashboards → Resources** → Add resource:
   - URL: `/local/printer-card.js`
   - Type: **JavaScript Module**
4. Clear your browser cache and refresh

## Configuration

### Visual editor

Add the card from the dashboard (**Add card** → **Printer Card** or **Printer Mini Card**). The first printer found is picked automatically; change it with the **Printer** field, then set the name, the picture, the sections to show and the low ink threshold. The **Entities (advanced)** panel lets you force an entity if auto-detection picks the wrong one. Options left at their default are not written to the YAML.

### Minimal

```yaml
type: custom:printer-card
device_id: e1146b5da5cdfee3f4b06c25b0c863a7
```

Use either `device_id` (what the visual editor writes) or `entity` (any entity of the printer's main device). With neither, the card uses the first printer it finds.

### Mini card

```yaml
type: custom:printer-mini-card
device_id: e1146b5da5cdfee3f4b06c25b0c863a7
zoom: true
```

The mini card takes the same options as the full card (they also apply to its full view), plus `zoom`. `show_inks` and `show_alerts` choose its chips; `show_image` its picture. In a Sections view it takes 6 columns (half the width) by default.

### Full options

```yaml
type: custom:printer-card
device_id: e1146b5da5cdfee3f4b06c25b0c863a7
name: Printer
show_image: true
show_inks: true
show_parts: true
show_alerts: true
show_stats: true
show_eprint: true
show_expired: false
low_threshold: 15
picture: auto
admin_url: http://printer.local
image: /local/my-printer.png
language: en
entities:
  status: sensor.hp_officejet_pro_9010_series_192_168_1_119_status
  ipp: sensor.hp_officejet_pro_9010_series
  total_pages: sensor.hp_officejet_pro_9010_series_192_168_1_119_printer_total_pages
  eprint: binary_sensor.hp_officejet_pro_9010_series_192_168_1_119_eprint_status
  eprint_registration: binary_sensor.hp_officejet_pro_9010_series_192_168_1_119_eprint_registered
```

### Options reference

| Option | Required | Default | Description |
|---|---|---|---|
| `device_id` | ❌* | Auto | Printer device (*or `entity`; the first printer found is used if both are missing) |
| `entity` | ❌ | — | Any entity of the printer's main device, used to find the device |
| `name` | ❌ | Device name | Card title |
| `show_image` | ❌ | `true` | Show the printer picture |
| `show_inks` | ❌ | `true` | Show the ink or toner levels |
| `show_parts` | ❌ | Value of `show_inks` | Show the Brother parts (drum, belt unit, fuser, paper feed kits) by remaining life |
| `show_alerts` | ❌ | `true` | Show the alerts |
| `show_stats` | ❌ | `true` | Show the total page counter |
| `show_eprint` | ❌ | `true` | Show the ePrint status (HP Printer integration only) |
| `show_forecast` | ❌ | `true` | Show under each tank when it is forecast to be empty: the drop per day since the last refill (a rise of 20 points or more), over at least a week of the last 90 days of the recorder's daily statistics; nothing for a level that doesn't go down |
| `show_scan` | ❌ | `true` | Scan section (ha-hp printers that scan): source, format, resolution, color mode, Scan / Add a page, download link of the last scan |
| `show_expired` | ❌ | `false` | Also alert when a cartridge's warranty date has passed |
| `low_threshold` | ❌ | `15` | Ink level (%) at or below which a cartridge is flagged as low; at 5 % or less it is nearly empty. Also the remaining life (%) at which a Brother part (drum, belt, fuser, paper feed kit) raises an alert |
| `admin_url` | ❌ | Detected | Page opened when clicking the printer picture, e.g. `http://printer.local`. By default, the device's configuration URL or the address of its IPP sensor |
| `picture` | ❌ | `auto` | Picture: `auto`, `officejet`, `laserjet`, `deskjet`, `smart_tank` or `generic` (see below) |
| `image` | ❌ | — | URL of your own printer picture, e.g. `/local/printer.png`; replaces `picture` |
| `language` | ❌ | Auto | Force language: `fr`, `en`, `de`, `es`, `sr`, `sr-Latn`, `it`, `nl`, `pt`, `pl`, `ro`, `da`, `sv`, `bg`, `ru`, `uk`, `hu`, `sk`, `cs`, `sl`, `lv` or `el` (auto-detects from HA settings; *Automatic* in the visual editor) |
| `entities` | ❌ | Auto | Override detected entities (see below) |
| `zoom` | ❌ | `true` | Mini card only: detail button in the top right corner, showing the full card; a click on it or anywhere else goes back to the compact view. `false` removes it |

### Entity overrides

Keys accepted under `entities`:

| Key | Domain | Used for |
|---|---|---|
| `status` | `sensor` | Printer status (HP Printer *Status* sensor, or the IPP printer sensor) |
| `ipp` | `sensor` | IPP printer sensor, read for paper, jam and cover alerts |
| `total_pages` | `sensor` | Page counter |
| `eprint` | `binary_sensor` | ePrint status (on / off) |
| `eprint_registration` | `binary_sensor` | ePrint registration, shows *not registered* when off |

Cartridges are always found from the printer's devices.

### Pictures

| `picture` | Used by `auto` for |
|---|---|
| `officejet` | Other HP models (OfficeJet, PageWide…): all-in-one drawing |
| `laserjet` | HP LaserJet, Neverstop |
| `deskjet` | HP DeskJet, ENVY, Tango |
| `smart_tank` | HP Smart Tank, Ink Tank |
| `brother_laser` | Brother laser printers (HL, DCP-L, MFC-L) and other Brother models |
| `brother_inkjet` | Brother inkjet all-in-ones (MFC-J, DCP-J) |
| `ecotank` | Epson EcoTank (ET, L series) |
| `epson_inkjet` | Other Epson models (Expression, WorkForce…) |
| `pixma` | Canon PIXMA, MAXIFY and other Canon inkjets |
| `megatank` | Canon MegaTank (PIXMA G series) |
| `canon_laser` | Canon i-SENSYS, imageCLASS, imageRUNNER (LBP, MF) |
| `generic` | Printers of other brands (IPP) |

The drawings by brand:

<p align="center"><img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/models-hp.svg" alt="HP printer pictures" width="680"></p>
<p align="center"><img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/models-brother.svg" alt="Brother printer pictures" width="340">&nbsp;&nbsp;<img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/models-epson.svg" alt="Epson printer pictures" width="340"></p>
<p align="center"><img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/models-canon.svg" alt="Canon printer pictures" width="510">&nbsp;&nbsp;<img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/models-generic.svg" alt="Generic printer picture" width="170"></p>

The control panel of each picture lights up in the status color.

### Theme colors

The status colors follow the Home Assistant theme: `--success-color` (ready), `--info-color` (printing, copying), `--warning-color` (cancelling) and `--error-color` (stopped). Two states have no Home Assistant color and get their own variable, which a theme can set:

| Variable | State | Default |
|---|---|---|
| `--printer-card-sleep-color` | Sleeping (power save) | `#5c8fd6` |
| `--printer-card-scan-color` | Scanning | `#8e24aa` |

## Screenshots

The header icon carries the logo of the printer's brand as a badge: HP, Brother, Epson or Canon (the other brands get the icon alone). The drawing follows the brand and range of the printer.

### Animations

While a job prints, the card animates for every brand (Brother, Epson and Canon animations in their sections below): the preview screen glows as pages advance and the control panel pulses in the status colour. The card settles back to a still picture once the printer is idle, and the mini card's preview glows the same way.

HP OfficeJet Pro 9010 printing:

| | Card | Mini card |
|---|---|---|
| Light | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/printing.gif" alt="HP printing animation" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/printing-mini.gif" alt="HP mini card printing animation" width="400"> |
| Dark | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/printing-dark.gif" alt="HP printing animation dark" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/printing-mini-dark.gif" alt="HP mini card printing animation dark" width="400"> |

### <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/hp.svg" alt="" width="24"> HP

OfficeJet Pro 9010, set up with the HP Printer integration (and IPP for the paper alerts):

| | Card | Mini card |
|---|---|---|
| Light | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/card.png" alt="card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/mini-card.png" alt="mini card" width="400"> |
| Dark | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/card-dark.png" alt="card dark" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/mini-card-dark.png" alt="mini card dark" width="400"> |

Printer turned off: the picture turns grey and the card only says *Offline* with the last time it was seen:

| | Card | Mini card |
|---|---|---|
| Light | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/offline.png" alt="offline" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/mini-offline.png" alt="mini card offline" width="400"> |
| Dark | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/offline-dark.png" alt="offline dark" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/mini-offline-dark.png" alt="mini card offline dark" width="400"> |

Mini card zoomed in with its detail button (top right, click it again or anywhere outside the card to go back):

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/mini-zoom.png" alt="mini card full view" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/mini-zoom-dark.png" alt="mini card full view dark" width="400"> |

Scanning with [HP Printer (ha-hp)](https://github.com/juju35/ha-hp): source, format, resolution and color mode, **Scan** / **Add a page**, then the last scan with its **Download** link:

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/scan.png" alt="scan section" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/scan-dark.png" alt="scan section dark" width="400"> |

While it scans, the buttons wait and the Scan button turns to a spinner; an error from the integration (feeder empty, scanner busy…) shows in the section:

| | Scanning | Error |
|---|---|---|
| Light | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/scan-busy.gif" alt="scan in progress" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/scan-error.png" alt="scan error" width="400"> |
| Dark | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/scan-busy-dark.gif" alt="scan in progress dark" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/scan-error-dark.png" alt="scan error dark" width="400"> |

Drawn HP ranges:

<p align="center"><img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/models-hp.svg" alt="HP printer pictures" width="680"></p>

### <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/brother.svg" alt="" height="16"> Brother

HL-L2350DW laser printer, set up with the IPP integration:

| | Card | Mini card |
|---|---|---|
| Light | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/ipp.png" alt="brother card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/mini-ipp.png" alt="brother mini card" width="400"> |
| Dark | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/ipp-dark.png" alt="brother card dark" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/mini-ipp-dark.png" alt="brother mini card dark" width="400"> |

Drawn Brother ranges:

<p align="center"><img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/models-brother.svg" alt="Brother printer pictures" width="340"></p>

The laser printer printing:

| | Card | Mini card |
|---|---|---|
| Light | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/brother-printing.gif" alt="brother printing animation" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/brother-printing-mini.gif" alt="brother mini card printing animation" width="400"> |
| Dark | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/brother-printing-dark.gif" alt="brother printing animation dark" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/brother-printing-mini-dark.gif" alt="brother mini card printing animation dark" width="400"> |

### <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/epson.svg" alt="" height="16"> Epson

EcoTank ET-2850 ink tank printer, set up with the IPP integration:

| | Card | Mini card |
|---|---|---|
| Light | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/epson.png" alt="epson card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/mini-epson.png" alt="epson mini card" width="400"> |
| Dark | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/epson-dark.png" alt="epson card dark" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/mini-epson-dark.png" alt="epson mini card dark" width="400"> |

Drawn Epson ranges:

<p align="center"><img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/models-epson.svg" alt="Epson printer pictures" width="340"></p>

The EcoTank printing:

| | Card | Mini card |
|---|---|---|
| Light | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/epson-printing.gif" alt="epson printing animation" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/epson-printing-mini.gif" alt="epson mini card printing animation" width="400"> |
| Dark | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/epson-printing-dark.gif" alt="epson printing animation dark" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/epson-printing-mini-dark.gif" alt="epson mini card printing animation dark" width="400"> |

### <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/canon.svg" alt="" height="16"> Canon

PIXMA G650 MegaTank printer, set up with the IPP integration:

| | Card | Mini card |
|---|---|---|
| Light | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/canon.png" alt="canon card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/mini-canon.png" alt="canon mini card" width="400"> |
| Dark | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/canon-dark.png" alt="canon card dark" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/mini-canon-dark.png" alt="canon mini card dark" width="400"> |

Drawn Canon ranges:

<p align="center"><img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/images/models-canon.svg" alt="Canon printer pictures" width="510"></p>

The MegaTank printing:

| | Card | Mini card |
|---|---|---|
| Light | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/canon-printing.gif" alt="canon printing animation" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/canon-printing-mini.gif" alt="canon mini card printing animation" width="400"> |
| Dark | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/canon-printing-dark.gif" alt="canon printing animation dark" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-printer-card/main/screenshots/canon-printing-mini-dark.gif" alt="canon mini card printing animation dark" width="400"> |

## How it works

The HP Printer integration creates one device per part of the printer (each cartridge, the printhead, the print, scan and copy counters) linked to the main device. The card reads the entity registry to list them, then for each cartridge finds its level, slot, status and warranty date. The printer is shown as **offline** when its status sensor reports `off` (that's what the integration does when the printer stops answering) or is unavailable.

With the Brother integration, the card reads its *Printer status* sensor, and its *Status* text for the errors (paper jam, no paper, cover open, toner empty, "unable to print"…): the printer is then shown as stopped with that text as an alert. Its toner or ink levels are the cartridges, and the remaining life of the drum, belt unit, fuser and paper feed kits fills the *Parts* section.

With the IPP integration only (any brand), the card reads the printer sensor of the IPP device for the status and the `printer-state-reasons` alerts, and its marker sensors for the ink or toner levels. The ePrint chip is only shown for HP printers.

Set `image` to use a photo of your own model (the lit control panel is only drawn on the bundled drawings).

## Development

```bash
npm install
npm run build        # stamps the version of package.json into dist/printer-card.js
npm run check        # builds and checks the card (run in CI)
npm run screenshots  # renders the cards with mock HP, Brother, Epson and Canon printers into screenshots/ (and the printing GIFs in light and dark, needs ffmpeg)
npm run models       # renders the drawings by brand into images/models-<brand>.svg
```

`dist/` is not committed: `npm run build` creates it locally, CI builds it on every push, and the release workflow attaches the built file to the release, which is where the Marketplace installs it from.

### Releasing

1. Bump `version` in `package.json`
2. Add a `## <version>` section at the top of [CHANGELOG.md](https://github.com/juju35/ha-printer-card/blob/main/CHANGELOG.md)
3. Push to `main`: the **Release** workflow builds the card, creates the tag and the GitHub release with the changelog section as notes, and attaches `printer-card.js`

## Translations

The card auto-detects the language from your Home Assistant settings. Currently supported:

| Language | Code |
|---|---|
| English | `en` |
| Français | `fr` |
| Deutsch | `de` |
| Español | `es` |
| Српски | `sr` |
| Srpski (latinica) | `sr-Latn` |
| Italiano | `it` |
| Nederlands | `nl` |
| Português (Portugal) | `pt` |
| Polski | `pl` |
| Română | `ro` |
| Dansk | `da` |
| Svenska | `sv` |
| Български | `bg` |
| Русский | `ru` |
| Українська | `uk` |
| Magyar | `hu` |
| Slovenčina | `sk` |
| Čeština | `cs` |
| Slovenščina | `sl` |
| Latviešu | `lv` |
| Ελληνικά | `el` |

Contributions for additional languages are welcome!

## License

[MIT](https://github.com/juju35/ha-printer-card/blob/main/LICENSE)

## Support

If you find this project useful, you can support its development:

<a href="https://buymeacoffee.com/julienstep9"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" height="50"></a>
