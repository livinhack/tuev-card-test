# TÜV Card release check

Current checked version: `b32`.

## Local test install

Copy these files/folders into the local test resource folder, for example `/config/www/community/tuev-card/`:

```text
tuev-card.js
```

For source-level modular debugging, copy `src/` as well and point the resource to `src/tuev-card-entry.js`.

Reload the Lovelace resource with a fresh cache-buster, for example:

```text
/local/community/tuev-card/tuev-card.js?v=b32
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
/hacsfiles/tuev-card/tuev-card.js?v=b32
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
