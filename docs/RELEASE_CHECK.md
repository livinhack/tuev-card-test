# TÜV Card release check

Current checked version: `b27`.

## Local modular test install

Copy these files/folders into the local test resource folder, for example `/config/www/community/tuev-card/`:

```text
tuev-card.js
src/
```

Reload the Lovelace resource with a fresh cache-buster, for example:

```text
/local/community/tuev-card/tuev-card.js?v=b27
```

## HACS release install

The current repository configuration uses:

```text
dist/tuev-card.js
```

Important files for a HACS release package:

```text
dist/tuev-card.js
hacs.json
README.md
LICENSE
NOTICE.md
package.json
package-lock.json
scripts/build-bundle.mjs
src/
tuev-card.js
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
node --check dist/tuev-card.js
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
