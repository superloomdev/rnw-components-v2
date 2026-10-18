// Info: TimePicker measurement reference. The upstream time picker takes
// the label as `labelText`, a required `id`, the placeholder, value and
// validation props of the text input, and its select members as children
// - native `select` elements under `option` nodes built from our `items`
// data. The parts compared are the label, the time field, the error icon,
// the message and the two select frames, values and carets. No second
// reference: the row's second-system values are a Superloom decision and
// its clock-dial anatomy a deferred gap.

let counter = 0;


export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  mount: function (React, upstream, props) {
    counter = counter + 1;
    return React.createElement(upstream.TimePicker, {
      id: 'reference-time-picker-' + counter,
      labelText: props.label || props.accessibilityLabel,
      hideLabel: typeof props.label !== 'string',
      placeholder: props.placeholder,
      value: props.value,
      defaultValue: props.defaultValue,
      onChange: function () {
        return undefined;
      },
      maxLength: props.maxLength,
      size: props.size || 'md',
      disabled: props.disabled === true,
      invalid: props.invalid === true,
      invalidText: props.invalidText
    }, (Array.isArray(props.selects) ? props.selects : []).map(function (descriptor, index) {
      return React.createElement(upstream.TimePickerSelect, {
        key: index,
        id: 'reference-time-picker-select-' + counter + '-' + index,
        'aria-label': descriptor.accessibilityLabel,
        disabled: props.disabled === true ? true : undefined,
        value: descriptor.value,
        defaultValue: descriptor.defaultValue
      }, (Array.isArray(descriptor.items) ? descriptor.items : []).map(function (item) {
        return React.createElement('option', {
          key: item.value,
          value: item.value,
          disabled: item.disabled === true ? true : undefined
        }, item.label);
      }));
    }));
  },
  // The element a person hovers, presses and focuses
  target: Object.freeze({ upstream: 'input', ours: 'input' }),
  parts: Object.freeze({
    label: Object.freeze({ upstream: '.cds--label', ours: ':scope > div > [dir="auto"]:first-child', measure: 'text' }),
    frame: Object.freeze({ upstream: '.cds--time-picker__input-field', ours: 'div:has(> input)', measure: 'box' }),
    value: Object.freeze({ upstream: '.cds--time-picker__input-field', ours: 'input', measure: 'type' }),
    icon: Object.freeze({ upstream: '.cds--checkbox__invalid-icon', ours: 'div:has(> input) svg', measure: 'box' }),
    message: Object.freeze({ upstream: '.cds--form__helper-text, .cds--form-requirement', ours: '[data-testid="time-picker-message"]', measure: 'text' }),
    periodFrame: Object.freeze({ upstream: '.cds--time-picker__select .cds--select-input', ours: 'div:has(> [data-testid="time-select-period"])', measure: 'box' }),
    periodValue: Object.freeze({ upstream: '.cds--time-picker__select .cds--select-input', ours: '[data-testid="time-select-period"] > div:first-child > [dir="auto"]', measure: 'type' }),
    periodCaret: Object.freeze({ upstream: '.cds--time-picker__select .cds--select__arrow path', ours: '[data-testid="time-select-period"] > div:last-child svg path', measure: 'box' }),
    zoneFrame: Object.freeze({ upstream: '.cds--time-picker__select:nth-of-type(3) .cds--select-input', ours: 'div:has(> [data-testid="time-select-zone"])', measure: 'box' }),
    zoneValue: Object.freeze({ upstream: '.cds--time-picker__select:nth-of-type(3) .cds--select-input', ours: '[data-testid="time-select-zone"] > div:first-child > [dir="auto"]', measure: 'type' }),
    zoneCaret: Object.freeze({ upstream: '.cds--time-picker__select:nth-of-type(3) .cds--select__arrow path', ours: '[data-testid="time-select-zone"] > div:last-child svg path', measure: 'box' })
  })
});
