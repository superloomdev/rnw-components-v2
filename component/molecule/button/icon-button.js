// Info: IconButton molecule, the Button family's icon-only member. A square
// Pressable holding one icon token inside a compact Tooltip whose label is
// the button's accessible name. It reads the button family's role cells per
// kind, and the member icon cells where the standard and outlined kinds
// color their icon apart from a labelled button's; `selected` makes it a
// toggle (`aria-pressed`) and draws the kind's selected cells.

import SPEC from './spec.icon-button.js';


/********************************************************************
IconButton factory.

@param {Object} ctx - Component context

@return {Function} - The IconButton component
*********************************************************************/
export default function IconButton (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, View } = ctx.ReactNative;
  const { useButton } = ctx.behaviors;

  // The kinds the roster admits; the first names the default
  const KINDS = Object.freeze(['primary', 'secondary', 'ghost', 'tertiary']);

  // The kinds whose icon color is a member cell, not the kind's label cell
  const ICON_KINDS = Object.freeze(['ghost', 'tertiary']);

  // Size -> side metric in the spec sheet
  const SIZES = Object.freeze({ sm: 'sizeSmall', md: 'sizeMedium', lg: 'size' });

  // The press phase -> the border and elevation cell's state (they have no focus or selected cells)
  const PLAIN_PHASES = Object.freeze({ '': '', _hover: '_hover', _active: '_active', _focus: '', _disabled: '_disabled', _selected: '' });

  // The interactive target: the platforms' forty-four point minimum, wider
  // than the smallest sizes' face
  const TARGET = 44;


  /********************************************************************
  IconButton component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function IconButtonComponent (props) {

    // Init the behavior and its state; the label is the accessible name
    const button = useButton(Object.assign({}, props, { accessibilityLabel: props.label }));
    const state = button.state;

    // Init the kind, the square's side and the icon color's leaf
    const kind = Utils.inArray(KINDS, props.kind) ? props.kind : KINDS[0];
    const side = ctx.metric('IconButton', SIZES[props.size] || 'size');
    const borderWidth = ctx.metric('IconButton', 'borderWidth');
    const radius = ctx.metric('IconButton', 'radius');
    const press = ctx.pressPresentation(state, 'button_' + kind + '_container');
    const iconLeaf = Utils.inArray(ICON_KINDS, kind)
      ? 'icon_button_' + kind + '_icon' + press.phase
      : 'button_' + kind + '_label' + press.phase;
    const borderLeaf = 'button_' + kind + '_border' + PLAIN_PHASES[press.phase];
    const shadow = ctx.token('shadow.button_' + kind + PLAIN_PHASES[press.phase]);

    // The focus ring; a ring drawn with the border gives way to a pressed
    // border the kind states apart, and keeps the kind's elevation beside it.
    // A face whose resting cells draw neither fill nor border (the ghost
    // kind) draws the ring without the theme's separating line inside it
    const transparent = /^transparent$|,\s*0\.?0*\s*\)$/;
    const drawn = !transparent.test(ctx.color('button_' + kind + '_container')) || !transparent.test(ctx.color('button_' + kind + '_border'));
    const ring = Object.assign({}, ctx.focusRing('button', state, borderWidth, { gap: drawn }));
    if (state.pressed && Utils.isString(ring.borderColor) && ctx.color('button_' + kind + '_border_active') !== ctx.color('button_' + kind + '_border')) {
      delete ring.borderColor;
    }
    if (Utils.isString(ring.boxShadow) && Utils.isObject(shadow) && Utils.isString(shadow.boxShadow)) {
      ring.boxShadow = ring.boxShadow + ', ' + shadow.boxShadow;
    }

    // The button: the face carries the square and all of its paint where it
    // has always sat; the pressable is a transparent layer over its center,
    // no smaller than the platform's minimum interactive target
    const target = Math.max(TARGET, side);
    const inset = (target - side) / 2;
    const element = React.createElement(View, {
      style: { alignSelf: 'flex-start', height: side, width: side }
    },
    React.createElement(View, {
      testID: 'icon-button-face',
      style: [
        {
          alignItems: 'center',
          borderColor: ctx.color(borderLeaf),
          borderRadius: radius,
          borderWidth: borderWidth,
          height: side,
          justifyContent: 'center',
          width: side
        },
        press.container,
        shadow,
        ring
      ]
    },
    // The state layer covers the border too, as a container fill does
    React.createElement(View, {
      style: [{ borderRadius: radius, bottom: -borderWidth, left: -borderWidth, position: 'absolute', right: -borderWidth, top: -borderWidth }, press.layer]
    }),
    React.createElement(ctx.Registry.Icon, { name: props.icon, size: Utils.isNumber(props.iconSize) ? props.iconSize : ctx.metric('IconButton', 'iconSize'), color: Utils.isString(props.iconColor) ? props.iconColor : iconLeaf })),
    React.createElement(Pressable, Object.assign({}, button.rootProps, {
      'aria-pressed': props.selected !== undefined ? state.selected : undefined,
      testID: props.testID,
      style: {
        height: target,
        left: -inset,
        outlineStyle: 'none',
        position: 'absolute',
        top: -inset,
        width: target
      }
    })));

    // The compact tooltip names the button; a disabled one still shows it
    return React.createElement(ctx.Registry.Tooltip, {
      align: props.align,
      compact: true,
      label: props.label
    }, element);

  }

  IconButtonComponent.displayName = 'IconButton';

  return IconButtonComponent;

}

IconButton.spec = SPEC;
