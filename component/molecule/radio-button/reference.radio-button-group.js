// Info: RadioButtonGroup measurement reference. The upstream group is a
// fieldset - a form-item wrapper above it holding the messages - whose
// legend sits above radio wrappers laid out by orientation; each
// wrapper's label is the control, its ring the appearance element. The
// parts compared are the root, the legend, the three rows, each row's
// ring and label text, and the helper or error message with its icon.
// There is no second reference: the second system has no radio group,
// so its values are a Superloom decision.

let counter = 0;


export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    const items = Array.isArray(props.items) ? props.items : [];
    return React.createElement(upstream.RadioButtonGroup, {
      legendText: props.legendText,
      disabled: props.disabled === true,
      invalid: props.invalid === true,
      invalidText: props.invalidText,
      helperText: props.helperText,
      orientation: props.orientation,
      valueSelected: props.value,
      defaultSelected: props.defaultValue,
      onChange: function () {
        return undefined;
      }
    }, items.map(function (item) {
      counter = counter + 1;
      return React.createElement(upstream.RadioButton, {
        id: 'reference-radio-group-' + counter,
        key: item.value,
        labelText: item.label,
        value: item.value,
        disabled: item.disabled === true,
        onChange: function () {
          return undefined;
        }
      });
    }));
  },
  body: Object.freeze({ width: 320 }),
  // The element a person hovers and presses is the first row's label
  // (the upstream's label carries the ring); keyboard focus lands on its input
  target: Object.freeze({ upstream: '.cds--radio-button-wrapper:nth-of-type(1) .cds--radio-button__label', ours: '[role="radio"]', upstreamFocus: '.cds--radio-button-wrapper:nth-of-type(1) input[type="radio"]' }),
  parts: Object.freeze({
    root: Object.freeze({ upstream: ':scope > div', ours: ':scope > div', measure: 'box' }),
    legend: Object.freeze({ upstream: ':scope > div legend', ours: ':scope > div > [dir="auto"]', measure: 'text' }),
    row1: Object.freeze({ upstream: '.cds--radio-button-wrapper:nth-of-type(1)', ours: 'div:has(> [data-testid="radio-group-string-alpha"])', measure: 'box' }),
    row2: Object.freeze({ upstream: '.cds--radio-button-wrapper:nth-of-type(2)', ours: 'div:has(> [data-testid="radio-group-string-beta"])', measure: 'box' }),
    row3: Object.freeze({ upstream: '.cds--radio-button-wrapper:nth-of-type(3)', ours: 'div:has(> [data-testid="radio-group-string-gamma"])', measure: 'box' }),
    ring1: Object.freeze({ upstream: '.cds--radio-button-wrapper:nth-of-type(1) .cds--radio-button__appearance', ours: 'div:has(> [data-testid="radio-group-string-alpha"]) > div:nth-child(1) > div:nth-child(1)', measure: 'box' }),
    ring2: Object.freeze({ upstream: '.cds--radio-button-wrapper:nth-of-type(2) .cds--radio-button__appearance', ours: 'div:has(> [data-testid="radio-group-string-beta"]) > div:nth-child(1) > div:nth-child(1)', measure: 'box' }),
    ring3: Object.freeze({ upstream: '.cds--radio-button-wrapper:nth-of-type(3) .cds--radio-button__appearance', ours: 'div:has(> [data-testid="radio-group-string-gamma"]) > div:nth-child(1) > div:nth-child(1)', measure: 'box' }),
    label1: Object.freeze({ upstream: '.cds--radio-button-wrapper:nth-of-type(1) .cds--radio-button__label-text', ours: 'div:has(> [data-testid="radio-group-string-alpha"]) > [dir="auto"]', measure: 'text' }),
    label2: Object.freeze({ upstream: '.cds--radio-button-wrapper:nth-of-type(2) .cds--radio-button__label-text', ours: 'div:has(> [data-testid="radio-group-string-beta"]) > [dir="auto"]', measure: 'text' }),
    label3: Object.freeze({ upstream: '.cds--radio-button-wrapper:nth-of-type(3) .cds--radio-button__label-text', ours: 'div:has(> [data-testid="radio-group-string-gamma"]) > [dir="auto"]', measure: 'text' }),
    message: Object.freeze({ upstream: '.cds--form__helper-text, .cds--radio-button__validation-msg .cds--form-requirement', ours: ':scope > div > div:last-child > [dir="auto"]', measure: 'text' }),
    messageIcon: Object.freeze({ upstream: '.cds--radio-button__validation-msg .cds--radio-button__invalid-icon path', ours: ':scope > div > div:last-child > div > svg path', measure: 'box' })
  })
});
