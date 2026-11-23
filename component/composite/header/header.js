// Info: Header composite. The UI shell's bar: a `banner` landmark, a row
// `control.header_height` tall on `color.header_container` with a
// `border.width_01` rule in `color.header_border` under it, stacked at
// `stacking.header`. From its data it draws, in order, HeaderMenuButton
// (`menuButton`), HeaderName (`name`; it starts closer after a
// collapsible button), HeaderNavigation (`navigation`), HeaderGlobalBar (`actions`) and
// HeaderPanel (`panel`), then its children. The bar lays out in flow:
// upstream fixes it to the window's top, a host places it above its
// scrolling content.

import SPEC from './spec.header.js';


/********************************************************************
Header factory.

@param {Object} ctx - Component context

@return {Function} - The Header component
*********************************************************************/
export default function Header (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;


  /********************************************************************
  Header component.

  @param {Object} props - See `api.header.js`

  @return {Object} - React element
  *********************************************************************/
  function HeaderComponent (props) {

    // A collapsible menu button moves the name closer at every width
    // (`_header.scss:197-200`): the rule skips the toggle's `__hidden`
    // class, which a toggle without `isCollapsible` carries at every width
    // (`HeaderMenuButton.js:34`), so that one never moves it
    const menuButton = Utils.isObject(props.menuButton) ? props.menuButton : null;
    const collapsible = menuButton !== null && menuButton.isCollapsible === true;
    const members = [];
    if (menuButton !== null) {
      members.push(React.createElement(ctx.Registry.HeaderMenuButton, {
        accessibilityLabel: menuButton.label,
        isActive: menuButton.isActive,
        isCollapsible: menuButton.isCollapsible,
        key: 'menuButton',
        onPress: menuButton.onPress
      }));
    }
    if (Utils.isObject(props.name)) {
      members.push(React.createElement(ctx.Registry.HeaderName, {
        afterToggle: collapsible,
        href: props.name.href,
        key: 'name',
        onPress: props.name.onPress,
        prefix: props.name.prefix
      }, props.name.label));
    }
    if (Utils.isObject(props.navigation)) {
      members.push(React.createElement(ctx.Registry.HeaderNavigation, {
        accessibilityLabel: props.navigation.accessibilityLabel,
        items: props.navigation.items,
        key: 'navigation'
      }));
    }
    if (Utils.isArray(props.actions)) {
      members.push(React.createElement(ctx.Registry.HeaderGlobalBar, { actions: props.actions, key: 'actions' }));
    }
    if (Utils.isObject(props.panel)) {
      members.push(React.createElement(ctx.Registry.HeaderPanel, {
        expanded: props.panel.expanded,
        key: 'panel',
        onHeaderPanelFocus: props.panel.onHeaderPanelFocus
      }, props.panel.children));
    }

    // Render the bar (`_header.scss:30-46`)
    return React.createElement(View, {
      'aria-label': props.accessibilityLabel,
      role: 'banner',
      testID: props.testID,
      style: {
        alignItems: 'center',
        backgroundColor: ctx.color('header_container'),
        borderBottomColor: ctx.color('header_border'),
        borderBottomWidth: ctx.metric('Header', 'ruleWidth'),
        flexDirection: 'row',
        height: ctx.metric('Header', 'height'),
        position: 'relative',
        zIndex: ctx.metric('Header', 'level')
      }
    }, members, props.children);

  }

  HeaderComponent.displayName = 'Header';

  return HeaderComponent;

}

Header.spec = SPEC;
