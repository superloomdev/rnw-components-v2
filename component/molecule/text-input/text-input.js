// Info: TextInput molecule. A field root holding the label, the frame (the
// input and, while invalid, an error Icon) and a helper or error message;
// composes the `useTextField` behavior for value, focus, hover, invalid and
// disabled, and draws the theme's `feedback.field` frame and `anatomy.label`
// placement through the context's field presentation.

import SPEC from './spec.js';


/********************************************************************
TextInput factory.

@param {Object} ctx - Component context

@return {Function} - The TextInput component
*********************************************************************/
export default function TextInput (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;
  const NativeTextInput = ctx.ReactNative.TextInput;
  const { useTextField } = ctx.behaviors;

  // Size -> height metric in the spec sheet
  const SIZES = Object.freeze({ sm: 'heightSmall', md: 'height', lg: 'heightLarge' });


  /********************************************************************
  TextInput component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function TextInputComponent (props) {

    // Init the behavior and its state; a disabled field is never invalid
    const field = useTextField(Object.assign({}, props, { invalid: props.invalid === true && props.disabled !== true }));
    const state = field.state;
    const invalid = state.invalid;
    const labelled = Utils.isString(props.label) && !Utils.isEmptyString(props.label);

    // Read the theme's field presentation
    const surface = Utils.isString(props.surface) ? props.surface
      : Utils.isString(ctx.config.FIELD_SURFACE) ? ctx.config.FIELD_SURFACE : 'background';
    const presentation = ctx.fieldPresentation({
      disabled: state.disabled,
      focused: state.focused,
      hovered: state.hovered,
      invalid: invalid,
      populated: state.populated
    }, {
      member: 'text_input',
      height: ctx.metric('TextInput', SIZES[props.size] || 'height'),
      radius: ctx.metric('TextInput', 'radius'),
      surface: surface,
      trailing: invalid
    });

    // Render the error icon while invalid
    const icon = invalid ? React.createElement(View, { style: { marginStart: presentation.iconGap } },
      React.createElement(ctx.Registry.Icon, { name: 'invalid', size: ctx.metric('TextInput', 'iconSize'), color: presentation.invalidIcon })) : null;

    // Render the message below: the error while invalid, else the helper
    const message = invalid && Utils.isString(props.invalidText) ? props.invalidText
      : Utils.isString(props.helperText) ? props.helperText : null;

    // Render the root, the label, the frame with the input, and the message
    return React.createElement(View, Object.assign({}, field.rootProps, { style: [{ position: 'relative' }, presentation.root] }),
      labelled ? React.createElement(Text, Object.assign({}, field.labelProps, { style: presentation.label }), props.label) : null,
      React.createElement(View, { style: presentation.frame },
        React.createElement(NativeTextInput, Object.assign({}, field.inputProps, {
          accessibilityLabel: props.accessibilityLabel,
          placeholder: presentation.placeholder || !labelled ? props.placeholder : undefined,
          placeholderTextColor: presentation.placeholderColor,
          testID: props.testID,
          style: [presentation.value, {
            alignSelf: 'stretch',
            backgroundColor: 'transparent',
            // While a floating label rests over the empty field the input draws nothing, as the label covers it
            opacity: labelled && !presentation.placeholder ? 0 : 1,
            // Grow from the input's own width, not from zero: native layout gives
            // `flex: 1` a zero basis, which collapses the field inside a container
            // that sizes to its content
            flexBasis: 'auto',
            flexGrow: 1,
            flexShrink: 1,
            minWidth: 0,
            outlineStyle: 'none'
          }]
        })),
        icon
      ),
      message === null ? null : React.createElement(Text, { style: presentation.message }, message)
    );

  }

  TextInputComponent.displayName = 'TextInput';

  return TextInputComponent;

}

TextInput.spec = SPEC;
