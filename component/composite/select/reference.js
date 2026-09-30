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
  body: Object.freeze({ width: 320 }),
  parts: Object.freeze({
    label: Object.freeze({ upstream: '.cds--label', ours: ':scope > div > [dir="auto"]:first-child', measure: 'text' }),
    frame: Object.freeze({ upstream: '.cds--select-input', ours: 'div:has(> [role="combobox"])', measure: 'box' }),
    icon: Object.freeze({ upstream: '.cds--select__invalid-icon path', ours: '[role="combobox"] > div:nth-child(2):not(:last-child) svg path', measure: 'box' }),
    caret: Object.freeze({ upstream: '.cds--select__arrow path', ours: '[role="combobox"] > div:last-child svg path', measure: 'box' }),
    message: Object.freeze({ upstream: '.cds--form__helper-text, .cds--form-requirement', ours: ':scope > div > [dir="auto"]:last-child', measure: 'text' })
  })
});
