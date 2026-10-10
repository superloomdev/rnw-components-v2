// Info: Toggle spec sheet. Every metric names a token; the theme supplies
// the number. The track is a pill; the handle is a disc anchored inside a
// track-height square at the unchecked or checked end - that formula lands
// the primary's 3px inset and 24px travel and the second's end-zone math
// on the same numbers. The small variant is the next size step down: its
// track is the small size step wide and the icon step tall, and its handle
// is that minus a spacing step. The mark is the small handle minus its
// inset; the state layer centers on the handle zone.

export default Object.freeze({
  trackWidth: 'control.switch_track_width',
  trackHeight: 'control.switch_track_height',
  trackWidthSmall: 'size.size_small',
  trackHeightSmall: 'size.icon_01',
  outlineWidth: 'control.switch_outline_width',
  handleSize: 'control.switch_handle_size',
  handleSizeSelected: 'control.switch_handle_size_selected',
  handleSizePressed: 'control.switch_handle_size_pressed',
  handleSizeSmall: { tokens: ['size.icon_01', 'spacing.spacing_02', 'spacing.spacing_01'], operation: 'subtract' },
  handleSizeSmallSelected: { tokens: ['size.icon_01', 'spacing.spacing_02', 'spacing.spacing_01'], operation: 'subtract' },
  handleSizeSmallPressed: { tokens: ['size.icon_01', 'spacing.spacing_02', 'spacing.spacing_01'], operation: 'subtract' },
  markInset: 'spacing.spacing_01',
  // The inline line box the upstream label leaves under the row
  labelStrut: 'spacing.spacing_01',
  trackRadius: 'shape.radius_max',
  handleRadius: 'shape.radius_max',
  layerSize: 'control.selection_layer_size',
  layerRadius: 'shape.radius_max',
  labelGap: 'spacing.spacing_05',
  stateTextGap: 'spacing.spacing_03'
});
