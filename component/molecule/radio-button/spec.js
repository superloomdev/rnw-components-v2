// Info: RadioButton spec sheet. Every metric names a token; the theme
// supplies the number. The ring is a circle; the checked dot is a smaller
// circle centered inside it; the state layer is a disc centered on the
// ring. The primary reference insets the ring from the row edges in rem
// steps that fall between scale tokens, so each is the sum or difference
// of the two tokens it equals.

export default Object.freeze({
  ringSize: 'control.radio_size',
  borderWidth: 'control.radio_border',
  dotSize: 'control.radio_dot_size',
  radius: 'shape.radius_max',
  ringInsetStart: 'spacing.spacing_01',
  ringInsetTop: 'border.width_01',
  ringInsetBottom: 'border.width_02',
  labelGap: { tokens: ['spacing.spacing_04', 'border.width_02'], operation: 'subtract' },
  layerSize: 'control.selection_layer_size',
  layerRadius: 'shape.radius_max',
  focusOffset: 'control.radio_focus_offset'
});
