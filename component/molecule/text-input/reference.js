// Info: TextInput measurement reference. The upstream text input takes the
// label as `labelText`, a required `id`, and the same placeholder, value,
// size, disabled, invalid and helper props; an unlabelled field hides its
// label. The parts compared are the label, the input and the helper.

let counter = 0;


export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    counter = counter + 1;
    return React.createElement(upstream.TextInput, {
      id: 'reference-text-input-' + counter,
      labelText: typeof props.label === 'string' ? props.label : props.accessibilityLabel,
      hideLabel: typeof props.label !== 'string',
      placeholder: props.placeholder,
      value: props.value,
      onChange: function () {
        return undefined;
      },
      size: props.size || 'md',
      disabled: props.disabled === true,
      invalid: props.invalid === true,
      invalidText: props.invalidText,
      helperText: props.helperText
    });
  },
  parts: Object.freeze({ label: '.cds--label', input: '.cds--text-input', helper: '.cds--form__helper-text' })
});
