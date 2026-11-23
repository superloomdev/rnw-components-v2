// Info: HeaderMenuButton member. The side navigation's toggle at the
// header's start: a `control.header_action_size` square with a
// `border.width_01` border drawn in `color.focus` under focus, the `menu`
// glyph (`close` while `isActive`) at `control.header_action_icon_size` in
// `color.header_menu_button_icon`, filled `color.header_action_container`
// `_hover` and `_active` under the pointer. Active, it stands on
// `color.header_action_container_selected` between two `color.header_border`
// rules. Without `isCollapsible` it is drawn below `breakpoint.lg` only,
// read from the window (`_header.scss:149-153`). It must be composed inside
// Header.

import SPEC from './spec.header-menu-button.js';


/********************************************************************
HeaderMenuButton factory.

@param {Object} ctx - Component context

@return {Function} - The HeaderMenuButton component
*********************************************************************/
export default function HeaderMenuButton (ctx) {

  const React = ctx.React;
  const { Pressable } = ctx.ReactNative;
  const { useInteractionState, useViewportSize } = ctx.behaviors;


  /********************************************************************
  Whether the toggle is shown in a window this wide: always when it
  collapses, else below lg; an unknown window is wide.

  @param {Number}  width       - The window width, 0 when unknown
  @param {Boolean} collapsible - The `isCollapsible` prop

  @return {Boolean}
  *********************************************************************/
  function isShown (width, collapsible) {

    return collapsible === true || (width > 0 && width < ctx.metric('HeaderMenuButton', 'bpLg'));

  }


  /********************************************************************
  HeaderMenuButton component.

  @param {Object} props - See `api.header-menu-button.js`

  @return {Object|null} - React element, or null where it is not shown
  *********************************************************************/
  function HeaderMenuButtonComponent (props) {

    const interaction = useInteractionState({ onPress: props.onPress });
    const viewport = useViewportSize();
    if (!isShown(viewport.width, props.isCollapsible)) {
      return null;
    }
    const state = interaction.state;
    const active = props.isActive === true;
    const rule = ctx.color('header_border');
    const fill = state.pressed ? ctx.color('header_action_container_active')
      : state.hovered ? ctx.color('header_action_container_hover')
        : active ? ctx.color('header_action_container_selected') : 'transparent';

    // The square, its border and the glyph (`_header.scss:48-61,89-153`)
    return React.createElement(Pressable, Object.assign({}, interaction.rootProps, {
      'aria-label': props.accessibilityLabel,
      accessibilityRole: 'button',
      testID: props.testID,
      style: {
        alignItems: 'center',
        backgroundColor: fill,
        borderBottomColor: state.focused ? ctx.color('focus') : 'transparent',
        borderEndColor: state.focused ? ctx.color('focus') : active ? rule : 'transparent',
        borderStartColor: state.focused ? ctx.color('focus') : active ? rule : 'transparent',
        borderTopColor: state.focused ? ctx.color('focus') : 'transparent',
        borderWidth: ctx.metric('HeaderMenuButton', 'borderWidth'),
        height: ctx.metric('HeaderMenuButton', 'size'),
        justifyContent: 'center',
        outlineStyle: 'none',
        width: ctx.metric('HeaderMenuButton', 'size')
      }
    }), React.createElement(ctx.Registry.Icon, {
      color: 'header_menu_button_icon',
      name: active ? 'close' : 'menu',
      size: ctx.metric('HeaderMenuButton', 'iconSize')
    }));

  }

  HeaderMenuButtonComponent.displayName = 'HeaderMenuButton';
  HeaderMenuButtonComponent.isShown = isShown;

  return HeaderMenuButtonComponent;

}

HeaderMenuButton.spec = SPEC;
