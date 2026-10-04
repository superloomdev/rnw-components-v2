# TextInput

A single-line field: a label, a frame holding the input (and an error icon while invalid), and a helper or error message below. The theme's `feedback.field` enum draws the frame and its `anatomy.label` enum places the label.

## Decisions (roster flag `deferred_gap`)

- **Frame.** Under `underline` the frame is filled with `field_01` (`field_hover_01` on hover) and draws a bottom border; under `outline` it has no fill and draws four borders. The border is `border_strong_01`; a disabled field keeps it. While invalid, an underline frame keeps its border and draws a ring of the second border width in `support_error` inside its bounds, and an outline frame draws its border in `support_error`. Focus is the theme's focus presentation on the frame and takes precedence over the ring.
- **Label placement.** Under `above` the label sits over the frame in the label type set. Under `floating` the field root reserves half the raised label's line above the frame; the label rests inside the frame in the body type set and rises onto the top border in the label type set when the field is focused or holds a value, occluding the border with the surface color. The surface is the `surface` prop, else the `FIELD_SURFACE` config value, else `background`. Under a floating label the placeholder shows only once the label has risen.
- **One element tree.** The label is the first child of the field root under both placements; only its style moves it, so the accessibility tree is the same under every template.
- **Invalid.** An invalid field shows the `warning_filled` icon in `support_error` after the input and the error message below; a disabled field is never invalid.
- **Geometry is the template's.** The height, corner radius and icon size are `control.field_height`, `control.field_radius` and `control.field_icon_size`, the raised floating label is drawn in `type.field_label_raised`, so each template draws its own field (40 and square in one, 56 with 4px corners in another); the other sizes follow the shared size scale. Measured against both references. Still deferred, as contract requests for the next milestone: the type set of the value and resting label (the second reference draws them larger than compact body text), its outline color mapped onto the strong border, its helper and error text colors, and its disabled colors, drawn there as a translucent state layer.

## Platform

Both. The input renders on iOS, Android and web; hover feedback appears only where a pointer exists.

The field fills the width its container gives it (`sample.js` FRAME: the showcase and the walker lay it out at 320). In a container that sizes to its content, the field takes the platform's intrinsic input width: the browser's default input width on the web, the width of its text natively. The input grows from that width rather than from zero, so it never collapses to its padding.
