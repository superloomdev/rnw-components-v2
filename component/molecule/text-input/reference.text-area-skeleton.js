// Info: TextAreaSkeleton measurement reference. The upstream skeleton takes
// `hideLabel`; it draws a label bar over a 100px area box. The parts
// compared are the two shapes' boxes. A skeleton answers no interaction,
// so it has no target. No second reference: the second system has no
// skeleton.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.TextAreaSkeleton, {
      hideLabel: props.hideLabel === true
    });
  },
  parts: Object.freeze({
    label: Object.freeze({ upstream: ':scope > div > .cds--label.cds--skeleton', ours: '[data-testid="text-area-skeleton-label"]', measure: 'box' }),
    field: Object.freeze({ upstream: ':scope > div > .cds--text-area.cds--skeleton', ours: '[data-testid="text-area-skeleton-field"]', measure: 'box' })
  })
});
