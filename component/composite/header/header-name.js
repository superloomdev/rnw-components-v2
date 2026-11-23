// Info: HeaderName member. The product name as a link across the header's
// height: `control.header_name_padding_start` before it
// (`control.header_name_padding_start_toggle` after a shown menu button),
// `control.header_name_padding_end` after it
// (`control.header_name_padding_end_sm` below `breakpoint.md`, read from
// the window), a `control.header_name_focus_width` border drawn in
// `color.focus` under focus, the name in `type.header_name` and
// `color.header_name_label`, an optional `prefix` before it in
// `type.header_name_prefix` and a no-break space. It must be composed
// inside Header.

import SPEC from './spec.header-name.js';


/********************************************************************
HeaderName factory.

@param {Object} ctx - Component context

@return {Function} - The HeaderName component
*********************************************************************/
export default function HeaderName (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text } = ctx.ReactNative;
  const { useInteractionState, useViewportSize } = ctx.behaviors;


  /********************************************************************
  HeaderName component.

  @param {Object} props - See `api.header-name.js`

  @return {Object} - React element
  *********************************************************************/
  function HeaderNameComponent (props) {

    // Init the focus state and the window side of the end padding
    // (`_header.scss:163,173-175`); an unknown window is not narrow
    const interaction = useInteractionState({ onPress: props.onPress });
    const viewport = useViewportSize();
    const narrow = viewport.width > 0 && viewport.width < ctx.metric('HeaderName', 'bpMd');
    const prefixed = Utils.isString(props.prefix) && !Utils.isEmptyString(props.prefix);

    // Render the link and its line: the prefix, a no-break space, the name
    return React.createElement(Pressable, Object.assign({}, interaction.rootProps, {
      accessibilityRole: 'link',
      href: props.href,
      testID: props.testID,
      style: {
        alignItems: 'center',
        alignSelf: 'stretch',
        borderColor: interaction.state.focused ? ctx.color('focus') : 'transparent',
        borderWidth: ctx.metric('HeaderName', 'focusWidth'),
        flexDirection: 'row',
        outlineStyle: 'none',
        paddingEnd: ctx.metric('HeaderName', narrow ? 'paddingEndSmall' : 'paddingEnd'),
        paddingStart: ctx.metric('HeaderName', props.afterToggle === true ? 'paddingStartToggle' : 'paddingStart')
      }
    }),
    React.createElement(Text, {
      dir: 'auto',
      numberOfLines: 1,
      style: [ctx.typeStyle('header_name'), { color: ctx.color('header_name_label') }]
    },
    prefixed ? React.createElement(Text, { key: 'prefix', style: ctx.typeStyle('header_name_prefix') }, props.prefix) : null,
    prefixed ? '\u00a0' : null,
    props.children));

  }

  HeaderNameComponent.displayName = 'HeaderName';

  return HeaderNameComponent;

}

HeaderName.spec = SPEC;
