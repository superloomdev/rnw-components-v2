// Info: Slider spec sheet. The track host keeps the theme's min/max width
// and height; inside it the inactive track insets, the fill runs to the
// handle's center, and the handle, state-layer and focus answers take the
// theme's sizes. The optional number field is the shared field anatomy at
// the slider's own widths; its disabled border override keeps each
// template's outline or underline answer. Every metric names a token; the
// theme supplies the number.

export default Object.freeze({
  height: 'control.slider_height',
  minWidth: 'control.slider_min_width',
  maxWidth: 'control.slider_max_width',
  gap: 'control.slider_gap',
  trackHeight: 'control.slider_track_height',
  trackRadius: 'control.slider_track_radius',
  trackInset: 'control.slider_track_inset',
  handleInset: 'control.slider_handle_inset',
  handleSize: 'control.slider_handle_size',
  handleSizeActive: 'control.slider_handle_size_active',
  stateLayerSize: 'control.slider_state_layer_size',
  focusSize: 'control.slider_focus_size',
  focusWidth: 'control.slider_focus_width',
  focusGapWidth: 'control.slider_focus_gap_width',
  tickHeight: 'control.slider_tick_height',
  tickWidth: 'border.width_02',
  tickGap: 'border.width_01',
  labelGap: 'spacing.spacing_03',
  messageGap: 'control.field_message_gap',
  messageInset: 'control.field_message_inset',
  iconSize: 'control.field_icon_size',
  inputHeight: 'control.field_height',
  inputRadius: 'control.field_radius',
  inputWidth: 'control.slider_input_width',
  inputWidthInvalid: 'control.slider_input_width_invalid',
  inputDisabledBorderWidth: 'control.slider_input_outline_width_disabled',
  tooltipPaddingInline: 'spacing.spacing_03'
});
