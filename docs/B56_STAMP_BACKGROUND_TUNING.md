# b57 Stamp background tuning

Based on b55.

Scope: only the `show_badge: false` HU confirmation stamp overlay.

Changes:

- Keep the stamp frame style and typography from b55.
- Increase stamp rotation so the stamp does not visually compete with the straight plate text.
- Keep the overlay centered over the tile to avoid layout/space problems.
- Improve the stamp backgrounds only:
  - darker base
  - slightly stronger color glow
  - more backdrop blur/saturation
  - better contrast against license plate and status text behind it
- No reserved layout slot.
- No tile size change.
- No change to badge-visible confirmation overlay.
