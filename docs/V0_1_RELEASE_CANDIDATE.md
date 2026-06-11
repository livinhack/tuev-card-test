# TÜV Card b48 release notes

Current checked version: `b48`.

This document records the first semantic test release milestone. `b48` is based on the confirmed `b42` release candidate and the `b43` repository cleanup checkpoint.

## Release status

- First semantic test release: `b48`.
- Not actively advertised as a public launch yet.
- Intended as a stable technical baseline for further testing through HACS.
- No UI, renderer, editor, HACS naming, or runtime behavior changes were intentionally introduced during the final version switch.

## Current stable baseline

- Root HACS bundle naming is active: `tuev-card.js` is the production bundle in the repository root.
- The modular source entry is `src/tuev-card-entry.js`.
- HACS should load `/hacsfiles/tuev-card/tuev-card.js`.
- Card type remains `custom:tuev-card`.
- Graphical license plates are available only when `EuroPlate.ttf` is reachable.
- There is no graphical system-font fallback for license plates.
- Group title editing should keep focus while typing.
- Display, color, and manual-sort confirmation floating panels are currently stable.

## Must-have checks before publishing the GitHub Release

- Confirm the package version is `0.1.1-b48`.
- Confirm the generated bundle header says `TÜV Card bundled b48`.
- Confirm HACS uses `tuev-card.js` from the repository root.
- Confirm README installation paths match the root-bundle HACS structure.
- Confirm NOTICE/license notes are acceptable for the current state.
- Run `npm run build`.
- Run `npm run check`.

## Functional smoke test

- Confirm Firefox, Chrome, and the Home Assistant Android app all behave consistently when `EuroPlate.ttf` is missing.
- Confirm Firefox, Chrome, and the Home Assistant Android app all show graphical plates when `EuroPlate.ttf` is reachable.
- Confirm the editor can create, rename, color, sort, and delete groups without focus loss or stale state.
- Confirm dashboard save/reload keeps group order, group colors, sort modes, and display options.
- Confirm no browser-console errors appear on normal card load, editor open, or popover interactions.

## Explicitly deferred until after b48

- Plate Renderer v2 based on FZV Anlage 4.
- Replacing manual `EuroPlate.ttf` installation with bundled GL-Nummernschild fonts.
- Mittelschrift/Engschrift selection.
- Seasonal, two-line, motorcycle, interchangeable, or other special plate types.
- Group-specific display overrides.
- Compact mode / option to hide the TÜV badge.
- Optional side-by-side group layout for small groups.
- README screenshots and final image assets. Screenshots should be added late, after the UI is stable.

## Known product decisions

- Code and file names stay English.
- User-facing labels are handled through translations.
- ZIP/version numbering continues for future generated ZIPs after the release.
- Save/transition checkpoints should be created before the conversation or version chain gets too long.
- Graphical license plates require a real plate font. System-font rendering is intentionally not used for graphical plates.

## Release flow

1. Copy this `b48` ZIP into the repository.
2. Commit and push with GitHub Desktop.
3. Create a GitHub Release with tag `b48`.
4. Use the release title `b48 - Initial test release`.
5. Let HACS discover the update, or use **Informationen aktualisieren** for an immediate manual check.
