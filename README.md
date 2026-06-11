# TÜV Card

## English

Home Assistant Lovelace card for vehicles tracked by the **TÜV Reminder** integration.

The card displays one or more vehicles with TÜV/HU badge, next inspection date, status, optional graphical German-style license plates, sorting, and optional groups.

---

### Features

- Display one or multiple TÜV Reminder vehicles
- TÜV/HU badge rendering without external badge fonts
- Optional graphical license plates
- Optional `EuroPlate.ttf` support
- Visual editor with localized UI
- Column limit: `auto`, `1`, `2`, `3`, or `4`
- Sorting by name, plate, due date, or status
- Optional vehicle groups with individual colors and sorting
- Floating editor panels for display options, group colors, and manual-sort confirmation

---

### Requirements

- Home Assistant
- TÜV Reminder sensor entities
- HACS or manual Lovelace resource setup
- Optional: `EuroPlate.ttf` for graphical license plates

---

### Installation

#### HACS

Install the card through HACS.

If the Lovelace resource is not added automatically, add:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js
type: module
```

#### Manual installation

Copy the complete card folder to:

```text
/config/www/community/tuev-card/
```

For normal local testing, use the generated bundle:

```text
tuev-card.js
```

For source-level modular debugging, copy `src/` as well and use `src/tuev-card-entry.js` as the resource.

Add the Lovelace resource:

```yaml
url: /local/community/tuev-card/tuev-card.js
type: module
```

For release/HACS installs, the same root bundle is used:

```text
tuev-card.js
```

After changing frontend files, reload the dashboard and clear the browser cache if needed.

---

### Add the card

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
show_badge: true
show_details: true
entities:
  - sensor.focus_rs_tuv
  - sensor.focus_st_tuv
  - sensor.mondeo_tuv
```

Grouped vehicles:

```yaml
type: custom:tuev-card
columns: auto
groups:
  - title: Private
    color: "#42a5f5"
    entities:
      - sensor.focus_rs_tuv
      - sensor.mondeo_tuv
  - title: Company
    color: "#66bb6a"
    entities:
      - sensor.transit_tuv
entities:
  - sensor.unassigned_trailer_tuv
```

---

### Visual editor

The visual editor supports:

- selecting TÜV entities
- adding all new TÜV vehicles at once
- column limit
- sorting for ungrouped vehicles and groups
- showing or hiding details
- graphical license plates when available
- optional vehicle groups with freely named headings
- group colors
- manual group ordering

The native Home Assistant editor preview may be narrower than the final dashboard card. Manual `4` and `auto` are therefore shown conservatively in the editor preview. The final dashboard uses the real available card width.

---

### Options

| Option | Default | Description |
| --- | --- | --- |
| `entity` | optional | Single TÜV Reminder sensor |
| `entities` | optional | List of ungrouped TÜV Reminder sensors |
| `groups` | optional | Vehicle groups with title, entity list, optional color, and optional sorting |
| `columns` | `auto` | `auto`, `1`, `2`, `3`, or `4`; treated as a maximum/limit |
| `sort` | `name` | Ungrouped sorting: `name`, `plate`, `due_date`, or `status` |
| `sort_direction` | `asc` | Ungrouped sort direction: `asc` or `desc` |
| `show_badge` | `true` | Show the TÜV sticker. Set to `false` for a more compact card while keeping status/details visible. |
| `show_details` | `true` | Show next HU and status |
| `plate_style` | `text` | `text` or `plate` |

Optional groups can be used to divide one card into sections such as `Private`, `Company`, `Cars`, `Motorcycles`, or `Trailers`. Each group can optionally define a `color`, `sort`, and `sort_direction`. Vehicles without a group remain in the ungrouped section.

`columns: auto` uses as many readable columns as fit. Manual values `1` to `4` act as maximums and may be reduced automatically if the available width is too small.

---

### Graphical license plates

Graphical license plates can use a user-provided `EuroPlate.ttf`.

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

`EuroPlate.ttf` is not included. Users must provide their own file and are responsible for complying with that font's license.

---

### TÜV badge rendering

The TÜV badge does not need external fonts. Month digits and the center year are rendered from bundled SVG digit path data in:

```text
src/badge/digits.js
```

This keeps badge rendering consistent across browsers and Home Assistant frontends.

---

### Project structure

```text
src/badge/          TÜV badge rendering
src/plate/          Graphical license plate rendering and EuroPlate loading
src/card/           Card config, entity, layout, group, and render helpers
src/editor/         Visual editor, editor styles, buttons, and floating panels
src/translations/   Card/editor translations
```

HACS uses the generated root bundle:

```text
tuev-card.js
```

