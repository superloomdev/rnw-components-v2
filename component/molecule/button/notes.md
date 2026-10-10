# Button

A pressable root holding a one-line label and, optionally, a trailing decorative icon. The kind names the theme's `button` role cells it draws in (fill, label, border and elevation per state), the size picks a height, and the theme's `feedback.press` enum decides how hover and press are shown.

## Decisions (roster flag `superloom_decision`)

- **Every state is the theme's cell.** Each kind reads its own cells for rest, hover, pressed, focus, disabled and selected: the fill, the label color, the border (rest, hover, pressed, disabled) and the elevation (`shadow.button_<kind>` per state). A focused button draws its focus cells, which equal rest unless the reference fills on focus. Under `highlight` the container paints the state's fill cell; under `ripple` the state's cell is a layer over the resting container (a reference that draws a state layer states it flattened over the container, or translucent over a transparent one); under `opacity` the resting fill fades by the theme's state opacities. The label follows the same state. The state layer element is always mounted, so the element tree is the same under every template.
- **Focus ring.** The ring is the theme's button cells: its width, offset (below zero it is drawn inside the edge) and color, and the page-color line some systems draw inside it. Under `feedback.focus_trigger: keyboard` it shows on keyboard focus only, so a pointer press draws none.
- **Tonal and elevated are Superloom decisions.** The primary reference has no such kinds. `tonal` fills with the accent layer and its hover and active steps; `elevated` fills with the first layer, draws its label in the link color (the interactive hue as it reads on a surface, which a dark scheme tints) and lifts with the first shadow level. Each template answers their cells; a reference without such a kind draws them in its own roles.
- **Geometry is the template's.** The default height, inline paddings, ghost paddings, minimum width, corner radius, icon size and label type set are the `control.button_*` roles and `type.button_label`, so each template draws its own button (a 48px square-cornered button in one, a 40px pill at least 64 wide in another); the other sizes follow the shared size scale. Measured against both references in every sample state, in hover, focus and pressed, in light and dark.
- **The border is always drawn.** Every kind carries the same border width in its border cell (transparent unless the kind is outlined or the theme says otherwise), so all kinds share one outer size and the paddings are measured inside the border.
- **Label position.** The label is centered in the default height. In a taller button the theme's `anatomy.button_label` decides: `top` keeps it where the default height puts it (the primary reference caps the block padding at the default height's), `center` centers it in the button's own height (the second reference's button centers its content at any height).
- **Ghost kinds reserve no icon slot.** `ghost` and `danger_ghost` take the ghost paddings and set the icon after the label; every other kind reserves a trailing slot and sets the icon in it.
- **Composition.** The button composes the `Icon` atom for its trailing glyph, which makes it a molecule.
- **Selected.** A button that toggles passes `selected`; while selected it draws the kind's selected fill and label cells, and hover and press still apply over it. This is a `superloom_decision`: the primary reference draws selection only on an icon-only button (its selected surface with the primary text), the second reference's selected action is its segmented button's selected colors; each template answers the cells, and the selected state has no measurement counterpart.

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
