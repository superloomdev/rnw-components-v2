// Info: ModalHeader member. The dialog's eyebrow label (gated by
// `anatomy.dialog_label`), its heading and the close button whose seat
// exists only where `anatomy.dialog_close` says `shown`. The heading's end
// gutter is `control.dialog_text_gutter_ratio` of the header width minus
// the close seat, computed by the parent and passed in. Label and heading
// ids name the dialog through `aria-labelledby`. It must be composed
// inside ComposedModal.

import SPEC from './spec.modal-header.js';


/********************************************************************
ModalHeader factory.

@param {Object} ctx - Component context

@return {Function} - The ModalHeader component
*********************************************************************/
export default function ModalHeader (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;


  /********************************************************************
  ModalHeader component.

  @param {Object} props - See `api.modal-header.js`

  @return {Object} - React element
  *********************************************************************/
  function ModalHeaderComponent (props) {

    // Init the metrics and the anatomy reads
    const headingLineHeight = (ctx.token('type.dialog_heading') || {}).lineHeight || 0;
    const metrics = {
      closeIconSize: ctx.metric('ModalHeader', 'closeIconSize'),
      closeSize: ctx.metric('ModalHeader', 'closeSize'),
      headerGap: ctx.metric('ModalHeader', 'headerGap'),
      headerSpace: ctx.metric('ModalHeader', 'headerSpace'),
      paddingInline: ctx.metric('ModalHeader', 'paddingInline'),
      paddingTop: ctx.metric('ModalHeader', 'paddingTop')
    };
    const labelShown = ctx.enum('anatomy.dialog_label') === 'shown';
    const closeShown = ctx.enum('anatomy.dialog_close') === 'shown';
    const gutter = Utils.isNumber(props.textGutter) && props.textGutter > 0 ? props.textGutter : undefined;

    // Render the header block and, where shown, the close seat
    return React.createElement(React.Fragment, null,
      React.createElement(View, {
        style: {
          // Upstream's heading overlays the content region's top padding:
          // pull the body up under it by the heading's line height
          marginBottom: metrics.headerSpace - headingLineHeight,
          paddingEnd: closeShown ? metrics.closeSize : metrics.paddingInline,
          paddingStart: metrics.paddingInline,
          paddingTop: metrics.paddingTop
        }
      },
      Utils.isString(props.label) ? React.createElement(Text, {
        nativeID: props.labelId,
        style: [ctx.typeStyle('label01'), { color: ctx.color('text_secondary'), display: labelShown ? undefined : 'none', marginBottom: metrics.headerGap }]
      }, props.label) : null,
      React.createElement(Text, {
        nativeID: props.headingId,
        style: [ctx.typeStyle('dialog_heading'), { color: ctx.color('dialog_heading'), paddingEnd: gutter }]
      }, props.title)),
      React.createElement(View, {
        style: {
          display: closeShown ? 'flex' : 'none',
          end: 0,
          position: 'absolute',
          top: 0
        }
      },
      React.createElement(ctx.Registry.IconButton, {
        buttonRef: props.closeRef,
        icon: 'close',
        iconSize: metrics.closeIconSize,
        kind: 'ghost',
        label: Utils.isString(props.iconDescription) ? props.iconDescription : 'Close',
        onPress: typeof props.buttonOnClick === 'function' ? props.buttonOnClick : undefined
      })));

  }

  ModalHeaderComponent.displayName = 'ModalHeader';

  return ModalHeaderComponent;

}

ModalHeader.spec = SPEC;
