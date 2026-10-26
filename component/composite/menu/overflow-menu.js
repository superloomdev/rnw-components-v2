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
      spacing: ctx.metric('OverflowMenu', 'spacing'),
      x: anchor === null ? 0 : [anchor.x, anchor.x + anchor.width],
      y: anchor === null ? 0 : [anchor.y, anchor.y + anchor.height]
    });

    // The collection: arrows rove the enabled options, Escape and Tab
    // close, focus leaving closes; opening focuses the first enabled
    // option
    const collection = useMenuCollection({
      onRequestClose: close,
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
    React.createElement(View, {
      'aria-hidden': 'true',
      style: {
        backgroundColor: ctx.enum('anatomy.overflow_menu_connector') === 'shown' ? ctx.color('overflow_menu_trigger_open') : 'transparent',
        opacity: ctx.enum('anatomy.overflow_menu_connector') === 'shown' ? 1 : 0,
        bottom: direction === 'top' ? -ctx.metric('OverflowMenu', 'connectorSize') : undefined,
        height: ctx.metric('OverflowMenu', 'connectorSize'),
        left: flipped === true ? undefined : 0,
        position: 'absolute',
        right: flipped === true ? 0 : undefined,
        top: direction === 'top' ? undefined : -ctx.metric('OverflowMenu', 'connectorSize'),
        width: ctx.metric('IconButton', { xs: 'sizeXsmall', sm: 'sizeSmall', md: 'sizeMedium', lg: 'size' }[size])
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
      style: { alignSelf: 'flex-start' }
    },
    panel !== null && overlay.hosted !== true ? panel : null,
    React.createElement(ctx.Registry.IconButton, {
      'aria-controls': open ? menuId : undefined,
      'aria-expanded': open,
      'aria-haspopup': true,
      align: props.align,
      disabled: props.disabled === true,
      fillActiveLeaf: open === true ? 'overflow_menu_trigger_open' : 'overflow_menu_trigger_hover',
      fillHoverLeaf: open === true ? 'overflow_menu_trigger_open' : 'overflow_menu_trigger_hover',
      fillLeaf: triggerFill,
      icon: 'overflow_vertical',
      iconColor: 'overflow_menu_icon',
      iconSize: ctx.metric('OverflowMenu', 'iconSize'),
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
      size: size
    }));

  }

  OverflowMenuComponent.displayName = 'OverflowMenu';

  return OverflowMenuComponent;

}

OverflowMenu.spec = SPEC;
