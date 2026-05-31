# TÜV Card

Dynamic TÜV/HU sticker card for Home Assistant.

This Lovelace card displays vehicle inspection stickers for the TÜV Reminder integration.

## Features

- Dynamic TÜV/HU sticker rendering without image assets
- Year-based TÜV color cycle
- Month-based sticker rotation
- Supports single vehicle cards
- Supports multiple vehicle cards
- Supports layout options:
  - `auto`
  - `horizontal`
  - `vertical`
- Supports sorting options:
  - `config`
  - `name`
  - `plate`
  - `due_date`
  - `status`
- Visual editor support
- Entity chip selection in the visual editor
- Confirmation overlay for due or expired inspections
- Calls the `tuev_reminder.confirm_passed` service

## Installation

### Manual installation

Copy the card file to your Home Assistant `www` directory:

```text
/config/www/community/tuev-card/tuev-card.js
```

Then add the resource in Home Assistant:

```text
Settings → Dashboards → Resources
```

Resource URL:

```text
/local/community/tuev-card/tuev-card.js
```

Resource type:

```text
JavaScript module
```

## Usage

### Single vehicle

```yaml
type: custom:tuev-card
entity: sensor.your_vehicle_tuv
```

### Multiple vehicles

```yaml
type: custom:tuev-card
layout: horizontal
sort: due_date
entities:
  - sensor.vehicle_1_tuv
  - sensor.vehicle_2_tuv
```

## Options

### `entity`

Single TÜV Reminder sensor entity.

```yaml
entity: sensor.your_vehicle_tuv
```

### `entities`

List of TÜV Reminder sensor entities.

```yaml
entities:
  - sensor.vehicle_1_tuv
  - sensor.vehicle_2_tuv
```

### `layout`

Controls how multiple vehicles are displayed.

Possible values:

```text
auto
horizontal
vertical
```

Default:

```text
auto
```

### `sort`

Controls the order of multiple vehicles.

Possible values:

```text
config
name
plate
due_date
status
```

Default:

```text
config
```

## Example

```yaml
type: custom:tuev-card
layout: horizontal
sort: status
entities:
  - sensor.focus_rs_tuv
  - sensor.trailer_tuv
```

## Related project

This card is designed to be used together with the TÜV Reminder Home Assistant integration.

## Notes

This project is currently in early testing.

Use at your own risk and verify inspection dates manually.

---

## Deutsch

TÜV Card ist eine Lovelace Card für Home Assistant zur Anzeige dynamischer TÜV-/HU-Plaketten.

Die Card ist für die Verwendung mit der separaten TÜV Reminder Integration vorgesehen.

## Funktionen

- Dynamische TÜV-/HU-Plakette ohne Bild-Assets
- Farblogik abhängig vom Plakettenjahr
- Drehung abhängig vom Fälligkeitsmonat
- Unterstützung für einzelne Fahrzeuge
- Unterstützung für mehrere Fahrzeuge
- Layout-Optionen:
  - `auto`
  - `horizontal`
  - `vertical`
- Sortieroptionen:
  - `config`
  - `name`
  - `plate`
  - `due_date`
  - `status`
- Visueller Editor
- Fahrzeugauswahl per Chips im visuellen Editor
- Overlay bei fälliger oder abgelaufener HU
- Ruft den Service `tuev_reminder.confirm_passed` auf

## Manuelle Installation

Kopiere die Datei nach:

```text
/config/www/community/tuev-card/tuev-card.js
```

Füge anschließend in Home Assistant eine Ressource hinzu:

```text
Einstellungen → Dashboards → Ressourcen
```

Ressourcen-URL:

```text
/local/community/tuev-card/tuev-card.js
```

Ressourcen-Typ:

```text
JavaScript-Modul
```

## Verwendung

### Einzelnes Fahrzeug

```yaml
type: custom:tuev-card
entity: sensor.dein_fahrzeug_tuv
```

### Mehrere Fahrzeuge

```yaml
type: custom:tuev-card
layout: horizontal
sort: due_date
entities:
  - sensor.fahrzeug_1_tuv
  - sensor.fahrzeug_2_tuv
```

## Optionen

### `entity`

Ein einzelner TÜV-Reminder-Sensor.

### `entities`

Eine Liste mehrerer TÜV-Reminder-Sensoren.

### `layout`

Legt fest, wie mehrere Fahrzeuge angezeigt werden.

Mögliche Werte:

```text
auto
horizontal
vertical
```

### `sort`

Legt die Sortierung mehrerer Fahrzeuge fest.

Mögliche Werte:

```text
config
name
plate
due_date
status
```

## Hinweis

Dieses Projekt befindet sich aktuell in einer frühen Testphase.

Bitte HU-/TÜV-Termine weiterhin manuell prüfen.