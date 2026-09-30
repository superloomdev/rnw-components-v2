# TextInput

A single-line field: a label, a frame holding the input (and an error icon while invalid), and a helper or error message below. The theme's `feedback.field` enum draws the frame and its `anatomy.label` enum places the label.

## Decisions (roster flag `deferred_gap`)

- **Frame.** Under `underline` the frame is filled with `field_01` (`field_hover_01` on hover) and draws a bottom border; under `outline` it has no fill and draws four borders. The border is `border_strong_01` at rest, `support_error` while invalid and `border_disabled` while disabled. Focus is the theme's focus presentation on the frame.
- **Label placement.** Under `above` the label sits over the frame in the label type set. Under `floating` it rests inside the frame in the body type set and rises into the top border in the label type set when the field is focused or holds a value, occluding the border with the surface color. The surface is the `surface` prop, else the `FIELD_SURFACE` config value, else `background`. Under a floating label the placeholder shows only once the label has risen.
- **One element tree.** The label is the first child of the field root under both placements; only its style moves it, so the accessibility tree is the same under every template.
- **Invalid.** An invalid field shows the `warning_filled` icon in `support_error` after the input and the error message below; a disabled field is never invalid.
- **Geometry follows the primary reference; the second reference's field is deferred.** The second reference draws a taller field with rounded corners and its own raised-label type; the contract does not yet carry per-component geometry, so that field is recorded as a contract request and the primary field is drawn with each template's colors meanwhile.

## Platform

Both. The input renders on iOS, Android and web; hover feedback appears only where a pointer exists.