To rebuild the HACS bundle locally, either double-click:

```text
build-tuev-card.bat
```

or run manually from the project root:

```bash
npm.cmd install
npm.cmd run build
npm.cmd run check
```

Commit the generated file together with source changes before updating through HACS.

---

### Troubleshooting

If the card does not appear, check the Lovelace resource URL and clear the browser cache.

If no vehicles appear, check that your TÜV Reminder sensors provide the expected vehicle attributes such as month, year, plate, and status.

If graphical license plates are not available, check that `/local/EuroPlate.ttf` can be opened in the browser.

---

### License

The card source code is licensed under **AGPL-3.0-or-later**.

Additional artwork/data notices are documented in:

```text
NOTICE.md
LICENSES/
```

`EuroPlate.ttf` is not included. Users must provide their own file and are responsible for complying with that font's license.

---

## Deutsch

Home-Assistant-Lovelace-Card für Fahrzeuge aus der **TÜV Reminder** Integration.

Die Card zeigt ein oder mehrere Fahrzeuge mit TÜV/HU-Plakette, nächstem Prüftermin, Status, optional grafischem deutschem Kennzeichen, Sortierung und optionalen Gruppen.

---

### Funktionen

- Anzeige von einem oder mehreren TÜV Reminder Fahrzeugen
- TÜV/HU-Plaketten-Rendering ohne externe Plaketten-Schriftarten
- Optionale grafische Kennzeichen
- Optionale Unterstützung für `EuroPlate.ttf`
- Visueller Editor mit lokalisierter Oberfläche
- Spaltenbegrenzung: `auto`, `1`, `2`, `3` oder `4`
- Sortierung nach Name, Kennzeichen, HU-Datum oder Status
- Optionale Fahrzeuggruppen mit eigenen Farben und eigener Sortierung
- Schwebende Editor-Menüs für Darstellung, Gruppenfarben und Bestätigung beim Verwerfen manueller Sortierung

---

### Voraussetzungen

- Home Assistant
- TÜV Reminder Sensor-Entitäten
- HACS oder manuell eingerichtete Lovelace-Ressource
- Optional: `EuroPlate.ttf` für grafische Kennzeichen

---

### Installation

#### HACS

Installiere die Card über HACS.

Falls die Lovelace-Ressource nicht automatisch hinzugefügt wird, füge sie manuell hinzu:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js
type: module
```

#### Manuelle Installation

Kopiere den vollständigen Card-Ordner nach:

```text
/config/www/community/tuev-card/
```

Für normale lokale Tests reicht das erzeugte Bundle:

```text
tuev-card.js
```

Für modulare Quelltext-Tests zusätzlich `src/` kopieren und `src/tuev-card-entry.js` als Ressource verwenden.

Füge die Lovelace-Ressource hinzu:

```yaml
url: /local/community/tuev-card/tuev-card.js
type: module
```

Für Release-/HACS-Installationen wird dieselbe Bundle-Datei im Root verwendet:

```text
tuev-card.js
```

Nach Änderungen an Frontend-Dateien das Dashboard neu laden und bei Bedarf den Browser-Cache leeren.

---

### Card hinzufügen

Im Home-Assistant-Kartenpicker auswählen:

```text
TÜV Reminder
```

Oder manuell hinzufügen:

```yaml
type: custom:tuev-card
entity: sensor.your_vehicle_tuv
```

Mehrere Fahrzeuge:

```yaml
type: custom:tuev-card
columns: auto
sort: name
show_badge: true
show_details: true
entities:
  - sensor.focus_rs_tuv
  - sensor.focus_st_tuv
  - sensor.mondeo_tuv
```

Gruppierte Fahrzeuge:

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
    color: "#66bb6a"
    entities:
      - sensor.transit_tuv
entities:
  - sensor.unassigned_trailer_tuv
```

---

### Visueller Editor

Der visuelle Editor unterstützt:

- Auswahl von TÜV-Entitäten
- einmaliges Hinzufügen aller neuen TÜV-Fahrzeuge
- Spaltenbegrenzung
- Sortierung für ungruppierte Fahrzeuge und Gruppen
- Ein-/Ausblenden von Details
- grafische Kennzeichen, wenn verfügbar
- optionale Fahrzeuggruppen mit frei benennbaren Überschriften
- Gruppenfarben
- manuelle Gruppensortierung

Die native Home-Assistant-Editor-Vorschau kann schmaler sein als die endgültige Dashboard-Card. Manuell `4` und `auto` werden in der Editor-Vorschau deshalb konservativ dargestellt. Im Dashboard nutzt die Card die tatsächlich verfügbare Breite.

---

### Optionen

