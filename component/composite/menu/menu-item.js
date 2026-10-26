// Info: MenuItem member. One `role="menuitem"` entry of a Menu: the mark
// seat (when any item is selectable), the icon seat, the label and the
// shortcut through the list cells (the danger cells where the item is
// dangerous). An entry with `items` draws the `caret_right` glyph in the
// shortcut seat, carries `aria-haspopup`/`aria-expanded`, and opens a
// submenu of them on hover after a 100 ms delay, closing it when the
// pointer or focus leaves both.

import SPEC from './spec.menu-item.js';


/********************************************************************
MenuItem factory.

@param {Object} ctx - Component context

@return {Function} - The MenuItem component
*********************************************************************/
export default function MenuItem (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useAnchoredPosition } = ctx.behaviors;


  /********************************************************************
  MenuItem component.

  @param {Object} props - See `api.menu-item.js`

  @return {Object} - React element
  *********************************************************************/
  function MenuItemComponent (props) {

    // Init the item's ref, states and registration
    const item = props.item !== undefined ? props.item : props;
    const disabled = item.disabled === true;
    const ref = React.useRef(null);
    const [hovered, setHovered] = React.useState(false);
    const [pressed, setPressed] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    React.useEffect(function () {
      if (typeof props.registerItem === 'function') {
        return props.registerItem({ ref: ref, disabled: disabled });
      }
      return undefined;
    }, [props.registerItem, disabled]);

    // The item's state cells: a danger item reads the menu's own cells. A
    // press draws the hover's fill; a focused item carries the ring alone
    const danger = item.danger === true;
    const active = hovered || pressed;
    const state = { disabled: disabled, hovered: active && !danger, highlighted: focused, selected: item.selected === true };
    const list = props.list !== undefined ? props.list : {
      item: function () {
        return {};
      },
      label: function () {
        return ctx.typeStyle('list_item');
      },
      labelLeaf: function () {
        return 'list_item_label';
      },
      option: function () {
        return { paddingHorizontal: ctx.metric('MenuItem', 'optionPaddingInline') };
      },
      mark: 'shown'
    };
    const labelLeaf = disabled ? 'list_item_label_disabled'
      : danger ? (active ? 'menu_item_danger_label_hover' : 'menu_item_danger_label')
        : list.labelLeaf(state);
    const itemFill = !disabled && danger && active ? 'menu_item_danger_container_hover' : null;
    const iconLeaf = disabled ? 'menu_item_icon_disabled' : active ? 'menu_item_icon_hover' : 'menu_item_icon';
    const itemStyle = Object.assign({}, list.item(state));
    if (itemFill !== null) {
      itemStyle.backgroundColor = ctx.color(itemFill);
    }
    const seats = props.seats || {};

    // A submenu item: the caret in the shortcut seat, hover opens after
    // the delay, the submenu is a Menu at the member offsets
    const hasSub = Utils.isArray(item.items);
    const [submenuOpen, setSubmenuOpen] = React.useState(false);
    const submenuTimer = React.useRef(null);
    const anchored = useAnchoredPosition({ anchor: ref, offset: 0, placement: 'right', track: submenuOpen });
    const openSub = function () {
      clearTimeout(submenuTimer.current);
      submenuTimer.current = setTimeout(function () {
        setSubmenuOpen(true);
      }, ctx.metric('MenuItem', 'submenuDelay'));
    };
    const closeSub = function () {
      clearTimeout(submenuTimer.current);
      setSubmenuOpen(false);
    };
    React.useEffect(function () {
      return function () {
        clearTimeout(submenuTimer.current);
      };
    }, []);
    React.useEffect(function () {
      if (submenuOpen) {
        anchored.measure();
      }
    }, [submenuOpen, anchored.measure]);
    const anchor = anchored.anchor;

    // Render the item: mark seat, icon seat, label, shortcut seat (caret
    // for a submenu), then the submenu itself
    const role = item.radio === true ? 'menuitemradio' : item.selected === undefined ? 'menuitem' : 'menuitemcheckbox';
    return React.createElement(Pressable, {
      ref: ref,
      role: role,
      'aria-checked': item.selected === undefined && item.radio !== true ? undefined : item.selected === true,
      'aria-expanded': hasSub ? submenuOpen : undefined,
      'aria-haspopup': hasSub ? true : undefined,
      disabled: disabled,
      tabIndex: -1,
      onPress: disabled ? undefined : function () {
        if (hasSub) {
          setSubmenuOpen(true);
          return;
        }
        if (typeof props.onChoose === 'function') {
          props.onChoose(item);
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
        if (hasSub) {
          openSub();
        }
      },
      onPointerLeave: function () {
        setHovered(false);
        if (hasSub) {
          closeSub();
        }
      },
      onFocus: function () {
        setFocused(true);
      },
      onBlur: function () {
        setFocused(false);
      },
      style: itemStyle
    },
    React.createElement(View, { style: [list.option(props.first !== true), { alignItems: 'center', flexDirection: 'row' }] },
      props.selectable === true ? React.createElement(View, { style: [seats.markPlace, {
        display: list.mark === 'shown' ? 'flex' : 'none'
      }] },
      React.createElement(ctx.Registry.Icon, {
        name: 'selected_indicator',
        size: seats.markSize,
        color: iconLeaf,
        style: { opacity: item.selected === true ? 1 : 0 }
      })) : null,
      props.icons === true ? React.createElement(View, { style: [seats.iconPlace, {
        display: props.iconsShared === true || item.icon !== undefined ? 'flex' : 'none'
      }] },
      item.icon === undefined ? null : React.createElement(ctx.Registry.Icon, { name: item.icon, size: seats.iconSize, color: iconLeaf })) : null,
      React.createElement(Text, {
        numberOfLines: 1,
        style: [list.label(state), { color: ctx.color(labelLeaf), flexGrow: 1 }]
      }, item.label),
      hasSub === true ? React.createElement(View, { style: { marginStart: ctx.metric('MenuItem', 'itemGap') } },
        React.createElement(ctx.Registry.Icon, { name: 'caret_right', size: seats.iconSize, color: iconLeaf }))
        : item.shortcut === undefined ? null : React.createElement(Text, {
          style: [ctx.typeStyle('menu_item_shortcut'), { color: ctx.color(disabled || danger ? labelLeaf : active ? 'menu_item_shortcut_hover' : 'menu_item_shortcut'), marginStart: ctx.metric('MenuItem', 'itemGap') }]
        }, item.shortcut)),
    hasSub === true && submenuOpen === true && anchor !== null ? React.createElement(ctx.Registry.Menu, {
      accessibilityLabel: item.label,
      items: item.items,
      menuAlignment: 'bottom-start',
      open: true,
      x: anchor.x + anchor.width + ctx.metric('MenuItem', 'submenuOffsetEnd'),
      y: anchor.y + ctx.metric('MenuItem', 'submenuOffsetBlock'),
      onClose: function () {
        setSubmenuOpen(false);
        if (ref.current !== null && typeof ref.current.focus === 'function') {
          ref.current.focus();
        }
      }
    }) : null);

  }

  MenuItemComponent.displayName = 'MenuItem';

  return MenuItemComponent;

}

MenuItem.spec = SPEC;
