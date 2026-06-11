# TÜV Card repo cleanup notes

Current checked version: `b47`.

This checkpoint is a repository cleanup before the first semantic `b47` release. It does not intentionally change UI behavior, editor behavior, card rendering, EuroPlate handling, grouping, sorting, or HACS naming.

## Verified release layout

The productive HACS bundle is generated into the repository root:

```text
tuev-card.js
```

The modular source entry remains here:

```text
src/tuev-card-entry.js
```

The HACS metadata points to the root bundle:

```json
{
  "filename": "tuev-card.js",
  "content_in_root": true
}
```

Expected Home Assistant resource path:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js?v=b47
type: module
```

## Files that should not return

```text
tuev-card-test.js
dist/tuev-card.js
dist/tuev-card-test.js
/hacsfiles/tuev-card-test/
```

These names were only part of the earlier test-repository phase or intermediate bundle layout.

## Build and check workflow

The package scripts are intentionally simple:

```bash
npm run build
npm run check
```

`npm run check` now uses a small Node script so it works consistently on Windows and Linux instead of relying on Unix shell tools.

The Windows helper:

```text
build-tuev-card.bat
```

now runs both build and syntax check before reporting success.

## License and font notes

For the current `v0.1` candidate path:

- Graphical plate rendering remains available only when `EuroPlate.ttf` is reachable.
- There is no graphical system-font fallback.
- GL-Nummernschild fonts are noted for a later Plate Renderer v2, not included in this cleanup.

## Deferred after v0.1

Keep larger changes after the first stable test release:

- Plate Renderer v2 based on FZV Anlage 4.
- Bundled GL-Nummernschild Mittel-/Engschrift fonts, after final license documentation.
- Compact mode / hiding the TÜV badge.
- Optional group-specific display overrides.
- Optional side-by-side group layout for small groups.
- Screenshot refresh shortly before broader public promotion.
