// Info: component/molecule/text-input/reference.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
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
        value: props.value !== undefined ? props.value : (props.defaultValue || ''),
        disabled: props.disabled === true,
        error: props.invalid === true,
        errorText: props.invalidText,
        supportingText: props.helperText,
        style: { width: 320 }
      });
    },
    target: Object.freeze({ upstream: 'md-outlined-text-field', ours: 'input' }),
    parts: Object.freeze({
      frame: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .container', ours: 'div:has(> input)', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius'] }),
      edge: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .outline-start', pseudo: '::before', ours: 'div:has(> input)', measure: 'box', compare: ['borderTopWidth', 'borderBottomColor'] }),
      label: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .label:not(.hidden)', ours: ':scope > div > [dir="auto"]:first-child', measure: 'text' }),
      value: Object.freeze({ upstream: 'md-outlined-text-field >>> input', ours: 'input', measure: 'type' }),
      message: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .supporting-text > span', ours: ':scope > div > [dir="auto"]:last-child', measure: 'text' })
    }),
    omit: Object.freeze({
      icon: Object.freeze({ reason: 'the second reference marks an invalid field by the error color alone and draws a trailing icon only when the page slots one; ours draws the template\'s error icon', upstream: 'md-outlined-text-field >>> .icon.trailing svg, md-outlined-text-field [slot="trailing-icon"]', mask: true })
    })
  });
