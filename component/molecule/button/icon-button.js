// Info: IconButton molecule, the Button family's icon-only member. A square
// Pressable holding one icon token inside a compact Tooltip whose label is
// the button's accessible name. It reads the button family's role cells per
// kind, and the member icon cells where the standard and outlined kinds
// color their icon apart from a labelled button's; `selected` makes it a
// toggle (`aria-pressed`), drawing the kind's selected cells when true and
// its unselected-toggle cells when false.

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
  const SIZES = Object.freeze({ xs: 'sizeXsmall', sm: 'sizeSmall', md: 'sizeMedium', lg: 'size' });

  // The press phase -> the border and elevation cell's state (they have no focus or selected cells)
  const PLAIN_PHASES = Object.freeze({ '': '', _hover: '_hover', _active: '_active', _focus: '', _disabled: '_disabled', _selected: '' });


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
    const containerPrefix = 'button_' + kind + '_container';
    // Composition props that name the face's fill leaves outright (a
    // composing parent's own cells - the overflow menu's open-trigger
    // fill, the copy button's pressed fill); every unset phase falls back
    // to the kind's cell
    const fillMap = props.fillLeaf !== undefined || props.fillHoverLeaf !== undefined || props.fillActiveLeaf !== undefined
      ? {
        '': props.fillLeaf !== undefined ? props.fillLeaf : containerPrefix,
        _hover: props.fillHoverLeaf !== undefined ? props.fillHoverLeaf : containerPrefix + '_hover',
        _active: props.fillActiveLeaf !== undefined ? props.fillActiveLeaf : (props.fillHoverLeaf !== undefined ? props.fillHoverLeaf : containerPrefix + '_active'),
        _focus: props.fillLeaf !== undefined ? props.fillLeaf : containerPrefix + '_focus',
        _disabled: containerPrefix + '_disabled',
        _selected: containerPrefix + '_selected'
      }
      : null;
    const press = ctx.pressPresentation(state, containerPrefix, fillMap !== null ? { colors: fillMap } : undefined);
    // A toggle's identity pair is its own: `selected` draws the kind's
    // selected cells, `selected === false` the unselected-toggle cells; any
    // other value is an ordinary button at the family cells. The toggle's
    // face keeps its paint through an interaction, as the selected face does
    const toggle = state.selected === true ? '_selected' : props.selected === false ? '_unselected' : null;
    const iconLeaf = toggle !== null && state.disabled !== true
      ? 'icon_button_' + kind + '_icon' + toggle
      : Utils.inArray(ICON_KINDS, kind)
        ? 'icon_button_' + kind + '_icon' + press.phase
        : 'button_' + kind + '_label' + press.phase;
    const borderLeaf = 'button_' + kind + '_border' + PLAIN_PHASES[press.phase];
    const shadow = ctx.token('shadow.button_' + kind + PLAIN_PHASES[press.phase]);

    // The focus ring; a ring drawn with the border gives way to a pressed
    // border the kind states apart, and keeps the kind's elevation beside it.
    // A face whose resting cells draw neither fill nor border (the ghost
    // kind paints no face by definition) draws the ring without the theme's
    // separating line inside it
    const drawn = kind !== 'ghost';
    const ring = Object.assign({}, ctx.focusRing('button', state, borderWidth, { gap: drawn }));
    if (state.pressed && Utils.isString(ring.borderColor) && ctx.color('button_' + kind + '_border_active') !== ctx.color('button_' + kind + '_border')) {
      delete ring.borderColor;
    }
    if (Utils.isString(ring.boxShadow) && Utils.isObject(shadow) && Utils.isString(shadow.boxShadow)) {
      ring.boxShadow = ring.boxShadow + ', ' + shadow.boxShadow;
    }

    // The toggle's resting container paint is the icon-button pair's own:
    // where the presentation's container carries the rest fill (the selected
    // phase, the resting phase, or every phase of a layered press mode), a
    // toggle reads its `_selected` or `_unselected` cell instead of the
    // family's; an interaction face a highlight mode paints stays the
    // family's, and a disabled control keeps its disabled cell
    const face = toggle !== null && state.disabled !== true &&
      (Utils.isEmptyString(press.phase) || press.phase === '_selected' || ctx.enum('feedback.press') !== 'highlight')
      ? Object.assign({}, press.container, { backgroundColor: ctx.color('icon_button_' + kind + '_container' + toggle) })
      : press.container;

    // The button: the face carries the square and all of its paint where it
    // has always sat; the pressable is a transparent layer over its center,
    // no smaller than the platform's minimum interactive target
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
        face,
        shadow,
        ring
      ]
    },
    // The state layer covers the border too, as a container fill does
    React.createElement(View, {
      style: [{ borderRadius: radius, bottom: -borderWidth, left: -borderWidth, position: 'absolute', right: -borderWidth, top: -borderWidth }, press.layer]
    }),
    // The glyph's wrapper turns by `iconRotation` degrees; the turn
    // transitions on the theme's fast-02 duration and standard productive
    // easing - transition keys a native platform ignores, so the glyph
    // turns without a transition there, as the press fills' do
    React.createElement(View, {
      style: {
        transform: [{ rotate: (Utils.isNumber(props.iconRotation) ? props.iconRotation : 0) + 'deg' }],
        transitionDuration: ctx.token('motion.duration_fast_02') + 'ms',
        transitionProperty: 'transform',
        transitionTimingFunction: 'cubic-bezier(' + ctx.token('motion.easing_standard_productive').join(', ') + ')'
      }
    },
    React.createElement(ctx.Registry.Icon, { name: props.icon, size: Utils.isNumber(props.iconSize) ? props.iconSize : ctx.metric('IconButton', 'iconSize'), color: Utils.isString(props.iconColor) ? props.iconColor : iconLeaf }))),
    React.createElement(Pressable, Object.assign({}, button.rootProps, {
      // A composing parent's trigger announcements (the combo button's menu)
      'aria-controls': props['aria-controls'],
      'aria-expanded': props['aria-expanded'],
      'aria-haspopup': props['aria-haspopup'],
      'aria-pressed': props.selected !== undefined ? state.selected : undefined,
      // A composing parent's mousedown rule (the combo button's trigger
      // suppresses the press focus)
      onMouseDown: props.onMouseDown,
      testID: props.testID,
      style: ctx.pressTarget({ height: side, width: side })
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
