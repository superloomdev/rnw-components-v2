// Info: Select measurement reference. The upstream select wraps a native
// select element: it takes the label as `labelText`, a required `id`, the
// same size, disabled, invalid and helper props, and its options as
// children. The placeholder is its first, empty option. The parts compared
// are the label, the select frame and the helper.

let counter = 0;


export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    counter = counter + 1;
    const options = (Array.isArray(props.items) ? props.items : []).map(function (item) {
      return React.createElement(upstream.SelectItem, { key: item.value, value: item.value, text: item.label });
    });
    const placeholder = React.createElement(upstream.SelectItem, { key: '', value: '', text: props.placeholder || '' });
    return React.createElement(upstream.Select, {
      id: 'reference-select-' + counter,
      labelText: typeof props.label === 'string' ? props.label : props.accessibilityLabel,
      hideLabel: typeof props.label !== 'string',
      value: props.value || '',
      onChange: function () {
        return undefined;
      },
      size: props.size || 'md',
      disabled: props.disabled === true,
      invalid: props.invalid === true,
      invalidText: props.invalidText,
      helperText: props.helperText
    }, [placeholder].concat(options));
  },
  parts: Object.freeze({ label: '.cds--label', frame: '.cds--select-input', helper: '.cds--form__helper-text' })
});
