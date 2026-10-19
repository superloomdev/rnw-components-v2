// Info: FormGroup measurement reference. The upstream group is a fieldset
// whose legend sits a spacing step above the fields; ours is a labelled
// View with the legend in the field label cells. The group carries the
// compact body type the caller's text sets, so the unstyled message
// inherits it; the two specimen children mount as block elements, as ours
// stacks them. The parts compared are the root's box and the legend
// text's set, color and position. No second reference: the second system
// has no fieldset element.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.FormGroup, {
      disabled: props.disabled,
      invalid: props.invalid,
      legendText: props.legendText,
      message: props.message,
      messageText: props.messageText,
      style: upstream.fixtureTextStyle('bodyCompact01')
    }, (props.children || []).map(function (child, index) {
      return React.createElement('div', { key: index }, child);
    }));
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: ':scope > fieldset', ours: ':scope > div', measure: 'box' }),
    legend: Object.freeze({ upstream: ':scope > fieldset > legend', ours: ':scope > div > [dir="auto"]', measure: 'text' })
  })
});
