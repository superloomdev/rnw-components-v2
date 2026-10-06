# Select

A field that opens a list of options: a label, a frame holding a pressable trigger (the selection or the placeholder, an error icon while invalid, and the caret), and a helper or error message below. It shares the text input's field presentation, so the theme's `feedback.field` and `anatomy.label` enums draw it the same way; `anatomy.caret` decides whether the caret shows.

## Decisions (roster flag `deferred_gap`)

- **Shared field frame.** The frame, the border by state and the label placement come from the context's field presentation, exactly as for the text input; while open, the frame counts as focused so a floating label rises. A disabled select draws no border under `underline`, where a disabled text input keeps its border, as the primary reference does and its filled frame still shows the control's shape; under `outline` the border is all that draws the frame, so a disabled select keeps the disabled border, as the second reference does. An invalid select draws the same inner error ring as an invalid text input.
- **Placeholder.** While nothing is selected the trigger holds the placeholder. Under a resting floating label it stays in the element tree but is not drawn, so assistive technology hears the same trigger under every template.
- **Width.** The trigger is as wide as its widest text (the placeholder or any option), as a platform select is, so the frame keeps one width whatever is selected. A hidden sizer holding those texts sets it; it takes no height and is hidden from assistive technology.
- **Caret.** The `chevron_down` icon sits at the trailing edge. It is always mounted; under `anatomy.caret: hidden` it is not displayed, so the element tree is the same under every template.
- **List.** While open, the options are laid out directly below the frame, spanning its width, on the first layer at the dropdown stacking level with the second shadow level. The selected option fills with `layer_selected_01`, the highlighted one with `layer_hover_01`. The list closes on selection, on Escape and on a second press of the trigger.
- **Keyboard.** Arrow keys open the list and move the highlight, Enter and Space open it or commit the highlighted option, Escape closes it; all of this is the select behavior's.
- **Invalid.** An invalid select shows the `warning_filled` icon before the caret and the error message below; a disabled select is never invalid.
- **Geometry is the template's.** The height, corner radius and icon size are `control.field_height`, `control.field_radius` and `control.field_icon_size` (and the option row height `control.option_height`), the raised floating label is drawn in `type.field_label_raised`, so each template draws its own field (40 and square in one, 56 with 4px corners in another); the other sizes follow the shared size scale. Measured against both references (the second reference draws its own ten-by-five arrow in place of a glyph, so the caret is compared against the primary reference only). Still deferred, as contract requests for the next milestone: the type set of the value and resting label (the second reference draws them larger than compact body text), its outline color mapped onto the strong border, its helper and error text colors, and its disabled colors, drawn there as a translucent state layer.

## Platform

Both. The frame, trigger and list render on iOS, Android and web; the list is drawn by the library on every platform rather than by a platform picker.

The select fills the width its container gives it (`sample.js` FRAME: the showcase and the walker lay it out at 320). In a container that sizes to its content, its trigger grows from the hidden sizer (the widest option), the same on every platform, never from zero.
