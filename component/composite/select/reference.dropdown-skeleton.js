// Info: The dropdown placeholder also paints its entire form wrapper.
// The source's inert size prop is not part of the curated public API.
export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.DropdownSkeleton, { hideLabel: props.hideLabel === true });
  },
  parts: Object.freeze({
    root: Object.freeze({
      upstream: '.cds--skeleton.cds--form-item',
      ours: ':scope > div',
      measure: 'box',
      compare: Object.freeze(['x', 'y', 'width', 'height', 'backgroundColor'])
    }),
    label: Object.freeze({ upstream: '.cds--label.cds--skeleton', ours: '[data-testid="dropdown-skeleton-label"]', measure: 'box' }),
    field: Object.freeze({ upstream: '.cds--dropdown.cds--skeleton', ours: '[data-testid="dropdown-skeleton-field"]', measure: 'box' })
  })
});
