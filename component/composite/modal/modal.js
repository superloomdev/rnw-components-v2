// Info: Modal composite. A `role="dialog"` container assembled from the
// ModalHeader, ModalBody and ModalFooter members over a `dialog_scrim`
// layer - the same members `ComposedModal` renders, so the anchor's
// element tree is unchanged. Escape and focus trap come from the
// focus-trap behavior; outside press closes unless
// `preventCloseOnClickOutside`. Where the cells give no width bounds the
// width is the size's `control.dialog_width_ratio*` of the layer space it
// covers (the host's when hosted, else the viewport) - the ratio rule
// replaces the reference's breakpoint tiers (D23/D24: the form variants
// carry the compact values); where the cells give bounds, the dialog
// sizes to its content inside them.

import SPEC from './spec.js';


/********************************************************************
Modal factory.

@param {Object} ctx - Component context

@return {Function} - The Modal component
*********************************************************************/
export default function Modal (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, View } = ctx.ReactNative;
  const { useA11yId, useFocusTrap, useLayerSpace, useOverlay, useViewportLayer } = ctx.behaviors;


  /********************************************************************
  Modal component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function ModalComponent (props) {

    // Init the metrics, the anatomy reads and the a11y ids
    const open = props.open === true;
    const metrics = {
      borderWidth: ctx.metric('Modal', 'borderWidth'),
      level: ctx.metric('Modal', 'level'),
      maxWidth: ctx.metric('Modal', 'maxWidth'),
      minHeight: ctx.metric('Modal', 'minHeight'),
      minWidth: ctx.metric('Modal', 'minWidth'),
      paddingInline: ctx.metric('Modal', 'paddingInline'),
      radius: ctx.metric('Modal', 'radius'),
      stacking: ctx.metric('Modal', 'stacking')
    };
    const headingId = useA11yId('modal-heading');
    const bodyId = useA11yId('modal-body');
    const fadeId = useA11yId('modal-fade');

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

    // The width: the size's ratio of the layer space where the cells give
    // no bounds, else content-sized inside the bounds
    const bounded = metrics.minWidth > 0 || metrics.maxWidth > 0;
    const size = Utils.inArray(['xs', 'sm', 'md', 'lg'], props.size) ? props.size : 'md';
    const suffix = size === 'md' ? '' : '_' + size;
    const space = useLayerSpace();
    const widthRatio = ctx.token('control.dialog_width_ratio' + suffix);
    const heightRatio = ctx.token('control.dialog_height_ratio' + suffix);
    const dialogWidth = bounded ? undefined : (Utils.isNumber(space.width) && space.width > 0 ? space.width * widthRatio : undefined);
    const dialogHeight = bounded ? undefined : (Utils.isNumber(space.height) && space.height > 0 ? space.height * heightRatio : undefined);
    const passive = props.passive === true;
    const actions = !passive && Utils.isArray(props.actions) ? props.actions : [];

    // The prose gutter: `control.dialog_text_gutter_ratio` of the
    // container width minus the close seat; none under `xs`/`sm`
    const gutterRatio = ctx.token('control.dialog_text_gutter_ratio');
    const guttered = size === 'md' || size === 'lg';
    const textGutter = {
      body: guttered && Utils.isNumber(dialogWidth) ? gutterRatio * dialogWidth - ctx.token('spacing.spacing_07') : undefined,
      header: guttered && Utils.isNumber(dialogWidth) ? gutterRatio * dialogWidth - ctx.token('control.icon_button_size') : undefined
    };

    // Render the container through the members
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
        borderTopWidth: metrics.borderWidth,
        borderTopColor: ctx.color('dialog_border'),
        margin: bounded || widthRatio < 1 ? metrics.paddingInline : 0,
        maxHeight: bounded ? undefined : dialogHeight,
        maxWidth: bounded ? metrics.maxWidth : undefined,
        minHeight: metrics.minHeight > 0 ? metrics.minHeight : undefined,
        minWidth: bounded ? metrics.minWidth : undefined,
        outlineStyle: 'none',
        position: 'relative',
        width: bounded ? undefined : dialogWidth
      }, metrics.level]
    },
    React.createElement(ctx.Registry.ModalHeader, {
      buttonOnClick: requestClose,
      headingId: headingId,
      iconDescription: props.closeLabel,
      label: props.label,
      textGutter: textGutter.header,
      title: props.title
    }),
    React.createElement(ctx.Registry.ModalBody, {
      bodyId: bodyId,
      fadeId: fadeId,
      textGutter: textGutter.body
    }, props.children),
    passive || Utils.isEmptyArray(actions) ? null : React.createElement(ctx.Registry.ModalFooter, {
      actions: actions,
      onRequestClose: requestClose
    }));

    // The scrim layer covers the space it lives in and centers the
    // container in it
    const layerStyle = useViewportLayer();
    const scrim = React.createElement(Pressable, {
      testID: 'modal-scrim',
      onPress: function (event) {
        if (event.target === event.currentTarget && props.preventCloseOnClickOutside !== true) {
          trap.onOutsidePress();
        }
      },
      style: [layerStyle, {
        alignItems: 'center',
        backgroundColor: ctx.color('dialog_scrim'),
        justifyContent: !bounded && widthRatio === 1 ? 'flex-start' : 'center',
        zIndex: metrics.stacking
      }]
    }, container);

    // The layer renders through an overlay host where one is mounted
    const overlay = useOverlay({
      isOpen: open,
      name: 'Modal',
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
