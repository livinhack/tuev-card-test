# Future idea: groups and section headings

This is a planned optional feature and is not implemented yet.

## Goal

Allow users to divide one TÜV Card into freely named groups, for example:

- Privat
- Firma
- Anhänger
- Autos
- Motorräder
- Garage 2

The current ungrouped card layout should remain the default. Existing configurations without
groups must continue to render exactly as before.

## Proposed YAML shape

```yaml
type: custom:tuev-card
columns: auto
groups:
  - id: private
    title: Privat
    color: blue
    entities:
      - sensor.porsche_911_tuv
      - sensor.mercedes_eqb_tuv

  - id: company
    title: Firma
    color: green
    entities:
      - sensor.bmw_330i_tuv

entities:
  - sensor.unassigned_vehicle_tuv
```

## Rendering idea

- Each group renders as a section heading plus divider line.
- Vehicles inside a group keep the same card/tile rendering as today.
- Ungrouped entities can either render in a default group such as `Weitere` or at the end of the card.
- Group colors are optional visual accents only.

## Editor idea

- Add a `Groups & order` area.
- Create, rename and delete groups.
- Reorder groups.
- Assign vehicles to groups.
- Keep the simple entity list for users who do not enable groups.

## Implementation notes

Suggested order:

1. Add config normalization for optional `groups`.
2. Add group-aware entity ordering without changing ungrouped behavior.
3. Render group headings in the dashboard.
4. Add editor UI for creating and assigning groups.
5. Add optional group colors and collapse/expand later if still useful.
