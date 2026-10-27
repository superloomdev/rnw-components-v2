// Info: ProgressBar measurement reference. The upstream progress bar takes
// `label`, `helperText`, `max`, `value` and a `status` of active, finished
// or error; an absent value while active draws its indeterminate sweep.
// `size` is `small` or `big` upstream, `sm` or `lg` here. The bar is not
// interactive, so it has no target. The parts compared are the label, the
// status icon, the track, the fill and the helper; the indeterminate sweep
// is a painted pseudo-element upstream, so the pixel gates, not the part
// measurements, cover it.
//
// The second reference was retired (batch R).

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
  })
});
