# Tile family

One `View` on the layer groups related content; the interactive rows draw
the same box over a press target.

## Decisions

The rows carry no roster flags. The focus ring draws the tile's own
`tile_focus` / `tile_focus_width` cells as an inset outline (the upstream
edge outline), since no generic inset-ring machinery exists; a disabled
ClickableTile hides its icon seat rather than drawing the disabled glyph,
matching upstream where no glyph renders.

## Platform

`platform.support` is `both`: the rows render on the web and natively from
the same source; hover and focus are the web's states and the press target
is the platform Pressable.
