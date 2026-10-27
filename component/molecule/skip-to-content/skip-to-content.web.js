// Info: SkipToContent web half. The link and its two drawings; the
// dispatcher (`skip-to-content.js`) picks this half for web only.

import SPEC from './spec.js';


/********************************************************************
SkipToContent web factory.

@param {Object} ctx - Component context

@return {Function} - The SkipToContent web component
*********************************************************************/
export default function SkipToContentWeb (ctx) {

  const React = ctx.React;
  const { Pressable, Text } = ctx.ReactNative;


  /********************************************************************
  SkipToContent web component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function SkipToContentComponent (props) {

    const [focused, setFocused] = React.useState(false);
    const offset = ctx.metric('SkipToContent', 'offset');

    return React.createElement(Pressable, {
      accessibilityRole: 'link',
      href: props.href === undefined ? '#main-content' : props.href,
      onFocus: function () {
        setFocused(true);
      },
      onBlur: function () {
        setFocused(false);
      },
      testID: props.testID,
      style: focused === true ? {
        backgroundColor: ctx.color('skip_link_container'),
        borderColor: ctx.color('skip_link_border'),
        borderWidth: ctx.metric('SkipToContent', 'borderWidth'),
        outlineStyle: 'none',
        height: ctx.metric('SkipToContent', 'height'),
        justifyContent: 'center',
        left: offset,
        paddingHorizontal: ctx.metric('SkipToContent', 'paddingInline'),
        position: 'absolute',
        top: offset,
        zIndex: ctx.metric('SkipToContent', 'level')
      } : {
        height: 1,
        left: 0,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        width: 1
      }
    },
    React.createElement(Text, {
      style: [ctx.typeStyle('skip_link'), { color: ctx.color('skip_link_label'), textDecorationLine: 'underline' }]
    }, props.children === undefined ? 'Skip to main content' : props.children));

  }

  SkipToContentComponent.displayName = 'SkipToContent';

  return SkipToContentComponent;

}

SkipToContentWeb.spec = SPEC;
