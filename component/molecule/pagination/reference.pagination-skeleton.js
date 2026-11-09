// Info: PaginationSkeleton measurement reference. The upstream skeleton
// bar holds four text bars across its left and right slots.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 800 }),
  mount: function (React, upstream) {
    return React.createElement(upstream.PaginationSkeleton, null);
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--pagination', ours: '[data-part="root"]', measure: 'box' }),
    left: Object.freeze({ upstream: '.cds--pagination__left', ours: '[data-part="left"]', measure: 'box' }),
    right: Object.freeze({ upstream: '.cds--pagination__right', ours: '[data-part="right"]', measure: 'box' }),
    texts: Object.freeze({ upstream: '.cds--skeleton__text', ours: ':scope [data-part="text"]', measure: 'box', all: true })
  })
});
