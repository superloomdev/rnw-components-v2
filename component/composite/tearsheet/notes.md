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

## Action seats and the narrow window (plan 0162 U7r)

An action seat is upstream's ActionSet flex item (`ActionSet/_action-set.scss:94-113`: a quarter capped at 232,
a ghost growing) over its min-content minimum. Three outcomes (E17), each drawn: the label fits the seat
(`default`); the label is wider than the seat and its widest word fits, so it wraps inside it (`longAction`,
"Create workspace immediately" in the 232 cap; three words, so the narrow floor's three lines stay inside the 80
button); the widest word is wider than the seat, so the seat is the button's
min-content width (the narrow set: a quarter of 320 is 80, "Cancel" is 123.5 wide). The Button reports that width
through `onMinContentWidth`. Below md the influencer takes its content's width (`_tearsheet.scss:473-475`), except
the wide one, whose `flex-basis: 321px` follows that rule in the source (`:479-481`) and still applies: in a 320
body it fills the row, and main, never narrower than its action row's min-content width, is pushed past the
container, which clips it (`influencerWide` in the narrow set draws no action row).

- **Geometry against upstream (U7g).** The description is upstream's
  `inline-flex` box (`Tearsheet/_tearsheet.scss:385-394`): its text's width
  up to the 60 % cap, 309.72 in the wide states where ours filled the cap
  at 651.59; it shrink-wraps now and still wraps at the cap. Upstream's
  main is the content's grid row and the button container the next row
  (`:491-498,552-555`), so its main is 81 shorter than ours, which holds
  both: the main compares its x, y and width, and the body its height.
