// Info: Modal spec sheet. Every metric names a token; the theme supplies
// the number. The width and height steps are ratio cells of the layer
// space, read at render - D23/D24: no breakpoint read in a component. The
// members own their own spec sheets.

export default Object.freeze({
  borderWidth: 'control.dialog_border_width',
  level: 'shadow.dialog',
  maxWidth: 'control.dialog_max_width',
  minHeight: 'control.dialog_min_height',
  minWidth: 'control.dialog_min_width',
  paddingInline: 'control.dialog_padding_inline',
  radius: 'control.dialog_radius',
  stacking: 'stacking.overlay'
});
