// Info: EmptyState measurement reference - the product-patterns EmptyState:
// the illustration, the content column, the title, the subtitle, the
// action and the link.
export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 400 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.EmptyState, {
      action: props.action,
      illustration: props.illustration,
      illustrationPosition: props.illustrationPosition || 'top',
      link: props.link,
      size: props.size || 'lg',
      subtitle: props.subtitle,
      title: props.title
    });
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.c4p--empty-state', ours: ':scope > div', measure: 'box' }),
    illustration: Object.freeze({ upstream: '.c4p--empty-state__illustration', ours: '[data-part="illustration"]', measure: 'box', optional: true }),
    content: Object.freeze({ upstream: '.c4p--empty-state__content', ours: '[data-part="content"]', measure: 'box' }),
    header: Object.freeze({ upstream: '.c4p--empty-state__header', ours: '[data-part="header"]', measure: 'text' }),
    subtitle: Object.freeze({ upstream: '.c4p--empty-state__subtitle', ours: '[data-part="subtitle"]', measure: 'text' }),
    action: Object.freeze({ upstream: '.c4p--empty-state__action', ours: '[data-part="action"]', measure: 'box', optional: true }),
    link: Object.freeze({ upstream: '.c4p--empty-state__link', ours: '[data-part="link"]', measure: 'box', optional: true })
  })
});
