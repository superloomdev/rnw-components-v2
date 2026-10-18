// Info: SliderSkeleton spec sheet. The row is the nominal track width
// plus the two endpoint blocks and their gaps; inside it the track's
// full-width basis and the endpoint wrappers share the flex shrink, so
// the painted widths resolve at layout the way the source's own row does.
// The label bar is the field skeleton's label cells one spacing step
// above the row. Every metric names a token; the theme supplies the
// number.

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
  tickHeight: 'control.slider_tick_height',
  tickWidth: 'border.width_02',
  tickGap: 'border.width_01',
  labelWidth: 'control.field_skeleton_label_width',
  labelHeight: 'control.field_skeleton_label_height',
  labelGap: 'spacing.spacing_03',
  rangeWidth: 'control.slider_skeleton_range_width',
  rangeHeight: 'control.slider_skeleton_range_height',
  rowWidth: { tokens: ['control.slider_min_width', 'control.slider_skeleton_range_width', 'control.slider_skeleton_range_width', 'control.slider_gap', 'control.slider_gap'], operation: 'sum' }
});
