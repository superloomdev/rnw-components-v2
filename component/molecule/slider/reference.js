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
  }),
  second: Object.freeze({
    origin: 'host',
    interactions: Object.freeze(['hover', 'focus', 'pressed']),
    releaseBeforeMove: true,
    mount: function (React, upstream, props) {
      return React.createElement('md-slider', {
        min: props.min === undefined ? 0 : props.min,
        max: props.max === undefined ? 100 : props.max,
        step: props.step === undefined ? 1 : props.step,
        value: valueOf(props),
        disabled: props.disabled === true,
        'aria-label': props.label || props.accessibilityLabel,
        style: { width: 200 }
      });
    },
    target: Object.freeze({
      upstream: 'md-slider >>> .handleNub',
      upstreamFocus: 'md-slider >>> input',
      ours: '[role="slider"]',
      point: true
    }),
    parts: Object.freeze({
      host: Object.freeze({ upstream: 'md-slider', ours: '[data-testid="slider-track"]', measure: 'box' }),
      track: Object.freeze({ upstream: 'md-slider >>> .track', pseudo: '::before', ours: '[data-testid="slider-inactive"]', measure: 'box' }),
      // The source pseudo is full width and clip-path paints only a slice:
      // its DOM box width and box-center paint are not painted-fill bounds.
      // The stricter slider-anatomy strip assertion checks actual coverage
      // and disabled overlap pixel-for-pixel at min/quarter/half/max.
      filled: Object.freeze({
        upstream: 'md-slider >>> .track', pseudo: '::after',
        ours: '[data-testid="slider-filled"]', measure: 'box',
        // The source cap belongs to the full unclipped track; at minimum
        // our clipped slice is narrower than its height. Track curvature
        // is compared on `track`, and visible fill on the pixel strip.
        compare: ['x', 'y', 'height', 'borderTopWidth', 'borderBottomWidth', 'backgroundColor'],
        except: ['paint']
      }),
      thumb: Object.freeze({ upstream: 'md-slider >>> .handleNub', ours: '[data-testid="slider-thumb-face"]', measure: 'box' }),
      layer: Object.freeze({ upstream: 'md-slider >>> md-ripple', ours: '[data-testid="slider-state-layer"]', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
      focusRing: Object.freeze({ upstream: 'md-slider >>> md-focus-ring', ours: '[data-testid="slider-outer-focus"]', measure: 'box' })
    }),
    omit: Object.freeze({
      label: Object.freeze({ reason: 'the default slider has no external visible field label', upstream: 'md-slider > label, md-slider >>> label' }),
      row: Object.freeze({ reason: 'the default slider has no row containing endpoint text and an external number field', upstream: 'md-slider >>> .slider-container' }),
      minimum: Object.freeze({ reason: 'the default slider draws no endpoint text', upstream: 'md-slider >>> .range-label' }),
      maximum: Object.freeze({ reason: 'the default slider draws no endpoint text', upstream: 'md-slider >>> .range-label' }),
      tick: Object.freeze({ reason: 'the default slider has ticks=false; no center tick is rendered', upstream: 'md-slider >>> .tickmarks' }),
      frame: Object.freeze({ reason: 'its input is the hidden range control, not an external editable number field', upstream: 'md-slider >>> input:not([type="range"])' }),
      value: Object.freeze({ reason: 'its input is the hidden range control, not an external editable number field', upstream: 'md-slider >>> input:not([type="range"])' }),
      invalidIcon: Object.freeze({ reason: 'the slider has no invalid icon', upstream: 'md-slider >>> .invalid-icon' }),
      message: Object.freeze({ reason: 'the slider has no supporting or error message', upstream: 'md-slider >>> .supporting-text' }),
      tooltip: Object.freeze({
        reason: 'the selected default counterpart is unlabeled; our hidden-field member composes the library Tooltip. The distinct md-slider labeled value-badge mode is not selected or claimed as measured',
        upstream: 'md-slider >>> .label',
        mask: true
      })
    })
  })
});
