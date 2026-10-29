// Info: ActionableNotification molecule. A status band with one action,
// drawn inline (the ghost action) or as a toast (the tertiary-inverse
// action, `shadow.notification`, `control.notification_width`, the toast
// insets): the marker, the kind's status glyph, the title, subtitle and
// caption text block, the action and the close button at the row's end -
// all through the shared notification parts. The default role
// `alertdialog` traps focus inside (the modal trap behavior) and Escape
// asks for the close while `closeOnEscape` (default). The close calls
// `onCloseButtonClick` then `onClose`, a `false` return vetoes, and a
// closed notification unmounts.

import SPEC from './spec.actionable-notification.js';
import createNotificationParts from './notification-parts.js';


/********************************************************************
ActionableNotification factory.

@param {Object} ctx - Component context

@return {Function} - The ActionableNotification component
*********************************************************************/
export default function ActionableNotification (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const parts = createNotificationParts(ctx);
  const { useFocusTrap } = ctx.behaviors;


  /********************************************************************
  ActionableNotification component.

  @param {Object} props - See `api.actionable-notification.js`

  @return {Object} - React element
  *********************************************************************/
  function ActionableNotificationComponent (props) {

    // Init the kind, the layout, the open state and the metrics
    const kind = Utils.inArray(['info', 'success', 'warning', 'error', 'info-square', 'warning-alt'], props.kind) ? props.kind : 'info';
    const inline = props.inline === true;
    const closed = React.useState(false);
    const lowContrast = props.lowContrast === true;
    const owner = 'ActionableNotification';

    // The close button calls onCloseButtonClick then onClose; a false
    // return vetoes, else the notification unmounts
    const requestClose = function () {
      if (typeof props.onCloseButtonClick === 'function') {
        props.onCloseButtonClick();
      }
      if (typeof props.onClose === 'function' && props.onClose() === false) {
        return;
      }
      closed[1](true);
    };

    // `alertdialog` traps focus inside; Escape asks for the close while
    // `closeOnEscape` (the trap's Escape fires its onClose either way -
    // gate it at the request)
    const role = Utils.inArray(['alertdialog', 'alert', 'status'], props.role) ? props.role : 'alertdialog';
    const trap = useFocusTrap({
      isOpen: !closed[0] && role === 'alertdialog',
      onClose: function () {
        if (props.closeOnEscape !== false) {
          requestClose();
        }
      }
    });

    if (closed[0]) {
      return null;
    }

    // Render the band: details (icon + text), the action, the close in
    // flow at the end - toast gets its own width, shadow and insets
    const action = React.createElement(ctx.Registry.NotificationActionButton, {
      label: props.actionButtonLabel,
      lowContrast: lowContrast,
      marginEnd: props.hideCloseButton === true && !inline ? ctx.metric(owner, 'actionEndSpace') : undefined,
      onPress: props.onActionButtonClick,
      variant: inline ? 'inline' : 'toast'
    });
    const band = parts.frame({
      kind: kind,
      level: inline ? undefined : ctx.metric(owner, 'level'),
      lowContrast: lowContrast,
      owner: owner,
      role: role === 'status' ? 'status' : role,
      testID: props.testID,
      width: inline ? ctx.metric(owner, 'width') : ctx.metric(owner, 'toastWidth')
    }, [
      parts.details({ kind: kind, lowContrast: lowContrast, owner: owner }, [
        parts.icon({ iconTop: inline ? undefined : ctx.metric(owner, 'toastIconTop'), kind: kind, lowContrast: lowContrast, owner: owner }),
        parts.textBlock({ owner: owner, paddingBottom: inline ? undefined : ctx.metric(owner, 'toastTextPaddingBottom') }, [
          parts.text({ caption: props.caption, lowContrast: lowContrast, owner: owner, subtitle: props.subtitle, title: props.title })
        ])
      ]),
      props.hideCloseButton === true ? null : parts.close({ label: props.closeLabel, lowContrast: lowContrast, onPress: requestClose, owner: owner }),
      // The toast's action is a full-width row under the content, not a
      // third item on the first line; inline keeps it in flow
      inline ? action : React.createElement(ctx.ReactNative.View, { key: 'actionSeat', style: { alignItems: 'stretch', flexBasis: '100%' } }, action)
    ]);

    // The alertdialog trap wraps the band in its container ref
    return React.createElement(ctx.ReactNative.View, { ref: trap.containerRef, tabIndex: -1, style: { outlineStyle: 'none', alignSelf: 'flex-start' } }, band);

  }

  ActionableNotificationComponent.displayName = 'ActionableNotification';

  return ActionableNotificationComponent;

}

ActionableNotification.spec = SPEC;
