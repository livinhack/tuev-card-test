# TÜV Card versioning and release preparation

Current checked version: `b55`.

The project has switched from internal `bXX` checkpoint labels to the first semantic test release `b55`.

## Current release version

```json
"version": "0.1.1-b55"
```

The generated root bundle should start with:

```text
TÜV Card bundled b55
```

The GitHub Release tag should be:

```text
b55
```

## HACS file naming

The HACS filename stays unchanged:

```json
{
  "filename": "tuev-card.js",
  "content_in_root": true
}
```

The dashboard resource should use the root bundle:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js?v=b55
type: module
```

## Release flow

1. Start from the confirmed release-candidate checkpoint.
2. Change the package version to `0.1.1-b55`.
3. Adjust the bundle release label to `b55`.
4. Run:

```bash
npm run build
npm run check
```

5. Commit and push with GitHub Desktop.
6. Create a GitHub Release with tag `b55`.
7. Let HACS discover the update, or use **Informationen aktualisieren** for a manual test.

## What should not change for b55

Do not rename the card type:

```yaml
type: custom:tuev-card
```

Do not reintroduce old file names:

```text
tuev-card-test.js
dist/tuev-card.js
```

Do not change the current EuroPlate rule for the first release:

```text
Graphical license plates require reachable EuroPlate.ttf.
No graphical system-font fallback.
```

## Deferred after b55

The following items are intentionally not part of the first release versioning switch:

- Plate Renderer v2 based on FZV Anlage 4.
- Bundled GL-Nummernschild fonts.
- Mittelschrift / Engschrift selection.
- Compact mode / hide TÜV badge.
- Group-specific display overrides.
- Optional side-by-side layout for small groups.
- README screenshots.
