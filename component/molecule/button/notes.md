# Button

A pressable root holding a one-line label and, optionally, a trailing decorative icon. The kind names the theme's `button` role cells it draws in (fill, label, border and elevation per state), the size picks a height, and the theme's `feedback.press` enum decides how hover and press are shown.

## Decisions (roster flag `superloom_decision`)

- **Every state is the theme's cell.** Each kind reads its own cells for rest, hover, pressed, focus, disabled and selected: the fill, the label color, the border (rest, hover, pressed, disabled) and the elevation (`shadow.button_<kind>` per state). A focused button draws its focus cells, which equal rest unless the reference fills on focus. Under `highlight` the container paints the state's fill cell; under `ripple` the state's cell is a layer over the resting container (a reference that draws a state layer states it flattened over the container, or translucent over a transparent one); under `opacity` the resting fill fades by the theme's state opacities. The label follows the same state. The state layer element is always mounted, so the element tree is the same under every template.
- **Focus ring.** The ring is the theme's button cells: its width, offset (below zero it is drawn inside the edge) and color, and the page-color line some systems draw inside it. Under `feedback.focus_trigger: keyboard` it shows on keyboard focus only, so a pointer press draws none.
- **Tonal and elevated are Superloom decisions.** The primary reference has no such kinds. `tonal` fills with the accent layer and its hover and active steps; `elevated` fills with the first layer, draws its label in the link color (the interactive hue as it reads on a surface, which a dark scheme tints) and lifts with the first shadow level. Each template answers their cells; a reference without such a kind draws them in its own roles.
- **Geometry is the template's.** The default height, inline paddings, ghost paddings, minimum width, corner radius, icon size and label type set are the `control.button_*` roles and `type.button_label`, so each template draws its own button (a 48px square-cornered button in one, a 40px pill at least 64 wide in another); the other sizes follow the shared size scale. Measured against both references in every sample state, in hover, focus and pressed, in light and dark.
- **The border is always drawn.** Every kind carries the same border width in its border cell (transparent unless the kind is outlined or the theme says otherwise), so all kinds share one outer size and the paddings are measured inside the border.
- **Label position.** The label is centered in the default height. The theme's `anatomy.button_label` covers both axes: `top` keeps the label where the default height puts it and, in a wider button, holds it at the start padding (the primary reference's `.cds--btn` spreads its content `justify-content: space-between`, `button/_mixins.scss:50`, and sets `text-align: start`, `:70`); `center` centers it in the button's own height and width (the second reference's button centers its content at any size).
- **Ghost kinds reserve no icon slot.** `ghost` and `danger_ghost` take the ghost paddings and set the icon after the label; every other kind reserves a trailing slot and sets the icon in it.
- **Composition.** The button composes the `Icon` atom for its trailing glyph, which makes it a molecule.
- **Selected.** A button that toggles passes `selected`; while selected it draws the kind's selected fill and label cells, and hover and press still apply over it. This is a `superloom_decision`: the primary reference draws selection only on an icon-only button (its selected surface with the primary text), the second reference's selected action is its segmented button's selected colors; each template answers the cells, and the selected state has no measurement counterpart.
- **Composition props.** `minWidth`, `maxWidth` and `paddingStart` exist for composing parents only and are listed under `composition` in the api: they override the computed geometry (the combo button's width window, the fluid set's ghost padding). Label placement is not a prop: the theme's `anatomy.button_label` answers it.

## Platform

Both. The pressable root, the label and the icon render on iOS, Android and web; hover feedback appears only where a pointer exists.

# IconButton

The Button family's icon-only member: a square Pressable holding one icon token inside a compact `Tooltip` whose label is the button's accessible name. It shares the button's role cells, press presentation and focus ring; only its own member cells and decisions follow.

## Decisions

