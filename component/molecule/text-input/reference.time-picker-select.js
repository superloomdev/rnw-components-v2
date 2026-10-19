// Info: TimePickerSelect measurement reference. The member measures inside
// its parent: the mount is one upstream TimePickerSelect holding `option`
// nodes built from our `items` data, and each sample's `wrappers` compose
// the upstream TimePicker around it (the descriptor's `referenceProps`
// carry that parent's upstream props). The parts compared are the compact
// select's frame, displayed value and caret. No second reference.

let counter = 0;


export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  mount: function (React, upstream, props) {
    counter = counter + 1;
    return React.createElement(upstream.TimePickerSelect, {
      id: 'reference-time-picker-select-' + counter,
      'aria-label': props.accessibilityLabel || 'Choose time option',
      disabled: props.disabled === true
    }, (Array.isArray(props.items) ? props.items : []).map(function (item) {
      return React.createElement('option', { key: item.value, value: item.value }, item.label);
    }));
  },
  // The element a person hovers, presses and focuses
  target: Object.freeze({ upstream: 'select', ours: '[role="combobox"]' }),
  parts: Object.freeze({
    frame: Object.freeze({ upstream: '.cds--select-input', ours: 'div:has(> [data-testid="time-select"])', measure: 'box' }),
    value: Object.freeze({ upstream: '.cds--select-input', ours: '[data-testid="time-select"] > div:first-child > [dir="auto"]', measure: 'type' }),
    caret: Object.freeze({ upstream: '.cds--select__arrow path', ours: '[data-testid="time-select"] > div:last-child svg path', measure: 'box' })
  })
});
