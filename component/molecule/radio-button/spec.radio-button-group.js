// Info: RadioButtonGroup spec sheet. Every metric names a token; the
// theme supplies the number. The legend sits one spacing step above the
// items; the horizontal row's gap and the vertical column's per-item
// bottom margin are the group's own control cells. The message's gap is
// the sum the source's validation sibling states between the items and
// the message; the error icon's side insets are the same token sums the
// Checkbox family's error icon uses, with no top inset.

export default Object.freeze({
  legendGap: 'spacing.spacing_03',
  itemGapHorizontal: 'control.radio_group_gap_horizontal',
  itemGapVertical: 'control.radio_group_gap_vertical',
  messageGap: { tokens: ['spacing.spacing_01', 'spacing.spacing_02'], operation: 'sum' },
  iconSize: 'size.icon_01',
  iconInsetStart: { tokens: ['spacing.spacing_01', 'border.width_01'], operation: 'sum' },
  iconInsetEnd: 'border.width_01',
  messageTextGap: 'spacing.spacing_03'
});
