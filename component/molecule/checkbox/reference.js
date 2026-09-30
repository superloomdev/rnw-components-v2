// Info: Checkbox measurement reference. The upstream checkbox takes the
// label as `labelText`, a required `id`, and the same checked, mixed,
// disabled, invalid and helper props; its box is drawn on the label's
// `::before`, so the parts compared are the root and its label.

let counter = 0;


export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    counter = counter + 1;
    return React.createElement(upstream.Checkbox, {
      id: 'reference-checkbox-' + counter,
      labelText: props.label,
      checked: props.checked === true,
      indeterminate: props.indeterminate === true,
      disabled: props.disabled === true,
      invalid: props.invalid === true,
      invalidText: props.invalidText,
      helperText: props.helperText,
      onChange: function () {
        return undefined;
      }
    });
  },
  body: Object.freeze({ width: 320 }),
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--checkbox-wrapper', ours: ':scope > div', measure: 'box' }),
    box: Object.freeze({ upstream: '.cds--checkbox-label', pseudo: '::before', ours: '[role="checkbox"] > div > div:nth-child(2)', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--checkbox-label-text', ours: '[role="checkbox"] > [dir="auto"]', measure: 'text' }),
    message: Object.freeze({ upstream: '.cds--form__helper-text, .cds--form-requirement', ours: ':scope > div > div:nth-child(2) > [dir="auto"]', measure: 'text' }),
    messageIcon: Object.freeze({ upstream: '.cds--checkbox__invalid-icon path', ours: ':scope > div > div:nth-child(2) svg path', measure: 'box' })
  })
});
