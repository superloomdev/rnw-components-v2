// Info: Modal spec sheet. Every metric names a token; the theme supplies
// the number. The width and height steps are ratio cells of the layer
// space, read at render; below `breakpoint.md` every size spans it. The
// members own their own spec sheets.

export default Object.freeze({
  borderWidth: 'control.dialog_border_width',
  bpMd: 'breakpoint.md',
  level: 'shadow.dialog',
  maxWidth: 'control.dialog_max_width',
  minHeight: 'control.dialog_min_height',
  minWidth: 'control.dialog_min_width',
  paddingInline: 'control.dialog_padding_inline',
  radius: 'control.dialog_radius',
  stacking: 'stacking.overlay'
});
