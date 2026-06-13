# b57 Stamp readability tuning

This checkpoint refines the HU stamp confirmation overlay introduced in b54.

## Scope

Only the `show_badge: false` confirmation overlay was adjusted.

## Changes

- Warning stamp and action stamp now render their labels in two lines when possible.
- Stamp backgrounds are darker and more opaque for better contrast.
- The old `mix-blend-mode: screen` approach was removed because it reduced readability on busy backgrounds.
- The worn/damaged stamp border effect remains CSS-based.
- The action stamp still uses the clickable green `HU bestanden?` / `HU passed?` area with checkbox/checkmark.

## Not changed

- No change to badge-visible confirmation overlay.
- No change to vehicle layout or tile sizing.
- No change to EuroPlate rules.
- No system-font fallback for graphical plates.
