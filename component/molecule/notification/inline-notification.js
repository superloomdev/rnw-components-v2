// Info: InlineNotification molecule. A `status` band in the flow of the
// page: the marker, the kind's status glyph, the title and subtitle text
// block, and the close button at the row's end - all through the shared
// notification parts at the inline cells (`control.notification_inline_width`,
// `control.notification_min_height`, `control.notification_marker_width`,
// the details and text insets). `lowContrast` draws the kind fill and the
// 1 px kind outline on the top, end and bottom with primary text. The
// close calls `onCloseButtonClick` then `onClose`, a `false` return
// vetoes, and a closed notification unmounts.

import SPEC from './spec.inline-notification.js';
import createNotificationParts from './notification-parts.js';


/********************************************************************
InlineNotification factory.

@param {Object} ctx - Component context

@return {Function} - The InlineNotification component
*********************************************************************/
export default function InlineNotification (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const parts = createNotificationParts(ctx);


  /********************************************************************
  InlineNotification component.

  @param {Object} props - See `api.inline-notification.js`

  @return {Object} - React element
  *********************************************************************/
  function InlineNotificationComponent (props) {

    // Init the kind, the open state and the metrics
    const kind = Utils.inArray(['info', 'success', 'warning', 'error', 'info-square', 'warning-alt'], props.kind) ? props.kind : 'info';
    const closed = React.useState(false);
    const lowContrast = props.lowContrast === true;
    const owner = 'InlineNotification';

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

    if (closed[0]) {
      return null;
    }

    // Render the band: details (icon + text), the close in flow at the end
    const role = Utils.inArray(['status', 'alert', 'log'], props.role) ? props.role : 'status';
    return parts.frame({ kind: kind, lowContrast: lowContrast, owner: owner, role: role, testID: props.testID, fluid: true, width: ctx.metric(owner, 'width') }, [
      parts.details({ kind: kind, lowContrast: lowContrast, owner: owner }, [
        parts.icon({ kind: kind, lowContrast: lowContrast, owner: owner }),
        parts.textBlock({ owner: owner }, [
          parts.text({ lowContrast: lowContrast, owner: owner, subtitle: props.subtitle, title: props.title })
        ])
      ]),
      props.hideCloseButton === true ? null : parts.close({ label: props.closeLabel, lowContrast: lowContrast, onPress: requestClose, owner: owner })
    ]);

  }

  InlineNotificationComponent.displayName = 'InlineNotification';

  return InlineNotificationComponent;

}

InlineNotification.spec = SPEC;
