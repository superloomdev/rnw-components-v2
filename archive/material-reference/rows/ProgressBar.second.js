// Info: component/molecule/progress/reference.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
    origin: 'track',
    body: Object.freeze({ width: 320 }),
    mount: function (React, upstream, props) {
      // A bare determinate bar only: the reference knows no label, helper,
      // status or size, and its indeterminate state draws nothing at rest
      if (typeof props.value !== 'number' || props.status !== undefined || props.size === 'sm') {
        return null;
      }
      const max = typeof props.max === 'number' && props.max > 0 ? props.max : 100;
      return React.createElement('md-linear-progress', {
        value: props.value / max,
        max: 1
      });
    },
    parts: Object.freeze({
      track: Object.freeze({ upstream: 'md-linear-progress', ours: '[role="progressbar"]', measure: 'box', compare: ['width', 'height'] }),
      fill: Object.freeze({ upstream: 'md-linear-progress >>> .primary-bar .bar-inner', ours: '[role="progressbar"] > div:first-child', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor'] })
    }),
    omit: Object.freeze({
      label: Object.freeze({ reason: 'the second reference draws a bare track; it has no label element', upstream: 'md-linear-progress >>> .label-text' }),
      icon: Object.freeze({ reason: 'the second reference has no finished or error state, so it draws no status icon', upstream: 'md-linear-progress >>> svg' }),
      helper: Object.freeze({ reason: 'the second reference draws a bare track; it has no helper element', upstream: 'md-linear-progress >>> .helper-text' })
    })
  });
