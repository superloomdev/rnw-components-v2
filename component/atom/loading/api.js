// Info: Loading public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'Loading',
  props: Object.freeze({
    active: { type: 'boolean', required: false, description: 'Whether the spinner runs. Going `false` closes the arc over the exit duration, then the node renders nothing. Default `true`.' },
    small: { type: 'boolean', required: false, description: 'Draws the small spinner: the small size, stroke and arc, with a track circle behind the arc.' },
    withOverlay: { type: 'boolean', required: false, description: 'Centers the spinner on a full-viewport scrim in the overlay stacking order, with focus trapped. Default `true`, as upstream.' },
    description: { type: 'string', required: false, description: 'The spinner\'s accessible name and live-region text. Default "loading".' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the spinner.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.loading_size', 'control.loading_size_small',
    'control.loading_stroke_width', 'control.loading_stroke_width_small',
    'control.loading_arc', 'control.loading_arc_small',
    'anatomy.loading_motion',
    'motion.loading_rotation', 'motion.loading_arc_cycle', 'motion.loading_arc_easing',
    'motion.duration_slow_02', 'motion.easing_exit_productive',
    'shape.radius_max',
    'stacking.overlay',
    'color.loading_indicator', 'color.loading_track', 'color.loading_scrim'
  ]),
  colors: Object.freeze([])
});
