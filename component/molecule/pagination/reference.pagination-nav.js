// Info: PaginationNav measurement reference. The nav is a row of page
// buttons (first and last always, the middle through overflow selects)
// between the direction buttons.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 800 }),
  mount: function (React, upstream, props) {
    // Upstream reads `page` only (`PaginationNav.js:151`); our sample seeds
    // `defaultPage`, so the mount passes it as the probe mount does
    return React.createElement(upstream.PaginationNav, {
      itemsShown: props.itemsShown,
      page: props.page !== undefined ? props.page : props.defaultPage,
      size: props.size,
      totalItems: props.totalItems
    });
  },
  parts: Object.freeze({
    nav: Object.freeze({ upstream: '.cds--pagination-nav', ours: '[data-part="nav"]', measure: 'box' }),
    pages: Object.freeze({ upstream: '.cds--pagination-nav__page', ours: '[data-part="page"]', measure: 'box', all: true }),
    active: Object.freeze({ upstream: '.cds--pagination-nav__page--active', ours: '[data-part="page"][aria-current="page"]', measure: 'box' })
  })
});
