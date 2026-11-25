// Info: InlineNotification measurement reference. Upstream draws the
// `.cds--inline-notification` band: the start marker, the kind's status
// icon, the title and subtitle text and the close button; `lowContrast`
// swaps the inverse container for the kind fill with the 1 px kind
// outline on the top, end and bottom and primary text. The parts
// compared are the container, its low-contrast outline, the details, the
// icon, the text, the title, the subtitle and the close.

export default Object.freeze({
  kind: 'render-web',
  // Below md the band wraps at 288 with its details and action inset,
  // read from the window (`notification/_inline-notification.scss:26-55,
  // 272-286,306-319,400-413`): the narrow set draws a 320 body in a 375 window
  narrow: Object.freeze({ window: 375, width: 320 }),
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
  // The close is the pressable in every state that draws one; `noClose`
  // draws none, so the target is an additional target gated by states
  additionalTargets: Object.freeze([
    Object.freeze({
      name: 'close',
      upstream: '.cds--inline-notification__close-button',
      ours: '[role="status"] > div:last-child [role="button"], [role="alert"] > div:last-child [role="button"], [role="log"] > div:last-child [role="button"]',
      interactions: Object.freeze(['hover', 'focus']),
      states: Object.freeze(['error', 'success', 'info', 'warning', 'errorLow', 'successLow', 'infoLow', 'warningLow', 'infoSquare', 'warningAlt'])
    })
  ]),
  parts: Object.freeze({
    container: Object.freeze({ upstream: '.cds--inline-notification', ours: '[role="status"], [role="alert"], [role="log"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'minHeight', 'backgroundColor', 'borderLeftWidth', 'borderLeftColor', 'color'] }),
    outline: Object.freeze({ upstream: '.cds--inline-notification', ours: '[role="status"], [role="alert"], [role="log"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height', 'boxShadow'] }),
    details: Object.freeze({ upstream: '.cds--inline-notification__details', ours: '[role="status"] > div:first-child, [role="alert"] > div:first-child, [role="log"] > div:first-child', measure: 'box', compare: ['x', 'y', 'width', 'height', 'marginLeft', 'marginRight'] }),
    // Ours is the icon's column, stretched to the text beside it; its x, y
    // and width are the glyph's, upstream's box is the 20 glyph alone
    icon: Object.freeze({ upstream: '.cds--inline-notification__icon', ours: '[role="status"] > div:first-child > div:first-child, [role="alert"] > div:first-child > div:first-child, [role="log"] > div:first-child > div:first-child', measure: 'box', compare: ['x', 'y', 'width', 'marginTop', 'marginRight', 'fill'], except: ['height'] }),
    textWrapper: Object.freeze({ upstream: '.cds--inline-notification__text-wrapper', ours: '[role="status"] > div:first-child > div:last-child, [role="alert"] > div:first-child > div:last-child, [role="log"] > div:first-child > div:last-child', measure: 'box', compare: ['paddingTop'] }),
    title: Object.freeze({ upstream: '.cds--inline-notification__title', ours: '[dir="auto"]:first-child', measure: 'text' }),
    subtitle: Object.freeze({ upstream: '.cds--inline-notification__subtitle', ours: '[dir="auto"]:last-child', measure: 'text', optional: true }),
    close: Object.freeze({ upstream: '.cds--inline-notification__close-button', ours: '[role="status"] > div:last-child [role="button"], [role="alert"] > div:last-child [role="button"], [role="log"] > div:last-child [role="button"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height'] }),
    closeIcon: Object.freeze({ upstream: '.cds--inline-notification__close-icon', ours: '[role="status"] > div:last-child [data-testid="icon-button-face"] svg, [role="alert"] > div:last-child [data-testid="icon-button-face"] svg, [role="log"] > div:last-child [data-testid="icon-button-face"] svg', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height', 'fill'] })
  })
});
