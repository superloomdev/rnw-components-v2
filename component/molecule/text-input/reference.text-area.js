// Info: TextArea measurement reference. The upstream text area takes the
// label as `labelText`, a required `id`, `rows`, `enableCounter` with
// `maxCount` and the same placeholder, value, disabled, invalid and helper
// props; an unlabelled field hides its label. Its frame is the textarea
// element itself, its error icon sits absolute at the wrapper's top end and
// its counter sits beside the label. The parts compared are the label, the
// counter, the frame, the value, the icon and the helper. The second
// reference is the same field in its textarea type and puts the counter in
// the supporting row.

let counter = 0;


export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    counter = counter + 1;
    return React.createElement(upstream.TextArea, {
      id: 'reference-text-area-' + counter,
      labelText: typeof props.label === 'string' ? props.label : props.accessibilityLabel,
      hideLabel: typeof props.label !== 'string',
      placeholder: props.placeholder,
      value: props.value,
      onChange: function () {
        return undefined;
      },
      rows: props.rows,
      disabled: props.disabled === true,
      invalid: props.invalid === true,
      invalidText: props.invalidText,
      helperText: props.helperText,
      enableCounter: typeof props.maxCount === 'number',
      maxCount: props.maxCount
    });
  },
  body: Object.freeze({ width: 320 }),
  // The element a person hovers, presses and focuses
  target: Object.freeze({ upstream: '.cds--text-area', ours: 'textarea' }),
  parts: Object.freeze({
    label: Object.freeze({ upstream: '.cds--label', ours: ':scope > div > div:nth-child(1) > [dir="auto"]:nth-child(1)', measure: 'text' }),
    counter: Object.freeze({ upstream: '.cds--text-area__label-wrapper > :nth-child(2)', ours: ':scope > div > div:nth-child(1) > [dir="auto"]:last-child', measure: 'text', optional: true }),
    frame: Object.freeze({ upstream: '.cds--text-area', ours: 'div:has(> textarea)', measure: 'box' }),
    value: Object.freeze({ upstream: '.cds--text-area', ours: 'textarea', measure: 'type' }),
    icon: Object.freeze({ upstream: 'svg.cds--text-area__invalid-icon path', ours: 'div:has(> textarea) svg path', measure: 'box', optional: true }),
    message: Object.freeze({ upstream: '.cds--form__helper-text, .cds--form-requirement', ours: ':scope > div > div:nth-child(3) > [dir="auto"]:nth-child(1)', measure: 'text', optional: true })
  }),
  // The second reference is the same field drawn as its textarea type; its
  // counter lives in the supporting row, and its outline is drawn on
  // pseudo-elements of the outline's three segments, so the frame compares
  // geometry, radius and the outline color read from the leading segment
  second: Object.freeze({
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
      // The upstream counter reads `4 / 100` with spaced slashes; ours
      // renders `4/100`, so the leading edge differs while the trailing
      // edge, the line and the type still compare
      counter: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .counter', ours: ':scope > div > div:nth-child(3) > [dir="auto"]:last-child', measure: 'text', optional: true, except: ['x', 'width'] }),
      value: Object.freeze({ upstream: 'md-outlined-text-field >>> textarea', ours: 'textarea', measure: 'type' }),
      message: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .supporting-text > span', ours: ':scope > div > div:nth-child(3) > [dir="auto"]:nth-child(1)', measure: 'text', optional: true })
    }),
    omit: Object.freeze({
      icon: Object.freeze({ reason: 'the second reference marks an invalid field by the error color alone and draws a trailing icon only when the page slots one; ours draws the template\'s error icon', upstream: 'md-outlined-text-field >>> .icon.trailing svg, md-outlined-text-field [slot="trailing-icon"]', mask: true })
    })
  })
});
