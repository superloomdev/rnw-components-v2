// Info: OverflowMenuItem composite. One `role="none"` row of the overflow
// menu's panel holding a `role="menuitem"` pressable (a link when `href`
// is given on the web), the label one line with ellipsis at the option's
// width ceiling. `divider` draws the menu-divider rule across the row's
// top edge; `danger` reads the danger cells, painting its hover fill on
// the button over the row's own hover grey; `disabled` reads the disabled
// cells and is skipped by the parent's roving focus. A press calls
// `onPress`, then the parent's close and refocuses the trigger.

import SPEC from './spec.overflow-menu-item.js';


/********************************************************************
OverflowMenuItem factory.

@param {Object} ctx - Component context

@return {Function} - The OverflowMenuItem component
*********************************************************************/
export default function OverflowMenuItem (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;


  /********************************************************************
  OverflowMenuItem component.

  @param {Object} props - See `api.overflow-menu-item.js`

  @return {Object} - React element
  *********************************************************************/
  function OverflowMenuItemComponent (props) {

    // Init the item's ref, states and registration with the parent's
    // roving collection (none when the item stands alone)
    const disabled = props.disabled === true;
    const danger = props.danger === true;
    const ref = React.useRef(null);
    const [hovered, setHovered] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const [pressed, setPressed] = React.useState(false);
    React.useEffect(function () {
      if (typeof props.registerItem === 'function') {
        return props.registerItem({ ref: ref, disabled: disabled });
      }
      return undefined;
    }, [props.registerItem, disabled]);

    // The row's and button's cells: the row carries the hover fill on an
    // ordinary option; a danger option keeps the row's grey under its
    // button's red (the upstream li paints, the danger paint sits on the
    // button - frozen from the probe) and the 3 px white inset ring over
    // the focus outline while focused
    const active = hovered || pressed;
    const rowStyle = {
      backgroundColor: !disabled && !danger && active ? ctx.color('list_item_container_hover') : 'transparent',
      borderTopColor: ctx.color('menu_divider'),
      borderTopWidth: props.divider === true ? ctx.metric('OverflowMenuItem', 'dividerWidth') : 0,
      height: ctx.metric('OverflowMenuItem', { xs: 'optionHeightXsmall', sm: 'optionHeightSmall', lg: 'optionHeightLarge' }[props.size] || 'optionHeight')
    };
    const labelLeaf = disabled ? 'list_item_label_disabled'
      : danger ? (active ? 'menu_item_danger_label_hover' : 'menu_item_danger_label')
        : active ? 'list_item_label_hover' : 'list_item_label';
    const buttonStyle = Object.assign({
      alignItems: 'center',
      backgroundColor: !disabled && danger && active ? ctx.color('menu_item_danger_container_hover') : 'transparent',
      boxShadow: !disabled && danger && focused
        ? 'inset 0 0 0 ' + ctx.metric('OverflowMenuItem', 'dangerInsetWidth') + 'px ' + ctx.color('menu_item_danger_focus_inset')
        : undefined,
      flexDirection: 'row',
      height: rowStyle.height,
      paddingHorizontal: ctx.metric('OverflowMenuItem', 'optionPaddingInline')
    }, !disabled && focused ? ctx.focusRing('field', { focused: true }) : {});

    // Render the row: the pressable fills it, the label one line ellipsized
    // at the option's width ceiling
    return React.createElement(View, {
      dataSet: Utils.isNumber(props.index) ? { index: String(props.index), part: 'option' } : { part: 'option' },
      role: 'none',
      style: rowStyle
    },
    React.createElement(Pressable, {
      ref: ref,
      role: 'menuitem',
      accessibilityRole: props.href === undefined ? undefined : 'link',
      'aria-checked': undefined,
      disabled: disabled,
      href: props.href,
      tabIndex: -1,
      onPress: disabled ? undefined : function () {
        if (typeof props.onPress === 'function') {
          props.onPress(props);
        }
        if (typeof props.onRequestClose === 'function') {
          props.onRequestClose();
        }
      },
      onPressIn: function () {
        setPressed(true);
      },
      onPressOut: function () {
        setPressed(false);
      },
      onPointerEnter: function () {
        setHovered(true);
      },
      onPointerLeave: function () {
        setHovered(false);
      },
      onFocus: function () {
        setFocused(true);
      },
      onBlur: function () {
        setFocused(false);
      },
      style: buttonStyle,
      testID: props.testID
    },
    React.createElement(Text, {
      numberOfLines: 1,
      style: [ctx.typeStyle('list_item'), {
        color: ctx.color(labelLeaf),
        maxWidth: ctx.metric('OverflowMenuItem', 'optionMaxWidth')
      }]
    }, props.label)));

  }

  OverflowMenuItemComponent.displayName = 'OverflowMenuItem';

  return OverflowMenuItemComponent;

}

OverflowMenuItem.spec = SPEC;
