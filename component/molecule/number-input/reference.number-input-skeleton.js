// Info: NumberInputSkeleton measurement reference. The upstream skeleton
// takes `hideLabel` and `size`; it draws a label bar over a field-height
// box. The parts compared are the two shapes' boxes. A skeleton answers no
// interaction, so it has no target. No second reference: the second system
// has no skeleton.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.NumberInputSkeleton, {
      hideLabel: props.hideLabel === true,
      size: props.size || 'md'
    });
  },
  parts: Object.freeze({
    label: Object.freeze({ upstream: ':scope > div > .cds--label.cds--skeleton', ours: '[data-testid="text-input-skeleton-label"]', measure: 'box' }),
    field: Object.freeze({ upstream: ':scope > div > .cds--number.cds--skeleton', ours: '[data-testid="text-input-skeleton-field"]', measure: 'box' })
  })
});
