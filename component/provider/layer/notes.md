## Decisions (roster flag `superloom_decision`)

- **No second-system layer.** The second system has no Layer element - the roster's `superloom_decision`; where it is silent the template decides each level's values, and the literal `field_container` that template authors stays literal at every level.
- **Leveled tokens.** The layer does not re-read its children's tokens: it publishes a painted level (1-3) on the shared structural context and the reader seam answers `ctx.token`/`ctx.color` from that level's table when the built theme carries one - so `field_container`, the `layer_*` surfaces and the leveled borders step up for every descendant without a prop. A literal value never moves. An explicit `level` override counts from the page surface (`0` paints level 1 even inside a level-3 layer); an omitted level paints one deeper than the enclosing level, matching the upstream default of an unpainted page being level 1.
- **`withBackground`.** The surface is `color.layer_background_0N` for the painted level, read from the base map - the suffixed members are the per-level values already, and there is no unsuffixed background token.
- **Text children.** A bare string child renders through the registry Text, as a raw string inside a View crashes a native render.

## Platform

No element semantics are carried: the layer is a plain View plus a context provider on every platform, so the painted level survives inside a hosted overlay through the overlay context bridge.
