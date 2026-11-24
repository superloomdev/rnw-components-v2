// Info: SideNavFooter member. The side navigation's footer: a toggle
// button `control.side_nav_link_height_large` tall across the navigation,
// `control.side_nav_link_padding_inline` in from its start, drawing a
// `control.side_nav_icon_size` glyph in `color.side_nav_icon` (the close
// glyph while `expanded`, the chevron otherwise, `SideNavFooter.tsx`) and
// labelled by `assistiveText`; under the pointer
// `color.side_nav_link_container_hover`, focused a `border.width_02` ring
// in `color.focus` inside its box. The pinned upstream stylesheet has no
// rule for it (`notes.md`, `no_reference`). It must be composed inside
// SideNav.

import SPEC from './spec.side-nav-footer.js';

const ASSISTIVE_TEXT = 'Toggle opening or closing the side navigation';


/********************************************************************
SideNavFooter factory.

@param {Object} ctx - Component context

@return {Function} - The SideNavFooter component
*********************************************************************/
export default function SideNavFooter (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable } = ctx.ReactNative;
  const { useInteractionState } = ctx.behaviors;


  /********************************************************************
  SideNavFooter component.

  @param {Object} props - See `api.side-nav-footer.js`

  @return {Object} - React element
  *********************************************************************/
  function SideNavFooterComponent (props) {

    const interaction = useInteractionState({ onPress: props.onToggle });
    const state = interaction.state;
    const focusWidth = ctx.metric('SideNavFooter', 'focusWidth');
    const hovered = state.hovered === true || state.pressed === true;
    return React.createElement(Pressable, Object.assign({}, interaction.rootProps, {
      'aria-label': Utils.isString(props.assistiveText) ? props.assistiveText : ASSISTIVE_TEXT,
      accessibilityRole: 'button',
      style: {
        alignItems: 'center',
        backgroundColor: hovered ? ctx.color('side_nav_link_container_hover') : 'transparent',
        flexDirection: 'row',
        height: ctx.metric('SideNavFooter', 'height'),
        outlineColor: state.focused ? ctx.color('focus') : undefined,
        outlineOffset: state.focused ? -focusWidth : undefined,
        outlineStyle: state.focused ? 'solid' : 'none',
        outlineWidth: state.focused ? focusWidth : undefined,
        paddingHorizontal: ctx.metric('SideNavFooter', 'paddingInline')
      }
    }), React.createElement(ctx.Registry.Icon, {
      color: 'side_nav_icon',
      name: props.expanded === true ? 'close' : 'chevron_right',
      size: ctx.metric('SideNavFooter', 'iconSize')
    }));

  }

  SideNavFooterComponent.displayName = 'SideNavFooter';

  return SideNavFooterComponent;

}

SideNavFooter.spec = SPEC;
