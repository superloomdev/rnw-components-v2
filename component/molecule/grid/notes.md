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

M6 gate (upstream quoted): a condensed flexbox grid also pads every column's
block ends by half the condensed gutter (the grid package's
`_flex-grid.scss:317-319`, `padding-block: $condensed-gutter * 0.5`), so a
condensed row of one text line is 19 tall, not 18 (fidelity `condensed`
columns height 18 vs 19).

## The narrow set (plan 0162 U7r)

At the sm breakpoint every column spans one of four tracks and keeps a
gutter half on each side (`grid/scss/_css-grid.scss:90`, `:129`:
`margin-inline: var(--cds-grid-gutter-start) var(--cds-grid-gutter-end)`,
1rem each), so a 320 body gives a column 80 - 32 = 48. The sample's text
was `Column`, 49.4 wide: the browser lets a word wider than its box
overflow it (18 tall), React Native breaks it by letter on every host
(react-native-web's Text keeps `wordWrap: 'break-word'`, `Text/index.js:146`;
Android and iOS have no overflowing word), 36 tall. The library draws that
host rule on the web too, so the web and the devices agree (platform
exception 30). The sample draws the grid's tracks, not that rule: its text
is `Col`, 20.8 wide, clear of every column a gate draws.

## Platform

`platform.support` is `both`.
