// Info: MenuItemRadioGroup member. A `role="radiogroup"` naming a set of
// Menu items of which exactly one is selected and marked, its options
// `role="menuitemradio"`.

import SPEC from './spec.menu-item-radio-group.js';


/********************************************************************
MenuItemRadioGroup factory.

@param {Object} ctx - Component context

@return {Function} - The MenuItemRadioGroup component
*********************************************************************/
export default function MenuItemRadioGroup (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  MenuItemRadioGroup component.

  @param {Object} props - See `api.menu-item-radio-group.js`

  @return {Object} - React element
  *********************************************************************/
  function MenuItemRadioGroupComponent (props) {

    return React.createElement(View, {
      accessibilityLabel: props.label,
      role: 'group'
    }, props.children);

  }

  MenuItemRadioGroupComponent.displayName = 'MenuItemRadioGroup';

  return MenuItemRadioGroupComponent;

}

MenuItemRadioGroup.spec = SPEC;
