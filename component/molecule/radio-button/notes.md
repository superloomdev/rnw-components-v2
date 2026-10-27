# RadioButton

A pressable row: a circular ring holding the checked dot, then the label. Every color, the state layer and the focus ring come from the theme's `selection` role cells; the ring and dot geometry and the selected ring color come from the `radio` cells.

## Decisions

- **The ring and dot are drawn, not composed.** The ring is a bordered circle sized by `control.radio_size` with a `control.radio_border` edge; the checked state draws a centered `control.radio_dot_size` disc inside it. Neither reference draws its radio from an icon set, so the family declares no icon role. The dot element stays mounted hidden while unchecked, so the element tree is the same under every template and state.
- **Colors by state.** An unchecked ring draws the `selection_outline` cell for the state (`_hover`, `_active`, `_focus`, `_disabled`, `_invalid`); a checked ring draws the `radio_outline_selected` cells, a separate cell family because a reference selects the ring in a different color than it strokes an unselected one. The dot draws the `selection_container` cells: the same fill a checkbox takes when selected. Disabled suppresses the invalid ring.
- **State layer.** A disc centered on the ring, sized by `control.selection_layer_size`, shows the theme's layer cell for the selection and the state while hovered or pressed; a reference that draws no layer states it transparent. Always mounted, like the checkbox's.
- **Row geometry.** The ring sits inset from the row edges by the first-step spacing, a border width and a second border width, as the measured reference places it; the label starts the fourth-step spacing less that border width after the ring, centered in the row. The reference states these in rem steps between scale tokens, so the spec names the token sums and differences.
- **Focus ring.** Drawn on the ring itself: the ring's own circle radius rounds the outline, which sits at `control.radio_focus_offset` out, in the theme's `selection` focus width and color. Under `feedback.focus_trigger: keyboard` it shows on keyboard focus only; a press keeps the pointer flag so no ring shows while it is held.
- **A radio never unchecks.** A press or Space checks it; pressing a checked radio does nothing. Mutual exclusion and roving tab order belong to the group, which drives each member's `checked` and `focusable` - the keyboard contract is the same: Enter and Space check the member that holds the focus.
- **Invalid draws a ring, not a message.** `invalid` paints the error edge and announces it; the message and its icon belong to the group, as the measured reference draws them.

## RadioButtonSkeleton

- **The label block alone.** A `SkeletonPlaceholder` bar `control.selection_skeleton_label_width` wide and `control.radio_skeleton_label_height` tall at the row's top-left - the measured reference's `.cds--radio-button__label.cds--skeleton` draws exactly that, with no circle. The height is the published skeleton cell, not the live radio's `control.radio_size`.
- **No second reference.** No skeleton primitive exists in the second system; the row's values come from the published explicit skeleton cells only.

## RadioButtonGroup

- **A fieldset of members.** The group is a `radiogroup` role named by its generated legend id; members are `RadioButton` instances driven through its private composition props (`checked`, `focusable`, `invalid`, the `rootRef`/`onGroupFocus` pair and `groupVertical`), so the member's drawing, press and Space handling stay the control's own.
- **One selection, one tab stop.** `useRadioGroup` holds the shared `value` (controlled or `defaultValue`); a member presses to select through the controllable setter, which reports `onChange` once and mutates only the uncontrolled group. Exactly one enabled member sits in the tab order - the selected one when enabled, else the first enabled - and arrows, Home and End move selection and DOM focus together, skipping disabled members and wrapping; Tab alone focuses without selecting. Members are addressed by value, so reordering or removing items keeps the selection and drops stale refs; because `0` and `"0"` are distinct members, the React key and generated `testID` carry the value's type (`typeof` prefix).
- **Row geometry.** The horizontal row shrink-wraps with `control.radio_group_gap_horizontal` between members; the vertical column aligns at the start edge and every member carries `control.radio_group_gap_vertical` as its bottom margin. A vertical member asks its RadioButton for `groupVertical`: the ring's top and bottom insets become the row's top padding, matching the source's shorter vertical row.
- **The group owns the messages.** The legend and the one helper or error message are the group's; `invalid` marks every member's ring and suppresses the helper, and a disabled group suppresses invalid presentation and callbacks while `aria-invalid` still reports the flag. The error icon keeps the field icon's side insets with no top inset, as the source's validation sibling draws it.
- **No second reference.** The second system has no radio group, so the group's values are the roster's `superloom_decision`: the legend and messages use the `field_label`/`field_helper`/`field_message_invalid` cells the form family already owns, and the error icon uses `selection_invalid_icon` at `size.icon_01`.

## Platform

Both. The row, the ring and the dot render on iOS, Android and web; hover feedback appears only where a pointer exists.
