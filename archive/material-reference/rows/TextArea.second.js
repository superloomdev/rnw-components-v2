// Info: component/molecule/text-input/reference.text-area.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
    origin: 'frame',
    body: Object.freeze({ width: 320 }),
    mount: function (React, upstream, props) {
      return React.createElement('md-outlined-text-field', {
        type: 'textarea',
        label: props.label,
        'aria-label': typeof props.label === 'string' ? undefined : props.accessibilityLabel,
        placeholder: props.placeholder,
        value: props.value || '',
        rows: props.rows === undefined ? 4 : props.rows,
        disabled: props.disabled === true,
        error: props.invalid === true,
        errorText: props.invalidText,
        supportingText: props.helperText,
        counter: typeof props.maxCount === 'number',
        maxLength: props.maxCount,
        style: { width: 320 }
      });
    },
    target: Object.freeze({ upstream: 'md-outlined-text-field', ours: 'textarea' }),
    parts: Object.freeze({
      frame: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .outline', ours: 'div:has(> textarea)', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius'] }),
      edge: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .outline-start', pseudo: '::before', ours: 'div:has(> textarea)', measure: 'box', compare: ['borderTopWidth', 'borderBottomColor'] }),
      label: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .label:not(.hidden)', ours: ':scope > div > div:nth-child(1) > [dir="auto"]:nth-child(1)', measure: 'text' }),
      // The upstream counter reads `4 / 100` with spaced slashes, the
      // 'spaced' value of the counter format ours writes here; the upstream
      // applies no tracking to supporting text, so ours runs its glyphs
      // wider while staying pinned to the same trailing edge
      counter: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .counter', ours: ':scope > div > div:nth-child(3) > [dir="auto"]:last-child', measure: 'text', optional: true, edge: 'end' }),
      value: Object.freeze({ upstream: 'md-outlined-text-field >>> textarea', ours: 'textarea', measure: 'type' }),
      message: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .supporting-text > span', ours: ':scope > div > div:nth-child(3) > [dir="auto"]:nth-child(1)', measure: 'text', optional: true })
    }),
    omit: Object.freeze({
      icon: Object.freeze({ reason: 'the second reference marks an invalid field by the error color alone and draws a trailing icon only when the page slots one; ours draws the template\'s error icon', upstream: 'md-outlined-text-field >>> .icon.trailing svg, md-outlined-text-field [slot="trailing-icon"]', mask: true })
    })
  });
