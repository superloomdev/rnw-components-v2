// Lead-authored descriptor. Copy verbatim to
// component/molecule/slider/reference.js with the renderer handoff.
let counter = 0;

const valueOf = function (props) {
  return props.value === undefined
    ? props.defaultValue === undefined ? props.min === undefined ? 0 : props.min : props.defaultValue
    : props.value;
};

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 640 }),
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  releaseBeforeMove: true,
  mount: function (React, upstream, props) {
    counter = counter + 1;
    return React.createElement(upstream.Slider, {
      id: 'reference-slider-' + counter,
      labelText: props.label,
      hideLabel: props.hideLabel === true,
      ariaLabelInput: props.inputLabel || props.accessibilityLabel,
      min: props.min === undefined ? 0 : props.min,
      max: props.max === undefined ? 100 : props.max,
      step: props.step,
      stepMultiplier: props.stepMultiplier,
      value: valueOf(props),
      minLabel: props.minLabel,
      maxLabel: props.maxLabel,
      formatLabel: props.formatLabel,
      disabled: props.disabled === true,
      invalid: props.invalid === true,
      invalidText: props.invalidText,
      hideTextInput: props.hideTextInput === true,
      onChange: function () {}
    });
  },
  target: Object.freeze({ upstream: '.cds--slider__thumb', ours: '[role="slider"]' }),
  additionalTargets: Object.freeze([
    Object.freeze({
      name: 'number',
      upstream: '.cds--slider-text-input',
      ours: '[data-testid="slider-input"]',
      anchor: 'frame',
      states: ['default', 'minimum', 'quarter', 'maximum', 'hidden label', 'invalid', 'fractional']
    })
  ]),
  parts: Object.freeze({
    label: Object.freeze({ upstream: '.cds--label', ours: '[data-testid="slider-label"]', measure: 'text' }),
    row: Object.freeze({ upstream: '.cds--slider-container', ours: '[data-testid="slider-row"]', measure: 'box' }),
    minimum: Object.freeze({ upstream: '.cds--slider__range-label:first-of-type', ours: '[data-testid="slider-minimum"]', measure: 'text' }),
    maximum: Object.freeze({ upstream: '.cds--slider__range-label:last-of-type', ours: '[data-testid="slider-maximum"]', measure: 'text' }),
    host: Object.freeze({ upstream: '.cds--slider', ours: '[data-testid="slider-track"]', measure: 'box' }),
    track: Object.freeze({ upstream: '.cds--slider__track', ours: '[data-testid="slider-inactive"]', measure: 'box' }),
    tick: Object.freeze({ upstream: '.cds--slider__track', pseudo: '::before', translate: true, ours: '[data-testid="slider-tick"]', measure: 'box' }),
    filled: Object.freeze({ upstream: '.cds--slider__filled-track', ours: '[data-testid="slider-filled"]', measure: 'box' }),
    thumb: Object.freeze({ upstream: '.cds--slider__thumb', ours: '[data-testid="slider-thumb-face"]', measure: 'box', scaleRadius: true, paintCenter: true, profileDepth: 5 }),
    frame: Object.freeze({ upstream: '.cds--slider-text-input', ours: 'div:has(> [data-testid="slider-input"])', measure: 'box' }),
    value: Object.freeze({ upstream: '.cds--slider-text-input', ours: '[data-testid="slider-input"]', measure: 'type' }),
    invalidIcon: Object.freeze({ upstream: '.cds--slider__invalid-icon', ours: 'div:has(> [data-testid="slider-input"]) > div > svg', measure: 'box' }),
    message: Object.freeze({ upstream: '.cds--slider__validation-msg', ours: '[data-testid="slider-message"]', measure: 'text' }),
    tooltip: Object.freeze({ upstream: '.cds--popover-content', ours: '[role="tooltip"] > div:first-child', measure: 'box' })
  })
});
