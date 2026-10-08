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
  // The element a person hovers, presses and focuses
  target: Object.freeze({ upstream: 'select', ours: '[role="combobox"]' }),
  parts: Object.freeze({
    label: Object.freeze({ upstream: '.cds--label', ours: ':scope > div > [dir="auto"]:first-child', measure: 'text' }),
    frame: Object.freeze({ upstream: '.cds--select-input', ours: 'div:has(> [role="combobox"])', measure: 'box' }),
    icon: Object.freeze({ upstream: '.cds--select__invalid-icon path', ours: '[role="combobox"] > div:nth-child(2):not(:last-child) svg path', measure: 'box' }),
    caret: Object.freeze({ upstream: '.cds--select__arrow path', ours: '[role="combobox"] > div:last-child svg path', measure: 'box' }),
    message: Object.freeze({ upstream: '.cds--form__helper-text, .cds--form-requirement', ours: ':scope > div > [dir="auto"]:last-child', measure: 'text' })
  }),
  // The second reference draws one size and shares its field with the text field (parts are
  // measured from the frame); its caret is a drawn ten-by-five arrow, compared as a box
  second: Object.freeze({
    origin: 'frame',
    body: Object.freeze({ width: 320 }),
    mount: function (React, upstream, props) {
      // One size; and no placeholder, so an unlabelled empty select draws nothing there
      if ((props.size !== undefined && props.size !== 'md') || (typeof props.label !== 'string' && props.value === undefined)) {
        return null;
      }
      return React.createElement('md-outlined-select', {
        label: props.label,
        'aria-label': typeof props.label === 'string' ? undefined : props.accessibilityLabel,
        value: props.value || '',
        disabled: props.disabled === true,
        error: props.invalid === true,
        errorText: props.invalidText,
        supportingText: props.helperText,
        style: { width: 320 }
      }, props.items.map(function (item) {
        return React.createElement('md-select-option', { key: item.value, value: item.value },
          React.createElement('div', { slot: 'headline' }, item.label));
      }));
    },
    target: Object.freeze({ upstream: 'md-outlined-select', ours: '[role="combobox"]' }),
    parts: Object.freeze({
      frame: Object.freeze({ upstream: 'md-outlined-select >>> md-outlined-field >>> .container', ours: 'div:has(> [role="combobox"])', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius'] }),
      edge: Object.freeze({ upstream: 'md-outlined-select >>> md-outlined-field >>> .outline-start', pseudo: '::before', ours: 'div:has(> [role="combobox"])', measure: 'box', compare: ['borderTopWidth', 'borderBottomColor'] }),
      label: Object.freeze({ upstream: 'md-outlined-select >>> md-outlined-field >>> .label:not(.hidden)', ours: ':scope > div > [dir="auto"]:first-child', measure: 'text' }),
      value: Object.freeze({ upstream: 'md-outlined-select >>> #label', ours: '[role="combobox"] > div:first-child > [dir="auto"]', measure: 'text' }),
      caret: Object.freeze({ upstream: 'md-outlined-select >>> .icon.trailing svg polygon.down', ours: '[role="combobox"] > div:last-child svg path', measure: 'box' }),
      message: Object.freeze({ upstream: 'md-outlined-select >>> md-outlined-field >>> .supporting-text > span', ours: ':scope > div > [dir="auto"]:last-child', measure: 'text' })
    }),
    omit: Object.freeze({
      icon: Object.freeze({ reason: 'the second reference marks an invalid select by the error color alone and draws no error icon unless the page slots one; ours draws the template\'s error icon before the caret', upstream: 'md-outlined-select [slot="leading-icon"], md-outlined-select [slot="trailing-icon"]', mask: true })
    })
  })
});
