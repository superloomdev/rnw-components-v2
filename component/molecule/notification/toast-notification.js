// Info: ToastNotification molecule. A `status` (or `alert`) band on the
// toast cells: the marker and the status icon where `anatomy.status_marker`
// says `bar_icon` (the seat is `display: none` under `plain`, so the tree
// never depends on the theme), the details (title, subtitle, optional
// caption and link-styled action), and the close `IconButton` - all
// through the shared notification parts at the toast insets
// (`control.notification_toast_icon_top`, `_icon_gap`,
// `_text_padding_block`, `_toast_text_padding_bottom`, `_title_gap`,
// `_details_inset`, `_details_inset_end`). `lowContrast` draws the kind
// fill, the kind outline and primary text instead of the inverse
// container. The width is `control.notification_width` capped by the
// host, under `shadow.notification`.

import SPEC from './spec.toast-notification.js';
import createNotificationParts from './notification-parts.js';


/********************************************************************
ToastNotification factory.

@param {Object} ctx - Component context

@return {Function} - The ToastNotification component
*********************************************************************/
export default function ToastNotification (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const parts = createNotificationParts(ctx);


  /********************************************************************
  ToastNotification component.

  @param {Object} props - See `api.toast-notification.js`

  @return {Object} - React element
  *********************************************************************/
  function ToastNotificationComponent (props) {

    // Init the kind, the open state and the anatomy read
    const kind = Utils.inArray(['info', 'success', 'warning', 'error'], props.kind) ? props.kind : 'info';
    const lowContrast = props.lowContrast === true;
    const barIcon = ctx.enum('anatomy.status_marker') === 'bar_icon';
    const owner = 'ToastNotification';
    const [actionHover, setActionHover] = React.useState(false);

    // The close button asks for a close
    const requestClose = function () {
      if (typeof props.onCloseButtonClick === 'function') {
        props.onCloseButtonClick();
      }
      if (typeof props.onClose === 'function') {
        props.onClose();
      }
    };

    // Render the band: details (icon seat + text block with the link
    // action and the caption), the close in flow at the end
    const textLeaf = lowContrast ? 'text_primary' : 'notification_text';
    const iconSeat = React.createElement(View, {
      key: 'iconSeat',
      style: { display: barIcon ? 'flex' : 'none' }
    },
    parts.icon({ kind: kind, lowContrast: lowContrast, owner: owner }));
    const rows = [
      parts.text({ lowContrast: lowContrast, owner: owner, subtitle: props.subtitle, title: props.title }),
      Utils.isObject(props.action) ? React.createElement(Pressable, {
        key: 'action',
        onPress: typeof props.action.onPress === 'function' ? props.action.onPress : undefined,
        onPointerEnter: function () {
          setActionHover(true);
        },
        onPointerLeave: function () {
          setActionHover(false);
        },
        style: { alignSelf: 'flex-start', marginTop: ctx.metric(owner, 'textPaddingBlock') }
      },
      React.createElement(Text, {
        style: [ctx.typeStyle('notification_body'), { color: ctx.color(actionHover ? 'notification_action_hover' : 'notification_action') }]
      }, props.action.label)) : null,
      Utils.isString(props.caption) ? React.createElement(Text, {
        key: 'caption',
        style: [ctx.typeStyle('notification_body'), { color: ctx.color(textLeaf), paddingTop: ctx.metric(owner, 'captionSpace') }]
      }, props.caption) : null
    ];
    return parts.frame({
      kind: kind,
      level: ctx.metric(owner, 'level'),
      marker: barIcon,
      lowContrast: lowContrast,
      owner: owner,
      role: props.role === 'alert' ? 'alert' : 'status',
      testID: props.testID,
      width: ctx.metric(owner, 'width')
    }, [
      parts.details({ kind: kind, lowContrast: lowContrast, owner: owner }, [
        iconSeat,
        parts.textBlock({ owner: owner, paddingBottom: ctx.metric(owner, 'textPaddingBottom') }, rows)
      ]),
      parts.close({ label: props.closeLabel, lowContrast: lowContrast, onPress: requestClose })
    ]);

  }

  ToastNotificationComponent.displayName = 'ToastNotification';

  return ToastNotificationComponent;

}

ToastNotification.spec = SPEC;
