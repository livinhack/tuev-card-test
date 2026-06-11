# TÜV Card release check

Current checked version: `v0.1.0`.

## v0.1.0 release note

`v0.1.0` is the first semantic test release. It is based on the confirmed release-candidate and repository-cleanup checkpoints and should not introduce new runtime behavior compared with the tested candidate state.

This release keeps the current EuroPlate rule unchanged:

- Graphical plates are only available when `EuroPlate.ttf` is reachable.
- No graphical system-font fallback is used.

## Local test install

Copy these files/folders into the local test resource folder, for example `/config/www/community/tuev-card/`:

```text
tuev-card.js
```

For source-level modular debugging, copy `src/` as well and point the resource to `src/tuev-card-entry.js`.

Reload the Lovelace resource with a fresh cache-buster, for example:

```text
/local/community/tuev-card/tuev-card.js?v=v0.1.0
```

## HACS release install

The current repository configuration uses the generated root bundle:

```text
tuev-card.js
```

Important files for a HACS release package:

```text
tuev-card.js
hacs.json
README.md
LICENSE
NOTICE.md
package.json
package-lock.json
scripts/build-bundle.mjs
src/
```

## Versioning

The package version for this release is:

```json
"version": "0.1.0"
```

The GitHub Release tag should be:

```text
v0.1.0
```

See `docs/VERSIONING_AND_RELEASE_PREP.md` and `docs/HACS_RELEASE_FLOW.md` for the release/update trigger checklist.

## Build/check commands

```bash
npm run build
npm run check
```

Equivalent explicit commands:

```bash
node scripts/build-bundle.mjs
node scripts/check-js.mjs
```

## Post naming migration checks

Verify that HACS and Home Assistant load the production file directly from the repository root:

```text
/config/www/community/tuev-card/tuev-card.js
/hacsfiles/tuev-card/tuev-card.js?v=v0.1.0
```

Make sure these old names are not present in the installed HACS folder or Lovelace resource configuration:

```text
tuev-card-test.js
dist/tuev-card.js
/hacsfiles/tuev-card-test/
```

The dashboard card type remains unchanged:

```yaml
type: custom:tuev-card
```

## Functional smoke test

- Add/remove ungrouped entities.
- Add all new TÜV entities.
- Open display panel; click column chips and checkboxes.
- Open color picker; select multiple colors.
- Switch manual group sorting to an automatic mode and confirm/cancel the discard dialog.
- Sort ungrouped entities by name, plate, HU, status.
- Check grouped and ungrouped dashboard rendering.
- Verify graphical license plates with reachable `EuroPlate.ttf`; verify text rendering when `EuroPlate.ttf` is missing or unreachable.

## Responsive / Browser test

See `docs/RESPONSIVE_BROWSER_TEST.md` for the dedicated cross-browser and Home Assistant view checklist introduced during the release-candidate phase.
