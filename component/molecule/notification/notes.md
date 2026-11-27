# Notification

`ToastNotification` is a `role="status"` band (`alert` when asked): the
status marker and status icon, the details (title, subtitle, optional
caption and link-styled action), and a close `IconButton`. There is no
second rendered reference - the roster records none; the second template
answers the `notification` cells from the snackbar token
file and the row is measured against the primary alone.

## Decisions

- **Marker.** `anatomy.status_marker` `bar_icon` draws the start border
  (`notification_marker_width` of `notification_marker_<status>`) and the
  status glyph; `plain` sets the border to zero and the icon seat to
  `display: none` - the tree never depends on the theme.
- **Low contrast.** `lowContrast` swaps the inverse container for
  `notification_background_<status>`, the marker for the plain
  `support_<status>`, the text for `text_primary`, and the close glyph for
  `icon_primary` - the reference's low-contrast rules.
- **Width.** `control.notification_width` capped by the host
  (`max-width: 100%`): a fixed band under the primary, fill-up-to under the
  snackbar value.
- **Spacing.** The icon margin, the details' margins and the caption's top
  space come off the spacing scale (`spacing_05`, `spacing_03`) - the
  reference's own values, not new cells. The start padding is the space
  minus the marker border (the reference's 16 minus 3).
- **Action.** A plain link-styled pressable reading
  `notification_action` / `notification_action_hover` - the reference's
  ghost-link action is a part of the toast, not a composed `Button` kind.
- **Close.** Composes `IconButton` (ghost) whose glyph reads
  `notification_close_icon` (`icon_primary` under `lowContrast`) through
  its `iconColor` prop; the kind's hover and focus still come from the
  icon-button cells.
- **Narrow side: where the action stands.** Below md the upstream details
  are `display: flex; flex-grow: 1` at an auto basis in a wrapping band
  288 wide (`_actionable-notification.scss:33-45,324-328`,
  `_inline-notification.scss:277-281`). The rule has two outcomes and a
  sample state draws each: a text that does not fit beside the action
  takes the line and the action wraps under it (`inline`, `noClose`;
  Callout `info`), and a text that fits shares its line with the action,
  which then ends at the band's end because the details grow
  (`inlineShort`; Callout `short`). The references compare the band's
  size and the action's `x`, `y` and `width`, so either outcome drawn
  wrong is a failure.
- **Narrow side on a device.** A native layout differs from the browser in
  three ways, each read on the engine (`react-native` 0.88.1's
  `ReactCommon/yoga`, and a model of the band): (1) the one item of a row
  that both grows and shrinks gets a zero basis, so a wrapping row never
  breaks after it (native run 45024868316: the action shared the text's
  line, ActionableNotification inline 120 high against the web's 106,
  Callout 156 against 106); (2) a block that grows inside the details is
  measured at the whole line, so the details never report a short text's
  width; (3) a zero-basis block is measured as empty. Below md the details
  therefore grow and never shrink, capped at their line (the band's floor
  less the marker and their two insets, which is where a browser's shrink
  would stop them), and the text block is its content and does not grow,
  as the upstream text wrapper is (`_actionable-notification.scss:351-355`).
  The browser draws both outcomes from the same values. An earlier repair
  stopped the details growing (`ef1230b`): it held for the wrapping
  outcome and drew the other one wrong, the action short of the band's end
  in a browser and wrapped under a short text on a device.
- **The text block is its content from md too** (inline, actionable and
  callout bands): upstream's text wrapper does not grow
  (`_inline-notification.scss:293-297`), so `noClose` drew ours 302.89 wide
  against 254.89. Its basis is its content, it does not grow, and the
  details no longer wrap, so a long text shrinks beside the icon. The band
  model (`wip/0162-yoga/notification-wide.mjs`) drew the same band heights
  as before for a short and a long text, with and without the close seat
  and an action, and a wrapping details row dropped the long text under the
  icon, which is why the wrap goes. The toast keeps the grown block: its
  upstream details are a block (`_toast-notification.scss:237-240`).
- **Callout's end space.** The upstream Callout always carries the
  no-close class (`Notification.js:664`), so its action keeps
  `margin-inline-end: $spacing-03` (`_actionable-notification.scss:458-461`).
  Measured once the reference compared the band's width and the action's
  place: the band 420.97 here against 428.97 upstream from md, the `short`
  action at x 221.95 against 213.95 below md. Callout hands the action
  `control.notification_action_end_space`, as ActionableNotification does
  without a close.
- **Short text, action and close.** Below md the upstream close is out of
  flow at the band's top end, 48 square
  (`_actionable-notification.scss:570-615`), and the details keep 48 at
  their end for it. When the action shares the text's line it stands in
  that corner, under the close: the upstream page's close takes every
  pointer event aimed at the action (the `inlineShort` narrow run). The
  window rule is drawn as it is. In the compact and medium form classes
  the action is a target the close crowds (structural gate at 375); the
  form variant clears it with a cell queued for the next wave
  (`CONTRACT-REQUESTS.md`), not with a change of the window rule.
- **Status icons** are plain named glyphs (`error_filled`,
  `checkmark_filled`, `information_filled`, `warning_filled`) colored by
  the marker leaf - the glyph carries the meaning.

## Cells

- `color.notification_container`, `shadow.notification`, `control.notification_width`, `control.notification_radius` - the band
- `anatomy.status_marker`, `control.notification_marker_width`, `color.notification_marker_<status>` - the marker
- `control.notification_icon_size` - the status icon
- `type.notification_title`, `type.notification_body`, `color.notification_text` - the texts
- `color.notification_close_icon`, `control.icon_button_size`, `icon.close` - the close control
- `color.notification_action`, `color.notification_action_hover` - the action
- `color.notification_background_<status>`, `color.support_<status>`, `color.text_primary`, `color.icon_primary` - the low-contrast set

## Accessibility

- `role="status"` by default, `role="alert"` under `alert`; the close
  button names itself through `closeLabel`.
- **NotificationActionButton** (requires_parent): must be composed inside ActionableNotification; measured through ActionableNotification's samples.
- **NotificationActionButton** (no_reference): no standalone upstream mount; measured through the notification's samples.
- **The toast's end space.** Upstream's subtitle keeps `margin-block: 0
  $spacing-05` and the details `margin-block-end: $spacing-05`
  (`_toast-notification.scss:238,295`); the details are a flex item, so
  the two do not collapse: 32 below a subtitle with no caption, 16 above
  a caption and 16 below it. Measured once the reference compared the
  band's height: 75 here against 84 (`low-contrast`, no caption) and 119
  against 128 (`default`, a caption) with the one 23 end space. The toast
  now draws the subtitle's end and the details' end as two `spacing_05`
  spaces; both outcomes have a state.
