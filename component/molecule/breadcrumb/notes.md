# Breadcrumb

A `nav` landmark holding an ordered list of `li` items: links through
`ctx.Registry.Link`, the current page `aria-current="page"` in
`color.breadcrumb_current`, the `/` separator in
`color.breadcrumb_separator` at the `control.breadcrumb_gap` (`_small`)
gap after every item but the last. `BreadcrumbItem` renders the item;
`BreadcrumbSkeleton` renders the shimmer bars with the same separators
and no landmark.

U4c (upstream quoted, probe `Breadcrumb@375.json`, a 320 body in a 375
window). Below `breakpoint.md` the list is `display: inline` around
`display: flex` items (`breadcrumb/_breadcrumb.scss:25-33,43-48`),
so every item takes its own line across the list: items 312 wide (the
last 320) and 18 apart (15.98 small). The list stacks its items below md,
read from the window as upstream's media query is. The last item takes no
end gap at every width (`:88-91`). The reference's `narrow` set draws that
side. A composing parent's items: an icon link (`icon`, `iconColorLeaf`;
the page header's back link), an item that keeps its room unseen
(`hidden`), its place in the parent's line box (`offsetTop`,
`boxHeight`) and its width (`onLayout`).

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
- **BreadcrumbItem** (requires_parent): must be composed inside Breadcrumb; measured through Breadcrumb's samples.
- **BreadcrumbItem** (no_reference): no standalone upstream mount; measured through Breadcrumb's samples.
- **BreadcrumbItem** (no_reference): no standalone upstream mount; measured through Breadcrumb's samples.

A composing parent may hand the list and every item its own type set and
item gap (`typeLeaf`, `gap`); the page header's breadcrumb row does, with
label-01 and its 4 gap.
