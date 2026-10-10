# Select

A field that opens a list of options: a label, a frame holding a pressable trigger (the selection or the placeholder, an error icon while invalid, and the dropdown indicator), and a helper or error message below. It shares the text input's field presentation, so the theme's `feedback.field` and `anatomy.label` enums and its `field` role cells draw it the same way.

## Decisions

- **Shared field frame.** The frame, its fill, outline, widths, paddings, label and text by state come from the context's field presentation, exactly as for the text input; while open, the frame counts as focused so a floating label rises. The select is a member of the field family with one cell of its own: a disabled select draws its outline in `select_outline_disabled` (the primary reference draws none, its filled frame still showing the control's shape; the second reference keeps its translucent disabled outline). It hovers with the family's `field_container_hover`, as the primary reference's select does. An invalid select draws the family's invalid outline and, where the theme states a ring width, its inner error ring.
- **Placeholder.** While nothing is selected the trigger holds the placeholder. Under a floating label it is never drawn, open or not, as the second reference's select draws none; it stays in the element tree, so assistive technology hears the same trigger under every template.
- **Width.** The trigger is as wide as its widest text (the placeholder or any option), as a platform select is, so the frame keeps one width whatever is selected. A hidden sizer holding those texts sets it; it takes no height and is hidden from assistive technology.
- **Indicator.** The trailing indicator is the theme's `dropdown_indicator` icon role in the field's indicator cell for the state: the primary reference's chevron in one template, the second reference's own ten-by-five drop-down drawing in another. Which glyph a part shows is template data, so the select names the role and never a shape. The frame's trailing padding is the theme's `control.field_icon_inset`, the gap before the indicator `control.field_icon_gap`.
- **List.** While open, the options are laid out directly below the frame, spanning its width, on the theme's `list_container` fill at the `dropdown` stacking level with the `list` shadow and `control.list_radius`, each option at `control.list_item_height` in the `list_item` type set with the `list_item` label and container cells for its state. The selected option fills with `list_item_container_selected`, the highlighted one with `list_item_container_hover`, a pressed one with `list_item_container_active`. The list closes on selection, on Escape and on a second press of the trigger.
- **Keyboard.** Arrow keys open the list and move the highlight, Enter and Space open it or commit the highlighted option, Escape closes it; all of this is the select behavior's.
- **Invalid.** An invalid select shows the `invalid` icon role in the field's invalid icon cell before the indicator and the error message below; a disabled select is never invalid.
- **Geometry is the template's.** The height, corner radius and icon size are `control.field_height`, `control.field_radius` and `control.field_icon_size` (and the option row height `control.list_item_height`); the frame, label and text are the `field` role cells, so each template draws its own field. Measured against both references in every sample state, in hover, focus and pressed, in light and dark.

## Dropdown

The select family's other member: the same field frame, trigger, label and message, but the open list reads the theme's `list` role cells in full - its container, item heights, dividers inside the inline padding, label colors by state, block padding, radius and shadow - and marks the selected item with the `selected_indicator` icon where `anatomy.list_selected_mark` says so (shown under the primary reference's template, hidden under the second's). The mark's seat mounts on every item under every template and only its drawing changes, so the accessibility tree is the same everywhere. The indicator turns 180 degrees while open. `open` is controllable like `value`, reporting through `onOpenChange`.

## Platform

Both. The frame, trigger and list render on iOS, Android and web; the list is drawn by the library on every platform rather than by a platform picker.

The select fills the width its container gives it (`sample.js` FRAME: the showcase and the walker lay it out at 320). In a container that sizes to its content, its trigger grows from the hidden sizer (the widest option), the same on every platform, never from zero.
