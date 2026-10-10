// Info: Modal composite. A `role="dialog"` container on a `dialog_scrim`
// layer: header (an eyebrow label gated by `anatomy.dialog_label` and a
// heading), body, an actions row, and a close button whose seat exists only
// where `anatomy.dialog_close` says `shown`. `anatomy.dialog_actions` picks
// the row: `stretched` fills the
// actions height edge to edge with equal buttons, `trailing` rows them
// right with the gap and padding cells. Escape and focus trap come from
// the focus-trap behavior; outside press closes unless
// `preventCloseOnClickOutside`. Where the cells give no width bounds the
// width is the size's percentage of the viewport (the reference's own
// rule); where they do, the dialog sizes to its content inside them.

import SPEC from './spec.js';


// The width steps: the reference's per-size percentages of the viewport at
// its 66rem media tier, the tier a 1280px viewport is in
const WIDTHS = Object.freeze({ xs: 32, sm: 42, md: 60, lg: 84 });


/********************************************************************
Modal factory.

@param {Object} ctx - Component context

@return {Function} - The Modal component
*********************************************************************/
export default function Modal (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useA11yId, useFocusTrap, useOverlay, useViewportSize } = ctx.behaviors;


  /********************************************************************
  Modal component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function ModalComponent (props) {

    // Init the metrics, the anatomy reads and the a11y ids
    const open = props.open === true;
    const metrics = {
      actionsGap: ctx.metric('Modal', 'actionsGap'),
      actionsHeight: ctx.metric('Modal', 'actionsHeight'),
      actionsPadding: ctx.metric('Modal', 'actionsPadding'),
      actionsTopSpace: ctx.metric('Modal', 'actionsTopSpace'),
      bodyPaddingBottom: ctx.metric('Modal', 'bodyPaddingBottom'),
      bodyPaddingTop: ctx.metric('Modal', 'bodyPaddingTop'),
      borderWidth: ctx.metric('Modal', 'borderWidth'),
      closeIconSize: ctx.metric('Modal', 'closeIconSize'),
      closeSize: ctx.metric('Modal', 'closeSize'),
      headerGap: ctx.metric('Modal', 'headerGap'),
      headerPaddingTop: ctx.metric('Modal', 'headerPaddingTop'),
      headerSpace: ctx.metric('Modal', 'headerSpace'),
      maxWidth: ctx.metric('Modal', 'maxWidth'),
      minHeight: ctx.metric('Modal', 'minHeight'),
      minWidth: ctx.metric('Modal', 'minWidth'),
      paddingInline: ctx.metric('Modal', 'paddingInline'),
      radius: ctx.metric('Modal', 'radius')
    };
    const stretched = ctx.enum('anatomy.dialog_actions') === 'stretched';
    const closeShown = ctx.enum('anatomy.dialog_close') === 'shown';
    const labelShown = ctx.enum('anatomy.dialog_label') === 'shown';
    const headingId = useA11yId('modal-heading');
    const bodyId = useA11yId('modal-body');

    // The close button asks for a close
    const requestClose = function () {
      if (typeof props.onClose === 'function') {
        props.onClose();
      }
    };

    // Escape, the tab wrap and the focus memory live in the trap behavior
    const trap = useFocusTrap({
      isOpen: open,
      onClose: requestClose
    });

    // The width: the size's percentage where the cells give no bounds,
    // else content-sized inside the bounds
    const bounded = metrics.minWidth > 0 || metrics.maxWidth > 0;
    const size = Utils.inArray(['xs', 'sm', 'md', 'lg'], props.size) ? props.size : 'md';
    const actions = Utils.isArray(props.actions) && props.passive !== true ? props.actions : [];

    // The body's bottom padding falls to the header gap where a trailing
    // row follows it (the second reference's layout)
    const bodyPaddingBottom = !Utils.isEmptyArray(actions) && !stretched ? metrics.headerGap : metrics.bodyPaddingBottom;

    // Render the container: header, body, close seat and the actions row
    const container = React.createElement(View, {
      ref: trap.containerRef,
      'aria-describedby': props.alert === true ? bodyId : undefined,
      'aria-label': Utils.isString(props.accessibilityLabel) ? props.accessibilityLabel : undefined,
      'aria-labelledby': Utils.isString(props.accessibilityLabel) ? undefined : headingId,
      'aria-modal': true,
      focusable: true,
      role: props.alert === true ? 'alertdialog' : 'dialog',
      tabIndex: -1,
      testID: props.testID,
      style: [{
        backgroundColor: ctx.color('dialog_container'),
        borderColor: ctx.color('dialog_border'),
        borderRadius: metrics.radius,
        borderWidth: metrics.borderWidth,
        margin: metrics.paddingInline,
        maxWidth: bounded ? metrics.maxWidth : undefined,
        minHeight: metrics.minHeight > 0 ? metrics.minHeight : undefined,
        minWidth: bounded ? metrics.minWidth : undefined,
        outlineStyle: 'none',
        position: 'relative',
        width: bounded ? undefined : WIDTHS[size] + '%'
      }, ctx.metric('Modal', 'level')]
    },
    React.createElement(View, {
      style: {
        marginBottom: metrics.headerSpace,
        paddingEnd: closeShown ? metrics.closeSize : metrics.paddingInline,
        paddingStart: metrics.paddingInline,
        paddingTop: metrics.headerPaddingTop
      }
    },
    Utils.isString(props.label) ? React.createElement(Text, {
      style: [ctx.typeStyle('label01'), { color: ctx.color('text_secondary'), display: labelShown ? undefined : 'none', marginBottom: metrics.headerGap }]
    }, props.label) : null,
    React.createElement(Text, {
      nativeID: headingId,
      style: [ctx.typeStyle('dialog_heading'), { color: ctx.color('dialog_heading') }]
    }, props.title)),
    React.createElement(View, {
      nativeID: bodyId,
      style: {
        flexGrow: 1,
        paddingBottom: bodyPaddingBottom,
        paddingInline: metrics.paddingInline,
        paddingTop: metrics.bodyPaddingTop
      }
    },
    Utils.isString(props.children) ? React.createElement(Text, {
      style: [ctx.typeStyle('dialog_body'), { color: ctx.color('dialog_body') }]
    }, props.children) : props.children),
    React.createElement(View, {
      style: {
        display: closeShown ? 'flex' : 'none',
        end: 0,
        position: 'absolute',
        top: 0
      }
    },
    React.createElement(ctx.Registry.IconButton, {
      icon: 'close',
      iconSize: metrics.closeIconSize,
      kind: 'ghost',
      label: Utils.isString(props.closeLabel) ? props.closeLabel : 'Close',
      onPress: requestClose
    })),
    Utils.isEmptyArray(actions) ? null : React.createElement(View, {
      testID: 'modal-actions',
      style: {
        alignItems: stretched ? 'stretch' : 'center',
        flexDirection: 'row',
        gap: metrics.actionsGap,
        height: metrics.actionsHeight > 0 ? metrics.actionsHeight : undefined,
        justifyContent: stretched ? 'flex-start' : 'flex-end',
        paddingBottom: metrics.actionsPadding,
        paddingInline: metrics.actionsPadding,
        paddingTop: stretched ? 0 : metrics.actionsTopSpace
      }
    }, actions.map(function (action, index) {
      const last = index === actions.length - 1;
      return React.createElement(ctx.Registry.Button, {
        disabled: action.disabled === true,
        fill: stretched,
        key: index,
        kind: Utils.isString(action.kind) ? action.kind : last ? (stretched ? 'primary' : 'ghost') : (stretched ? 'secondary' : 'ghost'),
        onPress: typeof action.onPress === 'function' ? action.onPress : undefined
      }, action.label);
    })));

    // The scrim layer covers the viewport and centers the container in it:
    // on web the reference anchors the layer at its containing block's
    // origin but sizes it to the viewport itself, so the layer covers the
    // screen even inside a transformed cell
    const windowSize = useViewportSize();
    const scrim = React.createElement(Pressable, {
      testID: 'modal-scrim',
      onPress: function (event) {
        if (event.target === event.currentTarget && props.preventCloseOnClickOutside !== true) {
          trap.onOutsidePress();
        }
      },
      style: ctx.platform.split({
        native: {
          alignItems: 'center',
          backgroundColor: ctx.color('dialog_scrim'),
          bottom: 0,
          justifyContent: 'center',
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: ctx.metric('Modal', 'stacking')
        },
        web: {
          alignItems: 'center',
          backgroundColor: ctx.color('dialog_scrim'),
          height: windowSize.height,
          justifyContent: 'center',
          left: 0,
          position: 'fixed',
          top: 0,
          width: windowSize.width,
          zIndex: ctx.metric('Modal', 'stacking')
        }
      })
    }, container);

    // The layer renders through an overlay host where one is mounted
    const overlay = useOverlay({
      isOpen: open,
      onClose: requestClose,
      render: function () {
        return scrim;
      },
      trap: true
    });

    if (!open) {
      return null;
    }

    return overlay.hosted ? null : scrim;

  }

  ModalComponent.displayName = 'Modal';

  return ModalComponent;

}

Modal.spec = SPEC;
