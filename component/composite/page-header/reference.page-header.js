// Info: PageHeader measurement reference - the ibm-products PageHeader:
// the breadcrumb row, the title row, subtitle and tags.
export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 1280 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.PageHeader, {
      breadcrumbs: (props.breadcrumbs || []).map(function (c) {
        return { children: c.label, href: c.href };
      }),
      collapseHeader: props.collapseHeader === true,
      pageActions: (props.pageActions || []).map(function (a) {
        return { label: a.label, onClick: a.onPress };
      }),
      subtitle: props.subtitle,
      tags: (props.tags || []).map(function (t) {
        return { children: t.label };
      }),
      title: props.title
    });
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.c4p--page-header', ours: ':scope > div', measure: 'box' }),
    breadcrumb: Object.freeze({ upstream: '.cds--breadcrumb', ours: '[data-part="breadcrumb"]', measure: 'box', optional: true }),
    title: Object.freeze({ upstream: '.c4p--page-header__title', ours: '[data-part="title"]', measure: 'box' }),
    titleIcon: Object.freeze({ upstream: '.c4p--page-header__icon', ours: '[data-part="titleIcon"] svg', measure: 'box', optional: true }),
    actions: Object.freeze({ upstream: '.c4p--page-header__actions', ours: '[data-part="actions"]', measure: 'box', optional: true }),
    subtitle: Object.freeze({ upstream: '.c4p--page-header__subtitle', ours: '[data-part="subtitle"]', measure: 'text', optional: true }),
    tags: Object.freeze({ upstream: '.c4p--page-header__tags', ours: '[data-part="tags"]', measure: 'box', optional: true })
  })
});
