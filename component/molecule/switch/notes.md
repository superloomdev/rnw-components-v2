# Toggle

A field: a label over a pill track with a sliding disc handle, and - where
the theme shows it - the on/off text beside the track.

## Anatomy

- The label is `label01` in `text_secondary` (`text_disabled` when
  disabled), spaced `labelGap` above the row.
- The track is a `trackWidth` x `trackHeight` pill. Its border draws only
  while unchecked (the selected track has no outline in either reference).
- The handle is a disc centered in a track-height square anchored at the
  unchecked or checked end of the track. That one formula reproduces both
  references: the primary's `3px` inset and `24px` travel, and the
  second's `trackWidth - trackHeight` margin. The disc's vertical
  centering also holds for the second's pressed handle, which grows past
  the track edge.
- The `sm` variant is the next size step down: the track is
  `size.size_small` wide and `size.icon_01` tall, the handle is the icon
  step minus `spacing.spacing_03`.
- `sm` draws the checked mark (`switch_checked_indicator` from the icon
  registry) pinned at the checked end's zone center. The first reference
  pins it there too - it does not travel with the handle - and reveals it
  with `visibility`, so ours mounts it under `sm` in every state and
  toggles `visibility` the same way.
- The state layer is the `selection_layer_size` disc centered on the
  handle zone, drawn only under the `ripple` press presentation while
  hovered or pressed; its four cells are hover/active by unselected/
  selected.
- The focus ring is an outline on the track element. Both references wrap
  the track (the primary's `::after`, the second's `md-focus-ring` is
  `for` the track-sized `.switch`), so one element carries it. The
  primary draws the ring on `:active` too, so a press keeps the ring;
  under the `keyboard` focus trigger a pointer press still shows none,
  matching the second reference.

## State cells

The phase is pressed, then hovered, then focused (disabled short-circuits
and falls back to its own cells). The `switch_track`, `switch_handle` and
`switch_outline` families provide the cells; `switch_track` and
`switch_handle` carry `_selected` variants, the outline does not (the
selected track has no border). `pressPresentation` supplies the track's
container fragment from the `switch_track[_selected]` prefix, so
`feedback.press` decides whether the state's track fill paints the track
(`highlight`), the layer (`ripple`) or a fade (`opacity`).

## Anatomy enums

- `anatomy.switch_handle`: `fixed` reads the base handle size in every
  state and animates only the slide (`left, background-color`); `grows`
  reads the pressed and selected sizes and animates size too (`left,
  width, height, background-color`). The second reference's `grows` is
  why a pressed handle reaches 28px.
- `anatomy.switch_state_text`: `shown` renders the `body01` on/off text
  `stateTextGap` after the track (`text_primary`, aria-hidden; the label
  already names the control); `hidden` renders nothing.

## Behavior

`checked` is controllable; a press toggles and `onChange` reports the next
value. The web press responder activates on Enter only, so Space is
handled here. The role is `switch` with `aria-checked`, `aria-disabled`
and `aria-labelledby` to the label.

## Second reference

`md-switch` is the control alone: no label, no on/off text, no small
variant (those samples are not mounted there). Its track and handle colors
live on `::before` skins whose sizes are percentages, so the track
compares as a pseudo by color and the handle as its element by geometry;
each handle fill is left to the pixel comparison.
