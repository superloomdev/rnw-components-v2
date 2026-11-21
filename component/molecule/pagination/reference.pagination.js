// Info: Pagination measurement reference. The bar is one row: the label
// plus the page-size select on the left; the page select, the item count
// and the previous/next buttons on the right.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 800 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Pagination, props);
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--pagination', ours: '[data-part="root"]', measure: 'box' }),
    left: Object.freeze({ upstream: '.cds--pagination__left', ours: '[data-part="left"]', measure: 'box' }),
    right: Object.freeze({ upstream: '.cds--pagination__right', ours: '[data-part="right"]', measure: 'box' }),
    texts: Object.freeze({ upstream: '.cds--pagination__text', ours: '[data-part="text"]', measure: 'text', all: true }),
    count: Object.freeze({ upstream: '.cds--pagination__items-count', ours: '[data-part="count"]', measure: 'box' }),
    selects: Object.freeze({ upstream: '.cds--select-input', ours: '[data-part="root"] [data-part="inlineFrame"]', measure: 'box', all: true }),
    buttons: Object.freeze({ upstream: '.cds--pagination__button', ours: '[data-part="button"]', measure: 'box', all: true }),
    buttonGlyphs: Object.freeze({ upstream: '.cds--pagination__button svg', ours: '[data-part="button"] svg', measure: 'box', all: true })
  })
});
