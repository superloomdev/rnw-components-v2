// Info: TabsSkeleton measurement reference.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream) {
    return React.createElement(upstream.TabsSkeleton, {});
  },
  parts: Object.freeze({
    item: Object.freeze({ upstream: '.cds--tabs__nav-item:first-child .cds--tabs__nav-link', ours: ':scope > div > div:first-child', measure: 'box' }),
    bar: Object.freeze({ upstream: '.cds--tabs__nav-item:first-child .cds--tabs__nav-link span', ours: ':scope > div > div:first-child > div', measure: 'box' })
  })
});
