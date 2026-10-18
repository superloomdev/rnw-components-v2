// Info: SearchSkeleton measurement reference. The upstream skeleton takes
// `size`; it draws one field-height box with no label bar. The part
// compared is the box. A skeleton answers no interaction, so it has no
// target. No second reference: the second system has no skeleton.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.SearchSkeleton, {
      size: props.size || 'md'
    });
  },
  parts: Object.freeze({
    field: Object.freeze({ upstream: ':scope > div > .cds--search-input', ours: '[data-testid="search-skeleton-field"]', measure: 'box' })
  })
});
