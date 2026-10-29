// Info: InlineNotification measurement reference. Upstream draws the
// `.cds--inline-notification` band: the start marker, the kind's status
// icon, the title and subtitle text and the close button; `lowContrast`
// swaps the inverse container for the kind fill with the 1 px kind
// outline on the top, end and bottom and primary text. The parts
// compared are the container, its low-contrast outline, the details, the
// icon, the text, the title, the subtitle and the close.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus']),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.InlineNotification, {
      hideCloseButton: props.hideCloseButton === true,
      kind: props.kind,
      lowContrast: props.lowContrast === true,
      subtitle: props.subtitle,
      title: props.title
    });
  },
  // The element a person interacts with: the close button
  target: Object.freeze({ upstream: '.cds--inline-notification__close-button', ours: '[role="status"] [role="button"], [role="alert"] [role="button"], [role="log"] [role="button"]' }),
  parts: Object.freeze({
    container: Object.freeze({ upstream: '.cds--inline-notification', ours: '[role="status"], [role="alert"], [role="log"]', measure: 'box', compare: ['width', 'minHeight', 'backgroundColor', 'borderLeftWidth', 'borderLeftColor', 'color'] }),
    outline: Object.freeze({ upstream: '.cds--inline-notification', ours: '[role="status"], [role="alert"], [role="log"]', measure: 'box', optional: true, compare: ['borderTopColor', 'borderTopWidth', 'borderRightColor', 'borderBottomColor'] }),
    details: Object.freeze({ upstream: '.cds--inline-notification__details', ours: '[role="status"] > div:first-child, [role="alert"] > div:first-child, [role="log"] > div:first-child', measure: 'box', compare: ['marginLeft', 'marginRight'] }),
    icon: Object.freeze({ upstream: '.cds--inline-notification__icon', ours: '[role="status"] > div:first-child > div:first-child, [role="alert"] > div:first-child > div:first-child, [role="log"] > div:first-child > div:first-child', measure: 'box', compare: ['width', 'marginTop', 'marginRight', 'fill'] }),
    textWrapper: Object.freeze({ upstream: '.cds--inline-notification__text-wrapper', ours: '[role="status"] > div:first-child > div:last-child, [role="alert"] > div:first-child > div:last-child, [role="log"] > div:first-child > div:last-child', measure: 'box', compare: ['paddingTop'] }),
    title: Object.freeze({ upstream: '.cds--inline-notification__title', ours: '[dir="auto"]:first-child', measure: 'text' }),
    subtitle: Object.freeze({ upstream: '.cds--inline-notification__subtitle', ours: '[dir="auto"]:last-child', measure: 'text', optional: true }),
    close: Object.freeze({ upstream: '.cds--inline-notification__close-button', ours: '[role="status"] > [role="button"], [role="alert"] > [role="button"], [role="log"] > [role="button"]', measure: 'box', optional: true, compare: ['width', 'height'] }),
    closeIcon: Object.freeze({ upstream: '.cds--inline-notification__close-icon', ours: '[role="status"] svg, [role="alert"] svg, [role="log"] svg', measure: 'box', optional: true, compare: ['width', 'height', 'fill'] })
  })
});
