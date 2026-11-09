# SkipToContent notes

- The link keeps upstream's two states exactly: a 1 x 1 clipped box at
  rest (the text clipped by `overflow: hidden`, never removed) and, while
  focused (any focus, as upstream's `:focus`), drawn at `(-1, -1)` of the
  staged containing block - the rest rule's `margin: -1px` is not reset
  by the focus rule (`_header.scss:436-447`), recorded as a spec constant.
- Focused, the link draws `control.skip_link_height` (48) tall,
  `control.skip_link_padding_inline` (16) inline padding, a
  `control.skip_link_border_width` (4) border in `color.skip_link_border`,
  on `color.skip_link_container` with `color.skip_link_label` text in
  `type.skip_link` (16/16/400/0 under the reference template)

- **Flagged `web_only`.** Native screens have no tab order to skip; the link exists for the web platform's keyboard navigation, so the roster carries `web_only` and the component renders on web only., at `stacking.skip_link`
  (9999), content centred vertically.
- Upstream marks its tokens unspecified (`_header.scss:462`); the cell
  values come from the probe's computed readings, not the stylesheet.
- Activating follows the href (the browser's own navigation); the
  component owns no focus shift.
- Native renders nothing (`platform.support: web`): one file,
  `ctx.platform.split({ web })` returning null for the native half.
- The focused link is underlined, as the reference draws it (the user agent's anchor underline; the reference's own rules set no text-decoration).
