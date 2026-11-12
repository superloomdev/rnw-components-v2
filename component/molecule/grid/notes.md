# Grid family

The layout grid: Grid holds Columns (CSS-grid form) or Rows (flexbox
form); Row and Column read the family context for the gutter halves and
the breakpoint the laid-out width names.

## Decisions

Samples express columns through the `columns` composition prop (as
TileGroup's `items`, D21a): samples cannot carry element children. `span:
0` draws nothing, as upstream's `col-span-0`. Row and Column carry the
`requires_parent` flag: a Row draws only inside a Grid and a Column only
inside a Grid or Row - the family context the Grid provides carries the
gutter halves and the breakpoint. Column also carries `no_reference`:
upstream's bare `.cds--col` box is measured through the Grid and Row
references instead.

## U2 repair (upstream quoted)

The grid takes its container's width, `breakpoint.max` only caps it
(`.cds--css-grid` / `.cds--grid` inline-size 100%). A Column's text child
takes `color.text_primary`, as upstream's bare div inherits the body color
(the dark perceptual 2.5% was black text). The flexbox Row pulls back by half
the regular gutter in every grid kind; condensed and narrow change only the
columns' padding (probe `Row.json`: rows margin-left -16 in all states). The
Row reference draws the probe's FlexGrid itself and the sample's Grid wrapper
is `reference: false` (upstream's `Grid` is the CSS grid).

## Platform

`platform.support` is `both`.
