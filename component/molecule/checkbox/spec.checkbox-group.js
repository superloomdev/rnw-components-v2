// Info: CheckboxGroup spec sheet. Every metric names a token; the theme
// supplies the number. The legend sits one spacing step above the rows,
// the rows keep the group's row gap as a bottom margin on every row - the
// source's validation sibling always sits one gap below - and the first
// row pulls up by the first-step overlap the source margin expresses.
// The error icon's insets are the same token sums the Checkbox's error
// icon uses.

export default Object.freeze({
  legendGap: 'spacing.spacing_03',
  rowGap: 'control.checkbox_group_gap',
  firstRowOverlap: 'spacing.spacing_01',
  messageGap: 'spacing.spacing_02',
  iconSize: 'size.icon_01',
  iconInsetStart: { tokens: ['spacing.spacing_01', 'border.width_01'], operation: 'sum' },
  iconInsetEnd: 'border.width_01',
  iconInsetTop: 'border.width_01',
  messageTextGap: 'spacing.spacing_03'
});
