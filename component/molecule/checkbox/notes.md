# Checkbox

A pressable row: a square box holding the check or mixed mark, then the label, with a helper or error message below. Every color, the state layer and the focus ring come from the theme's `selection` role cells.

## Decisions

- **The mark is an icon role.** The check and the mixed dash are the `checked_indicator` and `mixed_indicator` icon roles, drawn in the `selection_mark` cell (`selection_mark_disabled` when disabled) on the filled box, so each template draws its own mark (a glyph from its icon set, or the checkbox's own drawing where its reference draws one). This composition makes the checkbox a molecule.
- **State layer.** A disc centered on the box, sized by `control.selection_layer_size`, shows the theme's layer cell for the selection and the state (`selection_layer_hover`, `_active`, `selection_layer_selected_hover`, `_active`) while hovered or pressed; a reference that draws no layer states it transparent. The disc element is always mounted, so the element tree is the same under every template.
- **Colors by state.** An unmarked box draws its border in the outline cell for the state (`selection_outline`, `_hover`, `_active`, `_invalid`, `_disabled`); a checked or mixed box fills with the container cell for the state and draws no border unless invalid. The label, helper, error message and error icon have their own cells. Disabled suppresses the invalid state.
- **Row geometry.** The row is at least the sum of the fifth-step and second-step spacing tokens tall. The box sits at its top, inset from the start and the top by the first-step spacing plus a border width, as the measured reference places it; the label text starts the fourth-step spacing less a border width after the box, centered in the row. The reference states these in rem steps between scale tokens.
- **Error message.** While invalid, the message row starts with the `invalid` icon role in `selection_invalid_icon`, inset by the first-step spacing plus a border width, then the message after the third-step spacing.
- **Geometry is the template's.** The box size and border width are `control.checkbox_size` and `control.checkbox_border`, so each template draws its own box (16 with a 1px border in one, 18 with a 2px border in another). Measured against both references in every sample state, in hover, focus and pressed, in light and dark; the retired second reference has no label, helper or invalid state of its own and draws its mark with rectangles, so those are compared against the measured reference only.
- **Focus ring.** The ring is drawn around the box, not the row: an element centered on the box, larger by the theme's `control.selection_focus_offset` on each side, with the theme's corner (`control.selection_focus_radius`) and ring width and color. A square ring one pixel out in one template, a 44px circle in another. Under `feedback.focus_trigger: keyboard` it shows on keyboard focus only. A checkbox takes focus when a press completes (the measured reference focuses its input on the click), so no ring shows while the pointer is held.

## CheckboxSkeleton

- **The label block alone.** A `SkeletonPlaceholder` bar `control.selection_skeleton_label_width` wide and `spacing.spacing_05` tall, seated where the live row's text would start - the start inset (`spacing.spacing_05` + `spacing.spacing_03` + `spacing.spacing_01`) keeps the space the missing box and its gap take empty, as the measured reference's `.cds--checkbox-label-text.cds--skeleton` does. The row is `spacing.spacing_05` + `spacing.spacing_02` tall with a `spacing.spacing_01` + `border.width_01` bottom margin, the same wrapper the reference draws.
- **No second reference.** No skeleton primitive exists in the second system; the row's values come from the published explicit skeleton cells only.

## CheckboxGroup

- **A fieldset, not a form.** The group is a `group` role named by its generated legend id, as the upstream fieldset is; items are `Checkbox` members - the group composes them, it does not redraw the control.
- **Item state by id.** An item's `checked` is controlled when present; an uncontrolled item keeps its own `useCheckbox` state (seeded by `defaultChecked`), and the member element is keyed by the item's stable `id`, so reordering keeps each item's answer and removing one cannot shift another's state.
- **The group owns the messages.** The legend and the one helper or error message are the group's; `invalid` is passed to every member so each draws its error edge, but member helper or error text is never forwarded - members mount no messages. A disabled group suppresses the invalid presentation; the `aria-invalid` marker still reports the group's flag.
- **Vertical only.** The upstream horizontal checkbox-group class sets no layout rule at the pinned stylesheet, so no orientation option exists; adding one would promise a layout the source does not draw.
- **Row geometry.** Every row carries `control.checkbox_group_gap` as its bottom margin - the source's always-present validation sibling sits one gap below the last row - and the first row pulls up by `spacing.spacing_01`, the negative top margin the source applies. The message's gap is `spacing.spacing_02`; since block margins do not collapse in flex layout, the message adds only the shortfall when rows precede it (`max(0, messageGap - rowGap)`), and the full gap when the group is empty.
- **No second reference.** The second system has no checkbox group, so the group's values are the roster's `superloom_decision`: the legend and messages use the `field_label`/`field_helper`/`field_message_invalid` cells the form family already owns, and the error icon keeps the Checkbox's own margins and `selection_invalid_icon` cell.

## Platform

Both. The row, the box and the mark render on iOS, Android and web; hover feedback appears only where a pointer exists.
