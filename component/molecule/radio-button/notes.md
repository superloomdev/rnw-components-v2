# RadioButton

A pressable row: a circular ring holding the checked dot, then the label. Every color, the state layer and the focus ring come from the theme's `selection` role cells; the ring and dot geometry and the selected ring color come from the `radio` cells.

## Decisions

- **The ring and dot are drawn, not composed.** The ring is a bordered circle sized by `control.radio_size` with a `control.radio_border` edge; the checked state draws a centered `control.radio_dot_size` disc inside it. Neither reference draws its radio from an icon set, so the family declares no icon role. The dot element stays mounted hidden while unchecked, so the element tree is the same under every template and state.
- **Colors by state.** An unchecked ring draws the `selection_outline` cell for the state (`_hover`, `_active`, `_focus`, `_disabled`, `_invalid`); a checked ring draws the `radio_outline_selected` cells, a separate cell family because a reference selects the ring in a different color than it strokes an unselected one. The dot draws the `selection_container` cells: the same fill a checkbox takes when selected. Disabled suppresses the invalid ring.
- **State layer.** A disc centered on the ring, sized by `control.selection_layer_size`, shows the theme's layer cell for the selection and the state while hovered or pressed; a reference that draws no layer states it transparent. Always mounted, like the checkbox's.
- **Row geometry.** The ring sits inset from the row edges by the first-step spacing, a border width and a second border width, as the primary reference places it; the label starts the fourth-step spacing less that border width after the ring, centered in the row. The reference states these in rem steps between scale tokens, so the spec names the token sums and differences.
- **Focus ring.** Drawn on the ring itself: the ring's own circle radius rounds the outline, which sits at `control.radio_focus_offset` out, in the theme's `selection` focus width and color. Under `feedback.focus_trigger: keyboard` it shows on keyboard focus only; a press keeps the pointer flag so no ring shows while it is held.
- **A radio never unchecks.** A press or Space checks it; pressing a checked radio does nothing. Mutual exclusion and roving tab order belong to the group, which drives each member's `checked` and `focusable` - the keyboard contract is the same: Enter and Space check the member that holds the focus.
- **Invalid draws a ring, not a message.** `invalid` paints the error edge and announces it; the message and its icon belong to the group, as the primary reference draws them.

## Platform

Both. The row, the ring and the dot render on iOS, Android and web; hover feedback appears only where a pointer exists.
