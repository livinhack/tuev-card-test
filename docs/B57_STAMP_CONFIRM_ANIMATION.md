# b57 – Stamp confirmation animation

This checkpoint tunes the stamp-style confirmation overlay introduced for `show_badge: false`.

## Scope

Only the compact/no-badge confirmation overlay was changed.

## Behavior

When the user confirms HU as passed:

1. The checkbox draws its checkmark with a hand-written stroke animation.
2. The red TÜV status stamp fades out softly.
3. The green HU confirmation stamp fades out softly.
4. After the animation, the existing `tuev_reminder.confirm_passed` flow continues.

## Not changed

- No layout reservation.
- No card-size changes caused by the overlay.
- No changes to `show_badge: true` overlay behavior.
- No changes to EuroPlate handling.
- No plate renderer changes.
