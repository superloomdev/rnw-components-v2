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
  const { useTimedFlag } = ctx.behaviors;


  /********************************************************************
  CopyButton component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function CopyButtonComponent (props) {

    const timeout = props.feedbackTimeout || 2000;
    const feedback = useTimedFlag({ duration: timeout });
    const active = feedback.state.active === true;
    // The label and leave delay follow the feedback timer the way the
    // upstream CopyButton's does: `feedback` while it shows,
    // `iconDescription` at rest
    const label = active ? (props.feedback || 'Copied!') : props.iconDescription;

    return React.createElement(ctx.Registry.IconButton, {
      accessibilityLabel: props.iconDescription,
      align: props.align === undefined ? 'bottom' : props.align,
      disabled: props.disabled === true,
      fillLeaf: 'copy_button_container',
      fillHoverLeaf: 'copy_button_container_hover',
      fillActiveLeaf: 'copy_button_container_active',
      icon: 'copy',
      kind: 'ghost',
      label: label,
      leaveDelayMs: active === true ? timeout : undefined,
      onPress: function () {
        feedback.activate();
        props.onClick();
      },
      size: props.size === undefined ? 'md' : props.size,
      testID: props.testID
    });

  }

  CopyButtonComponent.displayName = 'CopyButton';

  return CopyButtonComponent;

}

CopyButton.spec = SPEC;
