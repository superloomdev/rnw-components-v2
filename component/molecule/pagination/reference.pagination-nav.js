// Info: PaginationNav measurement reference. The nav is a row of page
// buttons (first and last always, the middle through overflow selects)
// between the direction buttons.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 800 }),
  // At or below an sm window the nav shows its size's fallback count
  // instead of `itemsShown` (`PaginationNav.tsx:378-398` `max-width:
  // sm`): the narrow set draws a 320 body in a 320 window
  narrow: Object.freeze({ window: 320, width: 320 }),
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
    // Upstream's overflow picker is a `__page` too (`PaginationNav.tsx:242,261`);
    // the harness tries comma alternatives in order, so ours joins its two
    // kinds in one `:is()` and the first in document order is read, as
    // upstream's (narrow `middle` opens on the front picker, not on page 5)
    pages: Object.freeze({ upstream: '.cds--pagination-nav__page', ours: ':is([data-part="page"], [data-part="overflow"] [role="button"])', measure: 'box', all: true }),
    active: Object.freeze({ upstream: '.cds--pagination-nav__page--active', ours: '[data-part="page"][aria-current="page"]', measure: 'box' })
  })
});
