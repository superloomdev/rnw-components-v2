// Info: MenuItemSelectable member. A `role="menuitemcheckbox"` entry that
// toggles on and off and shows the selection mark while it is on; it must
// be composed inside Menu.

import SPEC from './spec.menu-item-selectable.js';
import MenuItem from './menu-item.js';


/********************************************************************
MenuItemSelectable factory.

@param {Object} ctx - Component context

@return {Function} - The MenuItemSelectable component
*********************************************************************/
export default function MenuItemSelectable (ctx) {

  const React = ctx.React;
  const Impl = MenuItem(ctx);


  /********************************************************************
  MenuItemSelectable component.

  @param {Object} props - See `api.menu-item-selectable.js`

  @return {Object} - React element
  *********************************************************************/
  function MenuItemSelectableComponent (props) {

    return React.createElement(Impl, Object.assign({}, props, {
      item: props.item !== undefined ? props.item : Object.assign({}, props, { selected: props.selected === true })
    }));

  }

  MenuItemSelectableComponent.displayName = 'MenuItemSelectable';

  return MenuItemSelectableComponent;

}

MenuItemSelectable.spec = SPEC;
