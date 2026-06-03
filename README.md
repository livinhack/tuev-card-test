# TÜV Card

A Home Assistant Lovelace card for displaying TÜV / HU inspection reminders with rendered inspection stickers.

The card is designed to be used with the **TÜV Reminder** integration.

---

## Features

- Display one or multiple vehicles
- Show TÜV / HU inspection stickers
- Optional graphical license plate display
- Optional EuroPlate font support
- Automatic or fixed column layout
- Sorting by vehicle name, license plate, due date, or status
- Optional details below the sticker
- Adjustable sticker size
- Visual editor support
- Home Assistant card picker support

---

## Installation

### HACS

Install the card through HACS.

If the Lovelace resource is not added automatically, add it manually:

```yaml
url: /hacsfiles/tuev-card-test/tuev-card.js
type: module
```

### Manual installation

Copy the complete card folder to:

```text
/config/www/community/tuev-card/
```

The folder must contain:

```text
tuev-card.js
src/
```

Then add this Lovelace resource:

```yaml
url: /local/community/tuev-card/tuev-card.js
type: module
```

After adding or changing the resource, reload the browser or restart Home Assistant if necessary.

---

## Optional EuroPlate font

The card can optionally use `EuroPlate.ttf` for the graphical license plate display.

Place the font file here:

```text
/config/www/EuroPlate.ttf
```

It will be available in Home Assistant as:

```text
/local/EuroPlate.ttf
```

If the font is not available, the card automatically uses a system font instead.

Do not redistribute `EuroPlate.ttf` unless its license explicitly allows it.

---

## Adding the card

After installation, open your dashboard and add a new card.

Choose:

```text
TÜV Reminder
```

from the card picker.

If the card does not appear in the picker, you can add it manually with YAML:

```yaml
type: custom:tuev-card
entity: sensor.your_vehicle_tuv
```

---

## Basic examples

### Single vehicle

```yaml
type: custom:tuev-card
entity: sensor.focus_rs_tuv
```

### Multiple vehicles

```yaml
type: custom:tuev-card
entities:
  - sensor.focus_rs_tuv
  - sensor.focus_st_tuv
  - sensor.mondeo_tuv
```

### Multiple vehicles with graphical license plates

```yaml
type: custom:tuev-card
columns: auto
sort: name
plate_style: plate
show_details: true
entities:
  - sensor.focus_rs_tuv
  - sensor.focus_st_tuv
  - sensor.mondeo_tuv
```

---

## Visual editor options

The card can be configured through the Home Assistant visual editor.

Available options:

- TÜV entities
- Columns
- Sorting
- Show details
- Render license plate graphically
- Sticker size

---

## YAML options

| Option | Default | Description |
| --- | --- | --- |
| `entity` | optional | A single TÜV Reminder sensor |
| `entities` | optional | A list of TÜV Reminder sensors |
| `columns` | `auto` | Number of columns: `auto`, `1`, `2`, `3`, or `4` |
| `sort` | `name` | Sorting: `name`, `plate`, `due_date`, or `status` |
| `show_details` | `true` | Shows next inspection date and status |
| `plate_style` | `text` | Use `plate` to render graphical license plates |
| `badge_size` | automatic | Manual sticker size in pixels |

---

## Columns

The `columns` option controls how multiple vehicles are displayed.

```yaml
columns: auto
```

Available values:

```yaml
columns: auto
columns: 1
columns: 2
columns: 3
columns: 4
```

For a single vehicle, the card always uses one column.

---

## Sorting

Available sorting options:

```yaml
sort: name
sort: plate
sort: due_date
sort: status
```

`status` sorts expired vehicles first, then due vehicles, then valid vehicles.

---

## Graphical license plates

To show license plates as graphical plates:

```yaml
plate_style: plate
```

To show license plates as plain text:

```yaml
plate_style: text
```

If `EuroPlate.ttf` is available, it is used automatically. Otherwise the card uses a system font.

---

## Sticker size

By default, the card automatically chooses a suitable sticker size.

You can manually set the sticker size:

```yaml
badge_size: 220
```

Remove `badge_size` to return to automatic sizing.

The visual editor provides a slider and reset button for this option.

---

## Required integration

This card expects sensor entities created by the **TÜV Reminder** integration.

The required data, such as vehicle name, license plate, inspection month, inspection year, and status, is provided by that integration.

---

## License

This project is licensed under the **GNU Affero General Public License v3.0 or later**.

The license applies to the card source code only.

`EuroPlate.ttf` is not included in this project and is not covered by this license. Do not redistribute font files unless their license explicitly allows it.

SPDX-License-Identifier: `AGPL-3.0-or-later`

---

# TÜV Card

Eine Home-Assistant-Lovelace-Karte zur Anzeige von TÜV-/HU-Erinnerungen mit gerenderten Prüfplaketten.

Die Karte ist für die Verwendung mit der **TÜV Reminder**-Integration gedacht.

---

## Funktionen

- Anzeige eines oder mehrerer Fahrzeuge
- Anzeige von TÜV-/HU-Prüfplaketten
- Optionale grafische Kennzeichendarstellung
- Optionale Unterstützung für `EuroPlate.ttf`
- Automatisches oder festes Spaltenlayout
- Sortierung nach Fahrzeugname, Kennzeichen, HU-Fälligkeit oder Status
- Optionaler Detailbereich unter der Plakette
- Einstellbare Plakettengröße
- Unterstützung des visuellen Editors
- Unterstützung der Home-Assistant-Kartenauswahl

---

## Installation

### HACS

