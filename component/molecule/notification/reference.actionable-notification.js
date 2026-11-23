// Info: ActionableNotification measurement reference. Upstream draws the
// `.cds--actionable-notification` band like the inline one, with the
// `.cds--actionable-notification__action-button` between the text and the
// close: inline the ghost action, as a toast the tertiary-inverse action
// under `shadow.notification` at the toast width. The parts compared are
// the container, the details, the icon, the text, the action and the
// close. Below md a text that fits beside its action (`inlineShort`)
// shares its line with it, and the upstream's close, out of flow at the
// band's top end (`_actionable-notification.scss:570-615`), covers the
// action: no pointer reaches it there, so the action is a target of the
// other states and that state is compared at rest and under its close.

// Upstream's ActionableNotification focuses its action button on every
// mount (`Notification.js:449`: `hasFocus && role === "alertdialog"`
// focuses `.cds--actionable-notification__action-button`; `hasFocus`
// defaults true). A rest frame is measured unfocused: this wrapper's
// mount effect - it runs after the child's autofocus - blurs the button
// back. Built once from the React the mount is handed
let blurActionFocus = null;

export default Object.freeze({
  kind: 'render-web',
  // Below md the inline band wraps at 288 with its details and action
  // inset, read from the window (`notification/_actionable-notification.scss:
  // 44-58,327-337,405-416,605-627`): the narrow set draws a 320 body in a
  // 375 window
  narrow: Object.freeze({ window: 375, width: 320 }),
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
      states: Object.freeze(['inline', 'inlineLow', 'toast', 'toastLow', 'inlineShort'])
    }),
    // The element a person interacts with: the action button
    Object.freeze({
      name: 'action',
      upstream: '.cds--actionable-notification__action-button',
      ours: '[role="button"]:has([dir="auto"])',
      states: Object.freeze(['inline', 'inlineLow', 'toast', 'toastLow', 'noClose', 'toastNoClose'])
    })
  ]),
  mount: function (React, upstream, props) {
    if (blurActionFocus === null) {
      blurActionFocus = function (wrapperProps) {
        React.useEffect(function () {
          const active = document.activeElement;
          if (active !== null && active.matches('.cds--actionable-notification__action-button')) {
            active.blur();
          }
        }, []);
        return wrapperProps.children;
      };
    }
    return React.createElement(blurActionFocus, null,
      React.createElement(upstream.ActionableNotification, {
        actionButtonLabel: props.actionButtonLabel,
        caption: props.caption,
        hideCloseButton: props.hideCloseButton === true,
        inline: props.inline === true,
        kind: props.kind,
        lowContrast: props.lowContrast === true,
        subtitle: props.subtitle,
        title: props.title
      }));
  },
  // The band's size and the action's place are compared: where the action
  // stands (beside the text, under it, at which end) is the narrow rule
  parts: Object.freeze({
    container: Object.freeze({ upstream: '.cds--actionable-notification', ours: '[role="alertdialog"], [role="alert"], [role="status"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'minHeight', 'backgroundColor', 'borderLeftWidth', 'borderLeftColor', 'boxShadow'] }),
    action: Object.freeze({ upstream: '.cds--actionable-notification__action-button', ours: '[role="button"]:has([dir="auto"])', measure: 'box', compare: ['x', 'y', 'width', 'height', 'marginLeft', 'marginBottom', 'backgroundColor', 'color'] }),
    close: Object.freeze({ upstream: '.cds--actionable-notification__close-button', ours: '[role="alertdialog"] [data-testid="notification-close"], [role="alert"] [data-testid="notification-close"], [role="status"] [data-testid="notification-close"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height'] })
  })
});
