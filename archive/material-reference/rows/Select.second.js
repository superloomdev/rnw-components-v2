// Info: component/composite/select/reference.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
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
  });
