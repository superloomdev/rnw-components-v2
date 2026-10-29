// Info: ComposedModal composite. A `role="dialog"` container assembled
// from a ModalHeader, a ModalBody and a ModalFooter over a `dialog_scrim`
// layer, rendered through `ctx.Registry` so each member is a row of its
// own (the Modal anchor renders through the same members). Escape and the
// focus trap come from the focus-trap behavior; outside press closes only
// a passive dialog (no footer) unless `preventCloseOnClickOutside`;
// `onClose` returning `false` vetoes the close. The container's width is
// the size's `control.dialog_width_ratio*` of the layer space it covers
// (`isFullWidth` spans it all) and its max height the size's
// `control.dialog_height_ratio*`, the ratio rule replacing every
// breakpoint read (D23/D24: the form variants carry the compact values);
// where the cells give bounds the dialog sizes to its content inside
// them. The container enters from `control.dialog_enter_offset` above to
// rest over `motion.duration_moderate_02` (reduced motion and the
// measurement mode draw it at rest). The body enters with
// `useLayerSpace`; hosted or not the scrim covers its space, as the Modal
// anchor.

import SPEC from './spec.composed-modal.js';


/********************************************************************
ComposedModal factory.

@param {Object} ctx - Component context

@return {Function} - The ComposedModal component
*********************************************************************/
export default function ComposedModal (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, View } = ctx.ReactNative;
  const { useA11yId, useFocusTrap, useLayerSpace, useOverlay, useReducedMotion, useViewportLayer } = ctx.behaviors;


  /********************************************************************
  ComposedModal component.

  @param {Object} props - See `api.composed-modal.js`

  @return {Object} - React element
  *********************************************************************/
  function ComposedModalComponent (props) {

    // Init the metrics, the focus refs and the a11y ids
    const open = props.open === true;
    const metrics = {
      borderWidth: ctx.metric('ComposedModal', 'borderWidth'),
      enterOffset: ctx.metric('ComposedModal', 'enterOffset'),
      level: ctx.metric('ComposedModal', 'level'),
      margin: ctx.metric('ComposedModal', 'margin'),
      maxWidth: ctx.metric('ComposedModal', 'maxWidth'),
      minHeight: ctx.metric('ComposedModal', 'minHeight'),
      minWidth: ctx.metric('ComposedModal', 'minWidth'),
      paddingInline: ctx.metric('ComposedModal', 'paddingInline'),
      radius: ctx.metric('ComposedModal', 'radius'),
      stacking: ctx.metric('ComposedModal', 'stacking')
    };
    const headingId = useA11yId('modal-heading');
    const labelId = useA11yId('modal-label');
    const bodyId = useA11yId('modal-body');
    const fadeId = useA11yId('modal-fade');
    const closeRef = React.useRef(null);
    const secondaryRef = React.useRef(null);
    const header = Utils.isObject(props.header) ? props.header : {};
    const body = Utils.isObject(props.body) ? props.body : {};
    const passive = !Utils.isObject(props.footer);

    // A close request: `onClose` returning false vetoes it
    const requestClose = function () {
      if (typeof props.onClose === 'function' && props.onClose() === false) {
        return;
      }
    };

    // Escape, the tab wrap and the focus memory live in the trap
    // behavior; danger lands the initial focus on the secondary button,
    // everything else on the close button, and the close returns focus to
    // the launcher ref
    const trap = useFocusTrap({
      finalFocusRef: props.returnFocusRef,
      initialFocusRef: props.danger === true ? secondaryRef : closeRef,
      isOpen: open,
      onClose: requestClose
    });

    // The width: the size's ratio of the layer space (`isFullWidth` spans
    // it), else content-sized inside the cells' bounds
    const bounded = metrics.minWidth > 0 || metrics.maxWidth > 0;
    const size = Utils.inArray(['xs', 'sm', 'md', 'lg'], props.size) ? props.size : 'md';
    const suffix = size === 'md' ? '' : '_' + size;
    const space = useLayerSpace();
    const widthRatio = props.isFullWidth === true ? 1 : ctx.token('control.dialog_width_ratio' + suffix);
    const heightRatio = ctx.token('control.dialog_height_ratio' + suffix);
    const dialogWidth = bounded ? undefined : (Utils.isNumber(space.width) && space.width > 0 ? space.width * widthRatio : undefined);
    const dialogHeight = bounded ? undefined : (Utils.isNumber(space.height) && space.height > 0 ? space.height * heightRatio : undefined);

    // The prose gutters: `control.dialog_text_gutter_ratio` of the
    // container width minus the close seat (header) or `spacing_07`
    // (body); no gutter under `xs`/`sm` or a form body
    const gutterRatio = ctx.token('control.dialog_text_gutter_ratio');
    const guttered = size === 'md' || size === 'lg';
    const textGutter = guttered && Utils.isNumber(dialogWidth) ? {
      body: gutterRatio * dialogWidth - ctx.token('spacing.spacing_07'),
      header: gutterRatio * dialogWidth - ctx.token('control.icon_button_size')
    } : { body: undefined, header: undefined };

    // The enter motion: from `enterOffset` above to rest; reduced motion
    // draws it at rest
    const entered = React.useState(false);
    const reduced = useReducedMotion();
    React.useEffect(function () {
      if (open && !entered[0]) {
        entered[1](true);
      }
    }, [open]);
    const animated = open && metrics.enterOffset !== 0 && !reduced;

    // Render the container through the members
    const container = React.createElement(View, {
      ref: trap.containerRef,
      'aria-label': Utils.isString(props.accessibilityLabel) ? props.accessibilityLabel : undefined,
      'aria-labelledby': Utils.isString(props.accessibilityLabel) ? undefined : (Utils.isString(header.label) ? labelId + ' ' + headingId : headingId),
      'aria-modal': true,
      focusable: true,
      role: 'dialog',
      tabIndex: -1,
      testID: props.testID,
      style: [{
        backgroundColor: ctx.color('dialog_container'),
        borderColor: ctx.color('dialog_border'),
        borderRadius: metrics.radius,
        borderTopWidth: metrics.borderWidth,
        borderTopColor: ctx.color('dialog_border'),
        margin: bounded || widthRatio < 1 ? metrics.margin : 0,
        maxHeight: bounded ? undefined : dialogHeight,
        maxWidth: bounded ? metrics.maxWidth : undefined,
        minHeight: metrics.minHeight > 0 ? metrics.minHeight : undefined,
        minWidth: bounded ? metrics.minWidth : undefined,
        outlineStyle: 'none',
        position: 'relative',
        transform: animated ? [{ translateY: entered[0] ? 0 : -metrics.enterOffset }] : undefined,
        transitionDuration: String(ctx.token('motion.duration_moderate_02')) + 'ms',
        transitionProperty: 'transform',
        transitionTimingFunction: 'ease-out',
        width: bounded ? undefined : dialogWidth
      }, metrics.level]
    },
    React.createElement(ctx.Registry.ModalHeader, {
      buttonOnClick: typeof header.buttonOnClick === 'function' ? header.buttonOnClick : requestClose,
      closeRef: closeRef,
      headingId: headingId,
      iconDescription: header.iconDescription,
      label: header.label,
      labelId: labelId,
      textGutter: textGutter.header,
      title: header.title
    }),
    React.createElement(ctx.Registry.ModalBody, {
      accessibilityLabel: body.accessibilityLabel,
      bodyId: bodyId,
      fadeId: fadeId,
      hasForm: body.hasForm === true,
      hasScrollingContent: body.hasScrollingContent === true,
      headingId: headingId,
      textGutter: textGutter.body
    }, props.children),
    passive ? null : React.createElement(ctx.Registry.ModalFooter, {
      danger: props.danger === true,
      loadingDescription: props.footer.loadingDescription,
      loadingStatus: props.footer.loadingStatus,
      onRequestClose: requestClose,
      onRequestSubmit: props.footer.onRequestSubmit,
      primaryButtonDisabled: props.footer.primaryButtonDisabled === true,
      primaryButtonText: props.footer.primaryButtonText,
      secondaryButtonText: props.footer.secondaryButtonText,
      secondaryButtons: props.footer.secondaryButtons,
      secondaryRef: secondaryRef
    }));

    // The scrim covers the layer space and centers the container in it;
    // outside press closes only a passive dialog unless prevented
    const layerStyle = useViewportLayer();
    const scrim = React.createElement(Pressable, {
      testID: 'composed-modal-scrim',
      onPress: function (event) {
        if (event.target === event.currentTarget && passive && props.preventCloseOnClickOutside !== true) {
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
      name: 'ComposedModal',
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

  ComposedModalComponent.displayName = 'ComposedModal';

  return ComposedModalComponent;

}

ComposedModal.spec = SPEC;
