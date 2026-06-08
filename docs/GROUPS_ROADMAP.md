# Groups and section headings

Optional groups are implemented as an editor-managed card feature.
Existing cards without `groups` remain compatible and keep the normal ungrouped layout.

## Current state

Implemented:

- Create, rename and delete groups.
- Move groups up and down.
- Assign vehicles to groups.
- Remove vehicles from groups without automatically moving them to the ungrouped section.
- Release all ungrouped vehicles from the card.
- Render group headings in the dashboard card.
- Optional group colors for editor accents and dashboard heading lines.
- Per-group sorting by name, license plate, HU due date, status or manual order.

## YAML shape

```yaml
type: custom:tuev-card
columns: auto
groups:
  - id: private
    title: Privat
    color: "#42a5f5"
    entities:
      - sensor.porsche_911_tuv
      - sensor.mercedes_eqb_tuv

  - id: company
    title: Firma
    color: "#66bb6a"
    entities:
      - sensor.bmw_330i_tuv

entities:
  - sensor.unassigned_vehicle_tuv
```

## Notes

- `color` is optional. If omitted, the card/editor use a stable fallback palette.
- `sort` is optional. If omitted, groups use manual order. Supported values are `name`, `plate`, `due_date`, `status` and `manual`.
- `sort_direction` is optional and applies to non-manual group sorting.
- Ungrouped `entities` render after grouped sections.
- Vehicles removed from a group become available again in the editor picker.
- Deleting a group does not automatically move its vehicles to the ungrouped section.

## Possible later enhancements

- Collapse/expand groups.
- Hide empty groups.
- Optional group descriptions.
- Optional group icons.
- Drag and drop for manual sorting, if needed.
- More advanced group assignment UI if needed.

- Card group headings show the group color and vehicle count.