Installiere die Karte über HACS.

Falls die Lovelace-Ressource nicht automatisch hinzugefügt wurde, füge sie manuell hinzu:

```yaml
url: /hacsfiles/tuev-card-test/tuev-card.js
type: module
```

### Manuelle Installation

Kopiere den vollständigen Kartenordner nach:

```text
/config/www/community/tuev-card/
```

Der Ordner muss enthalten:

```text
tuev-card.js
src/
```

Füge danach diese Lovelace-Ressource hinzu:

```yaml
url: /local/community/tuev-card/tuev-card.js
type: module
```

Nach dem Hinzufügen oder Ändern der Ressource den Browser neu laden oder Home Assistant bei Bedarf neu starten.

---

## Optionale EuroPlate-Schrift

Die Karte kann optional `EuroPlate.ttf` für die grafische Kennzeichendarstellung verwenden.

Lege die Schriftdatei hier ab:

```text
/config/www/EuroPlate.ttf
```

Sie ist dann in Home Assistant erreichbar unter:

```text
/local/EuroPlate.ttf
```

Wenn die Schrift nicht vorhanden ist, verwendet die Karte automatisch eine Systemschrift.

`EuroPlate.ttf` darf nur weitergegeben werden, wenn die Lizenz der Schrift dies ausdrücklich erlaubt.

---

## Karte hinzufügen

Öffne nach der Installation dein Dashboard und füge eine neue Karte hinzu.

Wähle:

```text
TÜV Reminder
```

aus der Kartenauswahl.

Falls die Karte nicht in der Auswahl erscheint, kannst du sie manuell per YAML hinzufügen:

```yaml
type: custom:tuev-card
entity: sensor.dein_fahrzeug_tuv
```

---

## Grundbeispiele

### Einzelnes Fahrzeug

```yaml
type: custom:tuev-card
entity: sensor.focus_rs_tuv
```

### Mehrere Fahrzeuge

```yaml
type: custom:tuev-card
entities:
  - sensor.focus_rs_tuv
  - sensor.focus_st_tuv
  - sensor.mondeo_tuv
```

### Mehrere Fahrzeuge mit grafischen Kennzeichen

```yaml
type: custom:tuev-card
columns: auto
sort: name
plate_style: plate
show_details: true
entities:
  - sensor.focus_rs_tuv
  - sensor.focus_st_tuv
  - sensor.mondeo_tuv
```

---

## Optionen im visuellen Editor

Die Karte kann über den visuellen Home-Assistant-Editor eingerichtet werden.

Verfügbare Optionen:

- TÜV-Entitäten
- Spalten
- Sortierung
- Details anzeigen
- Kennzeichen grafisch darstellen
- Plakettengröße

---

## YAML-Optionen

| Option | Standard | Beschreibung |
| --- | --- | --- |
| `entity` | optional | Einzelner TÜV-Reminder-Sensor |
| `entities` | optional | Liste mehrerer TÜV-Reminder-Sensoren |
| `columns` | `auto` | Anzahl der Spalten: `auto`, `1`, `2`, `3` oder `4` |
| `sort` | `name` | Sortierung: `name`, `plate`, `due_date` oder `status` |
| `show_details` | `true` | Zeigt nächste HU und Status an |
| `plate_style` | `text` | Mit `plate` werden Kennzeichen grafisch dargestellt |
| `badge_size` | automatisch | Manuelle Plakettengröße in Pixeln |

---

## Spalten

Die Option `columns` steuert die Darstellung bei mehreren Fahrzeugen.

```yaml
columns: auto
```

Verfügbare Werte:

```yaml
columns: auto
columns: 1
columns: 2
columns: 3
columns: 4
```

Bei einem einzelnen Fahrzeug verwendet die Karte immer eine Spalte.

---

## Sortierung

Verfügbare Sortierungen:

```yaml
sort: name
sort: plate
sort: due_date
sort: status
```

`status` sortiert abgelaufene Fahrzeuge zuerst, danach fällige Fahrzeuge und danach gültige Fahrzeuge.

---

## Grafische Kennzeichen

Um Kennzeichen grafisch darzustellen:

```yaml
plate_style: plate
```

Um Kennzeichen als normalen Text anzuzeigen:

```yaml
plate_style: text
```

Wenn `EuroPlate.ttf` vorhanden ist, wird sie automatisch verwendet. Andernfalls nutzt die Karte eine Systemschrift.

---

## Plakettengröße

Standardmäßig wählt die Karte automatisch eine passende Plakettengröße.

Du kannst die Plakettengröße manuell setzen:

```yaml
badge_size: 220
```

Entferne `badge_size`, um zur automatischen Größenwahl zurückzukehren.

Im visuellen Editor gibt es dafür einen Schieberegler und einen Zurücksetzen-Button.

---

## Benötigte Integration

Diese Karte erwartet Sensor-Entitäten der **TÜV Reminder**-Integration.

Die benötigten Daten wie Fahrzeugname, Kennzeichen, HU-Monat, HU-Jahr und Status werden von dieser Integration bereitgestellt.

---

## Lizenz

Dieses Projekt steht unter der **GNU Affero General Public License v3.0 or later**.

Die Lizenz gilt nur für den Quellcode der Karte.

`EuroPlate.ttf` ist nicht Teil dieses Projekts und nicht von dieser Lizenz umfasst. Font-Dateien dürfen nur weiterverbreitet werden, wenn ihre Lizenz dies ausdrücklich erlaubt.

SPDX-License-Identifier: `AGPL-3.0-or-later`
