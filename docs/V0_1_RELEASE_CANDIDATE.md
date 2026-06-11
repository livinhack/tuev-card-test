# TÜV Card v0.1 release candidate notes

Current checked version: `b42`.

This document collects the current release-candidate status for the first `v0.1` milestone. `b42` is the dedicated release-candidate checkpoint after the successful `b41` Home Assistant/HACS test pass. It does not change UI behavior or rendering logic.

## Release-candidate checkpoint

- `b41` was tested successfully in Home Assistant/HACS.
- `b42` only updates documentation, version markers, and release-candidate notes.
- No UI, renderer, editor, HACS naming, or runtime behavior was intentionally changed in `b42`.

## Current stable baseline

- Root HACS bundle naming is active: `tuev-card.js` is the production bundle in the repository root.
- The modular source entry is `src/tuev-card-entry.js`.
- HACS should load `/hacsfiles/tuev-card/tuev-card.js`.
- Card type remains `custom:tuev-card`.
- Graphical license plates are available only when `EuroPlate.ttf` is reachable.
- There is no graphical system-font fallback for license plates.
- Group title editing should keep focus while typing.
- Display, color, and manual-sort confirmation floating panels are currently stable.

## Must-have before v0.1

- Confirm the latest HACS install loads the root bundle, not an old `dist/` or `-test` resource.
- Confirm Firefox, Chrome, and the Home Assistant Android app all behave consistently when `EuroPlate.ttf` is missing.
- Confirm Firefox, Chrome, and the Home Assistant Android app all show graphical plates when `EuroPlate.ttf` is reachable.
- Confirm the editor can create, rename, color, sort, and delete groups without focus loss or stale state.
- Confirm dashboard save/reload keeps group order, group colors, sort modes, and display options.
- Confirm no browser-console errors appear on normal card load, editor open, or popover interactions.
- Confirm README installation paths match the current root-bundle HACS structure.
- Confirm NOTICE/license notes are acceptable for the current state.

## Optional before v0.1

- Minor README wording cleanup.
- Minor release-check documentation cleanup.
- Additional manual test pass in Home Assistant Sections and Panel views.
- Small visual adjustments only if they are low-risk and do not affect the plate renderer.

## Explicitly deferred until after v0.1

- Plate Renderer v2 based on FZV Anlage 4.
- Replacing manual `EuroPlate.ttf` installation with bundled GL-Nummernschild fonts.
- Mittelschrift/Engschrift selection.
- Seasonal, two-line, motorcycle, interchangeable, or other special plate types.
- Group-specific display overrides.
- Compact mode / option to hide the TÜV badge.
- Optional side-by-side group layout for small groups.
- README screenshots and final image assets. Screenshots should be added late, after the UI is stable.
- GitHub tags/releases for HACS update notifications are verified with the temporary `b39` test. For the first real public version, switch from `bXX` test tags to semantic releases such as `v0.1.0`.

## Known product decisions

- Code and file names stay English.
- User-facing labels are handled through translations.
- ZIP/version numbering continues with every generated ZIP.
- Save/transition checkpoints should be created before the conversation or version chain gets too long.
- Graphical license plates require a real plate font. System-font rendering is intentionally not used for graphical plates.

## Versioning preparation

The semantic `v0.1.0` switch is prepared in `docs/VERSIONING_AND_RELEASE_PREP.md`. Keep using `bXX` checkpoints until the remaining must-have checks are confirmed.

## Current recommended next step

After `b42`, do only a short release-candidate verification pass in Home Assistant. Avoid new feature work until the release-candidate state is confirmed.

Recommended next practical step: install/test `b42`. If no blockers remain, prepare the semantic `v0.1.0` ZIP/tag/release from this checkpoint.
