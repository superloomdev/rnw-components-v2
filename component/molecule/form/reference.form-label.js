// Info: FormLabel measurement reference. The upstream label is the
// no-margin label element; ours is the registry Text in the same field
// label set and color, with no margin either. The part compares the label
// text: its set, its color and where it sits. No second reference: the
// second system has no label element.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.FormLabel, {
      className: props.disabled === true ? 'cds--label--disabled' : undefined,
      id: props.id
    }, props.children);
  },
  parts: Object.freeze({
    label: Object.freeze({ upstream: ':scope > label', ours: ':scope > [dir="auto"]', measure: 'text' })
  })
});
