// Info: OverflowMenu composite. A square icon button that opens a panel
// of `role="none"` option rows joined to it: the panel on the list
// container with the list shadow, `control.overflow_menu_width` wide,
// below the trigger (`direction: 'top'` above), start-aligned (`flipped`
// end-aligned), joined to the open trigger by the connector bar where the
// theme's `anatomy.overflow_menu_connector` says `shown`. Arrows rove the
// focus over enabled options, opening focuses the first; Escape, Tab,
// outside press and focus leaving close, the option's own press calling
// `onPress` then the close and refocusing the trigger. The trigger keeps
// its open fill while the panel shows.

import SPEC from './spec.overflow-menu.js';


/********************************************************************
OverflowMenu factory.

@param {Object} ctx - Component context

@return {Function} - The OverflowMenu component
*********************************************************************/
export default function OverflowMenu (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { useA11yId, useAnchoredPosition, useMenuCollection, useMenuPosition, useOverlay, usePopoverDismiss } = ctx.behaviors;

  const SIZES = Object.freeze(['xs', 'sm', 'md', 'lg']);
  const DIRECTIONS = Object.freeze({ ArrowDown: 'next', ArrowUp: 'previous' });


  /********************************************************************
  OverflowMenu component.

  @param {Object} props - See `api.overflow-menu.js`

  @return {Object} - React element
  *********************************************************************/
  function OverflowMenuComponent (props) {

    // Init the size, direction, alignment and open state: `open` seeds the
    // panel, never locks it - every close path dismisses it and a prop
    // change re-syncs, as upstream
    const size = Utils.inArray(SIZES, props.size) ? props.size : 'md';
    const direction = props.direction === 'top' ? 'top' : 'bottom';
    const flipped = props.flipped === true;
    const [open, setOpen] = React.useState(props.open === true);
    const openPropRef = React.useRef(props.open);
    React.useEffect(function () {
      if (props.open !== openPropRef.current) {
        openPropRef.current = props.open;
        setOpen(props.open === true);
      }
    }, [props.open]);
    // `onClose` fires once per open -> close cycle: Escape's keydown, the
    // blur it causes and an outside press all request the same close
    const openRef = React.useRef(open);
    openRef.current = open;
    const items = Utils.isArray(props.items) ? props.items : [];
    // A composing parent may shift the panel off the anchor edge by a
    // constant (the breadcrumb's menuOffset) and draw a custom trigger
    const menuOffset = Utils.isObject(props.menuOffset) ? props.menuOffset : null;
    const [triggerFocused, setTriggerFocused] = React.useState(false);
    const [triggerHovered, setTriggerHovered] = React.useState(false);
    const menuId = useA11yId('overflow-menu-panel');
    const containerRef = React.useRef(null);
    const panelRef = React.useRef(null);

    // The close: an Escape returns the focus to the trigger; every other
    // cause lets it proceed (Tab, outside press, a chosen option)
    const close = function (event) {
      if (!openRef.current) {
        return;
      }
      openRef.current = false;
      setOpen(false);
      if (typeof props.onClose === 'function') {
        props.onClose();
      }
      if (event !== undefined && event !== null && event.key === 'Escape' && containerRef.current !== null) {
        const trigger = containerRef.current.querySelector('button');
        if (trigger !== null) {
          trigger.focus();
        }
      }
    };
    const requestClose = function () {
      close();
      if (containerRef.current !== null) {
        const trigger = containerRef.current.querySelector('button');
        if (trigger !== null) {
          trigger.focus();
        }
      }
    };

    // The container is the panel's anchor: measured into the layer's own
    // space each time the panel opens (and on scroll and resize while it
    // is)
    const anchored = useAnchoredPosition({ anchor: containerRef, offset: 0, placement: direction, track: open });
    React.useEffect(function () {
      if (open) {
        anchored.measure();
      }
    }, [open, anchored.measure]);
    const anchor = anchored.anchor;

    // The panel's placement: the trigger edge it opens from, start-aligned
    // (flipped: end-aligned)
    const menuAlignment = direction === 'top' ? (flipped ? 'top-end' : 'top-start') : (flipped ? 'bottom-end' : 'bottom-start');
    const positioned = useMenuPosition({
      menuRef: panelRef,
      menuAlignment: menuAlignment,
      fit: false,
      spacing: ctx.metric('OverflowMenu', 'spacing'),
      active: open,
      x: anchor === null ? 0 : [anchor.x + (menuOffset === null ? 0 : menuOffset.left), anchor.x + anchor.width + (menuOffset === null ? 0 : menuOffset.left)],
      y: anchor === null ? 0 : [anchor.y, anchor.y + anchor.height + (menuOffset === null ? 0 : menuOffset.top)]
    });

    // The collection: arrows rove the enabled options, Escape and Tab
    // close, focus leaving closes; opening focuses the first enabled
    // option
    const collection = useMenuCollection({
      onRequestClose: function (event) {
        // Upstream OverflowMenu exempts the trigger from the focus-leave
        // close: focus moving to it leaves the panel open
        const next = event !== undefined && event !== null ? event.relatedTarget : null;
        if (next !== null && next !== undefined && containerRef.current !== null && containerRef.current.contains(next)) {
          return;
        }
        close(event);
      },
      rootRef: panelRef
    });
    React.useEffect(function () {
      if (open) {
        positioned.measure();
        if (panelRef.current !== null && !panelRef.current.contains(document.activeElement)) {
          collection.focusItem('first', null);
        }
      }
    }, [open, positioned.measure, collection.state.items]);
    // A composing parent's underline tracks the trigger's focus: the
    // View's onFocus prop does not reach the DOM, so native listeners do
    React.useEffect(function () {
      const node = containerRef.current;
      if (node === null || !Utils.isObject(props.focusUnderline)) {
        return undefined;
      }
      const onIn = function () {
        setTriggerFocused(true);
      };
      const onOut = function (event) {
        if (event.relatedTarget === null || event.relatedTarget === undefined || !node.contains(event.relatedTarget)) {
          setTriggerFocused(false);
        }
      };
      const onOver = function () {
        setTriggerHovered(true);
      };
      const onOut_ = function () {
        setTriggerHovered(false);
      };
      node.addEventListener('focusin', onIn);
      node.addEventListener('focusout', onOut);
      node.addEventListener('mouseover', onOver);
      node.addEventListener('mouseout', onOut_);
      return function () {
        node.removeEventListener('focusin', onIn);
        node.removeEventListener('focusout', onOut);
        node.removeEventListener('mouseover', onOver);
        node.removeEventListener('mouseout', onOut_);
      };
    }, [props.focusUnderline]);
    usePopoverDismiss({
      contentRef: panelRef,
      onRequestClose: close,
      open: open,
      rootRef: containerRef
    });

    // Arrows rove over the enabled options; Escape and Tab close through
    // the collection
    const onKeyDown = function (event) {
      const direction = DIRECTIONS[event.key];
      if (direction === undefined) {
        collection.containerProps.onKeyDown(event);
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

    // Render the container (the panel's anchor and its upstream mounting
    // block) and the trigger; the panel mounts once the anchor is measured
    const triggerFill = open === true ? 'overflow_menu_trigger_open' : undefined;
    const triggerSize = ctx.metric('IconButton', { xs: 'sizeXsmall', sm: 'sizeSmall', md: 'sizeMedium', lg: 'size' }[size]);
    const panel = open === true && anchor !== null ? React.createElement(View, {
      ref: panelRef,
      onLayout: positioned.measure,
      accessibilityLabel: props.accessibilityLabel,
      onBlur: collection.containerProps.onBlur,
      nativeID: menuId,
      onKeyDown: onKeyDown,
      role: 'menu',
      tabIndex: -1,
      style: [positioned.layerStyle, {
        backgroundColor: ctx.color('list_container'),
        boxShadow: ctx.token('shadow.list') !== null && ctx.token('shadow.list').boxShadow !== undefined ? ctx.token('shadow.list').boxShadow : undefined,
        width: ctx.metric('OverflowMenu', 'width')
      }]
    },
    // A composing parent may draw a caret above the panel (the
    // breadcrumb's menu): a border-built triangle on the top edge
    (Utils.isObject(props.caret) && direction === 'bottom') ? React.createElement(View, {
      'aria-hidden': 'true',
      style: {
        borderBottomColor: ctx.color(props.caret.colorLeaf),
        borderBottomWidth: props.caret.size,
        borderLeftColor: 'transparent',
        borderLeftWidth: props.caret.size,
        borderRightColor: 'transparent',
        borderRightWidth: props.caret.size,
        height: 0,
        left: props.caret.offsetX,
        position: 'absolute',
        top: -props.caret.size,
        width: 0
      }
    }) : null,
    React.createElement(View, {
      'aria-hidden': 'true',
      style: {
        backgroundColor: ctx.enum('anatomy.overflow_menu_connector') === 'shown' && props.connector !== false ? ctx.color('overflow_menu_trigger_open') : 'transparent',
        opacity: ctx.enum('anatomy.overflow_menu_connector') === 'shown' && props.connector !== false ? 1 : 0,
        bottom: direction === 'top' ? -ctx.metric('OverflowMenu', 'connectorSize') : undefined,
        height: ctx.metric('OverflowMenu', 'connectorSize'),
        left: flipped === true ? undefined : 0,
        position: 'absolute',
        right: flipped === true ? 0 : undefined,
        top: direction === 'top' ? undefined : -ctx.metric('OverflowMenu', 'connectorSize'),
        width: triggerSize
      }
    }),
    items.map(function (item, index) {
      return React.createElement(ctx.Registry.OverflowMenuItem, {
        danger: item.danger === true,
        disabled: item.disabled === true,
        divider: item.divider === true,
        href: item.href,
        index: index,
        key: index,
        label: item.label,
        size: size,
        onPress: item.onPress,
        onRequestClose: requestClose,
        registerItem: collection.registerItem
      });
    })) : null;

    const overlay = useOverlay({
      isOpen: panel !== null,
      name: 'OverflowMenu',
      onClose: close,
      render: function () {
        return panel;
      }
    });

    return React.createElement(View, {
      ref: containerRef,
      testID: props.testID,
      style: { alignSelf: 'flex-start', width: Utils.isNumber(props.triggerWidth) ? props.triggerWidth : triggerSize }
    },
    panel !== null && overlay.hosted !== true ? panel : null,
    React.createElement(ctx.Registry.IconButton, {
      'aria-controls': open ? menuId : undefined,
      'aria-expanded': open,
      'aria-haspopup': true,
      align: props.align,
      disabled: props.disabled === true,
      fillActiveLeaf: props.fillActiveLeaf !== undefined ? props.fillActiveLeaf : (open === true ? 'overflow_menu_trigger_open' : 'overflow_menu_trigger_hover'),
      fillHoverLeaf: props.fillHoverLeaf !== undefined ? props.fillHoverLeaf : (open === true ? 'overflow_menu_trigger_open' : 'overflow_menu_trigger_hover'),
      fillLeaf: props.fillLeaf !== undefined ? props.fillLeaf : triggerFill,
      focusRingLeaf: props.focusRingLeaf,
      height: props.triggerHeight,
      icon: Utils.isString(props.icon) ? props.icon : 'overflow_vertical',
      iconActiveLeaf: props.iconActiveLeaf,
      iconColor: Utils.isString(props.iconColor) ? props.iconColor : 'overflow_menu_icon',
      iconHoverLeaf: props.iconHoverLeaf,
      iconOffset: props.iconOffset,
      iconSize: Utils.isNumber(props.iconSize) ? props.iconSize : ctx.metric('OverflowMenu', 'iconSize'),
      kind: 'ghost',
      label: props.iconDescription === undefined ? 'Options' : props.iconDescription,
      onPress: function () {
        if (open) {
          close();
          return;
        }
        setOpen(true);
        if (typeof props.onOpen === 'function') {
          props.onOpen();
        }
      },
      size: size,
      width: props.triggerWidth
    }),
    // A composing parent's focus underline (the breadcrumb's overflow
    // trigger): a 1 px bar inside the box while the trigger holds focus
    Utils.isObject(props.focusUnderline) ? React.createElement(View, {
      'aria-hidden': 'true',
      dataSet: { part: 'focusUnderline' },
      style: {
        backgroundColor: ctx.color(triggerFocused ? props.focusUnderline.colorLeaf : Utils.isString(props.focusUnderline.hoverLeaf) ? props.focusUnderline.hoverLeaf : props.focusUnderline.colorLeaf),
        opacity: triggerFocused || triggerHovered ? 1 : 0,
        height: 1,
        left: props.focusUnderline.offsetStart,
        position: 'absolute',
        top: props.focusUnderline.offsetTop,
        width: props.focusUnderline.width
      }
    }) : null);

  }

  OverflowMenuComponent.displayName = 'OverflowMenu';

  return OverflowMenuComponent;

}

OverflowMenu.spec = SPEC;
