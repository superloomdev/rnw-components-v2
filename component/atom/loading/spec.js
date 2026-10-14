// Info: Loading spec sheet. Every metric names a token; the theme supplies
// the number. The spinner square, stroke and arc have a cell each per size;
// the rotation and the breathing arc's cycle are motion cells; the stop's
// close duration and easing are the shared exit pair; the overlay's order
// is the shared overlay stacking cell.
//
// The remaining entries are drawing constants of the 100-unit viewBox the
// upstream svg is drawn in (loading/_vars.scss:14-16,
// loading/_loading.scss:36-37,62,85): the circle radii, the pi the
// circumference is written with, and the small track's dash offset.

export default Object.freeze({
  size: 'control.loading_size',
  sizeSmall: 'control.loading_size_small',
  strokeWidth: 'control.loading_stroke_width',
  strokeWidthSmall: 'control.loading_stroke_width_small',
  arc: 'control.loading_arc',
  arcSmall: 'control.loading_arc_small',
  rotation: 'motion.loading_rotation',
  arcCycle: 'motion.loading_arc_cycle',
  // The arc anatomy's expand/rotate easing and the circle's full-round
  // corner
  arcEasing: 'motion.loading_arc_easing',
  radiusMax: 'shape.radius_max',
  stopDuration: 'motion.duration_slow_02',
  stopEasing: 'motion.easing_exit_productive',
  stacking: 'stacking.overlay',
  viewBox: { constant: 100 },
  radius: { constant: 44 },
  radiusSmall: { constant: 42 },
  pi: { constant: 3.1416 },
  trackOffset: { constant: -22 },
  // The arc drawing sits inside the progress's fixed container padding
  // (the second system's progress/internal/_circular-progress.scss:31
  // $container-padding), and its rotate cycle turns four arc cycles
  // (:45 $cycle-duration = 4 * $arc-duration)
  arcInset: { constant: 4 },
  arcCycles: { constant: 4 }
});
