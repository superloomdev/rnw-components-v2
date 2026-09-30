# Text

The text atom. A caller names a type set (`type: 'heading03'`) and a color leaf (`color: 'text_secondary'`); the theme supplies the family, size, line height, weight, tracking and color, so the same `Text` reads as each template's typography without a change.

## Decisions

- **The type is a contract leaf.** `type` takes any `type.` leaf the contract defines, not a fixed list of names; a leaf the theme lacks throws at render. The default is `body_compact_02`, the reference's own default.
- **Color is a token, never a value.** `color` takes a color leaf; the default is `text_primary`.
- **Break mode.** `head`, `middle` and `tail` render a single line with the ellipsis at that position; `wrap` or no break mode wraps freely.
- **No geometry.** The spec sheet is empty: everything Text draws comes from the type set and the color token.

The row carries no roster flags.

## Platform

Both. React Native's text element renders on iOS, Android and web; the family token names a font the host installs.
