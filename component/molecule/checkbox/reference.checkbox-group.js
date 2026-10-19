// Info: CheckboxGroup measurement reference. The upstream group is a
// fieldset whose legend sits above checkbox wrappers; each wrapper's
// label is the control, its box the label's `::before` pseudo. The parts
// compared are the root, the legend, the three row wrappers, each row's
// box and label text, and the helper or error message with its icon -
// the wide wrapper is compared to ours wide row, never to a label.
// There is no second reference: the second system has no checkbox group,
// so its values are a Superloom decision.

let counter = 0;


export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    const items = Array.isArray(props.items) ? props.items : [];
    return React.createElement(upstream.CheckboxGroup, {
      legendText: props.legendText,
      disabled: props.disabled === true,
      invalid: props.invalid === true,
      invalidText: props.invalidText,
      helperText: props.helperText
    }, items.map(function (item) {
      counter = counter + 1;
      return React.createElement(upstream.Checkbox, {
        id: 'reference-checkbox-group-' + counter,
        key: item.id,
        labelText: item.label,
        checked: item.checked,
        defaultChecked: item.defaultChecked,
        indeterminate: item.indeterminate === true,
        disabled: item.disabled === true,
        onChange: function () {
          return undefined;
        }
      });
    }));
  },
  body: Object.freeze({ width: 320 }),
  // The element a person hovers and presses is the first row's label (the
  // upstream's label carries the box); keyboard focus lands on its input
  target: Object.freeze({ upstream: '.cds--checkbox-wrapper:nth-of-type(1) .cds--checkbox-label', ours: '[role="checkbox"]', upstreamFocus: '.cds--checkbox-wrapper:nth-of-type(1) input[type="checkbox"]' }),
  parts: Object.freeze({
    root: Object.freeze({ upstream: ':scope > fieldset', ours: ':scope > div', measure: 'box' }),
    legend: Object.freeze({ upstream: ':scope > fieldset > legend', ours: ':scope > div > [dir="auto"]', measure: 'text' }),
    row1: Object.freeze({ upstream: '.cds--checkbox-wrapper:nth-of-type(1)', ours: ':scope > div > div:has(> div > [data-testid="checkbox-group-alpha"])', measure: 'box' }),
    row2: Object.freeze({ upstream: '.cds--checkbox-wrapper:nth-of-type(2)', ours: ':scope > div > div:has(> div > [data-testid="checkbox-group-beta"])', measure: 'box' }),
    row3: Object.freeze({ upstream: '.cds--checkbox-wrapper:nth-of-type(3)', ours: ':scope > div > div:has(> div > [data-testid="checkbox-group-gamma"])', measure: 'box' }),
    box1: Object.freeze({ upstream: '.cds--checkbox-wrapper:nth-of-type(1) .cds--checkbox-label', pseudo: '::before', ours: '[data-testid="checkbox-group-alpha"] > div > div:nth-child(1)', measure: 'box' }),
    box2: Object.freeze({ upstream: '.cds--checkbox-wrapper:nth-of-type(2) .cds--checkbox-label', pseudo: '::before', ours: '[data-testid="checkbox-group-beta"] > div > div:nth-child(1)', measure: 'box' }),
    box3: Object.freeze({ upstream: '.cds--checkbox-wrapper:nth-of-type(3) .cds--checkbox-label', pseudo: '::before', ours: '[data-testid="checkbox-group-gamma"] > div > div:nth-child(1)', measure: 'box' }),
    label1: Object.freeze({ upstream: '.cds--checkbox-wrapper:nth-of-type(1) .cds--checkbox-label-text', ours: '[data-testid="checkbox-group-alpha"] > [dir="auto"]', measure: 'text' }),
    label2: Object.freeze({ upstream: '.cds--checkbox-wrapper:nth-of-type(2) .cds--checkbox-label-text', ours: '[data-testid="checkbox-group-beta"] > [dir="auto"]', measure: 'text' }),
    label3: Object.freeze({ upstream: '.cds--checkbox-wrapper:nth-of-type(3) .cds--checkbox-label-text', ours: '[data-testid="checkbox-group-gamma"] > [dir="auto"]', measure: 'text' }),
    message: Object.freeze({ upstream: '.cds--form__helper-text, .cds--checkbox-group__validation-msg .cds--form-requirement', ours: ':scope > div > div:last-child > [dir="auto"]', measure: 'text' }),
    messageIcon: Object.freeze({ upstream: '.cds--checkbox-group__validation-msg .cds--checkbox__invalid-icon path', ours: ':scope > div > div:last-child > div > svg path', measure: 'box' })
  })
});
