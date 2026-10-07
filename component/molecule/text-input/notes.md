# TextInput

A single-line field: a label, a frame holding the input (and an error icon while invalid), and a helper or error message below. The theme's `feedback.field` enum draws the frame, its `anatomy.label` enum places the label, and its `field` role cells give every colour, width, space and type set by state.

## Decisions

- **Frame.** Under `underline` the frame draws a bottom border, under `outline` four borders inside the inline padding. Its fill, outline colour and outline width are the field cells for the state (rest, hover, focus, disabled, invalid with its hover and focus); a hovered text input reads its own `text_input_container_hover` cell, since the primary reference's text input does not change on hover while its select does. While invalid, where the theme states a ring width, the frame draws an inner ring in `field_ring_invalid`. Focus draws the field ring from its cells and takes precedence over the invalid ring.
- **Label placement.** Under `above` the label sits over the frame in the label type set. Under `floating` the field root reserves half the raised label's line above the frame; the label rests inside the frame in the field label type set and rises onto the top border in the raised label type set when the field is focused or holds a value, occluding the border with the surface color. The surface is the `surface` prop, else the `FIELD_SURFACE` config value, else `background`. Under a floating label the placeholder shows only once the label has risen.
- **One element tree.** The label is the first child of the field root under both placements; only its style moves it, so the accessibility tree is the same under every template.
- **Invalid.** An invalid field shows the `invalid` icon role in `field_invalid_icon` after the input, the frame's trailing padding becoming the theme's icon inset, and the error message below; a disabled field is never invalid.
- **Geometry is the template's.** The height, corner radius and icon size are `control.field_height`, `control.field_radius` and `control.field_icon_size`; the paddings, message inset and gap and the type sets are field cells, so each template draws its own field (40 and square in one, 56 with 4px corners in another); the other sizes follow the shared size scale. Measured against both references in every sample state, in hover, focus and pressed, in light and dark.

## Platform

Both. The input renders on iOS, Android and web; hover feedback appears only where a pointer exists.

The field fills the width its container gives it (`sample.js` FRAME: the showcase and the walker lay it out at 320). In a container that sizes to its content, the field takes the platform's intrinsic input width: the browser's default input width on the web, the width of its text natively. The input grows from that width rather than from zero, so it never collapses to its padding.
