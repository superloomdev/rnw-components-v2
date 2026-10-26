// Info: MenuButton composite. A button that opens a Menu below or above
// it - the trailing chevron turning 180 while the menu is open over the
// theme's fast-02 transition. The menu takes the button's size and, for
// the plain `top`/`bottom` alignments, the trigger's measured width; the
// aligned placements take the menu's content width. Non-ghost triggers
// floor at the member's minimum width. Escape and a choice close and
// refocus the trigger.

import SPEC from './spec.menu-button.js';


/********************************************************************
MenuButton factory.

@param {Object} ctx - Component context

@return {Function} - The MenuButton component
*********************************************************************/
export default function MenuButton (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { useA11yId, useAnchoredPosition } = ctx.behaviors;

  const SIZES = Object.freeze(['xs', 'sm', 'md', 'lg']);
  const KINDS = Object.freeze(['primary', 'tertiary', 'ghost']);
  const ALIGNMENTS = Object.freeze(['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end']);


  /********************************************************************
  MenuButton component.

  @param {Object} props - See `api.menu-button.js`

  @return {Object} - React element
  *********************************************************************/
  function MenuButtonComponent (props) {

    // Init the size, kind, alignment and the open state (controlled when
    // `open` is given, the trigger's own toggle otherwise)
    const size = Utils.inArray(SIZES, props.size) ? props.size : 'lg';
    const kind = Utils.inArray(KINDS, props.kind) ? props.kind : 'primary';
    const alignment = Utils.inArray(ALIGNMENTS, props.menuAlignment) ? props.menuAlignment : 'bottom';
    const controlled = props.open !== undefined;
    const [toggled, setToggled] = React.useState(false);
    const open = controlled ? props.open === true : toggled;
    const menuId = useA11yId('menu-button-menu');
    const containerRef = React.useRef(null);
    const triggerRef = React.useRef(null);
    // The menu opens at the trigger's edge: the measured anchor is the
    // pressable itself, not the stretched container
    React.useEffect(function () {
      triggerRef.current = containerRef.current !== null && typeof containerRef.current.querySelector === 'function' ? containerRef.current.querySelector('button') : containerRef.current;
    }, []);

    // The trigger is the menu's anchor: measured into the layer's own
    // space each time the menu opens (and on scroll and resize while it is)
    const anchored = useAnchoredPosition({ anchor: triggerRef, offset: 0, placement: 'bottom', track: open });
    React.useEffect(function () {
      if (open) {
        anchored.measure();
      }
    }, [open, anchored.measure]);
    const anchor = anchored.anchor;

    const close = function () {
      if (!controlled) {
        setToggled(false);
      }
      if (typeof props.onClose === 'function') {
        props.onClose();
      }
    };

    // Render the container (the menu's anchor), the trigger and - once the
    // container is measured - the menu it opens
    return React.createElement(View, {
      'aria-owns': open ? menuId : undefined,
      ref: containerRef,
      testID: props.testID,
      style: { alignSelf: 'flex-start' }
    },
    open && anchor !== null ? React.createElement(ctx.Registry.Menu, {
      accessibilityLabel: props.accessibilityLabel,
      backgroundToken: props.menuBackgroundToken,
      border: props.menuBorder === true,
      id: menuId,
      items: props.items,
      menuAlignment: alignment,
      size: size,
      width: alignment === 'top' || alignment === 'bottom' ? anchor.width : undefined,
      x: [anchor.x, anchor.x + anchor.width],
      y: [anchor.y, anchor.y + anchor.height],
      onChange: function (entry) {
        if (typeof props.onChange === 'function') {
          props.onChange(entry);
        }
      },
      onClose: function () {
        close();
        const trigger = containerRef.current !== null ? containerRef.current.querySelector('button') : null;
        if (trigger !== null && typeof trigger.focus === 'function') {
          trigger.focus();
        }
      },
      open: true
    }) : null,
    React.createElement(ctx.Registry.Button, {
      'aria-controls': open ? menuId : undefined,
      'aria-expanded': open,
      'aria-haspopup': true,
      children: props.label,
      disabled: props.disabled === true,
      icon: 'chevron_down',
      iconRotation: open ? 180 : 0,
      kind: kind,
      minWidth: kind === 'ghost' ? undefined : ctx.metric('MenuButton', 'minWidth'),
      onPress: function () {
        if (controlled) {
          if (open && typeof props.onClose === 'function') {
            props.onClose();
          }
          return;
        }
        setToggled(function (previous) {
          return !previous;
        });
      },
      size: size
    }));

  }

  MenuButtonComponent.displayName = 'MenuButton';

  return MenuButtonComponent;

}

MenuButton.spec = SPEC;
