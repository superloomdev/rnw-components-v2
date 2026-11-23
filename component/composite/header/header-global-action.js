// Info: HeaderGlobalAction member. One action of the header's global bar:
// a `control.header_action_size` square with a `border.width_01` border
// drawn in `color.focus` under focus, the glyph at
// `control.header_action_icon_size` in `color.header_action_icon`
// (`_hover`, `_active`, `_selected`), filled
// `color.header_action_container` `_hover` and `_active` under the
// pointer; active (`isActive`, its panel open) on
// `color.header_action_container_selected` between two
// `color.header_border` rules. The compact tooltip under it names it,
// aligned by `tooltipAlignment`. It must be composed inside Header, in
// HeaderGlobalBar.

import SPEC from './spec.header-global-action.js';

// The tooltip's place under the action, by `tooltipAlignment`
const ALIGN = Object.freeze({ center: 'bottom', end: 'bottom-end', start: 'bottom-start' });


/********************************************************************
HeaderGlobalAction factory.

@param {Object} ctx - Component context

@return {Function} - The HeaderGlobalAction component
*********************************************************************/
export default function HeaderGlobalAction (ctx) {

  const React = ctx.React;
  const { Pressable } = ctx.ReactNative;
  const { useInteractionState } = ctx.behaviors;


  /********************************************************************
  HeaderGlobalAction component.

  @param {Object} props - See `api.header-global-action.js`

  @return {Object} - React element
  *********************************************************************/
  function HeaderGlobalActionComponent (props) {

    const interaction = useInteractionState({ onPress: props.onPress });
    const state = interaction.state;
    const active = props.isActive === true;
    const rule = ctx.color('header_border');
    const focus = state.focused ? ctx.color('focus') : null;
    const fill = state.pressed ? ctx.color('header_action_container_active')
      : state.hovered ? ctx.color('header_action_container_hover')
        : active ? ctx.color('header_action_container_selected') : 'transparent';
    const ink = state.pressed ? 'header_action_icon_active'
      : state.hovered ? 'header_action_icon_hover'
        : active ? 'header_action_icon_selected' : 'header_action_icon';

    // The square, its border and the glyph (`_header.scss:48-130`)
    const button = React.createElement(Pressable, Object.assign({}, interaction.rootProps, {
      'aria-label': props.accessibilityLabel,
      accessibilityRole: 'button',
      testID: props.testID,
      style: {
        alignItems: 'center',
        backgroundColor: fill,
        borderBottomColor: focus || 'transparent',
        borderEndColor: focus || (active ? rule : 'transparent'),
        borderStartColor: focus || (active ? rule : 'transparent'),
        borderTopColor: focus || 'transparent',
        borderWidth: ctx.metric('HeaderGlobalAction', 'borderWidth'),
        height: ctx.metric('HeaderGlobalAction', 'size'),
        justifyContent: 'center',
        outlineStyle: 'none',
        width: ctx.metric('HeaderGlobalAction', 'size')
      }
    }), React.createElement(ctx.Registry.Icon, { color: ink, name: props.icon, size: ctx.metric('HeaderGlobalAction', 'iconSize') }));

    // The compact tooltip opens under the action
    return React.createElement(ctx.Registry.Tooltip, {
      align: ALIGN[props.tooltipAlignment] || ALIGN.center,
      compact: true,
      label: props.accessibilityLabel
    }, button);

  }

  HeaderGlobalActionComponent.displayName = 'HeaderGlobalAction';

  return HeaderGlobalActionComponent;

}

HeaderGlobalAction.spec = SPEC;
