# b52 Fixed confirm slot for hidden badge mode

This checkpoint refines the `show_badge: false` confirmation overlay.

## Goal

The compact confirmation overlay must not change the vehicle tile size when it appears.
At the same time, it should no longer cover the plate/HU/status area as much as before.

## Change

For `show_badge: false`, vehicle tiles now always reserve a small internal bottom area.
The confirmation overlay is absolutely positioned into that fixed area when needed.

This means:

- pending/expired vehicles do not become taller than non-pending vehicles because of the overlay
- the overlay no longer depends on a percentage `top` position
- the overlay is aligned within the tile width via `left`/`right` instead of being centered as `max-content`
- important plate/HU/status information should remain easier to read

## Not changed

- The normal badge overlay for `show_badge: true` is unchanged.
- Card logic is unchanged.
- Confirmation service calls are unchanged.
