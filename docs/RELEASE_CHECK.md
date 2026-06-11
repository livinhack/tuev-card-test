# TÜV Card release check

Current checked version: `b40`.

## b40 note

This version is a v0.1 must-fix audit / release-preparation checkpoint.
It documents the successful `b39` HACS release trigger test and keeps the current EuroPlate rule unchanged:

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
/local/community/tuev-card/tuev-card.js?v=b40
```

## HACS release install

The current repository configuration uses:

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



## HACS release/update trigger

The temporary `b39` release trigger test confirmed the GitHub Desktop + GitHub Release + HACS update-information workflow.

See `docs/HACS_RELEASE_FLOW.md` for the release/update trigger checklist.

## Build/check commands

```bash
npm run build
npm run check
```

Equivalent manual checks:

```bash
node scripts/build-bundle.mjs
node --check tuev-card.js
find src -name '*.js' -print0 | xargs -0 -n1 node --check
```

## Post naming migration checks

After the root bundle migration, verify that HACS and Home Assistant load the production file directly from the repository root:

```text
/config/www/community/tuev-card/tuev-card.js
/hacsfiles/tuev-card/tuev-card.js?v=b40
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
- Verify graphical license plates with and without `EuroPlate.ttf`.

## Responsive / Browser test

See `docs/RESPONSIVE_BROWSER_TEST.md` for the dedicated cross-browser and Home Assistant view checklist introduced in `b36`.


## v0.1 release candidate notes

See `docs/V0_1_RELEASE_CANDIDATE.md` for the current must-have, optional, and deferred items for the first `v0.1` milestone.
