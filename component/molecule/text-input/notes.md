# TextInput

A single-line field: a label, a frame holding the input (and an error icon while invalid), and a helper or error message below. The theme's `feedback.field` enum draws the frame, its `anatomy.label` enum places the label, and its `field` role cells give every color, width, space and type set by state.

## Decisions

- **Frame.** Under `underline` the frame draws a bottom border, under `outline` four borders inside the inline padding. Its fill, outline color and outline width are the field cells for the state (rest, hover, focus, disabled, invalid with its hover and focus); a hovered text input reads its own `text_input_container_hover` cell, since the primary reference's text input does not change on hover while its select does. While invalid, where the theme states a ring width, the frame draws an inner ring in `field_ring_invalid`. Focus draws the field ring from its cells and takes precedence over the invalid ring.
- **Label placement.** Under `above` the label sits over the frame in the label type set. Under `floating` the field root reserves half the raised label's line above the frame; the label rests inside the frame in the field label type set and rises onto the top border in the raised label type set when the field is focused or holds a value, occluding the border with the surface color. The surface is the `surface` prop, else the `FIELD_SURFACE` config value, else `background`. Under a floating label the placeholder shows only once the label has risen.
- **One element tree.** The label is the first child of the field root under both placements; only its style moves it, so the accessibility tree is the same under every template.
- **Invalid.** An invalid field shows the `invalid` icon role in `field_invalid_icon` after the input, the frame's trailing padding becoming the theme's icon inset, and the error message below; a disabled field is never invalid.
- **Geometry is the template's.** The height, corner radius and icon size are `control.field_height`, `control.field_radius` and `control.field_icon_size`; the paddings, message inset and gap and the type sets are field cells, so each template draws its own field (40 and square in one, 56 with 4px corners in another); the other sizes follow the shared size scale. Measured against both references in every sample state, in hover, focus and pressed, in light and dark.

## Platform

Both. The input renders on iOS, Android and web; hover feedback appears only where a pointer exists.

The field fills the width its container gives it (`sample.js` FRAME: the showcase and the walker lay it out at 320). In a container that sizes to its content, the field takes the platform's intrinsic input width: the browser's default input width on the web, the width of its text natively. The input grows from that width rather than from zero, so it never collapses to its padding.

# TextArea

A multi-line field, the same family frame grown to `rows` value lines: a label row, a frame holding a `textarea` (and an error icon anchored at its top end while invalid), and a message row below. It composes `useTextField` like its sibling and reads the field presentation as member `text_area`, so its hover fill is `text_area_container_hover`, its disabled outline `text_area_outline_disabled` and its value type `text_area_value`.

## Decisions

- **Height.** The frame carries no fixed height: `rows` (default 4) sizes the textarea and `minHeight` holds the field height as a floor. The frame's block padding is the room one `field_value` line takes centered in that floor - `(field_height - lineHeight) / 2`, which lands both references' own numbers (11 against 40/18, 16 against 56/24).
- **Counter.** `maxCount` shows a `count/maxCount` counter and caps the input length. `anatomy.field_counter` picks the seat: `label` puts it beside the label (in the label type and color), `message` puts it at the supporting row's end (in the helper type and color). Both seats mount whenever a counter exists and only the theme's is displayed, so the element tree never depends on the template.
- **Icon.** The invalid icon sits absolute at the frame's top end (`spacing.spacing_04` down, the icon inset in), the way the primary reference anchors it.
- **One element tree.** The label row and the message row keep their places under every template; placement moves styles, not elements.
- **Resize.** The primary reference lets the field resize vertically; the web textarea keeps the platform default here and the difference is left to the screenshots.

## Platform

Both. The input renders on iOS, Android and web; hover feedback appears only where a pointer exists.
