// Info: Checkbox measurement reference. The upstream checkbox takes the
// label as `labelText`, a required `id`, and the same checked, mixed,
// disabled, invalid and helper props; its box is drawn on the label's
// `::before`, so the parts compared are the root and its label. The second
// reference was retired (batch R).

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
  // The element a person hovers and presses (the upstream's label carries the box), and the one focused
  target: Object.freeze({ upstream: '.cds--checkbox-label', ours: '[role="checkbox"]', upstreamFocus: 'input[type="checkbox"]' }),
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--checkbox-wrapper', ours: ':scope > div', measure: 'box' }),
    box: Object.freeze({ upstream: '.cds--checkbox-label', pseudo: '::before', ours: 'div:has(> [role="checkbox"]) > div:nth-child(1) > div:nth-child(1)', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--checkbox-label-text', ours: 'div:has(> [role="checkbox"]) > [dir="auto"]', measure: 'text' }),
    message: Object.freeze({ upstream: '.cds--form__helper-text, .cds--form-requirement', ours: ':scope > div > div:nth-child(2) > [dir="auto"]', measure: 'text' }),
    messageIcon: Object.freeze({ upstream: '.cds--checkbox__invalid-icon path', ours: ':scope > div > div:nth-child(2) svg path', measure: 'box' })
  })
});
