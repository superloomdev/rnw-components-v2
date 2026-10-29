// Info: Button molecule. A pressable root with the label and an optional
// trailing Icon; composes the `useButton` behavior for press, hover,
// focus, selected and disabled, and draws the theme's `feedback.press`
// choice through the context's press presentation. The kind names the role
// cells the theme fills for it (fill, label and border per state, and its
// elevation); the size picks a height metric.

import SPEC from './spec.js';


/********************************************************************
Button factory.

@param {Object} ctx - Component context

@return {Function} - The Button component
*********************************************************************/
export default function Button (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useButton } = ctx.behaviors;

  // Kinds that sit inline with text: they reserve no trailing icon slot,
  // set the icon after the label and take the ghost paddings
  const INLINE = Object.freeze(['ghost', 'danger_ghost']);
  const KINDS = Object.freeze(['primary', 'secondary', 'tertiary', 'ghost', 'danger', 'danger_tertiary', 'danger_ghost', 'tonal', 'elevated']);

  // Size -> height metric in the spec sheet
  const SIZES = Object.freeze({
    xs: 'heightXsmall',
    sm: 'heightSmall',
    md: 'heightMedium',
    lg: 'height',
    xl: 'heightXlarge',
    '2xl': 'height2xlarge'
  });

  // The press phase -> the border and elevation cell's state (they have no focus or selected cells)
  const PLAIN_PHASES = Object.freeze({ '': '', _hover: '_hover', _active: '_active', _focus: '', _disabled: '_disabled', _selected: '' });


  /********************************************************************
  Button component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function ButtonComponent (props) {
    const [faceSize, onFaceLayout] = props.pressFloor === true ? ctx.useFaceSize() : [null, undefined];

    // Init the behavior and its state
    const button = useButton(props);
    const state = button.state;

    // Init the kind and the size
    const kind = Utils.inArray(KINDS, props.kind) ? props.kind : 'primary';
    const inline = Utils.inArray(INLINE, kind);
    const height = ctx.metric('Button', SIZES[props.size] || 'height');
    // A composing parent may override the computed geometry (the combo
    // button's width window, the fluid set's ghost padding)
    const radius = ctx.metric('Button', 'radius');
    const borderWidth = ctx.metric('Button', 'borderWidth');

    // Read the theme's press presentation over the kind's fill cells; the label,
    // border and elevation follow the same state. A composing parent may
    // re-colour the fills and the label (the notification action's ghost
    // and tertiary-inverse maps) and point the border at another leaf
    const fillMap = props.fillLeaf !== undefined || props.fillHoverLeaf !== undefined || props.fillActiveLeaf !== undefined
      ? {
        '': props.fillLeaf !== undefined ? props.fillLeaf : 'button_' + kind + '_container',
        _hover: props.fillHoverLeaf !== undefined ? props.fillHoverLeaf : (props.fillLeaf !== undefined ? props.fillLeaf : 'button_' + kind + '_container_hover'),
        _active: props.fillActiveLeaf !== undefined ? props.fillActiveLeaf : (props.fillHoverLeaf !== undefined ? props.fillHoverLeaf : 'button_' + kind + '_container_active'),
        _focus: props.fillLeaf !== undefined ? props.fillLeaf : 'button_' + kind + '_container_focus',
        _disabled: 'button_' + kind + '_container_disabled',
        _selected: 'button_' + kind + '_container_selected'
      }
      : null;
    const press = ctx.pressPresentation(state, 'button_' + kind + '_container', fillMap !== null ? { colors: fillMap } : undefined);
    const contentLeaf = Utils.isString(props.labelLeaf)
      ? ((state.hovered === true || state.pressed === true) && Utils.isString(props.labelHoverLeaf) ? props.labelHoverLeaf : props.labelLeaf)
      : 'button_' + kind + '_label' + press.phase;
    const borderLeaf = Utils.isString(props.borderLeaf) ? props.borderLeaf : 'button_' + kind + '_border' + PLAIN_PHASES[press.phase];
    const shadow = ctx.token('shadow.button_' + kind + PLAIN_PHASES[press.phase]);

    // The focus ring; a ring drawn with the border gives way to a pressed border
    // the kind states apart from its rest border, and keeps the kind's elevation
    // beside it. The ring draws its own page-color line width (none in the
    // primary system, where the ring is a plain inset)
    const ring = Object.assign({}, ctx.focusRing('button', state, borderWidth));
    // A composing parent may point the ring at another leaf (the toggletip's
    // action sits on the inverse surface, whose ring is `focus_ring_inverse`)
    if (Utils.isString(props.focusRingLeaf)) {
      ring.outlineColor = ctx.color(props.focusRingLeaf);
      if (Utils.isString(ring.borderColor)) {
        ring.borderColor = ctx.color(props.focusRingLeaf);
      }
    }
    if (state.pressed && Utils.isString(ring.borderColor) && ctx.color('button_' + kind + '_border_active') !== ctx.color('button_' + kind + '_border')) {
      delete ring.borderColor;
    }
    if (Utils.isString(ring.boxShadow) && Utils.isObject(shadow) && Utils.isString(shadow.boxShadow)) {
      ring.boxShadow = ring.boxShadow + ', ' + shadow.boxShadow;
    }

    // The label is centered in the default height; in a taller button the
    // theme's `anatomy.button_label` keeps it where the default height puts
    // it (`top`) or centers it in the button's own height (`center`). The
    // same answer places it horizontally: `top` holds the label at the
    // start padding in a wider button (the primary's `space-between`
    // content), `center` centers it
    const labelStyle = ctx.typeStyle('button_label');
    const labelAtStart = ctx.enum('anatomy.button_label') === 'top';
    const labelBox = labelAtStart ? Math.min(height, ctx.metric('Button', 'height')) : height;
    const labelTop = (labelBox - labelStyle.lineHeight) / 2 - borderWidth;

    // Render the icon when one is named: at the trailing edge, or after the label for an inline kind.
    // A trailing icon needs its inset, its size and a gap before it; a kind whose end padding
    // reserves less than that widens to fit (one reference reserves a slot, the other does not)
    const iconSize = ctx.metric('Button', 'iconSize');
    const hasIcon = Utils.isString(props.icon);
    const slot = ctx.metric('Button', 'iconInset') + iconSize + ctx.metric('Button', 'iconGap') - borderWidth;
    const paddingStart = Utils.isNumber(props.paddingStart) ? props.paddingStart
      : inline ? ctx.metric('Button', 'ghostPaddingStart') : ctx.metric('Button', 'paddingStart');
    const paddingEnd = inline ? ctx.metric('Button', 'ghostPaddingEnd')
      : hasIcon ? Math.max(ctx.metric('Button', 'paddingEnd'), slot) : ctx.metric('Button', 'paddingEnd');
    const minWidth = Utils.isNumber(props.minWidth) ? props.minWidth : ctx.metric('Button', 'minWidth');
    const iconPlace = inline
      // An inline kind's icon centers itself on the row the way upstream's
      // static ghost icon does (align-self: center), not by a computed top
      ? { alignSelf: 'center', marginStart: ctx.metric('Button', 'iconGap') }
      : { end: ctx.metric('Button', 'iconInset'), position: 'absolute', top: labelTop + (labelStyle.lineHeight - iconSize) / 2 };
    // A composing parent turns the glyph (the menu button's chevron while
    // open); the turn transitions on the theme's fast-02 duration and
    // standard productive easing
    const rotation = Utils.isNumber(props.iconRotation) ? props.iconRotation : 0;
    if (rotation !== 0) {
      iconPlace.transform = [{ rotate: rotation + 'deg' }];
    }
    iconPlace.transitionDuration = ctx.token('motion.duration_fast_02') + 'ms';
    iconPlace.transitionProperty = 'transform';
    iconPlace.transitionTimingFunction = 'cubic-bezier(' + ctx.token('motion.easing_standard_productive').join(', ') + ')';
    const icon = hasIcon ? React.createElement(View, { style: iconPlace },
      React.createElement(ctx.Registry.Icon, { name: props.icon, size: iconSize, color: contentLeaf })) : null;
    // A transparent hit expander reaches the form-class floor while the
    // face keeps its size; a press on it bubbles to the Pressable
    const hit = props.pressFloor === true ? React.createElement(View, { 'aria-hidden': true, dataSet: { part: 'hit' }, style: ctx.pressTarget(faceSize) }) : null;

    // Render the root, the state layer, the label and the icon
    return React.createElement(Pressable, Object.assign({}, button.rootProps, {
      onLayout: onFaceLayout,
      ref: props.buttonRef,
      accessibilityLabel: Utils.isString(props.accessibilityLabel) ? props.accessibilityLabel : button.rootProps.accessibilityLabel,
      onMouseDown: props.onMouseDown,
      testID: props.testID,
      style: [
        props.fill === true ? {
          alignItems: 'flex-start',
          alignSelf: 'stretch',
          borderColor: ctx.color(borderLeaf),
          borderRadius: radius,
          borderWidth: borderWidth,
          flexBasis: 0,
          flexDirection: 'row',
          flexGrow: 1,
          // The theme places the label: the start padding under `top`,
          // centered under `center`
          justifyContent: labelAtStart ? 'flex-start' : 'center',
          maxWidth: props.maxWidth,
          // Fill is stretch-or-taller: the size's height cell is the floor
          minHeight: height,
          minWidth: minWidth,
          // The theme's ring is the only focus indicator
          outlineStyle: 'none',
          paddingBottom: Utils.isNumber(props.paddingBottom) ? props.paddingBottom : labelTop,
          paddingEnd: paddingEnd,
          paddingStart: paddingStart,
          paddingTop: Utils.isNumber(props.paddingTop) ? props.paddingTop : labelTop
        } : {
          alignItems: 'flex-start',
          alignSelf: 'flex-start',
          borderColor: ctx.color(borderLeaf),
          borderRadius: radius,
          borderWidth: borderWidth,
          flexDirection: 'row',
          // A minimum, not a fixed height: a scaled text run grows the button
          minHeight: height,
          // The theme places the label: the start padding under `top`,
          // centered under `center`
          justifyContent: labelAtStart ? 'flex-start' : 'center',
          maxWidth: props.maxWidth,
          minWidth: minWidth,
          // The theme's ring is the only focus indicator
          outlineStyle: 'none',
          paddingBottom: Utils.isNumber(props.paddingBottom) ? props.paddingBottom : labelTop,
          paddingEnd: paddingEnd,
          paddingStart: paddingStart,
          paddingTop: Utils.isNumber(props.paddingTop) ? props.paddingTop : labelTop
        },
        press.container,
        shadow,
        ring
      ]
    }),
    hit,
    // The state layer covers the border too, as a container fill does
    React.createElement(View, {
      style: [{ borderRadius: radius, bottom: -borderWidth, left: -borderWidth, position: 'absolute', right: -borderWidth, top: -borderWidth }, press.layer]
    }),
    React.createElement(Text, {
      numberOfLines: 1,
      style: [labelStyle, { color: ctx.color(contentLeaf) }]
    }, props.children),
    icon);

  }

  ButtonComponent.displayName = 'Button';

  return ButtonComponent;

}

Button.spec = SPEC;
