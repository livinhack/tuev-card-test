# Responsive / Browser Test Checklist

Current checked version: `b57`.

This checklist is for validating the TÜV Card across Home Assistant views, browsers, and the Android companion app. It is intentionally a manual smoke-test document; it does not change card behavior.

## Test environments

- Firefox desktop
- Chrome desktop
- Home Assistant Android app
- Optional: mobile browser

## Home Assistant views

Test each environment in these dashboard contexts:

- Panel view
- Sections view
- Masonry / standard dashboard view
- Small tile/card container
- Wide card container

## Resource / HACS naming

The loaded resource should be:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js?v=b57
type: module
```

There should be no remaining resource reference to:

```text
tuev-card-test.js
dist/tuev-card.js
/hacsfiles/tuev-card-test/
```

The card type remains:

```yaml
type: custom:tuev-card
```

## Basic card rendering

- Card loads without `Custom element not found: tuev-card`.
- Vehicle name is visible.
- Status is visible and translated.
- TÜV badge renders.
- Due/expired state blur and confirmation overlay still work.
- No new console errors appear on first load.

## Layout / columns

For each view and browser/app:

- `Spaltenbegrenzung: 1` shows one column.
- `Spaltenbegrenzung: 2` can show two columns if enough width exists.
- `Spaltenbegrenzung: 3` does not overflow.
- `Spaltenbegrenzung: 4` does not overlap or create horizontal scrolling.
- `Ausfüllen` uses available width sensibly.
- After closing the editor, the card recalculates width without needing a dashboard reload.

## Editor

- Visual editor opens without errors.
- `Darstellung` floating panel opens below or above the button depending on available space.
- `Darstellung` does not cover `Code-Editor anzeigen` unnecessarily.
- Color picker opens near its group and stays within the visible editor area.
- `Manuelle Sortierung verwerfen?` aligns to the right edge of the group and does not create horizontal scrolling.
- Click inside display/color popovers keeps them open.
- Click outside closes display/color popovers.
- Confirm/cancel closes the manual-sort confirmation dialog.

## Groups

- Create a group.
- Rename a group.
- Change group color.
- Add vehicles to a group.
- Remove vehicles from a group.
- Delete a group.
- `Ungruppierte freigeben` behaves as expected.
- Group sorting works: name, plate, HU, status, manual.
- Manual drag/reorder still works.

## License plate rendering

Important decision: graphical plates are available only when `EuroPlate.ttf` is reachable. There is no graphical system-font fallback.

Test with `EuroPlate.ttf` present:

- `Kennzeichen grafisch darstellen` is available.
- Graphical plates render in card/editor.
- Example plates to check: `BIT GT 500`, `EU TE 333E`, `S AB 1234`, `DA CI 500`, `TR A 77`.

Test with `EuroPlate.ttf` missing/unreachable:

- Graphical plate option is not available.
- Card does not fall back to graphical system-font plate rendering.
- Text plate display still works.

## Browser-specific notes

Record differences here while testing:

### Firefox

- Notes:

### Chrome

- Notes:

### Android app

- Notes:

## Result

- [ ] Firefox passed
- [ ] Chrome passed
- [ ] Android app passed
- [ ] No horizontal scrolling introduced
- [ ] No new console errors
- [ ] Ready for next v0.1 checklist step
