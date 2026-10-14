// Info: ProgressStep measurement reference. The step is an `li` holding a
// pressable (`__button`, unclickable while `current`) that carries the
// state glyph, the `__progress-text` column (label plus an optional
// `__progress-optional` line) and the `__line` connector, which the
// reference mounts as the pressable's last child. The parts compared are
// the step root, the pressable, the glyph, the label, the secondary line
// and the line. There is no second reference: the second system has no
// progress indicator, so its values are a Superloom decision.

export default Object.freeze({
  kind: 'render-web',
  // The cell frame on both measurement pages matches the sample's: the
  // `secondary` label hangs absolute below the step, so the cell is the
  // 160 x 48 box that holds it (the step's own box stays 128 x 28.3)
  body: Object.freeze({ width: 160, height: 48 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.ProgressStep, {
      complete: props.complete,
      current: props.current,
      description: props.description,
      disabled: props.disabled,
      index: 0,
      invalid: props.invalid,
      label: props.label,
      onClick: props.onPress,
      secondaryLabel: props.secondaryLabel
    });
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--progress-step', ours: ':scope > li', measure: 'box' }),
    pressable: Object.freeze({ upstream: '.cds--progress-step-button', ours: '[role="button"]', measure: 'box', target: true }),
    icon: Object.freeze({ upstream: '.cds--progress-step-button > svg', ours: '[role="button"] > svg', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--progress-label', ours: '[role="button"] [dir="auto"]', measure: 'text' }),
    secondary: Object.freeze({ upstream: '.cds--progress-optional', ours: '[data-testid="progress-step-secondary"]', measure: 'text', optional: true }),
    line: Object.freeze({ upstream: '.cds--progress-line', ours: '[role="button"] > div:last-child', measure: 'box' })
  })
});
