// Info: CopyButton molecule. A pressable icon square whose Tooltip
// confirms a copy for a moment after it is pressed: `iconDescription` at
// rest, `feedback` while the timer runs. The host's `onClick` does the
// clipboard write; the component never touches the clipboard.

import SPEC from './spec.js';


/********************************************************************
CopyButton factory.

@param {Object} ctx - Component context

@return {Function} - The CopyButton component
*********************************************************************/
export default function CopyButton (ctx) {

  const React = ctx.React;
  const { Pressable } = ctx.ReactNative;
  const { useTimedFlag, useInteractionState } = ctx.behaviors;


  /********************************************************************
  CopyButton component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function CopyButtonComponent (props) {

    const timeout = props.feedbackTimeout || 2000;
    const feedback = useTimedFlag({ duration: timeout });
    const interaction = useInteractionState({ disabled: props.disabled === true });

    const sizeName = props.size === 'sm' ? 'sizeSmall' : props.size === 'lg' ? 'sizeLarge' : 'sizeMedium';
    const size = ctx.metric('CopyButton', sizeName);
    const active = feedback.state.active === true;
    const label = active ? (props.feedback || 'Copied!') : props.iconDescription;
    const state = interaction.state;

    return React.createElement(ctx.Registry.Tooltip, {
      align: props.align,
      compact: true,
      label: label
    }, React.createElement(Pressable, {
      accessibilityLabel: props.iconDescription,
      accessibilityRole: 'button',
      onPress: function () {
        feedback.activate();
        props.onClick();
      },
      onPressIn: interaction.rootProps.onPressIn,
      onPressOut: interaction.rootProps.onPressOut,
      onHoverIn: interaction.rootProps.onHoverIn,
      onHoverOut: interaction.rootProps.onHoverOut,
      onFocus: interaction.rootProps.onFocus,
      onBlur: interaction.rootProps.onBlur,
      style: {
        alignItems: 'center',
        backgroundColor: state.pressed === true ? ctx.color('copy_button_container_active') : state.hovered === true ? ctx.color('copy_button_container_hover') : ctx.color('copy_button_container'),
        height: size,
        justifyContent: 'center',
        width: size
      }
    }, React.createElement(ctx.Registry.Icon, { color: 'icon_primary', name: 'copy', size: 16 })));
  }

  CopyButtonComponent.displayName = 'CopyButton';

  return CopyButtonComponent;

}

CopyButton.spec = SPEC;
