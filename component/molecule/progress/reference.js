// Info: ProgressBar measurement reference. The upstream progress bar takes
// `label`, `helperText`, `max`, `value` and a `status` of active, finished
// or error; an absent value while active draws its indeterminate sweep.
// `size` is `small` or `big` upstream, `sm` or `lg` here. The bar is not
// interactive, so it has no target. The parts compared are the label, the
// status icon, the track, the fill and the helper; the indeterminate sweep
// is a painted pseudo-element upstream, so the pixel gates, not the part
// measurements, cover it.
//
// The second reference draws a bare bar - no label, helper, status states
// or sizes - so a state that exercises any of those is unmeasured there,
// and the parts it cannot draw are omitted with their reasons. Its fill is
// measured on the primary bar's inner, the element that carries the paint.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.ProgressBar, {
      label: typeof props.label === 'string' ? props.label : '',
      helperText: props.helperText,
      value: props.value,
      max: props.max,
      status: props.status === 'finished' || props.status === 'error' ? props.status : 'active',
      size: props.size === 'sm' ? 'small' : 'big'
    });
  },
  body: Object.freeze({ width: 320 }),
  parts: Object.freeze({
    label: Object.freeze({ upstream: '.cds--progress-bar__label-text', ours: ':scope > div > div:first-child > [dir="auto"]', measure: 'text' }),
    icon: Object.freeze({ upstream: '.cds--progress-bar__status-icon', ours: ':scope > div > div:first-child > div > svg', measure: 'box' }),
    track: Object.freeze({ upstream: '.cds--progress-bar__track', ours: '[role="progressbar"]', measure: 'box' }),
    fill: Object.freeze({ upstream: '.cds--progress-bar__bar', ours: '[role="progressbar"] > div:first-child', measure: 'box' }),
    helper: Object.freeze({ upstream: '.cds--progress-bar__helper-text', ours: ':scope > div > [dir="auto"]:last-child', measure: 'text' })
  }),
  second: Object.freeze({
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
  })
});
