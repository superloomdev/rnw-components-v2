// Info: TextInput molecule. A field root holding the label, the frame (the
// input and, while invalid, an error Icon) and a helper or error message;
// composes the `useTextField` behavior for value, focus, hover, invalid and
// disabled, and draws the theme's `feedback.field` frame and `anatomy.label`
// placement through the context's field presentation.

import SPEC from './spec.js';
import createFieldParts from './field-parts.js';


/********************************************************************
TextInput factory.

@param {Object} ctx - Component context

@return {Function} - The TextInput component
*********************************************************************/
export default function TextInput (ctx) {

  const Utils = ctx.Utils;
  const { useTextField } = ctx.behaviors;
  const { renderField } = createFieldParts(ctx);

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

    // Render the shared field anatomy with no supplied slots or styles
    return renderField({
      owner: 'TextInput',
      props: props,
      field: field,
      presentation: presentation
    });

  }

  TextInputComponent.displayName = 'TextInput';

  return TextInputComponent;

}

TextInput.spec = SPEC;
