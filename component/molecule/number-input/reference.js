// Info: NumberInput measurement reference. The upstream number field takes
// `label`, a required `id`, and the value, bounds, step, empty and stepper
// props; its steppers sit in a controls box on the field's end edge beside
// two rule dividers. The parts compared are the label, the frame, the
// value, the invalid icon, both action faces, paints and glyphs, the two
// dividers and the message; the steppers are additional interaction
// targets anchored on their faces. The second reference was retired
// (batch R).

let counter = 0;

// Numeric props travel to the upstream mount as numbers
const NUM = function (value) {
  return value === undefined ? undefined : Number(value);
};


export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  mount: function (React, upstream, props) {
    counter = counter + 1;
    return React.createElement(upstream.NumberInput, {
      id: 'reference-number-input-' + counter,
      label: typeof props.label === 'string' ? props.label : props.accessibilityLabel,
      hideLabel: typeof props.label !== 'string',
      placeholder: props.placeholder,
      value: props.value === undefined ? undefined : NUM(props.value),
      defaultValue: props.defaultValue === undefined ? undefined : NUM(props.defaultValue),
      onChange: function () {
        return undefined;
      },
      min: props.min,
      max: props.max,
      step: props.step,
      allowEmpty: props.allowEmpty === true,
      hideSteppers: props.hideSteppers === true,
      incrementNumLabel: props.incrementLabel,
      decrementNumLabel: props.decrementLabel,
      size: props.size || 'md',
      disabled: props.disabled === true,
      invalid: props.invalid === true,
      invalidText: props.invalidText,
      helperText: props.helperText
    });
  },
  // The element a person hovers, presses and focuses
  target: Object.freeze({ upstream: 'input', ours: 'input' }),
  additionalTargets: Object.freeze([
    Object.freeze({
      name: 'decrement',
      upstream: '.cds--number__control-btn.down-icon',
      ours: '[data-testid="number-decrement"]',
      anchor: 'decrementFace',
      states: ['default', 'helper', 'invalid', 'small', 'large']
    }),
    Object.freeze({
      name: 'increment',
      upstream: '.cds--number__control-btn.up-icon',
      ours: '[data-testid="number-increment"]',
      anchor: 'incrementFace',
      states: ['default', 'helper', 'invalid', 'small', 'large']
    })
  ]),
  parts: Object.freeze({
    label: Object.freeze({ upstream: '.cds--label', ours: ':scope > div > [dir="auto"]:first-child', measure: 'text' }),
    frame: Object.freeze({ upstream: '.cds--number input', ours: 'div:has(> input)', measure: 'box' }),
    value: Object.freeze({ upstream: '.cds--number input', ours: 'input', measure: 'type' }),
    invalidIcon: Object.freeze({ upstream: '.cds--number__invalid', ours: 'div:has(> input) > div > svg', measure: 'box' }),
    decrementFace: Object.freeze({ upstream: '.cds--number__control-btn.down-icon', ours: '[data-testid="number-decrement-face"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopLeftRadius'] }),
    decrementPaint: Object.freeze({ upstream: '.cds--number__control-btn.down-icon', ours: '[data-testid="number-decrement-paint"]', measure: 'box', compare: ['backgroundColor'] }),
    decrementIcon: Object.freeze({ upstream: '.cds--number__control-btn.down-icon svg', ours: '[data-testid="number-decrement-face"] svg', measure: 'box' }),
    incrementFace: Object.freeze({ upstream: '.cds--number__control-btn.up-icon', ours: '[data-testid="number-increment-face"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopLeftRadius'] }),
    incrementPaint: Object.freeze({ upstream: '.cds--number__control-btn.up-icon', ours: '[data-testid="number-increment-paint"]', measure: 'box', compare: ['backgroundColor'] }),
    incrementIcon: Object.freeze({ upstream: '.cds--number__control-btn.up-icon svg', ours: '[data-testid="number-increment-face"] svg', measure: 'box' }),
    dividerStart: Object.freeze({ upstream: '.cds--number__controls .cds--number__rule-divider:first-of-type', ours: '[data-testid="number-divider-start"]', measure: 'box' }),
    dividerCenter: Object.freeze({ upstream: '.cds--number__controls .cds--number__rule-divider:last-of-type', ours: '[data-testid="number-divider-center"]', measure: 'box' }),
    message: Object.freeze({ upstream: '.cds--form__helper-text, .cds--form-requirement', ours: ':scope > div > [dir="auto"]:last-child', measure: 'text' })
  })
});
