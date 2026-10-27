// Info: RadioButton measurement reference. The upstream radio takes the
// label as `labelText` and requires `id` and `value`; the ring is the
// label's appearance element and the checked dot is its `::before`, so the
// parts compared are the row and its label, and the dot is covered by the
// pixel comparison alone. Invalid is a group state upstream - the
// standalone radio draws none - so invalid samples mount nothing there.
// The second reference was retired (batch R).

let counter = 0;


export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    if (props.invalid === true) {
      return null;
    }
    counter = counter + 1;
    return React.createElement(upstream.RadioButton, {
      id: 'reference-radio-' + counter,
      labelText: props.label,
      value: 'reference-radio-' + counter,
      checked: props.checked === true,
      disabled: props.disabled === true,
      onChange: function () {
        return undefined;
      }
    });
  },
  body: Object.freeze({ width: 320 }),
  // The element a person hovers and presses (the upstream's label carries the ring), and the one focused
  target: Object.freeze({ upstream: '.cds--radio-button__label', ours: '[role="radio"]', upstreamFocus: 'input[type="radio"]' }),
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--radio-button-wrapper', ours: 'div:has(> [role="radio"])', measure: 'box' }),
    ring: Object.freeze({ upstream: '.cds--radio-button__appearance', ours: 'div:has(> [role="radio"]) > div:nth-child(1) > div:nth-child(1)', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--radio-button__label-text', ours: 'div:has(> [role="radio"]) > [dir="auto"]', measure: 'text' })
  })
});
