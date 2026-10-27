# Link

Link draws a pressable run of text in the theme's link colors for rest, hover, press, visited and disabled, underlined while hovered, focused or pressed and always when inline, in three type sizes with an optional trailing icon.

## Decisions (roster flag `superloom_decision`)

- **No second-system link.** The second system's nearest twin is a 40px pill button, not a link - the roster's `superloom_decision`; it records no second twin. That system's link values are its own: the family reads its primary role and label sets.
- **The ring.** A solid outline in the link focus-ring color at the focus width: one point outside the text while focused from the keyboard (the rendered reference's offset), at the edge while pressed.
- **`visited` is a prop, unmeasured.** No page can drive `:visited` - a browser answers it from history - so `visited` is a plain prop, and its state is unmeasured: the reference mount returns null for it.

## Platform

Both platforms. On a native platform a link navigates through `onPress`: `href` is a web anchor attribute and the library opens no URL itself.
