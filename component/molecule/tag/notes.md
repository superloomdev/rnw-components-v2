# Tag

A short, non-interactive label: a pill-shaped container holding an optional decorative icon and one line of text. Every color, size, radius, padding and the label's type set come from the theme's `tag` role cells; a `type` prop picks one of the theme's ten hue cells.

## Decisions

- **A molecule, not an atom.** The tag draws its optional leading icon through the Icon component (`ctx.Registry.Icon`), so it composes a library component - the same rule that makes IconButton a molecule. The icon is decorative; the label names the tag.
- **`type` picks a hue.** The contract's `color.tag_background_<hue>` and `color.tag_color_<hue>` cells (ten hues, answered by every template) color the container, label and icon. No `type`: the neutral `tag_container` / `tag_label` / `tag_icon` cells. The hue border cells (`tag_border_<hue>`) belong to the interactive tag variants of a later part; a read-only tag draws no hue border in the primary reference.
- **The outline is an inset shadow, not a border.** A real border would move the text inward and grow the box by two widths; both references draw the tag's outline as an overlay that does neither (`border: 0` on the primary, an absolutely-positioned `.outline` element on the second). The component paints `control.tag_outline_width` of `color.tag_outline` (`_disabled`) as an inset `boxShadow` - zero width under the primary, 1px under the second.
- **Sizes from the scale.** `md` height is `control.tag_height`; `sm` is the first icon step plus the first spacing step (the primary's 18); `lg` is the small size step (32 in both references). The minimum width is the small size step, matching the primary's `min-inline-size`. The large size widens the inline padding to `spacing.spacing_04`, and an icon shortens the start padding to `control.tag_padding_icon` (`spacing.spacing_03` at `lg`), with the same cell answering the gap after the icon - both references give the icon's start padding and its gap one number.
- **No interaction.** A read-only tag takes no focus and answers no pointer state, so it carries no role and no `target` in its measurement reference; `disabled` redraws it in the disabled cells only.

## Platform

Both. The container, icon and label render on iOS, Android and web.
