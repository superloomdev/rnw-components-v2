// Info: component/atom/loading/reference.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
    origin: 'root',
    pauseAnimations: true,
    mount: function (React, upstream, props) {
      // One indeterminate spinner at one size; the small, stopped and
      // overlayed forms have no second-reference answer
      if (props.small === true || props.active === false || props.withOverlay !== false) {
        return null;
      }
      return React.createElement('md-circular-progress', { indeterminate: true });
    },
    parts: Object.freeze({
      root: Object.freeze({ upstream: 'md-circular-progress', ours: ':scope > div', measure: 'box', compare: ['width', 'height'] })
    }),
    omit: Object.freeze({
      stroke: Object.freeze({ reason: 'the second reference draws its arcs inside a shadow root as layered segments, not one stroked circle', upstream: 'md-circular-progress >>> svg circle' }),
      background: Object.freeze({ reason: 'the second reference draws no track circle behind the arc', upstream: 'md-circular-progress >>> svg circle' })
    })
  });
