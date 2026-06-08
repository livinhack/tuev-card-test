# TÜV Card

Home Assistant Lovelace card for vehicles tracked by the **TÜV Reminder** integration.

The card shows one or more vehicles with TÜV/HU badge, next inspection date, status, and optionally a graphical German-style license plate.

---

## Requirements

- Home Assistant
- TÜV Reminder sensor entities
- HACS or manual Lovelace resource setup
- Optional: `EuroPlate.ttf` for graphical license plates

---

## Installation

### HACS

Install the card through HACS. If the resource is not added automatically, add:

```yaml
url: /hacsfiles/tuev-card-test/dist/tuev-card-test.js
type: module
```

### Manual installation

Copy the complete card folder to:

```text
/config/www/community/tuev-card/
```

Required files for manual modular development install:

```text
tuev-card.js
hacs.json
README.md
src/
```

For HACS/release installs the bundled file is used:

```text
dist/tuev-card-test.js
```

Add the Lovelace resource:

```yaml
url: /local/community/tuev-card/dist/tuev-card-test.js
type: module
```

Reload the dashboard after changing frontend files.

---

## Add the card

Use the Home Assistant card picker and select:

```text
TÜV Reminder
```

Or add it manually:

```yaml
type: custom:tuev-card
entity: sensor.your_vehicle_tuv
```

Multiple vehicles:

```yaml
type: custom:tuev-card
columns: auto
sort: name
show_details: true
entities:
  - sensor.focus_rs_tuv
  - sensor.focus_st_tuv
  - sensor.mondeo_tuv
```

---

### Grouped vehicles

Groups are optional. Existing cards without `groups` continue to work unchanged.

```yaml
type: custom:tuev-card
columns: auto
groups:
  - title: Privat
    color: "#42a5f5"
    entities:
      - sensor.focus_rs_tuv
      - sensor.mondeo_tuv
  - title: Firma
    entities:
      - sensor.transit_tuv
entities:
  - sensor.unassigned_trailer_tuv
```


## Visual editor

The visual editor supports:

- selecting TÜV entities
- adding all new TÜV vehicles at once
- column mode
- sorting
- showing or hiding details
- graphical license plates when `EuroPlate.ttf` is available
- optional vehicle groups with freely named section headings

The native Home Assistant preview may be narrower than the final dashboard card. Manual `4` and `auto` are therefore shown conservatively in the editor preview. The final dashboard always uses the real available card width.

---

## Options

| Option | Default | Description |
| --- | --- | --- |
| `entity` | optional | Single TÜV Reminder sensor |
| `entities` | optional | List of TÜV Reminder sensors |
| `groups` | optional | Freely named vehicle groups with their own entity lists, optional `color` and optional per-group sorting |
| `columns` | `auto` | `auto`, `1`, `2`, `3`, or `4` |
| `sort` | `name` | `name`, `plate`, `due_date`, or `status` |
| `show_details` | `true` | Show next HU and status |
| `plate_style` | `text` | `text` or `plate` |

Optional groups can be used to divide one card into headings such as `Privat`, `Firma`, `Autos`, `Motorräder`, or `Anhänger`. Each group can optionally define a `color` and its own sorting mode. The color is used for the editor accent and dashboard heading line. Vehicles without a group remain in the normal ungrouped section.

`columns: auto` uses as many readable columns as fit, capped at 16. Manual values `1` to `4` act as maximums and may be reduced automatically if the available width is too small.

---

## Graphical license plates

Graphical license plates require a user-provided `EuroPlate.ttf`.

Place the file here:

```text
/config/www/EuroPlate.ttf
```

Home Assistant serves it as:

```text
/local/EuroPlate.ttf
```

Then enable graphical plates:

```yaml
plate_style: plate
```

If the font is missing, the visual editor hides the graphical license plate option and the card falls back to plain text plates.

`EuroPlate.ttf` is not included and should only be redistributed if its own license allows it.

---

## TÜV badge rendering

The TÜV badge does not need external fonts. Month digits and the center year are rendered from bundled SVG digit path data in:

```text
src/badge/digits.js
```

This keeps the badge rendering consistent across browsers and Home Assistant frontends.

---

## Project structure

The development source is split into small frontend modules:

```text
src/badge/          TÜV badge rendering
src/plate/          Graphical license plate rendering and EuroPlate loading
src/card/           Card config, entity, layout and render helpers
src/editor/         Visual editor
src/translations/   Card/editor translations
```

HACS uses the generated bundled file:

```text
dist/tuev-card-test.js
```

To rebuild the HACS bundle locally, either double-click:

```text
build-tuev-card.bat
```

or run manually from the project root:

```bash
npm.cmd install
npm.cmd run build
```

The generated HACS file is:

```text
dist/tuev-card-test.js
```

Commit this generated file together with source changes before updating through HACS.

---

## Troubleshooting

If the card does not appear, check the Lovelace resource URL and clear the browser cache.

If no vehicles appear, check that your TÜV Reminder sensors provide the expected vehicle attributes such as month, year, plate, and status.

If graphical license plates are not available, check that `/local/EuroPlate.ttf` can be opened in the browser.

---

## License

The card source code is licensed under **AGPL-3.0-or-later**.

Additional artwork/data notices are documented in:

```text
NOTICE.md
LICENSES/
```

`EuroPlate.ttf` is not included. Users must provide their own file and are responsible for complying with that font's license.
