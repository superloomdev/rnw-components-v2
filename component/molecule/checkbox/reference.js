// Info: Checkbox measurement reference. The upstream checkbox takes the
// label as `labelText`, a required `id`, and the same checked, mixed,
// disabled, invalid and helper props; its box is drawn on the label's
// `::before`, so the parts compared are the root and its label. The second
// reference is the box alone (its label, helper and error live outside the
// element) and draws its mark with rectangles, so the parts compared there
// are the box outline and the box fill.

let counter = 0;


export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    counter = counter + 1;
    return React.createElement(upstream.Checkbox, {
      id: 'reference-checkbox-' + counter,
      labelText: props.label,
      checked: props.checked === true,
      indeterminate: props.indeterminate === true,
      disabled: props.disabled === true,
      invalid: props.invalid === true,
      invalidText: props.invalidText,
      helperText: props.helperText,
      onChange: function () {
        return undefined;
      }
    });
  },
  body: Object.freeze({ width: 320 }),
  // The element a person hovers and presses (the upstream's label carries the box), and the one focused
  target: Object.freeze({ upstream: '.cds--checkbox-label', ours: '[role="checkbox"]', upstreamFocus: 'input[type="checkbox"]' }),
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--checkbox-wrapper', ours: ':scope > div', measure: 'box' }),
    box: Object.freeze({ upstream: '.cds--checkbox-label', pseudo: '::before', ours: '[role="checkbox"] > div > div:nth-child(1)', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--checkbox-label-text', ours: '[role="checkbox"] > [dir="auto"]', measure: 'text' }),
    message: Object.freeze({ upstream: '.cds--form__helper-text, .cds--form-requirement', ours: ':scope > div > div:nth-child(2) > [dir="auto"]', measure: 'text' }),
    messageIcon: Object.freeze({ upstream: '.cds--checkbox__invalid-icon path', ours: ':scope > div > div:nth-child(2) svg path', measure: 'box' })
  }),
  // The second reference keeps its outline under the fill once selected and
  // has no invalid state, so the outline is compared while unselected, the
  // fill while selected, and an invalid state is unmeasured
  second: Object.freeze({
    origin: 'box',
    mount: function (React, upstream, props) {
      if (props.invalid === true) {
        return null;
      }
      return React.createElement('md-checkbox', {
        checked: props.checked === true,
        indeterminate: props.indeterminate === true,
        disabled: props.disabled === true
      });
    },
    target: Object.freeze({ upstream: 'md-checkbox', ours: '[role="checkbox"]' }),
    parts: Object.freeze({
      box: Object.freeze({ upstream: 'md-checkbox >>> .container', ours: '[role="checkbox"] > div > div:nth-child(1)', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius'] }),
      outline: Object.freeze({ upstream: 'md-checkbox >>> .container.unselected > .outline', ours: '[role="checkbox"][aria-checked="false"] > div > div:nth-child(1)', measure: 'box', compare: ['borderTopWidth', 'borderBottomWidth', 'borderBottomColor', 'backgroundColor'] }),
      fill: Object.freeze({ upstream: 'md-checkbox >>> .container.selected > .background', ours: '[role="checkbox"]:not([aria-checked="false"]) > div > div:nth-child(1)', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius', 'backgroundColor'] })
    }),
    // The second reference's checkbox is the box alone: the page pairs it with its own label,
    // wrapper and messages, so nothing of those is drawn beside it
    omit: Object.freeze({
      root: Object.freeze({ reason: 'the second reference draws no wrapper around the box', upstream: '*:has(> md-checkbox)' }),
      label: Object.freeze({ reason: 'the second reference draws no label; the page supplies one', upstream: 'md-checkbox ~ *, md-checkbox >>> label' }),
      message: Object.freeze({ reason: 'the second reference draws no helper or error text', upstream: 'md-checkbox ~ *, md-checkbox >>> .supporting-text' }),
      messageIcon: Object.freeze({ reason: 'the second reference has no invalid state with an icon (an invalid sample is not mounted there)', upstream: 'md-checkbox ~ * svg' })
    })
  })
});
