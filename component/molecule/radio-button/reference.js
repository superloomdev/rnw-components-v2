// Info: RadioButton measurement reference. The upstream radio takes the
// label as `labelText` and requires `id` and `value`; the ring is the
// label's appearance element and the checked dot is its `::before`, so the
// parts compared are the row and its label, and the dot is covered by the
// pixel comparison alone. Invalid is a group state upstream - the
// standalone radio draws none - so invalid samples mount nothing there.
// The second reference is the control alone: it draws no label and its ring
// and dot are one SVG drawing, so only the ring's box is compared and the
// row and label are omitted.

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
    root: Object.freeze({ upstream: '.cds--radio-button-wrapper', ours: ':scope > [role="radio"]', measure: 'box' }),
    ring: Object.freeze({ upstream: '.cds--radio-button__appearance', ours: '[role="radio"] > div > div:nth-child(1)', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--radio-button__label-text', ours: '[role="radio"] > [dir="auto"]', measure: 'text' })
  }),
  second: Object.freeze({
    origin: 'ring',
    mount: function (React, upstream, props) {
      if (props.invalid === true) {
        return null;
      }
      return React.createElement('md-radio', {
        checked: props.checked === true,
        disabled: props.disabled === true
      });
    },
    target: Object.freeze({ upstream: 'md-radio', ours: '[role="radio"]' }),
    parts: Object.freeze({
      ring: Object.freeze({ upstream: 'md-radio >>> svg.icon', ours: '[role="radio"] > div > div:nth-child(1)', measure: 'box', compare: ['width', 'height'] })
    }),
    // The second reference is the ring alone: the page pairs it with its own
    // label, so nothing of ours beside the ring is drawn there
    omit: Object.freeze({
      root: Object.freeze({ reason: 'the second reference draws no row around the control', upstream: '*:has(> md-radio)' }),
      label: Object.freeze({ reason: 'the second reference draws no label; the page supplies one', upstream: 'md-radio ~ *, md-radio >>> label' })
    })
  })
});
