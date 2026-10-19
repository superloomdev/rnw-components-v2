// Info: The fixed-height select placeholder has no input or interaction.
export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.SelectSkeleton, { hideLabel: props.hideLabel === true });
  },
  parts: Object.freeze({
    label: Object.freeze({ upstream: '.cds--label.cds--skeleton', ours: '[data-testid="select-skeleton-label"]', measure: 'box' }),
    field: Object.freeze({ upstream: '.cds--select.cds--skeleton', ours: '[data-testid="select-skeleton-field"]', measure: 'box' })
  })
});
