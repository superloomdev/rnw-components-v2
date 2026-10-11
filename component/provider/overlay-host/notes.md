# OverlayHost

The overlay layer host. Mount it once at the app root: on a native platform it is how overlays escape a parent's bounds and clipping, and why their coordinates are window coordinates. Without it an overlay renders inline - on the web a `fixed` layer escapes its parent anyway; on a native platform it stays bounded by the parent.

## Decisions (roster flags `no_reference`, `superloom_decision`)

- **No upstream visual reference.** Neither reference system publishes a layer host as a component; there is nothing to measure against. The gates for this row are structural, accessibility and cross-template consistency.
- **Membership, order and space.** The host owns the ordered layer stack and renders each registered layer in registration order inside a transparent full-cover root, and that root is the space its layers live in: a covering layer (a modal's scrim) fills the host, a menu positions at its `x`/`y` in it, and on a native platform an anchored layer is shifted into it by the host's measured window origin. An anchored layer on the web stays viewport-fixed, which survives a document scroll. The host owns no z-order or dismissal - those stay with the layers and their behaviors. A host mounted inside a bounded box (a showcase stage) therefore keeps its layers in that box. This anatomy is a Superloom decision.
- **Invisible when empty.** With no open overlays the layer root draws nothing and passes touches through (`pointerEvents="box-none"`).

## Platform

Both. On the web the fixed layers the overlays draw escape their cells regardless; on iOS and Android the host is what lifts an overlay out of its parent's bounds.
