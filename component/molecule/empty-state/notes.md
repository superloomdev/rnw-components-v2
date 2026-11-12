# EmptyState family

A title, supporting text, an action and a link under an optional
illustration. The upstream is the product-patterns `EmptyState`.

## Decisions

The action is an `sm` `tertiary` Button (the upstream default); the title
is a `Heading`-sized text in the `empty_state_title` type sets; the
illustration is a host `Image` (or a node) seated at `top` or `left`.

U2 repair (upstream quoted): the root is a flex row, its direction set by
the illustration position (`_empty-state.scss` `-position--top|right|bottom|
left`); the illustration keeps `margin-block-end` 16 in every position, so
`left` seats the content flush at x 80 and stretches it to 96 (probe
`illustrationLeft`: content x 116 = 36 + 80, height 96). The title and the
subtitle pad their bottoms (8, 16); the action button is a block with
`margin-block-end` 16 before the link (`__action-button`; probe `actions`:
action y = subtitle end, link y = action end + 16). The content takes the
widest child in a row and the full width in a column (probe: 253.6 vs 400).
The action Button takes the label as `children`; it was passed as `label`
and drew an empty 80 px face. It carries `pressFloor`, as the link beneath
it crowds a 32 px target.

## Platform

`platform.support` is `both`.
