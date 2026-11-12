# PageHeader family

The page's header stack: breadcrumb row, title row (icon + heading +
actions), subtitle, tags; `scrollY`/`collapseHeader` drive the collapsed
bar. Upstream is the product-patterns `PageHeader`.

U2 repair (upstream quoted, probe `PageHeader.json` at 1280): the content
sits inside `control.page_header_padding_inline` (32: breadcrumb items, title
text and page actions 32 in from each edge, the grid's 16 padding plus the
column's 16); without a breadcrumb row the title row starts 32 down
(`_page-header.scss:410-412`); the last row is followed by a buffer, 32 after
the title row and 16 after a subtitle or the content row or before the tags
(`__last-row-buffer--active`); a 1 px `color.page_header_divider` rule closes
the header (`:114`). The drawn fill is the `::before` layer at full opacity
(`:88-101`), so the root keeps `color.page_header_container` and an
absolute layer paints `color.page_header_container_scrolled` (probe: root
background white, paint layer-01). The page actions take their label as
`children` and their `kind`; the title row and the actions wrap below the
available width. `children` is the content row (`__available-row`, 16 under
the title row, 8 under a subtitle). The 32 and 44 literals wait for cells
(`CONTRACT-REQUESTS.md`, U2). The sample mirrors the probe's eight states.

## Decisions

Composes `Breadcrumb`, `Button`, `Icon`, `Tag`; `scrollY` is a prop (no
DOM scroll read); the collapsed bar keeps the title row only.

## Platform

`platform.support` is `both`.
