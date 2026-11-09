// Info: TextArea measurement reference. The upstream text area takes the
// label as `labelText`, a required `id`, `rows`, `enableCounter` with
// `maxCount` and the same placeholder, value, disabled, invalid and helper
// props; an unlabelled field hides its label. Its frame is the textarea
// element itself, its error icon sits absolute at the wrapper's top end and
// its counter sits beside the label. The parts compared are the label, the
// counter, the frame, the value, the icon and the helper. The second
// reference was retired (batch R).

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
    // The counter pins to the row's trailing edge; compared there so the
    // text's own tracking may widen it without moving the edge
    counter: Object.freeze({ upstream: '.cds--text-area__label-wrapper > :nth-child(2)', ours: ':scope > div > div:nth-child(1) > [dir="auto"]:last-child', measure: 'text', optional: true, edge: 'end' }),
    frame: Object.freeze({ upstream: '.cds--text-area', ours: 'div:has(> textarea)', measure: 'box' }),
    value: Object.freeze({ upstream: '.cds--text-area', ours: 'textarea', measure: 'type' }),
    icon: Object.freeze({ upstream: 'svg.cds--text-area__invalid-icon path', ours: 'div:has(> textarea) svg path', measure: 'box', optional: true }),
    message: Object.freeze({ upstream: '.cds--form__helper-text, .cds--form-requirement', ours: ':scope > div > div:nth-child(3) > [dir="auto"]:nth-child(1)', measure: 'text', optional: true })
  })
});
