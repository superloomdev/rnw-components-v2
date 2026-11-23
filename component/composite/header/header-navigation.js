// Info: HeaderNavigation member. The header's menu bar: a `navigation`
// landmark across the header's height, `control.header_nav_padding_start`
// after a `control.header_nav_divider_height` rule in
// `color.header_border` at its start, holding a list of HeaderMenuItem
// links and HeaderMenu menus from `items`, then its children. It is drawn
// from `breakpoint.lg`, read from the window (`_header.scss:205-213`);
// below it the links belong to HeaderSideNavItems. It must be composed
// inside Header.

import SPEC from './spec.header-navigation.js';


/********************************************************************
HeaderNavigation factory.

@param {Object} ctx - Component context

@return {Function} - The HeaderNavigation component
*********************************************************************/
export default function HeaderNavigation (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { useViewportSize } = ctx.behaviors;


  /********************************************************************
  HeaderNavigation component.

  @param {Object} props - See `api.header-navigation.js`

  @return {Object|null} - React element, or null below `breakpoint.lg`
  *********************************************************************/
  function HeaderNavigationComponent (props) {

    // Below lg the menu bar is not drawn; an unknown window is wide
    const viewport = useViewportSize();
    if (viewport.width > 0 && viewport.width < ctx.metric('HeaderNavigation', 'bpLg')) {
      return null;
    }
    const items = Utils.isArray(props.items) ? props.items : [];
    const dividerHeight = ctx.metric('HeaderNavigation', 'dividerHeight');

    // Render the landmark, its rule centered on the block axis
    // (`_header.scss:216-226`) and the list of members
    return React.createElement(View, {
      'aria-label': props.accessibilityLabel,
      role: 'navigation',
      testID: props.testID,
      style: { alignSelf: 'stretch', paddingStart: ctx.metric('HeaderNavigation', 'paddingStart'), position: 'relative' }
    },
    React.createElement(View, {
      'aria-hidden': true,
      key: 'divider',
      style: {
        backgroundColor: ctx.color('header_border'),
        height: dividerHeight,
        marginTop: -dividerHeight / 2,
        position: 'absolute',
        start: 0,
        top: '50%',
        width: ctx.metric('HeaderNavigation', 'dividerWidth')
      }
    }),
    React.createElement(View, { key: 'list', role: 'list', style: { flexDirection: 'row', flexGrow: 1 } },
      items.map(function (item, index) {
        return Utils.isArray(item.items)
          ? React.createElement(ctx.Registry.HeaderMenu, { isActive: item.isActive, items: item.items, key: index, menuLinkName: item.label })
          : React.createElement(ctx.Registry.HeaderMenuItem, { href: item.href, isActive: item.isActive, key: index, onPress: item.onPress }, item.label);
      }),
      props.children));

  }

  HeaderNavigationComponent.displayName = 'HeaderNavigation';

  return HeaderNavigationComponent;

}

HeaderNavigation.spec = SPEC;
