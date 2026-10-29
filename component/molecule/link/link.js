// Info: Link molecule. A pressable run of text in the theme's link colors
// for rest, hover, press, visited and disabled, underlined while hovered,
// focused or pressed and always when inline, in three type sizes with an
// optional trailing icon.
//
// Behavior: `useInteractionState` answers hovered, focused and pressed and
// guards a disabled link's press.
//
// Accessibility: `role="link"` on the pressable target; `aria-disabled`
// while disabled; the accessible name is `accessibilityLabel` or the
// children. The face is split from the target the way IconButton's is: the
// transparent pressable covers the face and is no smaller than the
// platform's minimum target.

import SPEC from './spec.js';


/********************************************************************
Link factory.

@param {Object} ctx - Component context

@return {Function} - The Link component
*********************************************************************/
export default function Link (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useInteractionState } = ctx.behaviors;


  /********************************************************************
  Link component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function LinkComponent (props) {

    const disabled = props.disabled === true;
    const interaction = useInteractionState({ disabled: disabled, onPress: props.onPress });
    const state = interaction.state;

    const size = props.size === 'sm' || props.size === 'lg' ? props.size : 'md';

    // The color leaf: disabled, then the inverse pair a composing parent
    // asks for on a dark surface, then pressed, hovered, visited, rest
    const inverse = props.inverse === true;
    const leaf = disabled ? 'link_label_disabled'
      : inverse === true ? (state.pressed === true || state.hovered === true ? 'link_label_inverse_hover' : 'link_label_inverse')
        : state.pressed === true ? 'link_label_active'
          : state.hovered === true ? 'link_label_hover'
            : props.visited === true ? 'link_label_visited'
              : 'link_label';

    // Underline while inline, hovered, focused or pressed, unless disabled
    const underline = !disabled && (props.inline === true || state.hovered === true || state.focused === true || state.pressed === true);

    // The ring while focused (1 out) or pressed (at the edge)
    const ring = !disabled && (state.focused === true || state.pressed === true)
      ? {
        outlineColor: ctx.color(inverse === true ? 'focus_ring_inverse' : 'link_focus_ring'),
        outlineOffset: ctx.metric('Link', state.pressed === true ? 'pressOffset' : 'focusOffset'),
        outlineStyle: 'solid',
        outlineWidth: ctx.metric('Link', 'focusWidth')
      }
      : null;

    const icon = Utils.isString(props.icon) && !Utils.isEmptyString(props.icon)
      ? React.createElement(View, {
        style: { marginStart: ctx.metric('Link', 'iconGap') }
      }, React.createElement(ctx.Registry.Icon, {
        name: props.icon,
        size: ctx.metric('Link', size === 'lg' ? 'iconSizeLarge' : 'iconSize'),
        glyphSize: ctx.metric('Link', 'iconSize'),
        color: leaf
      }))
      : null;

    // The measured face size grows the transparent pressable to the target
    // floor, centered on the face; before the first layout it covers the face
    const [faceSize, onLayout] = ctx.useFaceSize();

    return React.createElement(View, {
      style: { alignSelf: 'flex-start', position: 'relative' }
    },
    React.createElement(View, {
      onLayout: onLayout,
      style: [{ alignItems: 'center', flexDirection: 'row', minWidth: Utils.isNumber(props.minWidth) ? props.minWidth : undefined }, ring]
    },
    React.createElement(Text, {
      style: [ctx.typeStyle(size === 'sm' ? 'link_label_small' : size === 'lg' ? 'link_label_large' : 'link_label'), {
        color: ctx.color(leaf),
        textDecorationLine: underline ? 'underline' : 'none'
      }]
    }, props.children), icon),
    React.createElement(Pressable, Object.assign({}, interaction.rootProps, {
      role: 'link',
      href: disabled ? undefined : props.href,
      disabled: disabled,
      'aria-disabled': disabled ? true : undefined,
      testID: props.testID,
      accessibilityLabel: props.accessibilityLabel !== undefined ? props.accessibilityLabel : props.children,
      style: ctx.pressTarget(faceSize)
    })));

  }

  LinkComponent.displayName = 'Link';

  return LinkComponent;

}

Link.spec = SPEC;
