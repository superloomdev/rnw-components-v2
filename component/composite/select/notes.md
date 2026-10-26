# Select

A field that opens a list of options: a label, a frame holding a pressable trigger (the selection or the placeholder, an error icon while invalid, and the dropdown indicator), and a helper or error message below. It shares the text input's field presentation, so the theme's `feedback.field` and `anatomy.label` enums and its `field` role cells draw it the same way.

## Decisions

- **Shared field frame.** The frame, its fill, outline, widths, paddings, label and text by state come from the context's field presentation, exactly as for the text input; while open, the frame counts as focused so a floating label rises. The select is a member of the field family with one cell of its own: a disabled select draws its outline in `select_outline_disabled` (the primary reference draws none, its filled frame still showing the control's shape; the second reference keeps its translucent disabled outline). It hovers with the family's `field_container_hover`, as the primary reference's select does. An invalid select draws the family's invalid outline and, where the theme states a ring width, its inner error ring.
- **Placeholder.** While nothing is selected the trigger holds the placeholder. Under a floating label it is never drawn, open or not, as the second reference's select draws none; it stays in the element tree, so assistive technology hears the same trigger under every template.
- **Width.** The trigger is as wide as its widest text (the placeholder or any option), as a platform select is, so the frame keeps one width whatever is selected. A hidden sizer holding those texts sets it; it takes no height and is hidden from assistive technology.
- **Indicator.** The trailing indicator is the theme's `dropdown_indicator` icon role in the field's indicator cell for the state: the primary reference's chevron in one template, the second reference's own ten-by-five drop-down drawing in another. Which glyph a part shows is template data, so the select names the role and never a shape. The frame's trailing padding is the theme's `control.field_icon_inset`, the gap before the indicator `control.field_icon_gap`.
- **List.** While open, the options are laid out directly below the frame, spanning its width, on the theme's `list_container` fill at the `dropdown` stacking level with the `list` shadow and `control.list_radius`, each option at `control.list_item_height` in the `list_item` type set with the `list_item` label and container cells for its state. The selected option fills with `list_item_container_selected`, the highlighted one with `list_item_container_hover`, a pressed one with `list_item_container_active`. The list closes on selection, on Escape and on a second press of the trigger.
- The open list marks the chosen option for assistive technology only; it draws no selected fill or mark, as the reference draws none.
- **Keyboard.** Arrow keys open the list and move the highlight, Enter and Space open it or commit the highlighted option, Escape closes it; all of this is the select behavior's.
- **Invalid.** An invalid select shows the `invalid` icon role in the field's invalid icon cell before the indicator and the error message below; a disabled select is never invalid.
- **Geometry is the template's.** The height, corner radius and icon size are `control.field_height`, `control.field_radius` and `control.field_icon_size` (and the option row height `control.list_item_height`); the frame, label and text are the `field` role cells, so each template draws its own field. Measured against both references in every sample state, in hover, focus and pressed, in light and dark.

## Dropdown

The select family's other member: the same field frame, trigger, label and message, but the open list reads the theme's `list` role cells in full - its container, item heights, dividers inside the inline padding, label colors by state, block padding, radius and shadow - and marks the selected item with the `selected_indicator` icon where `anatomy.list_selected_mark` says so (shown under the primary reference's template, hidden under the second's). The mark's seat mounts on every item under every template and only its drawing changes, so the accessibility tree is the same everywhere. The indicator turns 180 degrees while open. `open` is controllable like `value`, reporting through `onOpenChange`.

## SelectSkeleton

The select field's loading shape: an optional label placeholder over a field-height placeholder, drawn by the shared field-skeleton parts the family's other skeletons use. The block's height is the theme's `control.field_height` - the primary reference's select skeleton is a fixed 40px with no size variant (`select/_select.scss:317-327`), so there is no `size` prop. The second reference has no skeleton; the primary reference alone is measured.

## DropdownSkeleton

