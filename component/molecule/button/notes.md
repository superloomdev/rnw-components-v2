# Button

A pressable root holding a one-line label and, optionally, a trailing decorative icon. The kind picks a palette of color leaves, the size picks a height, and the theme's `feedback.press` enum decides how hover and press are shown.

## Decisions (roster flags `superloom_decision`, `deferred_gap`)

- **Press feedback is the theme's choice.** Under `highlight` the fill changes to the kind's hover and active colors, and an outlined or ghost kind switches its label to the color that sits on that fill. Under `opacity` the whole button fades by the theme's state opacities. Under `ripple` a state layer in the label color is laid over the fill at the theme's hover, focus and pressed opacities. The state layer element is always mounted, so the element tree is the same under every template.
- **Tonal and elevated are Superloom decisions.** The primary reference has no such kinds. `tonal` fills with the accent layer and its hover and active steps; `elevated` fills with the first layer, draws the interactive color and lifts with the first shadow level. Both are drawn from existing tokens until the contract carries their own colors.
- **Geometry follows the primary reference; the second reference's shape is deferred.** Height, paddings, corner radius and the label's type set are the primary reference's. The second reference draws a shorter, fully rounded button with symmetric padding and its own label type; the contract does not yet carry per-component geometry, so that shape is recorded as a contract request and the button draws the primary shape with each template's colors meanwhile.
- **The border is always drawn.** Every kind carries the same border width, transparent unless the kind is outlined, so all kinds share one outer size and the paddings are measured inside the border.
- **Composition.** The button composes the `Icon` atom for its trailing glyph, which makes it a molecule.
- **Selected.** A button that toggles passes `selected`; it draws the pressed fill while selected.

## Platform

Both. The pressable root, the label and the icon render on iOS, Android and web; hover feedback appears only where a pointer exists.
