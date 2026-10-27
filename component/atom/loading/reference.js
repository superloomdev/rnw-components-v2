// Info: Loading measurement reference. The primary's spinner is an 88px
// square (16 small) holding a turning arc in `loading_indicator` on a
// 100-unit viewBox, the small form with a `loading_track` circle behind
// it. The spinner is not interactive, so it has no target. The parts
// compared are the spinner box, the stroke circle and, for `small`, the
// track behind it.
//
// Two sample states mount no reference: `inactive`, whose arc runs shut
// and renders nothing (the unit test covers the close and the unmount),
// and `overlay`, whose layer the upstream fixes to the viewport, outside
// the cell (the unit test covers the scrim's color and the dialog role).
//
// The second reference was retired (batch R).

export default Object.freeze({
  kind: 'render-web',
  // The spinner turns forever; its parts are read and shot frozen at
  // frame zero, or the rotated box measures larger than the square
  pauseAnimations: true,
  mount: function (React, upstream, props) {
    // The stopped and overlayed forms are not measured
    if (props.active === false || props.withOverlay !== false) {
      return null;
    }
    return React.createElement(upstream.Loading, {
      active: true,
      description: typeof props.description === 'string' ? props.description : undefined,
      small: props.small === true,
      withOverlay: false
    });
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--loading', ours: ':scope > div', measure: 'box' }),
    stroke: Object.freeze({ upstream: 'circle.cds--loading__stroke', ours: ':scope > div > div > svg > circle:last-child', measure: 'box' }),
    background: Object.freeze({ upstream: 'circle.cds--loading__background', ours: ':scope > div > div > svg > circle:first-child', measure: 'box', optional: true })
  })
});
