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
  body: Object.freeze({ width: 320 }),
  parts: Object.freeze({
    label: Object.freeze({ upstream: '.cds--label', ours: ':scope > div > [dir="auto"]:first-child', measure: 'text' }),
    frame: Object.freeze({ upstream: '.cds--text-input', ours: 'div:has(> input)', measure: 'box' }),
    value: Object.freeze({ upstream: '.cds--text-input', ours: 'input', measure: 'type' }),
    icon: Object.freeze({ upstream: '.cds--text-input__invalid-icon path', ours: 'div:has(> input) svg path', measure: 'box' }),
    message: Object.freeze({ upstream: '.cds--form__helper-text, .cds--form-requirement', ours: ':scope > div > [dir="auto"]:last-child', measure: 'text' })
  }),
  // The second reference draws one size and floats its label above the host box, so parts are
  // measured from the frame; its outline is drawn on pseudo-elements of
  // three segments, so the frame compares geometry, radius and the outline
  // color read from the leading segment
  second: Object.freeze({
    origin: 'frame',
    body: Object.freeze({ width: 320 }),
    mount: function (React, upstream, props) {
      if (props.size !== undefined && props.size !== 'md') {
        return null;
      }
      return React.createElement('md-outlined-text-field', {
        label: props.label,
        'aria-label': typeof props.label === 'string' ? undefined : props.accessibilityLabel,
        placeholder: props.placeholder,
        value: props.value || '',
        disabled: props.disabled === true,
        error: props.invalid === true,
        errorText: props.invalidText,
        supportingText: props.helperText,
        style: { width: 320 }
      });
    },
    parts: Object.freeze({
      frame: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .container', ours: 'div:has(> input)', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius'] }),
      edge: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .outline-start', pseudo: '::before', ours: 'div:has(> input)', measure: 'box', compare: ['borderTopWidth', 'borderBottomColor'] }),
      label: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .label:not(.hidden)', ours: ':scope > div > [dir="auto"]:first-child', measure: 'text' }),
      value: Object.freeze({ upstream: 'md-outlined-text-field >>> input', ours: 'input', measure: 'type' }),
      message: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .supporting-text > span', ours: ':scope > div > [dir="auto"]:last-child', measure: 'text' })
    })
  })
});
