// Info: ModalBody member. The dialog's content: `type.dialog_body` prose
// (or the caller's node) inside the body's padding, an end gutter of
// `control.dialog_text_gutter_ratio` of the body width minus `spacing_07`
// unless `hasForm` or the parent says no gutter. `hasScrollingContent` -
// or a measured overflow - turns the body into a focusable `role="region"`
// ScrollView named by the heading, its last child
// `control.dialog_scroll_end_space` below; where
// `anatomy.dialog_scroll_fade` says `shown` and the measured body is
// taller than `control.dialog_scroll_fade_min_height`, a bottom fade of
// `control.dialog_scroll_fade_height` from transparent to
// `color.dialog_container` starting at `control.dialog_scroll_fade_start`.
// It must be composed inside ComposedModal.

import SPEC from './spec.modal-body.js';


/********************************************************************
ModalBody factory.

@param {Object} ctx - Component context

@return {Function} - The ModalBody component
*********************************************************************/
export default function ModalBody (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { ScrollView, Text, View } = ctx.ReactNative;
  const Svg = ctx.Svg;


  /********************************************************************
  ModalBody component.

  @param {Object} props - See `api.modal-body.js`

  @return {Object} - React element
  *********************************************************************/
  function ModalBodyComponent (props) {

    // Init the metrics, the fade anatomy and the measured layout
    const metrics = {
      fadeHeight: ctx.metric('ModalBody', 'fadeHeight'),
      fadeMinHeight: ctx.metric('ModalBody', 'fadeMinHeight'),
      fadeStart: ctx.metric('ModalBody', 'fadeStart'),
      paddingBottom: ctx.metric('ModalBody', 'paddingBottom'),
      paddingInline: ctx.metric('ModalBody', 'paddingInline'),
      paddingTop: ctx.metric('ModalBody', 'paddingTop'),
      scrollEndSpace: ctx.metric('ModalBody', 'scrollEndSpace')
    };
    const fadeShown = ctx.enum('anatomy.dialog_scroll_fade') === 'shown';
    const layout = React.useState({ height: 0, content: 0 });
    const size = layout[0];
    const setLayout = layout[1];
    const scrolling = props.hasScrollingContent === true || (size.height > 0 && size.content > size.height);
    // The no-fade rule applies once the body is measured; an unmeasured
    // (zero-height) body is allowed it
    const fade = scrolling && fadeShown && (size.height === 0 || size.height > metrics.fadeMinHeight);
    const gutter = props.hasForm === true || !Utils.isNumber(props.textGutter) || props.textGutter <= 0 ? undefined : props.textGutter;

    // The body's content: prose children get the dialog body type and the
    // end gutter; anything else renders as given
    const content = React.createElement(View, {
      onLayout: function (event) {
        const height = event.nativeEvent && event.nativeEvent.layout ? event.nativeEvent.layout.height : 0;
        if (height !== size.content) {
          setLayout({ height: size.height, content: height });
        }
      },
      style: { flexGrow: 1 }
    },
    Utils.isString(props.children) ? React.createElement(Text, {
      style: [ctx.typeStyle('dialog_body'), { color: ctx.color('dialog_body'), paddingEnd: gutter }]
    }, props.children) : props.children,
    scrolling ? React.createElement(View, { style: { height: metrics.scrollEndSpace } }) : null);

    // Render the body: a plain box, or the scrolling region with its fade
    // `minHeight: 0` lets the body shrink inside the `maxHeight`-clipped
    // container so the footer stays in the painted box, as upstream's
    // `overflow-y` region does; scrolling bodies scroll, others clip
    const bodyStyle = {
      backgroundColor: ctx.color('dialog_container'),
      flexGrow: 1,
      flexShrink: 1,
      minHeight: 0,
      overflow: scrolling ? 'auto' : 'hidden',
      paddingBottom: metrics.paddingBottom,
      paddingInline: metrics.paddingInline,
      paddingTop: metrics.paddingTop
    };
    const named = { 'aria-label': Utils.isString(props.accessibilityLabel) ? props.accessibilityLabel : undefined, 'aria-labelledby': Utils.isString(props.accessibilityLabel) ? undefined : props.headingId, role: 'region', tabIndex: 0 };

    if (scrolling) {
      return React.createElement(View, {
        dataSet: { part: 'modalBody' },
        nativeID: props.bodyId,
        onLayout: function (event) {
          const height = event.nativeEvent && event.nativeEvent.layout ? event.nativeEvent.layout.height : 0;
          if (height !== size.height) {
            setLayout({ height: height, content: size.content });
          }
        },
        style: bodyStyle
      },
      React.createElement(ScrollView, Object.assign({}, named, {
        style: { flexGrow: 1 }
      }), content),
      fade ? React.createElement(View, {
        pointerEvents: 'none',
        style: { bottom: 0, end: 0, height: metrics.fadeHeight, position: 'absolute', start: 0 }
      },
      React.createElement(Svg.Svg, { height: metrics.fadeHeight, preserveAspectRatio: 'none', style: { alignSelf: 'stretch', flex: 1 }, viewBox: '0 0 1 1', width: metrics.fadeHeight },
        React.createElement(Svg.Defs, null,
          React.createElement(Svg.LinearGradient, { id: props.fadeId, x1: 0, x2: 0, y1: (metrics.fadeHeight - metrics.fadeStart) / metrics.fadeHeight, y2: 1 },
            React.createElement(Svg.Stop, { offset: 0, stopColor: ctx.color('dialog_container'), stopOpacity: 0 }),
            React.createElement(Svg.Stop, { offset: 1, stopColor: ctx.color('dialog_container'), stopOpacity: 1 }))),
        React.createElement(Svg.Rect, { fill: 'url(#' + props.fadeId + ')', height: 1, width: 1, x: 0, y: 0 }))) : null);
    }

    return React.createElement(View, {
      dataSet: { part: 'modalBody' },
      nativeID: props.bodyId,
      onLayout: function (event) {
        const height = event.nativeEvent && event.nativeEvent.layout ? event.nativeEvent.layout.height : 0;
        if (height !== size.height) {
          setLayout({ height: height, content: size.content });
        }
      },
      style: bodyStyle
    }, content);

  }

  ModalBodyComponent.displayName = 'ModalBody';

  return ModalBodyComponent;

}

ModalBody.spec = SPEC;
