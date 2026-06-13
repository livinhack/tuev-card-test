# b54 handoff checkpoint

Current checkpoint: `b54`.

This checkpoint exists because the project reached the planned 50-version reminder point. It is intended as a safe handoff and continuation marker before adding more features.

## Current confirmed working base

- `b49` was confirmed as a good UI state for the compact floating confirmation panel when `show_badge: false`.
- `b54` should not intentionally change UI behavior or runtime logic.
- The HACS/root-bundle naming remains:
  - bundle: `tuev-card.js` in the repository root
  - HACS resource: `/hacsfiles/tuev-card/tuev-card.js`
  - card type: `custom:tuev-card`

## Important confirmed decisions

- Graphical license plates require a reachable `EuroPlate.ttf`.
- There is no graphical system-font fallback for license plates.
- `show_badge` controls whether the TÜV badge is shown.
- If the badge is hidden and a vehicle is due/expired, a compact floating confirmation panel is used so the card height does not change.
- The compact floating confirmation panel currently uses the accepted `b49` spacing/position.

## Deferred ideas

- Plate Renderer v2 based on FZV Anlage 4.
- Replace manual EuroPlate installation with bundled GL-Nummernschild fonts after license/NOTICE review.
- Support Mittelschrift and Engschrift in the future renderer.
- Compact mode beyond simply hiding the badge.
- Optional side-by-side groups only when every involved group has at most two vehicles.
- Group-specific display overrides.
- Screenshots and public promotion should wait until the UI is more final.

## Recommended next steps

1. Continue from `b54` if the current chat or context becomes too long.
2. Avoid large refactors without a specific reason.
3. For the next feature step, prefer a small isolated change.
4. Keep incrementing ZIP versions after every generated ZIP.

## Validation expected for this checkpoint

- `npm run build`
- `npm run check`
