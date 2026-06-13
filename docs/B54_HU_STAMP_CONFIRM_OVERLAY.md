# b54 HU stamp confirm overlay

`b54` experiments with a stamp-style confirmation overlay for the compact `show_badge: false` layout.

## Scope

- Based on the restored `b53` / `b50` baseline.
- Only affects vehicles that are due/expired while `show_badge: false` is active.
- Does not reserve layout space and does not change the tile size.
- Keeps the existing confirmation service flow.

## Design goal

The previous compact button panel worked, but looked like a normal UI dialog placed on top of the tile. The new approach treats the confirmation as a TÜV/HU stamp:

- warning stamp for `TÜV fällig!` / `TÜV abgelaufen!`
- separate green `HU bestanden?` stamp action
- small checkbox/checkmark inside the same stamp frame style
- intentionally slightly rotated and semi-transparent
- distressed/partly worn frame look using CSS only

## Important constraints

- No external stamp image is used.
- Text remains localizable.
- The whole green action stamp is clickable, not only the checkbox.
- The existing confirmation logic still runs after click.
- If the concept works well, the same principle may later be evaluated for the normal badge view.
