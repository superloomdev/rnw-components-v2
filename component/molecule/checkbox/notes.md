# Checkbox

A pressable row: a square box holding the check or mixed mark, then the label, with a helper or error message below. Every color, the state layer and the focus ring come from the theme's `selection` role cells.

## Decisions

- **The mark is an icon role.** The check and the mixed dash are the `checked_indicator` and `mixed_indicator` icon roles, drawn in the `selection_mark` cell (`selection_mark_disabled` when disabled) on the filled box, so each template draws its own mark (a glyph from its icon set, or the checkbox's own drawing where its reference draws one). This composition makes the checkbox a molecule.
- **State layer.** A disc centered on the box, sized by `control.selection_layer_size`, shows the theme's layer cell for the selection and the state (`selection_layer_hover`, `_active`, `selection_layer_selected_hover`, `_active`) while hovered or pressed; a reference that draws no layer states it transparent. The disc element is always mounted, so the element tree is the same under every template.
- **Colors by state.** An unmarked box draws its border in the outline cell for the state (`selection_outline`, `_hover`, `_active`, `_invalid`, `_disabled`); a checked or mixed box fills with the container cell for the state and draws no border unless invalid. The label, helper, error message and error icon have their own cells. Disabled suppresses the invalid state.
- **Row geometry.** The row is at least the sum of the fifth-step and second-step spacing tokens tall. The box sits at its top, inset from the start and the top by the first-step spacing plus a border width, as the primary reference places it; the label text starts the fourth-step spacing less a border width after the box, centered in the row. The reference states these in rem steps between scale tokens.
- **Error message.** While invalid, the message row starts with the `invalid` icon role in `selection_invalid_icon`, inset by the first-step spacing plus a border width, then the message after the third-step spacing.
- **Geometry is the template's.** The box size and border width are `control.checkbox_size` and `control.checkbox_border`, so each template draws its own box (16 with a 1px border in one, 18 with a 2px border in another). Measured against both references in every sample state, in hover, focus and pressed, in light and dark; the second reference has no label, helper or invalid state of its own and draws its mark with rectangles, so those are compared against the primary reference only.
- **Focus ring.** The ring is drawn around the box, not the row: an element centered on the box, larger by the theme's `control.selection_focus_offset` on each side, with the theme's corner (`control.selection_focus_radius`) and ring width and color. A square ring one pixel out in one template, a 44px circle in another. Under `feedback.focus_trigger: keyboard` it shows on keyboard focus only. A checkbox takes focus when a press completes (the primary reference focuses its input on the click), so no ring shows while the pointer is held.

## Platform

Both. The row, the box and the mark render on iOS, Android and web; hover feedback appears only where a pointer exists.
