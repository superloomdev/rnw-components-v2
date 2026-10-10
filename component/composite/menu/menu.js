// Info: Menu composite. A `role="menu"` surface of `role="menuitem"` (or
// `menuitemcheckbox` for a selectable item) entries and `role="separator"`
// dividers, drawn on the `list` family's cells plus the menu's member cells:
// the item height, the container's block padding, the divider, the danger
// item and the icon size. It opens at `x`,`y`, fitted to the viewport by the
// `menu-position` behavior; arrows rove the focus over enabled items, Home
// and End the ends, Escape, Tab and outside press call `onClose`. Where
// `anatomy.menu_icon_seat` says `shared` a menu with any icon reserves the
// icon seat for every item, and a selectable menu the mark seat for every
// item; the mark itself draws only where `anatomy.list_selected_mark`
// says `shown` (on a selected item), so the element tree never depends on
// the theme.

import SPEC from './spec.js';


/********************************************************************
Menu factory.

@param {Object} ctx - Component context

@return {Function} - The Menu component
*********************************************************************/
export default function Menu (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useMenuCollection, useMenuPosition, useOverlay, usePopoverDismiss } = ctx.behaviors;

  // The keys that rove the focus
  const DIRECTIONS = Object.freeze({ ArrowDown: 'next', ArrowUp: 'previous', Home: 'first', End: 'last' });


  /********************************************************************
  One item. Registers its ref with the collection and draws the mark, the
  icon, the label and the shortcut through the list cells (the danger
  cells where the item is dangerous).

  @param {Object} props - { item, first, registerItem, list, metrics, onChoose }

  @return {Object} - React element
  *********************************************************************/
  function MenuItem (props) {

    // Init the item's ref, states and registration
    const item = props.item;
    const disabled = item.disabled === true;
    const ref = React.useRef(null);
    const [hovered, setHovered] = React.useState(false);
    const [pressed, setPressed] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    React.useEffect(function () {
      return props.registerItem({ ref: ref, disabled: disabled });
    }, [props.registerItem, disabled]);

    // The item's state cells: a danger item reads the menu's own cells. A
    // press draws the hover's fill (the references paint no deeper active on
    // a menu item); a focused item carries the control's ring, nothing else
    const danger = item.danger === true;
    const active = hovered || pressed;
    const state = { disabled: disabled, hovered: active && !danger, highlighted: focused, selected: item.selected === true };
    const labelLeaf = disabled ? 'list_item_label_disabled'
      : danger ? (active ? 'menu_item_danger_label_hover' : 'menu_item_danger_label')
        : props.list.labelLeaf(state);
    const itemFill = !disabled && danger && active ? 'menu_item_danger_container_hover' : null;
    // The item icon's ink reads the icon cells until the queued
    // color.menu_item_icon members land: the secondary ink, which is the
    // resting icon color in both references
    const iconLeaf = disabled ? 'icon_disabled' : 'icon_secondary';
    const itemStyle = Object.assign({}, props.list.item(state));
    if (itemFill !== null) {
      itemStyle.backgroundColor = ctx.color(itemFill);
    }

    // Render the item: mark seat, icon seat, label, shortcut seat
    return React.createElement(Pressable, {
      ref: ref,
      role: item.selected === undefined ? 'menuitem' : 'menuitemcheckbox',
      'aria-checked': item.selected === undefined ? undefined : item.selected === true,
      disabled: disabled,
      tabIndex: -1,
      onPress: disabled ? undefined : function () {
        props.onChoose(item);
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
      style: itemStyle
    },
    React.createElement(View, { style: [props.list.option(props.first !== true), { alignItems: 'center', flexDirection: 'row' }] },
      props.selectable === true ? React.createElement(View, { style: [props.metrics.markPlace, {
        display: props.list.mark === 'shown' ? 'flex' : 'none'
      }] },
      React.createElement(ctx.Registry.Icon, {
        name: 'selected_indicator',
        size: props.metrics.markSize,
        color: iconLeaf,
        style: { opacity: item.selected === true ? 1 : 0 }
      })) : null,
      props.icons === true ? React.createElement(View, { style: [props.metrics.iconPlace, {
        display: props.iconsShared === true || item.icon !== undefined ? 'flex' : 'none'
      }] },
      item.icon === undefined ? null : React.createElement(ctx.Registry.Icon, { name: item.icon, size: props.metrics.iconSize, color: iconLeaf })) : null,
      React.createElement(Text, {
        numberOfLines: 1,
        style: [props.list.label(state), { color: ctx.color(labelLeaf), flexGrow: 1 }]
      }, item.label),
      item.shortcut === undefined ? null : React.createElement(Text, {
        style: [props.list.label(state), { color: ctx.color(labelLeaf), marginStart: ctx.metric('Menu', 'itemGap') }]
      }, item.shortcut)));

  }


  /********************************************************************
  Menu component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function MenuComponent (props) {

    // Init the entries, the metrics, the shared list presentation and the collection
    const items = Utils.isArray(props.items) ? props.items : [];
    const open = props.open === true;
    const menuRef = React.useRef(null);
    // The seat mounts for every item of a menu that has any icon or is
    // selectable (the element tree stays the same under every template);
    // where `anatomy.menu_icon_seat` says `item` the seat draws only for an
    // item carrying an icon of its own
    const selectable = items.some(function (item) {
      return item.selected !== undefined;
    });
    const icons = items.some(function (item) {
      return item.icon !== undefined;
    });
    const iconsShared = ctx.enum('anatomy.menu_icon_seat') === 'shared';
    const metrics = {
      dividerSpace: ctx.metric('Menu', 'paddingBlock'),
      dividerWidth: ctx.metric('Menu', 'dividerWidth'),
      iconPlace: { marginEnd: ctx.metric('Menu', 'itemGap'), width: ctx.metric('Menu', 'iconSize') },
      iconSize: ctx.metric('Menu', 'iconSize'),
      markPlace: { marginEnd: ctx.metric('Menu', 'itemGap'), width: ctx.metric('Menu', 'markSize') },
      markSize: ctx.metric('Menu', 'markSize')
    };
    const list = ctx.listPresentation({
      dividerWidth: 0,
      itemHeight: ctx.metric('Menu', 'itemHeight'),
      level: ctx.metric('Menu', 'level'),
      mark: true,
      markRoom: 0,
      paddingBlock: ctx.metric('Menu', 'paddingBlock'),
      paddingInline: ctx.metric('Menu', 'paddingInline'),
      radius: ctx.metric('Menu', 'radius')
    });
    const collection = useMenuCollection({
      onRequestClose: props.onClose,
      rootRef: menuRef
    });

    // The surface: measured for placement, dismissed on outside press
    const positioned = useMenuPosition({
      menuRef: menuRef,
      menuAlignment: props.menuAlignment,
      spacing: ctx.metric('Menu', 'spacing'),
      x: props.x,
      y: props.y
    });
    React.useEffect(function () {
      if (open) {
        positioned.measure();
        // The reference opens with the focus on the first enabled item
        collection.focusItem('first', null);
      }
    }, [open, positioned.measure]);
    const dismiss = usePopoverDismiss({
      contentRef: menuRef,
      onRequestClose: props.onClose,
      open: open,
      rootRef: menuRef
    });

    // Arrows rove the enabled items; Escape and Tab close through the collection
    const onKeyDown = function (event) {
      const direction = DIRECTIONS[event.key];
      if (direction === undefined) {
        if (event.key !== 'Escape') {
          collection.containerProps.onKeyDown(event);
        }
        return;
      }
      if (typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      const focused = collection.state.items.find(function (entry) {
        return entry.ref.current === event.target;
      });
      collection.focusItem(direction, focused === undefined ? null : focused.ref);
    };

    // Render the surface: a container of items and separator entries
    const position = positioned.position || { left: Utils.isNumber(props.x) ? props.x : 0, top: Utils.isNumber(props.y) ? props.y : 0 };
    const surface = React.createElement(View, {
      ref: menuRef,
      accessibilityLabel: props.accessibilityLabel,
      onBlur: function (event) {
        dismiss.rootProps.onBlur(event);
        collection.containerProps.onBlur(event);
      },
      onKeyDown: onKeyDown,
      onMouseDown: dismiss.rootProps.onMouseDown,
      role: 'menu',
      tabIndex: -1,
      style: [list.container, {
        left: position.left,
        position: ctx.platform.isNative ? 'absolute' : 'fixed',
        top: position.top
      }],
      testID: props.testID
    }, items.map(function (item, index) {
      if (item.divider === true) {
        return React.createElement(View, {
          key: index,
          role: 'separator',
          style: {
            backgroundColor: ctx.color('menu_divider'),
            height: metrics.dividerWidth,
            marginVertical: metrics.dividerSpace
          }
        });
      }
      return React.createElement(MenuItem, {
        first: index === 0,
        icons: icons,
        iconsShared: iconsShared,
        item: item,
        key: index,
        list: list,
        metrics: metrics,
        selectable: selectable,
        onChoose: function (chosen) {
          if (typeof props.onChange === 'function') {
            props.onChange(chosen);
          }
          if (typeof props.onClose === 'function') {
            props.onClose();
          }
        },
        registerItem: collection.registerItem
      });
    }));

    // The surface renders through an overlay host where one is mounted
    const overlay = useOverlay({
      isOpen: open,
      onClose: props.onClose,
      render: function () {
        return surface;
      }
    });

    if (!open) {
      return null;
    }

    return overlay.hosted ? null : surface;

  }

  MenuComponent.displayName = 'Menu';

  return MenuComponent;

}

Menu.spec = SPEC;
