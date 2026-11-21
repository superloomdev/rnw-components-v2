# Tearsheet

The wide tearsheet: a bottom-anchored layer with a header (label, heading,
description, optional navigation), an optional influencer panel, the main
content and a row of actions. Composes the focus-trap, layer-space,
overlay, reduced-motion and viewport-layer behaviors; Heading, IconButton
and Button draw the parts.

- The container is `tearsheet_inset_inline` from each side and `inset_top`
  (`_lower` under `verticalPosition: 'lower'`) from the top of the layer
  space, bottom-anchored, with the dialog's border cells on every side.
- The header's `minHeight` is `tearsheet_header_height` (a floor); its
  padding is the block / inline cells, `header_padding_end` when the close
  button sits there, bottom 0 with navigation.
- The title is one themed `Text` with the header role at level 3, not the
  Heading row (upstream fixes `h3`).
- `hasCloseIcon` defaults to passive (no actions); the close button is the
  IconButton at `icon_button_size` with the dialog's close glyph size.
- Actions order ghost -> secondary -> primary; each seat is a quarter of
  the action row capped at `action_max_width`, a ghost takes the rest on
  the left. One element paints `tearsheet_actions_container` and the top
  rule; the button container wraps it transparent, as upstream's Wrap.
- Initial focus: the close button when drawn (passive or `hasCloseIcon`),
  else the first action button. Outside press closes only when passive.
- Enter: from `min(0.95 x layer height, tearsheet_enter_offset)` below over
  `motion.duration_moderate_02`; reduced motion and measurement draw at
  rest.
- Stacking: the host's open layers named `Tearsheet` form the stack, at
  most 3; a level below the top scales `(w - 32 * d) / w` and grows its
  max height `tearsheet_stack_offset` per level. Unhosted: no stack.
