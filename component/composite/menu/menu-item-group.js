// Info: MenuItemGroup member. A `role="group"` that names a run of a
// Menu's items for assistive technology without drawing a heading; the
// items inside it run on at the item height.

import SPEC from './spec.menu-item-group.js';


/********************************************************************
MenuItemGroup factory.

@param {Object} ctx - Component context

@return {Function} - The MenuItemGroup component
*********************************************************************/
export default function MenuItemGroup (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  MenuItemGroup component.

  @param {Object} props - See `api.menu-item-group.js`

  @return {Object} - React element
  *********************************************************************/
  function MenuItemGroupComponent (props) {

    return React.createElement(View, {
      accessibilityLabel: props.label,
      role: 'group'
    }, props.children);

  }

  MenuItemGroupComponent.displayName = 'MenuItemGroup';

  return MenuItemGroupComponent;

}

MenuItemGroup.spec = SPEC;
