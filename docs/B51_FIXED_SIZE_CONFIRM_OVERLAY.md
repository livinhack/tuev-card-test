# b52 – Fixed-size compact confirm overlay

This checkpoint keeps the `show_badge: false` confirmation panel fully non-reserving.

## Goal

The vehicle tile size must not change when the confirmation panel is shown.

## Change

- The compact confirmation panel is absolutely positioned inside the existing vehicle tile.
- It no longer uses a percentage-based vertical center position.
- It is anchored to the lower tile area with `bottom`, so it behaves more like a fixed overlay area.
- The panel width is constrained to the current tile width and cannot create layout growth.

## Not changed

- No badge rendering change.
- No EuroPlate behavior change.
- No group/editor logic change.
