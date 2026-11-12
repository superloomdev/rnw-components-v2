# Pagination family

The pagination bar and its satellite rows.

## Decisions

The rows carry no roster flags. PaginationSkeleton composes SkeletonText
bars; the widths are the contract's skeleton cells, not the upstream
placeholders' literal widths.

## U2 repair (upstream quoted)

Pagination (`Pagination.js:221-282`): the left block holds the label, the
page-size select and the item count; the right block the page select, the
page range ("of 11 pages") and the buttons; the bar is `minHeight` size plus
the rule and the blocks stretch to the size (probe: root 41, blocks and
buttons 40). The selects fill the bar and pad 16 / 36 with the arrow inside
the end padding 16 from the end (`_pagination.scss` select rules,
`_select.scss:269-271`) through the Select's inline composition props
`height`, `indicatorEnd`, `dividerEnd` (the page-size select's end rule) and
`fillLeaf` (disabled).

PaginationNav (`PaginationNav.js:155-301`): `md` shows 4 or 5 pages and `sm`
clamps to 4..7 (they were swapped); the row is upstream's order over
calculateCuts (the middle ended one page late); a single hidden page is a
page button and more are a page-sized overflow picker (`OverflowMenu` with
the horizontal glyph) instead of an inline Select; compact page buttons
carry a `hit` expander to the target minimum; the live region is a zero-size
box inside the nav. The reference passes `page` from `defaultPage`, as the
probe mount does.

PaginationSkeleton: every bar keeps its 16 end gap and is the placeholder
alone (`_pagination.scss:278-281` drops SkeletonText's bottom margin); the
left block pads both ends, the right block draws the divider at its start;
the bar is one rule short of its container (`calc(100% - 1px)`).

## Platform

`platform.support` is `both`: the rows render on the web and natively from
the same source.