| Option | Standard | Beschreibung |
| --- | --- | --- |
| `entity` | optional | Einzelner TÜV Reminder Sensor |
| `entities` | optional | Liste ungruppierter TÜV Reminder Sensoren |
| `groups` | optional | Fahrzeuggruppen mit Titel, Entitätenliste, optionaler Farbe und optionaler Sortierung |
| `columns` | `auto` | `auto`, `1`, `2`, `3` oder `4`; wird als Maximum/Begrenzung behandelt |
| `sort` | `name` | Sortierung ungruppierter Fahrzeuge: `name`, `plate`, `due_date` oder `status` |
| `sort_direction` | `asc` | Sortierrichtung ungruppierter Fahrzeuge: `asc` oder `desc` |
| `show_badge` | `true` | TÜV-Plakette anzeigen. Mit `false` wird die Card kompakter, Status/Details bleiben sichtbar. |
| `show_details` | `true` | Nächste HU und Status anzeigen |
| `plate_style` | `text` | `text` oder `plate` |

Optionale Gruppen können verwendet werden, um eine Card in Bereiche wie `Privat`, `Firma`, `Autos`, `Motorräder` oder `Anhänger` zu unterteilen. Jede Gruppe kann optional `color`, `sort` und `sort_direction` definieren. Fahrzeuge ohne Gruppe bleiben im ungruppierten Bereich.

`columns: auto` nutzt so viele lesbare Spalten, wie in die verfügbare Breite passen. Manuelle Werte von `1` bis `4` wirken als Maximum und können automatisch reduziert werden, wenn die verfügbare Breite zu klein ist.

---

### Grafische Kennzeichen

Grafische Kennzeichen können eine vom Nutzer bereitgestellte `EuroPlate.ttf` verwenden.

Lege die Datei hier ab:

```text
/config/www/EuroPlate.ttf
```

Home Assistant stellt sie dann bereit unter:

```text
/local/EuroPlate.ttf
```

Danach grafische Kennzeichen aktivieren:

```yaml
plate_style: plate
```

Wenn die Schrift fehlt, blendet der visuelle Editor die Option für grafische Kennzeichen aus und die Card fällt auf reine Textkennzeichen zurück.

`EuroPlate.ttf` ist nicht enthalten. Nutzer müssen die Datei selbst bereitstellen und sind selbst für die Einhaltung der jeweiligen Schriftlizenz verantwortlich.

---

### TÜV-Plaketten-Rendering

Die TÜV-Plakette benötigt keine externen Schriftarten. Monatsziffern und die Jahreszahl in der Mitte werden aus gebündelten SVG-Ziffernpfaden gerendert in:

```text
src/badge/digits.js
```

Dadurch bleibt die Plakettendarstellung über Browser und Home-Assistant-Frontends hinweg konsistenter.

---

### Projektstruktur

```text
src/badge/          TÜV-Plaketten-Rendering
src/plate/          Grafisches Kennzeichen-Rendering und EuroPlate-Laden
src/card/           Card-Konfiguration, Entitäten, Layout, Gruppen und Render-Helfer
src/editor/         Visueller Editor, Editor-Styles, Buttons und Floating Panels
src/translations/   Card-/Editor-Übersetzungen
```

HACS verwendet die erzeugte Bundle-Datei im Root:

```text
tuev-card.js
```

Zum lokalen Neubauen des HACS-Bundles entweder doppelklicken:

```text
build-tuev-card.bat
```

oder im Projektverzeichnis ausführen:

```bash
npm.cmd install
npm.cmd run build
npm.cmd run check
```

Die erzeugte Datei sollte zusammen mit den Quelländerungen committed werden, bevor über HACS aktualisiert wird.

---

### Fehlerbehebung

Wenn die Card nicht erscheint, prüfe die Lovelace-Ressourcen-URL und leere den Browser-Cache.

Wenn keine Fahrzeuge angezeigt werden, prüfe, ob deine TÜV Reminder Sensoren die erwarteten Fahrzeugattribute wie Monat, Jahr, Kennzeichen und Status liefern.

Wenn grafische Kennzeichen nicht verfügbar sind, prüfe, ob `/local/EuroPlate.ttf` im Browser geöffnet werden kann.

---

### Lizenz

Der Quellcode der Card ist unter **AGPL-3.0-or-later** lizenziert.

Zusätzliche Hinweise zu Artwork/Daten stehen in:

```text
NOTICE.md
LICENSES/
```

`EuroPlate.ttf` ist nicht enthalten. Nutzer müssen eine eigene Datei bereitstellen und sind selbst für die Einhaltung der jeweiligen Schriftlizenz verantwortlich.
