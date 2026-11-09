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

    // The group's options compose as children inside a Menu; standalone the
    // `items` data draws one `menuitemradio` each, `selectedItem` marked
    const items = Array.isArray(props.items) ? props.items.map(function (entry, index) {
      const item = typeof entry === 'string' ? { label: entry } : entry;
      return React.createElement(ctx.Registry.MenuItem, {
        item: Object.assign({ radio: true, selected: props.selectedItem !== undefined ? item.label === props.selectedItem : item.selected === true }, item),
        key: index,
        selectable: true
      });
    }) : props.children;

    return React.createElement(View, {
      accessibilityLabel: props.label,
      role: 'group'
    }, items);

  }

  MenuItemRadioGroupComponent.displayName = 'MenuItemRadioGroup';

  return MenuItemRadioGroupComponent;

}

MenuItemRadioGroup.spec = SPEC;