- **The square.** `lg` reads `control.icon_button_size` (the button's own height); `sm` and `md` come off the shared size scale. The border is always drawn, as the button's, so every kind shares the outer size, and `control.button_radius` gives each template its shape (a full radius on a square is a circle).
- **Icon color.** Filled kinds draw their icon in the kind's label cells; the standard (`ghost`) and outlined (`tertiary`) kinds read the member cells `color.icon_button_<kind>_icon` per state, which state the icon color apart from a labelled button's.
- **Toggle.** A `selected` prop makes the button `aria-pressed`; true draws the kind's selected cells, and hover and press still apply over it.
- **The tooltip is `compact`.** `align` chooses the side (default `top`); the label names the button and describes it through the tooltip's own `aria-describedby`. A disabled button still shows it.
- **Composition.** The icon atom draws the glyph, the Tooltip molecule the popover; both keep the element tree identical across templates.

## Second reference

`md-icon-button` (standard -> `ghost`), `md-outlined-icon-button` (`tertiary`), `md-filled-icon-button` (`primary`), `md-filled-tonal-icon-button` (`secondary`). It has no sizes, so `sm` and `md` are unmeasured there, and no rendered tooltip.

# ButtonSet

A row of Buttons built from `items` data, each filling a seat that shares the row up to the set's item width, with the theme's separator line between seats; `stacked` makes it a column and `fluid` a measured, kind-ordered, end-aligned layout that stacks under the items' floor.

## Decisions (roster flag `superloom_decision`)

- **Items, not children.** The set takes each button's props as `items` data (as Menu takes `items`) rather than arbitrary children, so the seats, the ordering and the focus tracking the separators need are the set's own.
- **The separator is a drawn line, not a shadow.** The primary draws the seam as a `-1px` box-shadow on every button but the first (the top edge in a column); the library draws a `border.width_01` view at each seat's leading edge instead, which reads the same pixel for pixel. Its ink is `color.button_set_separator`, `color.button_set_separator_disabled` beside a disabled item in a row, `color.button_set_separator_stacked_disabled` in a column, and transparent - still mounted - beside a focused item, as the primary's `:focus` rules suppress the same shadow.
- **The gap is the template's.** `control.button_set_gap` spaces the seats: 0 in the primary (buttons sit adjacent, the separator touching both), a positive gap where a template answers one; the transparent-separator template then leaves a visible gap where a seam would be.
- **Fluid order and stacking are the reference's rules.** A fluid set sorts its items by kind (ghost, danger ghost, tertiary, other, danger, primary) and reverses that order once stacked - by `stacked` or by its own measured width falling at or under the item count times the fluid floor. In a fluid row every seat is a quarter of the row, floored at `control.button_set_fluid_min_width` and capped at `control.button_set_fluid_max_width`; ghost items grow free of the ceiling with `control.button_set_fluid_ghost_padding_start`. At two items within four floors each takes half with no cap; one item within three floors takes the row. The stacked fluid column switches its ghost padding to `spacing_05`, as the reference's auto-stack does.
- **No second system.** The second system draws no button set and no seam between buttons; its separator and gap answers are a Superloom decision - the roster's `superloom_decision` flag.

## Platform

Both. The row, the column, the seats and the separator views render identically on iOS, Android and web; the fluid set's measured layout reads the same `onLayout` width natively, with no transition - the seat sizes simply change.

# ButtonSkeleton

The skeleton placeholder drawn in a button's shape: the button's height for the size, the button's corner and the skeleton button width.

## Decisions (roster flag `superloom_decision`)

- **The shape is the button's.** Height follows the button's size scale (`size` xs through 2xl, default lg at `control.button_height`), the corner is `control.button_radius` and the width is `control.button_skeleton_width`; the shimmer is the skeleton family's.
- **`href` is not carried.** The primary's skeleton can render as an anchor; a placeholder is not a link, so the component takes only `size` and `testID`.
- **No second system.** It has no skeleton element; the placeholder drawing is a Superloom decision.

## Platform

Both. The placeholder and its reduced-motion rule behave the same natively.

# PrimaryButton, SecondaryButton, DangerButton

Thin kind wrappers over Button: each mounts `ctx.Registry.Button` and fixes the kind - `primary`, `secondary` and `danger` respectively.

## Decisions

- **Kind precedence is the primary's.** PrimaryButton and SecondaryButton set their kind before the caller's props (`Object.assign({ kind }, props)`), so a caller's `kind` wins - the upstream wrappers pass `kind` first the same way. DangerButton sets its kind after (`Object.assign({}, props, { kind: 'danger' })`), so it is always `danger`, as the upstream's is.
- **No tokens.** The wrappers add and read nothing: the Button molecule owns the whole contract surface, so each spec sheet is empty and `tokens` is `[]`.

## Platform

Both, through the Button they mount.
