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
  const { View } = ctx.ReactNative;
  const { useMenuCollection, useMenuPosition, useOverlay, usePopoverDismiss } = ctx.behaviors;

  // The keys that rove the focus
  const DIRECTIONS = Object.freeze({ ArrowDown: 'next', ArrowUp: 'previous', Home: 'first', End: 'last' });


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
    const selectable = items.some(function anySelectable (item) {
      return item.selected !== undefined || item.radioGroup !== undefined ||
        (item.group !== undefined && Utils.isArray(item.items) && item.items.some(anySelectable));
    });
    const icons = items.some(function (item) {
      return item.icon !== undefined;
    });
    const iconsShared = ctx.enum('anatomy.menu_icon_seat') === 'shared';
    const metrics = {
      dividerSpace: ctx.metric('Menu', 'dividerMargin'),
      dividerWidth: ctx.metric('Menu', 'dividerWidth'),
      iconPlace: { marginEnd: ctx.metric('Menu', 'itemGap'), width: ctx.metric('Menu', 'iconSize') },
      iconSize: ctx.metric('Menu', 'iconSize'),
      markPlace: { marginEnd: ctx.metric('Menu', 'itemGap'), width: ctx.metric('Menu', 'markSize') },
      markSize: ctx.metric('Menu', 'markSize')
    };
    const size = Utils.inArray(['xs', 'sm', 'md', 'lg'], props.size) ? props.size : 'sm';
    const itemHeights = { xs: 'itemHeightXsmall', sm: 'itemHeight', md: 'itemHeightMedium', lg: 'itemHeightLarge' };
    const list = ctx.listPresentation({
      dividerWidth: 0,
      itemHeight: ctx.metric('Menu', itemHeights[size]),
      level: ctx.metric('Menu', 'level'),
      mark: true,
      markRoom: 0,
      paddingBlock: ctx.metric('Menu', 'paddingBlock'),
      paddingInline: ctx.metric('Menu', 'paddingInline'),
      radius: ctx.metric('Menu', 'radius')
    });
    const collection = useMenuCollection({
      onRequestClose: props.onClose,
      rootRef: props.dismissRootRef !== undefined && props.dismissRootRef !== null ? props.dismissRootRef : menuRef
    });

    // The surface: measured for placement, dismissed on outside press
    const positioned = useMenuPosition({
      menuRef: menuRef,
      menuAlignment: props.menuAlignment,
      spacing: ctx.metric('Menu', 'spacing'),
      x: props.x,
      y: props.y,
      active: open
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
      rootRef: props.dismissRootRef !== undefined && props.dismissRootRef !== null ? props.dismissRootRef : menuRef
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

    // Render the surface: a container of items and separator entries, on the
    // layer style the positioner returns (`absolute` at host coordinates
    // inside an overlay host on every platform; unhosted `fixed` at viewport
    // coordinates on the web, `absolute` at window coordinates on a native
    // platform) and floored at the icon-menu minimum when any item
    // carries an icon
    const onChooseItem = function (chosen) {
      if (typeof props.onChange === 'function') {
        props.onChange(chosen);
      }
      if (typeof props.onClose === 'function') {
        props.onClose();
      }
    };

    const surface = React.createElement(View, {
      ref: menuRef,
      // Laying the surface out is what measures it: inside a host the
      // surface mounts a commit after open, when the open effect's call
      // would still find no node
      onLayout: positioned.measure,
      accessibilityLabel: props.accessibilityLabel,
      onBlur: function (event) {
        dismiss.rootProps.onBlur(event);
        collection.containerProps.onBlur(event);
      },
      nativeID: props.id,
      onKeyDown: onKeyDown,
      onMouseDown: dismiss.rootProps.onMouseDown,
      role: 'menu',
      tabIndex: -1,
      style: [list.container, positioned.layerStyle, {
        backgroundColor: props.backgroundToken === 'background' ? ctx.color('menu_container_background') : undefined,
        maxWidth: ctx.metric('Menu', 'maxWidth'),
        minWidth: icons ? ctx.metric('Menu', 'iconMinWidth') : ctx.metric('Menu', 'minWidth'),
        outlineColor: props.border === true ? ctx.color('menu_border') : undefined,
        outlineStyle: props.border === true ? 'solid' : undefined,
        outlineWidth: props.border === true ? ctx.metric('Menu', 'borderWidth') : undefined,
        // A composing parent fixes the surface's width (the combo button's
        // container); without one the surface takes its content width
        width: Utils.isNumber(props.width) ? props.width : undefined
      }],
      testID: props.testID
    }, items.map(function (item, index) {
      if (item.divider === true) {
        return React.createElement(ctx.Registry.MenuItemDivider, { key: index });
      }
      if (item.group !== undefined && Utils.isArray(item.items)) {
        return React.createElement(ctx.Registry.MenuItemGroup, { key: index, label: item.group },
          item.items.map(function (sub, subIndex) {
            return React.createElement(ctx.Registry.MenuItem, {
              icons: icons,
              iconsShared: iconsShared,
              item: sub,
              key: subIndex,
              list: list,
              seats: metrics,
              selectable: selectable,
              onChoose: onChooseItem,
              registerItem: collection.registerItem
            });
          }));
      }
      if (item.radioGroup !== undefined && Utils.isArray(item.items)) {
        return React.createElement(ctx.Registry.MenuItemRadioGroup, { key: index, label: item.radioGroup },
          item.items.map(function (sub, subIndex) {
            const subItem = Utils.isString(sub) ? { label: sub } : sub;
            return React.createElement(ctx.Registry.MenuItem, {
              icons: icons,
              iconsShared: iconsShared,
              item: Object.assign({ radio: true, selected: item.selectedItem !== undefined ? subItem.label === item.selectedItem : subItem.selected === true }, subItem),
              key: subIndex,
              list: list,
              seats: metrics,
              selectable: selectable || true,
              onChoose: onChooseItem,
              registerItem: collection.registerItem
            });
          }));
      }
      if (item.selected !== undefined) {
        return React.createElement(ctx.Registry.MenuItemSelectable, {
          icons: icons,
          iconsShared: iconsShared,
          item: item,
          key: index,
          list: list,
          seats: metrics,
          selectable: selectable,
          onChoose: onChooseItem,
          registerItem: collection.registerItem
        });
      }
      return React.createElement(ctx.Registry.MenuItem, {
        first: index === 0,
        icons: icons,
        iconsShared: iconsShared,
        item: item,
        key: index,
        list: list,
        seats: metrics,
        selectable: selectable,
        onChoose: onChooseItem,
        registerItem: collection.registerItem
      });
    }));

    // The surface renders through an overlay host where one is mounted
    const overlay = useOverlay({
      isOpen: open,
      name: 'Menu',
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
