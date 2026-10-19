// Info: CheckboxSkeleton spec sheet. The skeleton is the label block alone:
// the empty space the box and its gap take stays where the live row would
// draw them. The primary reference states the row height and the label
// inset in rem steps that fall between scale tokens, so each is the sum of
// the tokens it equals. Every metric names a token; the theme supplies the
// number.

export default Object.freeze({
  width: 'control.selection_skeleton_label_width',
  height: 'spacing.spacing_05',
  rootHeight: { tokens: ['spacing.spacing_05', 'spacing.spacing_02'], operation: 'sum' },
  insetStart: { tokens: ['spacing.spacing_05', 'spacing.spacing_03', 'spacing.spacing_01'], operation: 'sum' },
  insetTop: 'spacing.spacing_01',
  marginBottom: { tokens: ['spacing.spacing_01', 'border.width_01'], operation: 'sum' }
});
