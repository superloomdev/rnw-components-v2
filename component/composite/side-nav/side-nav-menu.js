// Info: SideNavMenu member. A menu of links in the side navigation
// (`SideNavMenu.tsx`; `ui-shell/side-nav/_side-nav.scss:206-334`): an item
// holding a button and the list it opens: its `items`, then its children. The button is a row
// `control.side_nav_link_height` tall (`control.side_nav_link_height_large`
// when large) and `control.side_nav_link_padding_inline` in from each side:
// an optional SideNavIcon, the `type.side_nav_menu_title` title truncated
// at its end in `color.side_nav_link_label`, and a
// `control.side_nav_icon_size` chevron at its end that turns over while
// open. Under the pointer it takes `color.side_nav_link_container_hover`
// and `color.side_nav_link_label_hover`. It is active when `isActive` or,
// closed, when it holds the current link: its title and icons in the
// selected colors and, closed, `color.side_nav_link_container_selected`
// with the `control.side_nav_indicator_width` bar in
// `color.side_nav_link_indicator` (`:268-298`); under the pointer it keeps
// `color.side_nav_menu_container_selected_hover`. Focused, a
// `border.width_02` ring in `color.focus` inside its box. Escape inside it
// closes it. It must be composed inside SideNav.

import SPEC from './spec.side-nav-menu.js';
import { createNavigationContext } from './side-nav-context.js';


/********************************************************************
SideNavMenu factory.

@param {Object} ctx - Component context

@return {Function} - The SideNavMenu component
*********************************************************************/
export default function SideNavMenu (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useInteractionState } = ctx.behaviors;
  const NavigationContext = createNavigationContext(ctx);


  /********************************************************************
  Whether a link among the children is the current page
  (`SideNavMenu.tsx` `hasActiveDescendant`).

  @param {Array} items   - The menu's `items`
  @param {*}     children - The menu's children

  @return {Boolean}
  *********************************************************************/
  function holdsCurrent (items, children) {

    const fromItems = Utils.isArray(items) && items.some(function (item) {
      return item.isActive === true;
    });
    return fromItems || React.Children.toArray(children).some(function (child) {
      return Utils.isObject(child) && Utils.isObject(child.props) && (child.props.isActive === true || child.props['aria-current'] === 'page');
    });

  }


  /********************************************************************
  SideNavMenu component.

  @param {Object} props - See `api.side-nav-menu.js`

  @return {Object} - React element
  *********************************************************************/
  function SideNavMenuComponent (props) {

    const parent = React.useContext(NavigationContext);
    const [expanded, setExpanded] = React.useState(props.defaultExpanded === true);
    const interaction = useInteractionState({
      onPress: function () {
        setExpanded(function (previous) {
          return !previous;
        });
      }
    });
    const state = interaction.state;
    const hovered = state.hovered === true || state.pressed === true;
    const active = props.isActive === true || (!expanded && holdsCurrent(props.items, props.children));
    const hasIcon = Utils.isString(props.icon);
    const large = parent.large === true || props.large === true;
    const focusWidth = ctx.metric('SideNavMenu', 'focusWidth');

    // The fill: the selected fill only while closed (`:275-289`)
    let fill = 'transparent';
    if (hovered) {
      fill = ctx.color(active ? 'side_nav_menu_container_selected_hover' : 'side_nav_link_container_hover');
    } else if (active && !expanded) {
      fill = ctx.color('side_nav_link_container_selected');
    }
    let ink = 'side_nav_link_label';
    if (active) {
      ink = 'side_nav_link_label_selected';
    } else if (hovered) {
      ink = 'side_nav_link_label_hover';
    }
    const context = React.useMemo(function () {
      return Object.freeze(Object.assign({}, parent, { hasIcon: hasIcon, inMenu: true, large: large }));
    }, [parent, hasIcon, large]);

    const links = Utils.isArray(props.items) ? props.items.map(function (item, index) {
      return React.createElement(ctx.Registry.SideNavMenuItem, { href: item.href, isActive: item.isActive, key: index, onPress: item.onPress }, item.label);
    }) : null;
    const button = React.createElement(Pressable, Object.assign({}, interaction.rootProps, {
      'aria-expanded': expanded,
      accessibilityRole: 'button',
      key: 'button',
      tabIndex: parent.expanded === true || parent.isRail === true ? 0 : -1,
      testID: props.testID,
      style: {
        alignItems: 'center',
        backgroundColor: fill,
        flexDirection: 'row',
        height: ctx.metric('SideNavMenu', large ? 'heightLarge' : 'height'),
        outlineColor: state.focused ? ctx.color('focus') : undefined,
        outlineOffset: state.focused ? -focusWidth : undefined,
        outlineStyle: state.focused ? 'solid' : 'none',
        outlineWidth: state.focused ? focusWidth : undefined,
        paddingHorizontal: ctx.metric('SideNavMenu', 'paddingInline'),
        position: 'relative'
      }
    }),
    hasIcon ? React.createElement(ctx.Registry.SideNavIcon, { icon: props.icon, isSelected: active, key: 'icon' }) : null,
    React.createElement(Text, {
      dir: 'auto',
      key: 'title',
      numberOfLines: 1,
      style: [ctx.typeStyle('side_nav_menu_title'), { color: ctx.color(ink), flexShrink: 1 }]
    }, props.title),
    React.createElement(View, {
      'aria-hidden': true,
      dataSet: { part: 'chevron' },
      key: 'chevron',
      style: { alignItems: 'center', flexDirection: 'row', flexGrow: 1, justifyContent: 'flex-end' }
    }, React.createElement(View, { style: { transform: expanded ? [{ rotate: '180deg' }] : [] } },
      React.createElement(ctx.Registry.Icon, {
        color: active ? 'side_nav_icon_selected' : 'side_nav_icon',
        name: 'chevron_down',
        size: ctx.metric('SideNavMenu', 'chevronSize')
      }))),
    active && !expanded ? React.createElement(View, {
      'aria-hidden': true,
      dataSet: { part: 'indicator' },
      key: 'indicator',
      style: { backgroundColor: ctx.color('side_nav_link_indicator'), bottom: 0, position: 'absolute', start: 0, top: 0, width: ctx.metric('SideNavMenu', 'indicatorWidth') }
    }) : null);

    return React.createElement(View, {
      onKeyDown: function (event) {
        if (event && event.key === 'Escape') {
          setExpanded(false);
        }
      },
      role: 'listitem',
      style: { overflow: 'hidden' }
    },
    button,
    React.createElement(NavigationContext.Provider, { key: 'menu', value: context },
      React.createElement(View, { role: 'list' }, expanded ? links : null, expanded ? props.children : null)));

  }

  SideNavMenuComponent.displayName = 'SideNavMenu';

  return SideNavMenuComponent;

}

SideNavMenu.spec = SPEC;
