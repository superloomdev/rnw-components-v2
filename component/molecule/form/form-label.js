// Info: FormLabel molecule. The label a field's `aria-labelledby` points
// at: the theme's field label type and color, disabled on request, and no
// margin - the gap above a field belongs to the control, not the label.
//
// Behavior: none - a label takes no input.
//
// Accessibility: the text carries the caller's `id`, so the control it
// labels can name itself by it.

import SPEC from './spec.form-label.js';


/********************************************************************
FormLabel factory.

@param {Object} ctx - Component context

@return {Function} - The FormLabel component
*********************************************************************/
export default function FormLabel (ctx) {

  const React = ctx.React;


  /********************************************************************
  FormLabel component.

  @param {Object} props - See `api.form-label.js`

  @return {Object} - React element
  *********************************************************************/
  function FormLabelComponent (props) {

    return React.createElement(ctx.Registry.Text, {
      color: props.disabled === true ? 'field_label_disabled' : 'field_label',
      id: props.id,
      testID: props.testID,
      type: 'field_label'
    }, props.children);

  }

  FormLabelComponent.displayName = 'FormLabel';

  return FormLabelComponent;

}

FormLabel.spec = SPEC;
