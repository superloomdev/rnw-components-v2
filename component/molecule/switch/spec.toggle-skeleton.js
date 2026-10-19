// Info: ToggleSkeleton spec sheet. The circle has its own control cell:
// the skeleton's circle is its own upstream size, not the live handle's;
// the bar's two control cells size it and one spacing step separates it
// from the circle.

export default Object.freeze({
  circleSize: 'control.toggle_skeleton_circle_size',
  circleRadius: 'shape.radius_max',
  barWidth: 'control.toggle_skeleton_bar_width',
  barHeight: 'control.toggle_skeleton_bar_height',
  barGap: 'spacing.spacing_03'
});
