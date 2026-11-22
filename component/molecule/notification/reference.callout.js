// Info: Callout measurement reference. Upstream draws the Callout like
// the actionable inline layout: marker, kind glyph, title and subtitle
// with the ghost action; never a close button or a live role. The parts
// compared are the container, the details, the icon, the text and the
// action.

export default Object.freeze({
  kind: 'render-web',
  // The callout is an actionable band: below md it wraps at 288 with its
  // details and action inset (`Notification.tsx:1342-1348`,
  // `notification/_actionable-notification.scss:44-58,327-337,405-416`):
  // the narrow set draws a 320 body in a 375 window
  narrow: Object.freeze({ window: 375, width: 320 }),
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Callout, {
      actionButtonLabel: props.actionButtonLabel,
      kind: props.kind,
      lowContrast: props.lowContrast === true,
      subtitle: props.subtitle,
      title: props.title
    });
  },
  // The element a person interacts with: the action button
  // The action is the pressable in every state that draws one; `noAction`
  // draws none, so the target is an additional target gated by states
  additionalTargets: Object.freeze([
    Object.freeze({
      name: 'action',
      upstream: '.cds--actionable-notification__action-button, .cds--callout__action-button, [role="button"]',
      ours: '[role="button"]',
      states: Object.freeze(['info', 'warning', 'infoLow', 'warningLow', 'errorMapped'])
    })
  ]),
  parts: Object.freeze({
    container: Object.freeze({ upstream: '.cds--callout, .cds--actionable-notification', ours: '[role="list"] > div, div', measure: 'box', compare: ['minHeight', 'backgroundColor', 'borderLeftWidth', 'borderLeftColor'] }),
    action: Object.freeze({ upstream: '.cds--actionable-notification__action-button, .cds--callout__action-button', ours: '[role="button"]', measure: 'box', optional: true, compare: ['height', 'marginLeft', 'marginBottom', 'backgroundColor', 'color'] })
  })
});
