# View

The layout box every other part of an application sits in. A caller names token leaves (`background: 'layer_01'`, `padding: 'spacing_05'`, `radius: 'radius_08'`); the theme supplies the values, so a surface follows the template and a brand layer without a change.

## Decisions (roster flags `no_reference`, `superloom_decision`)

- **No upstream visual reference.** Neither reference system publishes a plain box as a component; there is nothing to measure against. The gates for this row are structural, accessibility and cross-template consistency.
- **Draws only what is asked.** With no props the box is transparent, borderless and square; there is no default fill, border or padding. This anatomy is a Superloom decision.
- **Values are leaves, not numbers.** Fill and border colors are `color.` leaves, the border width a `border.` leaf, the radius a `shape.` leaf, padding and gap `spacing.` leaves. A leaf the theme lacks throws at render.
- **A border needs a width.** `borderColor` alone draws nothing; `borderWidth` alone draws in `border_subtle_01`.

## Platform

Both. React Native's view element renders on iOS, Android and web.
