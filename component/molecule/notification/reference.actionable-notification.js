// Info: ActionableNotification measurement reference. Upstream draws the
// `.cds--actionable-notification` band like the inline one, with the
// `.cds--actionable-notification__action-button` between the text and the
// close: inline the ghost action, as a toast the tertiary-inverse action
// under `shadow.notification` at the toast width. The parts compared are
// the container, the details, the icon, the text, the action and the
// close.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  // Escape is the band's own close: skip it on leave or every later
  // interaction finds an unmounted cell
  escapeOnLeave: false,
  additionalTargets: Object.freeze([
    Object.freeze({
      name: 'close',
      upstream: '.cds--actionable-notification__close-button',
      ours: '[role="alertdialog"] [data-testid="notification-close"], [role="alert"] [data-testid="notification-close"], [role="status"] [data-testid="notification-close"]',
      interactions: Object.freeze(['hover', 'focus']),
      states: Object.freeze(['inline', 'inlineLow', 'toast', 'toastLow'])
    })
  ]),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.ActionableNotification, {
      actionButtonLabel: props.actionButtonLabel,
      caption: props.caption,
      hideCloseButton: props.hideCloseButton === true,
      inline: props.inline === true,
      kind: props.kind,
      lowContrast: props.lowContrast === true,
      subtitle: props.subtitle,
      title: props.title
    });
  },
  // The element a person interacts with: the action button
  target: Object.freeze({ upstream: '.cds--actionable-notification__action-button', ours: '[role="button"]:has([dir="auto"])' }),
  parts: Object.freeze({
    container: Object.freeze({ upstream: '.cds--actionable-notification', ours: '[role="alertdialog"], [role="alert"], [role="status"]', measure: 'box', compare: ['minHeight', 'backgroundColor', 'borderLeftWidth', 'borderLeftColor', 'boxShadow'] }),
    action: Object.freeze({ upstream: '.cds--actionable-notification__action-button', ours: '[role="button"]:has([dir="auto"])', measure: 'box', compare: ['height', 'marginLeft', 'marginBottom', 'backgroundColor', 'color'] }),
    close: Object.freeze({ upstream: '.cds--actionable-notification__close-button', ours: '[role="alertdialog"] [data-testid="notification-close"], [role="alert"] [data-testid="notification-close"], [role="status"] [data-testid="notification-close"]', measure: 'box', optional: true, compare: ['width', 'height'] })
  })
});
