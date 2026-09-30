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
  parts: Object.freeze({ root: '.cds--checkbox-wrapper', label: '.cds--checkbox-label' })
});
