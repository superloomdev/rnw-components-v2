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
  const INLINE = Object.freeze(['ghost', 'danger_ghost', 'quick_action']);
  const KINDS = Object.freeze(['primary', 'secondary', 'tertiary', 'ghost', 'danger', 'danger_tertiary', 'danger_ghost', 'tonal', 'elevated', 'quick_action']);

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

    // Init the behavior and its state
    const button = useButton(props);
    const state = button.state;

    // Init the kind and the size
    const kind = Utils.inArray(KINDS, props.kind) ? props.kind : 'primary';
    const inline = Utils.inArray(INLINE, kind);
    const height = ctx.metric('Button', SIZES[props.size] || 'height');
    // A composing parent may ask for the pill (half the height) or override
    // the computed geometry (the combo button's width window, the fluid
    // set's ghost padding, the chat button's icon-free end)
    const radius = props.pill === true ? height / 2 : ctx.metric('Button', 'radius');
    const borderWidth = ctx.metric('Button', 'borderWidth');

    // Read the theme's press presentation over the kind's fill cells; the label,
    // border and elevation follow the same state
    const press = ctx.pressPresentation(state, 'button_' + kind + '_container');
    const contentLeaf = 'button_' + kind + '_label' + press.phase;
    // The selected quick action's border is the primary's transparent line
    // over its selected fill: v7 carries no selected border cell
    const borderLeaf = press.phase === '_selected' && kind === 'quick_action'
      ? null
      : 'button_' + kind + '_border' + PLAIN_PHASES[press.phase];
    const borderColor = borderLeaf === null ? 'transparent' : ctx.color(borderLeaf);
    const shadow = ctx.token('shadow.button_' + kind + PLAIN_PHASES[press.phase]);
    // A selected quick action keeps answering the pointer: its hovered and
    // pressed fills win over its selected fill (the primary paints the
    // selected state through the same hover and active rules), while the
    // label, border and elevation keep the selected cells
    const paint = kind === 'quick_action' && press.phase === '_selected' && (state.hovered === true || state.pressed === true)
      ? ctx.pressPresentation(Object.assign({}, state, { selected: false }), 'button_' + kind + '_container')
      : press;

    // The focus ring; a ring drawn with the border gives way to a pressed border
    // the kind states apart from its rest border, and keeps the kind's elevation
    // beside it. The quick action's ring keeps painting through the press: the
    // primary's focus rule outranks its active rule. The ring draws its own
    // page-colour line width (none in the primary system, where the chat
    // button's ring is a plain inset)
    const ring = Object.assign({}, ctx.focusRing('button', state, borderWidth,
      kind === 'quick_action' ? { gapWidth: ctx.token('control.button_quick_action_focus_gap_width') } : undefined));
    if (state.pressed && kind !== 'quick_action' && Utils.isString(ring.borderColor) && ctx.color('button_' + kind + '_border_active') !== ctx.color('button_' + kind + '_border')) {
      delete ring.borderColor;
    }
    if (Utils.isString(ring.boxShadow) && Utils.isObject(shadow) && Utils.isString(shadow.boxShadow)) {
      ring.boxShadow = ring.boxShadow + ', ' + shadow.boxShadow;
    }

    // The label is centered in the default height; in a taller button the
    // theme's `anatomy.button_label` keeps it where the default height puts
    // it (`top`) or centers it in the button's own height (`center`)
    const labelStyle = ctx.typeStyle('button_label');
    const labelBox = ctx.enum('anatomy.button_label') === 'top' ? Math.min(height, ctx.metric('Button', 'height')) : height;
    const labelTop = (labelBox - labelStyle.lineHeight) / 2 - borderWidth;

    // Render the icon when one is named: at the trailing edge, or after the label for an inline kind.
    // A trailing icon needs its inset, its size and a gap before it; a kind whose end padding
    // reserves less than that widens to fit (one reference reserves a slot, the other does not)
    const iconSize = ctx.metric('Button', 'iconSize');
    const hasIcon = Utils.isString(props.icon);
    const slot = ctx.metric('Button', 'iconInset') + iconSize + ctx.metric('Button', 'iconGap') - borderWidth;
    const paddingStart = Utils.isNumber(props.paddingStart) ? props.paddingStart
      : inline ? ctx.metric('Button', 'ghostPaddingStart') : ctx.metric('Button', 'paddingStart');
    const paddingEnd = Utils.isNumber(props.paddingEnd) ? props.paddingEnd
      : inline ? ctx.metric('Button', 'ghostPaddingEnd')
        : hasIcon ? Math.max(ctx.metric('Button', 'paddingEnd'), slot) : ctx.metric('Button', 'paddingEnd');
    const minWidth = Utils.isNumber(props.minWidth) ? props.minWidth : ctx.metric('Button', 'minWidth');
    const iconPlace = inline
      ? { marginStart: ctx.metric('Button', 'iconGap'), marginTop: (labelStyle.lineHeight - iconSize) / 2 }
      : { end: ctx.metric('Button', 'iconInset'), position: 'absolute', top: labelTop + (labelStyle.lineHeight - iconSize) / 2 };
    const icon = hasIcon ? React.createElement(View, { style: iconPlace },
      React.createElement(ctx.Registry.Icon, { name: props.icon, size: iconSize, color: contentLeaf })) : null;

    // Render the root, the state layer, the label and the icon
    return React.createElement(Pressable, Object.assign({}, button.rootProps, {
      accessibilityLabel: Utils.isString(props.accessibilityLabel) ? props.accessibilityLabel : button.rootProps.accessibilityLabel,
      testID: props.testID,
      style: [
        props.fill === true ? {
          alignItems: 'flex-start',
          alignSelf: 'stretch',
          borderColor: borderColor,
          borderRadius: radius,
          borderWidth: borderWidth,
          flexBasis: 0,
          flexDirection: 'row',
          flexGrow: 1,
          // The label stays centered inside a minimum width unless the
          // caller asks for the start edge (the combo action's spacing)
          justifyContent: props.labelAlign === 'start' ? 'flex-start' : 'center',
          maxWidth: props.maxWidth,
          // Fill is stretch-or-taller: the size's height cell is the floor
          minHeight: height,
          minWidth: minWidth,
          // The theme's ring is the only focus indicator
          outlineStyle: 'none',
          paddingEnd: paddingEnd,
          paddingStart: paddingStart,
          paddingTop: labelTop
        } : {
          alignItems: 'flex-start',
          alignSelf: 'flex-start',
          borderColor: borderColor,
          borderRadius: radius,
          borderWidth: borderWidth,
          flexDirection: 'row',
          height: height,
          // The label stays centered inside a minimum width unless the
          // caller asks for the start edge (the combo action's spacing)
          justifyContent: props.labelAlign === 'start' ? 'flex-start' : 'center',
          maxWidth: props.maxWidth,
          minWidth: minWidth,
          // The theme's ring is the only focus indicator
          outlineStyle: 'none',
          paddingEnd: paddingEnd,
          paddingStart: paddingStart,
          paddingTop: labelTop
        },
        paint.container,
        shadow,
        ring
      ]
    }),
    // The state layer covers the border too, as a container fill does
    React.createElement(View, {
      style: [{ borderRadius: radius, bottom: -borderWidth, left: -borderWidth, position: 'absolute', right: -borderWidth, top: -borderWidth }, paint.layer]
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
