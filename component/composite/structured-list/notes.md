# StructuredList notes

## The table

The upstream list is a CSS table as wide as its container (`_structured-list.scss:31-38`): every column takes its
width from every row's cells by the browser's automatic table layout, which no flex layout reproduces. Each text
cell measures its own text through a hidden copy beside it (opacity 0, out of flow, hidden from assistive
technology): the whole text on one line is its max-content width, the widest run between break opportunities (a
space, after a hyphen) its min-content width, padding added. The wrapper takes the widest cell of each column,
measures its own width, and shares it out as the browser does (`structured-list-layout.js`, read from the probe's
column widths):

- room for every column's max-content width: each takes it, and the rest goes to the columns in proportion to it
  (`default`: 127.922 / 98.625 / 399.5 scaled by 1.2779 to 163.469 / 126.031 / 510.5);
- less room: each column grows from its min-content toward its max-content width in proportion to the difference
  (`wraps`, `wrapsAll`);
- a marker column is fixed at `control.structured_list_marker_column` (`selection`, `radio`).

A cell's `max-inline-size: 36rem` caps the max-content width the cell hands in, not its column (`twoColumns`:
127.922 x 800 / (127.922 + 576) = 145.375, the long column drawn 654.625). Its value is a cell the contract does not
have yet (`control.structured_list_cell_max_width`, queued for the next wave): until it lands ours applies no cap, and
`wrapsAll` and `twoColumns` draw their columns too narrow (`_test/fixtures/expected-gaps.json`). A cell
whose content is not text hands in no width of its own: its column is what its text cells and the room give it.
The copy never moves: it sits out of flow in a box of no size, so a column width it causes does not change it.

## Rules with more than one outcome (plan 0162 E17)

| Rule | Outcomes | Sample states |
|---|---|---|
| Width shared out (`_structured-list.scss:31-38`) | room to spare / a column wraps / a marker column fixed | `default`; `wraps`, `wrapsAll`; `selection`, `radio` |
| `noWrap` (`:183-185`) | held at its line / free to wrap | `wraps` / `wrapsAll` |
| Cell max width (`:178`) | under it / past it, the cell's share capped (queued cell) | `default` / `twoColumns`, `wrapsAll` |
| Paddings (`_mixins.scss:25-51`, `:22-69`) | plain / condensed / flush / selection / selection condensed / flush under selection (ignored) | `default`, `condensed`, `flush`, `selection`, `selectionCondensed`, `selectionFlush` |
| Head row floor 40 (`:157-169`) | content taller (16 + 18 + 8) / floor wins (condensed 8 + 18 + 8) | `default` / `condensed` |
| Marker (`StructuredList.js` Row, `:189-214`, `:270-281`) | none / trailing checkmark / leading radio | `default` / `selection` / `radio` |
| Checked (`:194-209`) | no row / a middle row / the last row (the closing rule) | `selection` / `selected`, `radioSelected` / `selectedLast` |
| Hover (`:94-112`) | a row not selected / a selected row (unchanged) / the next row's rule | `selection` hover / `selected` hover of the third row / both |
| Focus ring (Row `onFocus`) | radio row, none or it selected / check row: never | `radio` focus / `selection` focus |
| Condensed checkmark (`:181`, `:210-214`) | at the 16 end space / at the 8 end space | `selected` / `selectionCondensed` |
| Skeleton rows | five / one | Skeleton `default` / `one` |

## Borders

Upstream collapses the rules between rows: a row's box holds half of each rule on either side. Ours draws a rule
above each body row and the body draws the last row's closing rule, so a row's box is one rule taller at the top
and none at the bottom: every row and the head agree within half a pixel, and a cell's box is its row's less the
rule (its height is left out of the comparison, its top is within half a pixel). The rule above a row takes the
row's own hover or selected fill, or the row before it's; the pointer's wins (`:103-111` outranks `:120-124`).

## Selection

A selection row is pressed to select it; its hidden radio (StructuredListInput) takes focus, Space selects, and the
arrow keys select the next or previous row and move focus there, as the browser's radio group does. The row draws
its focus ring only in the radio form, and only when it is selected or no row is: upstream's Row reads its own
`selection` prop to keep focus, which the check form's rows do not carry. A selectable row holds
`control.structured_list_row_min_height`: 0 in the base, the target floor in the compact and medium form classes
(decision 62), since a condensed selection row is 37 high.

## Members

StructuredListHead, StructuredListBody, StructuredListRow, StructuredListCell and StructuredListInput carry
`requires_parent`: each reads the table the wrapper provides (its form, the selection, the column widths), so each
sample mounts in a whole list and each reference draws the same upstream list (`referenceProps.list`). A member
rendered without its list draws its own parts at their content widths and selects nothing.

## Platform

`both`: the layout is the same on every host. The hidden copy measures max-content in a row that scrolls, the one
container a native layout measures without its width (a row that does not scroll gives its children at most its
own width, which here is none).

The first device walk (native 45438462597, U7d) measured two text rules of the hosts, both read from the run's
screenshots and a text model built from the font's advances, which gives the web's height of every state at the 262
room and each device's from its rule:

- Android breaks no line after a hyphen inside a word: "Runs customer-facing services" drew "customer-fa / cing
  services", 20 short in every selection state. The context's Android text wrapper offers the break with a zero-width
  space after such a hyphen (`withHostTextDefaults`), for every text the library draws.
- iOS adds 0.001 to a text's height before it ceils it to the pixel grid, so the half-pixel cut under the line height
  held one line and took a sixth of a point from each further one (`wraps` 2.33 short over 11 lines). `typeStyle` now
  sets the line height 0.002 below the grid.

At the 262 room `wraps` and `wrapsAll` held the line "to the standby" 0.1 px over its column on the web, and a host
whose glyph run was a tenth of a pixel narrower drew one line fewer (Android, 20 short): a line that near its room
measures the hosts' glyph runs, not this layout. Both states now draw their own text (`WRAPPED`), chosen so that at the
walks' rooms (262 and 344) every line ends more than 4 short of its column and the next word passes it by more than 4,
by the text model on the font's advances, fractional and whole-pixel alike. `twoColumns` keeps the longer text: its
columns wait for the cell's max width, and its lines are read again after that wave.
