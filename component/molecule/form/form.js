// Info: Form molecule. The named container a set of fields groups into:
// a plain View that answers the host's `form` role only when it carries a
// label, as the role only exists with an accessible name.
//
// Behavior: none - a container takes no input.
//
// Accessibility: `form` role and its label when `accessibilityLabel` is
// set; a plain container otherwise.

import SPEC from './spec.js';


/********************************************************************
Form factory.

@param {Object} ctx - Component context

@return {Function} - The Form component
*********************************************************************/
export default function Form (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;


  /********************************************************************
  Form component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function FormComponent (props) {

    // The `form` role exists only with its accessible name; `role`, not
    // `accessibilityRole`, carries an ARIA name on every platform
    const named = Utils.isString(props.accessibilityLabel) && !Utils.isEmptyString(props.accessibilityLabel);

    return React.createElement(View, {
      accessibilityLabel: named ? props.accessibilityLabel : undefined,
      role: named ? 'form' : undefined,
      testID: props.testID
    },
    // Bare string or number children render through the registry Text in
    // the form family's compact type: raw text inside a View crashes a
    // native render
    React.Children.toArray(props.children).map(function (child, index) {
      return Utils.isString(child) || Utils.isNumber(child)
        ? React.createElement(ctx.Registry.Text, { key: index, type: 'body_compact_01' }, child)
        : child;
    }));

  }

  FormComponent.displayName = 'Form';

  return FormComponent;

}

Form.spec = SPEC;
