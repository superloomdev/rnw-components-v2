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

## Platform

`platform.support` is `both`.