The dropdown's loading shape: the same label bar and field-height block. The primary reference marks its whole form wrapper with the skeleton class (`Dropdown.Skeleton.js:23-27`), but the skeleton mixin is emitted per component (`_dropdown.scss:489-492` matches `.cds--dropdown.cds--skeleton` only) - no compiled rule answers the bare `cds--skeleton` class, so the rendered wrapper stays transparent and the gap between the bars shows the page, exactly as upstream draws it. The upstream `size` prop is excluded: it emits a `cds--list-box--{size}` class no compiled rule answers (`_dropdown.scss` carries `cds--dropdown--sm`/`--lg`, never on the skeleton), so upstream's block stays 40px whatever the size - an inert prop, not a variant.

## MultiSelect

The family's multiple-choice field: a frame row of an optional selection-count member and a combobox control, an option list where every row carries a decorative checkbox member and toggles without closing, and a live region that announces each committed count. The selected values are keyed by `items` value, never by row position; a selection the current list cannot show stays selected until the count member's clear empties it. Selected rows order ahead of unselected ones, and within each partition the items keep the host's own order; during an open session that order is a snapshot, so a toggled row never jumps under the pointer.

The count member is the dismissible tag's composition surface carrying the source's high-contrast palette - the existing `background_inverse`, `text_inverse`, `icon_inverse`, `background_inverse_hover` and `focus_inverse` leaves, `layer_01`, `text_disabled` and `icon_disabled` while disabled, and no tooltip because the control's `title` already names it. The second system has no multiple-choice field, so that member's treatment is a Superloom decision - the roster row's `superloom_decision` flag. The option checkbox is a presentation-only member of the same kind: it keeps its paint but answers no input, the option row being the one active surface.

The option block's text inset is the source's twenty-eight-pixel checkbox label padding plus its ten-pixel text padding, thirty-eight total, not the twenty-eight cell alone. The first highlighted row draws the source's own mounted border - the field focus width on the sides and bottom, one pixel on top - when the count member shows, where every other highlighted row takes the ordinary field focus ring. `open` is controllable like the selection, reporting through `onOpenChange`; the source's closed Escape clears the selection where ours claims nothing, so the fixture's dismissal is an outside click.

## FilterableMultiSelect

The query-bearing form of the same field: the control is an editable input and its text filters the open list through `shouldFilterItem`, defaulting to case-insensitive label inclusion. Filtering changes which rows display, never which values are selected - the count member still clears the whole selection, including rows the current query hides. The query is its own channel (`inputValue`/`defaultInputValue`/`onInputChange`), independent of the selection array.

The source's variants stay unported: there is no `select-all` row or mixed selection state, no `readOnly`, `warn`, `inline` or `upward` variant, as the carried contract keeps the field's one anatomy.

## SelectItem

SelectItem is Select's option row, composed by Select with the behavior's option props; rendered alone it answers the same role and state from its own props. `requires_parent`: it must be composed inside Select; its standalone render is for the showcase and the gates only. Upstream's `hidden` prop is not carried: Select's `placeholder` covers its use. A long option label truncates to one line in every template; the second reference wraps it into a two-line row, so that state is not measured against it.

## SelectItemGroup

SelectItemGroup is Select's option-group row; it must be composed inside Select. A group entry in `items` carries `{ label, items, disabled? }`: the behavior works on the flattened options while the render keeps the group structure. Neither reference system draws an option group header of its own, so the header's height, padding, type and color read the theme's list cells as a Superloom decision. `requires_parent`: it must be composed inside Select. `superloom_decision`: neither reference system draws an option group header, so the header's values are a Superloom decision. Its header row draws no divider, and the first option inside a group draws none.

## ComboBox

ComboBox is the family's single-choice field with an editable input that filters the open list as you type and a clear action once a value is chosen. Its trigger is a text input, so it takes the text input's field member: the field does not repaint on hover or press as a select's does, and its option list draws no selected mark - the selection lives in the input's text, as the reference draws none. The Material template's member cells equal Carbon's (census).

## FloatingActionButton

FloatingActionButton is a raised icon button, optionally extended with a label, for a screen's primary action. The source's `lowered` prop and disabled state are not carried: there are no cells for them.

## Platform

Both. The frame, trigger and list render on iOS, Android and web; the list is drawn by the library on every platform rather than by a platform picker.

The select fills the width its container gives it (`sample.js` FRAME: the showcase and the walker lay it out at 320). In a container that sizes to its content, its trigger grows from the hidden sizer (the widest option), the same on every platform, never from zero.
