# AspectRatio

A box that keeps its `ratio` (`W x H`) whatever width its container gives it, holding its children. A string child renders through the Text atom, so the row sits at molecule tier. It reads no token: the proportion is prop data, not theme data.

## Decisions

- **The ratio is the layout property, not a padding trick.** The primary reference holds its shape with a floated sliver whose top padding is the ratio's percentage; the component uses the style engine's own `aspectRatio`, which the host layouts resolve to the same rectangle.
- **`as` is not carried.** The reference lets a caller swap the rendered element; a native view has no element name to swap, so the prop is dropped — a `View` is the only answer on every platform.
- **A text child goes through `Text`.** A string child renders through the Text atom (`ctx.Registry.Text`), so the component composes a library component — the same rule that makes IconButton a molecule.
- **Unknown ratios fall back to `1x1`.** A `ratio` outside `variants` draws the square default rather than collapsing, so a wrong prop still renders a visible box.

## Platform

Both platforms. The box is layout only and draws no paint of its own; the Text child it may render is the atom's own.
