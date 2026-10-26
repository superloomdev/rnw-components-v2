// Info: ToggletipButton molecule. The information icon button that toggles a
// Toggletip's bubble: the `information` icon at the icon size in the
// `toggletip_icon` cell, reading `toggletip_icon_active` while hovered or
// open, with the family's focus ring. Toggletip supplies `expanded`,
// `controls` and `onPress`. Composed only inside Toggletip.

import SPEC from './spec.toggletip-button.js';


/********************************************************************
ToggletipButton factory.

@param {Object} ctx - Component context

@return {Function} - The ToggletipButton component
*********************************************************************/
export default function ToggletipButton (ctx) {

  const React = ctx.React;
  const { Pressable, View } = ctx.ReactNative;
  const { useInteractionState } = ctx.behaviors;


  /********************************************************************
  ToggletipButton component.

  @param {Object} props - See `api.toggletip-button.js`

  @return {Object} - React element
  *********************************************************************/
  function ToggletipButtonComponent (props) {

    const press = useInteractionState({ onPress: props.onPress });
    const [faceSize, onLayout] = ctx.useFaceSize();
    const state = press.state;
    // The icon reads the active cell while hovered or while the bubble is
    // open (the upstream button keeps its active fill either way)
    const active = state.hovered === true || props.expanded === true;

    const ring = Object.assign({}, ctx.focusRing('button', state, 0));

    return React.createElement(View, null,
      React.createElement(View, {
        onLayout: onLayout,
        style: [{
          alignItems: 'center',
          height: ctx.token('size.icon_01'),
          justifyContent: 'center',
          width: ctx.token('size.icon_01')
        }, ring]
      },
      React.createElement(ctx.Registry.Icon, {
        color: active === true ? 'toggletip_icon_active' : 'toggletip_icon',
        name: 'info',
        size: ctx.token('size.icon_01')
      })),
      // The transparent press layer carries the target floor; the glyph
      // face stays at the theme's icon size beneath it
      React.createElement(Pressable, Object.assign({}, press.rootProps, {
        'aria-controls': props.controls,
        'aria-expanded': props.expanded === true,
        accessibilityLabel: props.label,
        role: 'button',
        style: ctx.pressTarget(faceSize),
        testID: props.testID
      })));

  }

  ToggletipButtonComponent.displayName = 'ToggletipButton';

  return ToggletipButtonComponent;

}

ToggletipButton.spec = SPEC;
