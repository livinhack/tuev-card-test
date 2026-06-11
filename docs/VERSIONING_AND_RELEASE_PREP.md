# TÜV Card versioning and v0.1.0 release preparation

Current checked version: `b42`.

This document prepares the switch from internal `bXX` test versions to the first semantic public release `v0.1.0`.
It is documentation only. `b42` does not change UI behavior, rendering logic, HACS naming, or editor behavior.

## Current internal versioning

During development, every generated ZIP gets a new internal version:

```text
b38
b39
b40
b42
...
```

The npm package version follows the same checkpoint style:

```json
"version": "0.1.0-b42"
```

The generated root bundle includes the same checkpoint label in its generated header:

```text
TÜV Card bundled v0.1.0-b42
```

Temporary GitHub Releases such as `b39` are acceptable for testing the HACS update trigger, but they are not intended as the final public release style.

## Final v0.1.0 switch

When the project is ready for the first real public release, switch from internal checkpoint labels to semantic release naming:

```text
v0.1.0
```

Recommended final release changes:

```text
package.json           -> "version": "0.1.0"
package-lock.json      -> "version": "0.1.0"
scripts/build-bundle.mjs -> release label adjusted for v0.1.0
GitHub Release tag     -> v0.1.0
GitHub Release title   -> v0.1.0
```

The HACS filename should stay unchanged:

```json
{
  "filename": "tuev-card.js",
  "content_in_root": true
}
```

The dashboard resource should stay unchanged except for its cache-buster:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js?v=0.1.0

type: module
```

## Suggested v0.1.0 release flow

1. Start from the latest confirmed `bXX` checkpoint.
2. Confirm `docs/V0_1_RELEASE_CANDIDATE.md` has no remaining must-fix blockers.
3. Change the package version from `0.1.0-bXX` to `0.1.0`.
4. Adjust the bundle release label from the internal `bXX` label to `v0.1.0` / `0.1.0`.
5. Run:

```bash
npm run build
npm run check
```

6. Commit and push with GitHub Desktop.
7. Create a GitHub Release with tag `v0.1.0`.
8. Let HACS discover the update, or use **Informationen aktualisieren** for a manual test.

## What should not change for v0.1.0

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

## Deferred after v0.1.0

The following items are intentionally not part of the first release versioning switch:

- Plate Renderer v2 based on FZV Anlage 4.
- Bundled GL-Nummernschild fonts.
- Mittelschrift / Engschrift selection.
- Compact mode / hide TÜV badge.
- Group-specific display overrides.
- Optional side-by-side layout for small groups.
- README screenshots.
