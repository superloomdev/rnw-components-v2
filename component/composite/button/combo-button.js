// Info: ComboButton composite. A primary action Button joined to an icon
// button that opens a Menu of further actions - the two seats separated by
// the border-width seam, the action bounded by the combo's width window
// less the seam and the trigger's side. While open the trigger's chevron
// turns over the fast-02 productive transition and the menu opens against
// the measured container: at its bottom edge, or ending at its top edge
// for a top alignment, with `-start`/`-end` aligning the surface's edges
// to the container's; for the plain alignments the surface takes the
// container's measured width.
//
// Behavior: the container's own open state and its measurement through
// `useAnchoredPosition`; the Menu owns the open surface's placement,
// dismissal and collection.
//
// Accessibility: the action keeps the Button's, the trigger names itself
// "Additional actions" and announces `haspopup`, `expanded` and the menu
// it `controls`; the container claims the menu while open.

import SPEC from './spec.js';


/********************************************************************
ComboButton factory.

@param {Object} ctx - Component context

@return {Function} - The ComboButton component
*********************************************************************/
export default function ComboButton (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { useAnchoredPosition, useA11yId } = ctx.behaviors;

  const SIZES = Object.freeze(['xs', 'sm', 'md', 'lg']);
  const ALIGNMENTS = Object.freeze(['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end']);

  // Combo size -> the trigger's IconButton size: the smallest combo shares
  // the small trigger (there is no extra-small icon button)
  const TRIGGER_SIZES = Object.freeze({ xs: 'sm', sm: 'sm', md: 'md', lg: 'lg' });

  // Trigger size -> its side's metric in the spec sheet
  const TRIGGER_SIDES = Object.freeze({ sm: 'triggerSmall', md: 'triggerMedium', lg: 'triggerLarge' });


  /********************************************************************
  ComboButton component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function ComboButtonComponent (props) {

    // Init the size, the alignment and the open state
    const size = Utils.inArray(SIZES, props.size) ? props.size : 'lg';
    const alignment = Utils.inArray(ALIGNMENTS, props.menuAlignment) ? props.menuAlignment : 'bottom';
    const disabled = props.disabled === true;
    const [open, setOpen] = React.useState(false);
    const menuId = useA11yId('combo-button-menu');

    // Init the theme's seam and the action's width window: the floor less
    // the seam and the trigger's side, the ceiling less the seam
    const seam = ctx.metric('ComboButton', 'seam');
    const triggerSize = TRIGGER_SIZES[size];
    const triggerSide = ctx.metric('ComboButton', TRIGGER_SIDES[triggerSize]);
    const actionMin = ctx.metric('ComboButton', 'minWidth') - seam - triggerSide;
    const actionMax = ctx.metric('ComboButton', 'maxWidth') - seam;

    // The container is the menu's anchor: measured into the layer's own
    // space each time the menu opens (and on scroll and resize while it is)
    const containerRef = React.useRef(null);
    const anchored = useAnchoredPosition({ anchor: containerRef, offset: 0, placement: 'bottom', track: open });
    React.useEffect(function () {
      if (open) {
        anchored.measure();
      }
    }, [open, anchored.measure]);
    const anchor = anchored.anchor;

    // Render the container, the action, the trigger and - once the
    // container is measured - the menu it opens
    return React.createElement(View, {
      'aria-owns': open ? menuId : undefined,
      ref: containerRef,
      testID: props.testID,
      style: { alignSelf: 'flex-start', columnGap: seam, flexDirection: 'row' }
    },
    React.createElement(ctx.Registry.Button, {
      children: props.label,
      disabled: disabled,
      kind: 'primary',
      // The action's label holds its start padding under the width window:
      // the theme's `anatomy.button_label` draws it, as the primary's
      // `space-between` content rule does
      maxWidth: actionMax,
      minWidth: actionMin,
      onPress: props.onPress,
      size: size
    }),
    React.createElement(ctx.Registry.IconButton, {
      'aria-controls': open ? menuId : undefined,
      'aria-expanded': open,
      'aria-haspopup': true,
      disabled: disabled,
      icon: 'chevron_down',
      iconRotation: open ? 180 : 0,
      kind: 'primary',
      label: 'Additional actions',
      // The primary's trigger keeps the press off its focus ring: its
      // mousedown handler prevents the default, so a pointer press draws
      // no focused border while the press itself still lands
      onMouseDown: function (event) {
        if (event && typeof event.preventDefault === 'function') {
          event.preventDefault();
        }
      },
      onPress: function () {
        setOpen(function (previous) {
          return !previous;
        });
      },
      size: triggerSize
    }),
    open && anchor !== null ? React.createElement(ctx.Registry.Menu, {
      accessibilityLabel: props.accessibilityLabel,
      id: menuId,
      items: props.items,
      menuAlignment: alignment,
      onChange: props.onChange,
      onClose: function () {
        setOpen(false);
      },
      open: true,
      // The plain alignments span the container edge to edge; the aligned
      // ones take their content width
      width: alignment === 'top' || alignment === 'bottom' ? anchor.width : undefined,
      x: [anchor.x, anchor.x + anchor.width],
      y: [anchor.y, anchor.y + anchor.height]
    }) : null);

  }

  ComboButtonComponent.displayName = 'ComboButton';

  return ComboButtonComponent;

}

ComboButton.spec = SPEC;
