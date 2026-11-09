// Info: MenuItemDivider member. A `role="separator"` rule that separates
// groups of items in a Menu, drawn on the menu-divider cells.

import SPEC from './spec.menu-item-divider.js';


/********************************************************************
MenuItemDivider factory.

@param {Object} ctx - Component context

@return {Function} - The MenuItemDivider component
*********************************************************************/
export default function MenuItemDivider (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  MenuItemDivider component.

  @param {Object} props - See `api.menu-item-divider.js` (takes none)

  @return {Object} - React element
  *********************************************************************/
  function MenuItemDividerComponent () {

    return React.createElement(View, {
      role: 'separator',
      style: {
        backgroundColor: ctx.color('menu_divider'),
        height: ctx.metric('MenuItemDivider', 'dividerWidth'),
        marginVertical: ctx.metric('MenuItemDivider', 'dividerMargin')
      }
    });

  }

  MenuItemDividerComponent.displayName = 'MenuItemDivider';

  return MenuItemDividerComponent;

}

MenuItemDivider.spec = SPEC;
