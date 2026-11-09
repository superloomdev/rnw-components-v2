// Info: component/molecule/radio-button/reference.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
    origin: 'ring',
    mount: function (React, upstream, props) {
      if (props.invalid === true) {
        return null;
      }
      return React.createElement('md-radio', {
        checked: props.checked === true,
        disabled: props.disabled === true
      });
    },
    target: Object.freeze({ upstream: 'md-radio', ours: '[role="radio"]' }),
    parts: Object.freeze({
      ring: Object.freeze({ upstream: 'md-radio >>> svg.icon', ours: 'div:has(> [role="radio"]) > div:nth-child(1) > div:nth-child(1)', measure: 'box', compare: ['width', 'height'] })
    }),
    // The second reference is the ring alone: the page pairs it with its own
    // label, so nothing of ours beside the ring is drawn there
    omit: Object.freeze({
      root: Object.freeze({ reason: 'the second reference draws no row around the control', upstream: '*:has(> md-radio)' }),
      label: Object.freeze({ reason: 'the second reference draws no label; the page supplies one', upstream: 'md-radio ~ *, md-radio >>> label' })
    })
  });
