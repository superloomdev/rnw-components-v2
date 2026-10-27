// Info: TabsSkeleton measurement reference.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream) {
    return React.createElement(upstream.TabsSkeleton, {});
  },
  parts: Object.freeze({
    item: Object.freeze({ upstream: '.cds--tabs__nav-item', ours: ':scope > div > div:first-child', measure: 'box', optional: true })
  })
});
