// Info: NumberInput measurement reference. The upstream number field takes
// `label`, a required `id`, and the value, bounds, step, empty and stepper
// props; its steppers sit in a controls box on the field's end edge beside
// two rule dividers. The parts compared are the label, the frame, the
// value, the invalid icon, both action faces, paints and glyphs, the two
// dividers and the message; the steppers are additional interaction
// targets anchored on their faces. The second reference is the outlined
// text field with a numeric keyboard: its browser steppers are not the
// custom pair, so the action parts are omitted there.

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
  }),
  second: Object.freeze({
    origin: 'frame',
    body: Object.freeze({ width: 320 }),
    mount: function (React, upstream, props) {
      if (props.size !== undefined && props.size !== 'md') {
        return null;
      }
      const text = props.value !== undefined ? String(props.value)
        : (props.defaultValue !== undefined ? String(props.defaultValue) : '0');
      const trimmed = text.trim();
      const empty = !trimmed;
      const number = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(trimmed) && Number.isFinite(Number(trimmed))
        ? Number(trimmed) : undefined;
      const outOfBounds = number !== undefined && (
        (props.min !== undefined && number < props.min) || (props.max !== undefined && number > props.max));
      const invalid = props.disabled === true ? false
        : (props.invalid === true || outOfBounds === true
          || (empty !== true && number === undefined) || (empty === true && props.allowEmpty !== true));
      return React.createElement('md-outlined-text-field', {
        label: props.label,
        'aria-label': typeof props.label === 'string' ? undefined : props.accessibilityLabel,
        type: 'number',
        placeholder: props.placeholder,
        value: empty === true ? undefined : text,
        min: props.min,
        max: props.max,
        disabled: props.disabled === true,
        error: invalid,
        errorText: props.invalidText,
        supportingText: props.helperText,
        style: { width: 320 }
      });
    },
    target: Object.freeze({ upstream: 'md-outlined-text-field', ours: 'input' }),
    parts: Object.freeze({
      frame: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .container', ours: 'div:has(> input)', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius'] }),
      edge: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .outline-start', pseudo: '::before', ours: 'div:has(> input)', measure: 'box', compare: ['borderTopWidth', 'borderBottomColor'] }),
      label: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .label:not(.hidden)', ours: ':scope > div > [dir="auto"]:first-child', measure: 'text' }),
      value: Object.freeze({ upstream: 'md-outlined-text-field >>> input', ours: 'input', measure: 'type' }),
      message: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .supporting-text > span', ours: ':scope > div > [dir="auto"]:last-child', measure: 'text' })
    }),
    omit: Object.freeze({
      invalidIcon: Object.freeze({ reason: 'the second reference marks an invalid field by the error color alone and draws a trailing icon only when the page slots one; ours draws the template\'s error icon', upstream: 'md-outlined-text-field >>> .icon.trailing > svg, md-outlined-text-field > svg[slot="trailing-icon"]', mask: true }),
      decrementFace: Object.freeze({ reason: 'the second reference has no custom steppers; its browser stepper is native chrome', upstream: 'md-outlined-text-field >>> md-icon-button', mask: true }),
      decrementPaint: Object.freeze({ reason: 'the second reference has no custom steppers; its browser stepper is native chrome', upstream: 'md-outlined-text-field >>> md-icon-button' }),
      decrementIcon: Object.freeze({ reason: 'the second reference has no custom steppers; its browser stepper is native chrome', upstream: 'md-outlined-text-field >>> md-icon-button svg' }),
      incrementFace: Object.freeze({ reason: 'the second reference has no custom steppers; its browser stepper is native chrome', upstream: 'md-outlined-text-field >>> md-icon-button', mask: true }),
      incrementPaint: Object.freeze({ reason: 'the second reference has no custom steppers; its browser stepper is native chrome', upstream: 'md-outlined-text-field >>> md-icon-button' }),
      incrementIcon: Object.freeze({ reason: 'the second reference has no custom steppers; its browser stepper is native chrome', upstream: 'md-outlined-text-field >>> md-icon-button svg' }),
      dividerStart: Object.freeze({ reason: 'the second reference has no custom steppers, so no rule dividers', upstream: 'md-outlined-text-field >>> md-icon-button' }),
      dividerCenter: Object.freeze({ reason: 'the second reference has no custom steppers, so no rule dividers', upstream: 'md-outlined-text-field >>> md-icon-button' })
    })
  })
});
