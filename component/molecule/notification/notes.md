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
