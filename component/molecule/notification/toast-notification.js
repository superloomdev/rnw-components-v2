// Info: ToastNotification molecule. A `status` (or `alert`) band: the
// status marker and the status icon where `anatomy.status_marker` says
// `bar_icon` (the seat is `display: none` under `plain`, so the tree never
// depends on the theme), the details (title, subtitle, optional caption
// and link-styled action), and a close `IconButton` whose glyph reads
// `notification_close_icon`. `lowContrast` swaps the inverse container for
// the status fill, the marker for the plain support color, and the text
// for `text_primary`. The width is the member cell capped by the host.

import SPEC from './spec.toast-notification.js';


// The status glyph each kind draws
const GLYPHS = Object.freeze({
  error: 'error_filled',
  info: 'information_filled',
  success: 'checkmark_filled',
  warning: 'warning_filled'
});


/********************************************************************
ToastNotification factory.

@param {Object} ctx - Component context

@return {Function} - The ToastNotification component
*********************************************************************/
export default function ToastNotification (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;


  /********************************************************************
  ToastNotification component.

  @param {Object} props - See `api.toast-notification.js`

  @return {Object} - React element
  *********************************************************************/
  function ToastNotificationComponent (props) {

    // Init the kind, the metrics, the anatomy and the state leaves
    const kind = Utils.inArray(['info', 'success', 'warning', 'error'], props.kind) ? props.kind : 'info';
    const lowContrast = props.lowContrast === true;
    const metrics = {
      captionSpace: ctx.metric('ToastNotification', 'captionSpace'),
      iconSize: ctx.metric('ToastNotification', 'iconSize'),
      markerWidth: ctx.metric('ToastNotification', 'markerWidth'),
      radius: ctx.metric('ToastNotification', 'radius'),
      space: ctx.metric('ToastNotification', 'space'),
      width: ctx.metric('ToastNotification', 'width')
    };
    const barIcon = ctx.enum('anatomy.status_marker') === 'bar_icon';
    const markerLeaf = lowContrast ? 'support_' + kind : 'notification_marker_' + kind;
    const textLeaf = lowContrast ? 'text_primary' : 'notification_text';
    const containerLeaf = lowContrast ? 'notification_background_' + kind : 'notification_container';
    const [actionHover, setActionHover] = React.useState(false);

    // The close button asks for a close
    const requestClose = function () {
      if (typeof props.onClose === 'function') {
        props.onClose();
      }
    };

    // Render the band: icon seat, details, close seat
    return React.createElement(View, {
      role: props.role === 'alert' ? 'alert' : 'status',
      testID: props.testID,
      style: [{
        backgroundColor: ctx.color(containerLeaf),
        borderRadius: metrics.radius,
        borderStartColor: ctx.color(markerLeaf),
        borderStartWidth: barIcon ? metrics.markerWidth : 0,
        flexDirection: 'row',
        maxWidth: 100 + '%',
        // The pad plus the marker's border gives the icon its offset
        paddingStart: barIcon ? metrics.space - metrics.markerWidth : metrics.space,
        width: metrics.width
      }, ctx.metric('ToastNotification', 'level')]
    },
    React.createElement(View, {
      style: {
        display: barIcon ? 'flex' : 'none',
        marginEnd: metrics.space,
        marginTop: metrics.space
      }
    },
    React.createElement(ctx.Registry.Icon, {
      color: markerLeaf,
      name: GLYPHS[kind],
      size: metrics.iconSize
    })),
    React.createElement(View, {
      style: { flex: 1, marginBottom: metrics.space, marginEnd: metrics.space }
    },
    React.createElement(Text, {
      style: [ctx.typeStyle('notification_title'), { color: ctx.color(textLeaf), marginTop: metrics.space }]
    }, props.title),
    Utils.isString(props.subtitle) ? React.createElement(Text, {
      // Upstream's subtitle margin-bottom always stands: inside the flex
      // details it cannot collapse
      style: [ctx.typeStyle('notification_body'), { color: ctx.color(textLeaf), marginBottom: metrics.space }]
    }, props.subtitle) : null,
    Utils.isObject(props.action) ? React.createElement(Pressable, {
      onPress: typeof props.action.onPress === 'function' ? props.action.onPress : undefined,
      onPointerEnter: function () {
        setActionHover(true);
      },
      onPointerLeave: function () {
        setActionHover(false);
      },
      style: { alignSelf: 'flex-start', marginTop: metrics.space }
    },
    React.createElement(Text, {
      style: [ctx.typeStyle('notification_body'), { color: ctx.color(actionHover ? 'notification_action_hover' : 'notification_action') }]
    }, props.action.label)) : null,
    Utils.isString(props.caption) ? React.createElement(Text, {
      style: [ctx.typeStyle('notification_body'), { color: ctx.color(textLeaf), paddingTop: metrics.captionSpace }]
    }, props.caption) : null),
    React.createElement(ctx.Registry.IconButton, {
      icon: 'close',
      iconColor: lowContrast ? 'icon_primary' : 'notification_close_icon',
      kind: 'ghost',
      label: Utils.isString(props.closeLabel) ? props.closeLabel : 'Close',
      onPress: requestClose
    }));

  }

  ToastNotificationComponent.displayName = 'ToastNotification';

  return ToastNotificationComponent;

}

ToastNotification.spec = SPEC;
