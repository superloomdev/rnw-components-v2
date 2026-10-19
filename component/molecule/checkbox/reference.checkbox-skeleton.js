// Info: CheckboxSkeleton measurement reference. The upstream skeleton
// takes no props: it draws the label bar alone inside the row's wrapper,
// the space the box takes left empty. The parts compared are the row and
// the bar. A skeleton answers no interaction, so it has no target. No
// second reference: the second system has no skeleton.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  mount: function (React, upstream) {
    return React.createElement(upstream.CheckboxSkeleton, {});
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: ':scope > div', ours: ':scope > div', measure: 'box' }),
    bar: Object.freeze({ upstream: '.cds--checkbox-label-text.cds--skeleton', ours: '[data-testid="checkbox-skeleton-label"]', measure: 'box' })
  })
});
