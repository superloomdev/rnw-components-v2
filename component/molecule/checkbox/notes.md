# Checkbox

A pressable row: a square box holding the check or mixed mark, then the label, with a helper or error message below. The box and mark colors come from the icon color tokens; the theme's `feedback.press` enum decides how hover and press are shown.

## Decisions (roster flag `deferred_gap`)

- **The mark is an icon.** The check and the mixed dash are the `checkmark` and `subtract` icons, drawn in `icon_inverse` on the filled box, so each template draws its own glyph. This composition makes the checkbox a molecule.
- **Press feedback is the theme's choice.** The box has no fill of its own. Under `ripple` a disc in the box's color, centered on the box and sized by the medium size token, rises to the theme's hover, focus and pressed opacities; under `opacity` the row fades; under `highlight` nothing changes, as in the primary reference. The disc element is always mounted, so the element tree is the same under every template.
- **Colors by state.** The border is `icon_primary` at rest, `support_error` while invalid and `icon_disabled` while disabled; a checked or mixed box fills with `icon_primary` (`icon_disabled` when disabled) and draws no border unless invalid. Disabled suppresses the invalid state.
- **Row geometry.** The row is at least the sum of the fifth-step and second-step spacing tokens tall, the box and label centered in it; the label text starts the sum of the fourth-step and first-step spacing tokens after the box. The reference states both in rem steps between scale tokens.
- **Error message.** While invalid, the message row starts with the `warning_filled` icon in `support_error`, inset by the first-step spacing plus a border width, then the message after the third-step spacing.
- **Geometry follows the primary reference; the second reference's box is deferred.** The second reference draws a larger box with a thicker border; the contract does not yet carry per-component geometry, so that box is recorded as a contract request and the primary box is drawn with each template's colors meanwhile.
- **Focus** is drawn on the box, not the row.

## Platform

Both. The row, the box and the mark render on iOS, Android and web; hover feedback appears only where a pointer exists.
