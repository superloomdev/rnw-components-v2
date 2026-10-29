# Breadcrumb

A `nav` landmark holding an ordered list of `li` items: links through
`ctx.Registry.Link`, the current page `aria-current="page"` in
`color.breadcrumb_current`, the `/` separator in
`color.breadcrumb_separator` at the `control.breadcrumb_gap` (`_small`)
gap after every item but the last. `BreadcrumbItem` renders the item;
`BreadcrumbSkeleton` renders the shimmer bars with the same separators
and no landmark.

## Decisions

- **`requires_parent`: BreadcrumbItem must be composed inside Breadcrumb; its standalone render is for the showcase and the gates only.**
- **The overflow is a composed `ctx.Registry.OverflowMenu`.** The
  breadcrumb trigger's box, glyph offset, ink, focus underline, menu
  offset, caret and connector suppression are composition props on
  OverflowMenu (`triggerWidth`/`triggerHeight`, `icon`, `iconOffset`,
  `iconColor`/`iconHoverLeaf`/`iconActiveLeaf`, `focusRingLeaf`,
  `focusUnderline`, `menuOffset`, `caret`, `connector`), not a variant.
- **The small link's minimum width is a Link composition prop.** `minWidth`
  applies to the link's face; the pressable grows to cover it.
- **The current page is text, not a link.** Upstream's current item is a
  link-class span with `aria-current`; ours draws link-styled text in
  `color.breadcrumb_current` with no underline and no link semantics.
