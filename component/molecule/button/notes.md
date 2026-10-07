# Button

A pressable root holding a one-line label and, optionally, a trailing decorative icon. The kind names the theme's `button` role cells it draws in (fill, label, border and elevation per state), the size picks a height, and the theme's `feedback.press` enum decides how hover and press are shown.

## Decisions (roster flag `superloom_decision`)

- **Every state is the theme's cell.** Each kind reads its own cells for rest, hover, pressed, focus, disabled and selected: the fill, the label colour, the border (rest, hover, pressed, disabled) and the elevation (`shadow.button_<kind>` per state). A focused button draws its focus cells, which equal rest unless the reference fills on focus. Under `highlight` the container paints the state's fill cell; under `ripple` the state's cell is a layer over the resting container (a reference that draws a state layer states it flattened over the container, or translucent over a transparent one); under `opacity` the resting fill fades by the theme's state opacities. The label follows the same state. The state layer element is always mounted, so the element tree is the same under every template.
- **Focus ring.** The ring is the theme's button cells: its width, offset (below zero it is drawn inside the edge) and colour, and the page-colour line some systems draw inside it. Under `feedback.focus_trigger: keyboard` it shows on keyboard focus only, so a pointer press draws none.
- **Tonal and elevated are Superloom decisions.** The primary reference has no such kinds. `tonal` fills with the accent layer and its hover and active steps; `elevated` fills with the first layer, draws its label in the link color (the interactive hue as it reads on a surface, which a dark scheme tints) and lifts with the first shadow level. Each template answers their cells; a reference without such a kind draws them in its own roles.
- **Geometry is the template's.** The default height, inline paddings, ghost paddings, minimum width, corner radius, icon size and label type set are the `control.button_*` roles and `type.button_label`, so each template draws its own button (a 48px square-cornered button in one, a 40px pill at least 64 wide in another); the other sizes follow the shared size scale. Measured against both references in every sample state, in hover, focus and pressed, in light and dark.
- **The border is always drawn.** Every kind carries the same border width in its border cell (transparent unless the kind is outlined or the theme says otherwise), so all kinds share one outer size and the paddings are measured inside the border.
- **Label position.** The label is centered up to the default height; a taller button keeps it where the default height puts it, near the top, as the primary reference does.
- **Ghost kinds reserve no icon slot.** `ghost` and `danger_ghost` take the ghost paddings and set the icon after the label; every other kind reserves a trailing slot and sets the icon in it.
- **Composition.** The button composes the `Icon` atom for its trailing glyph, which makes it a molecule.
- **Selected.** A button that toggles passes `selected`; while selected it draws the kind's selected fill and label cells, and hover and press still apply over it. This is a `superloom_decision`: the primary reference draws selection only on an icon-only button (its selected surface with the primary text), the second reference's selected action is its segmented button's selected colours; each template answers the cells, and the selected state has no measurement counterpart.

## Platform

Both. The pressable root, the label and the icon render on iOS, Android and web; hover feedback appears only where a pointer exists.
