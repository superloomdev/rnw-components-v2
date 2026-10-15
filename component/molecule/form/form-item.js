// Info: FormItem molecule. The column one field's parts stack in:
// children laid out in a column, aligned to the start edge, in the
// compact body type the upstream container sets on itself.
//
// Behavior: none - a container takes no input.
//
// Accessibility: a plain container; no role and no naming.

import SPEC from './spec.form-item.js';


/********************************************************************
FormItem factory.

@param {Object} ctx - Component context

@return {Function} - The FormItem component
*********************************************************************/
export default function FormItem (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;


  /********************************************************************
  FormItem component.

  @param {Object} props - See `api.form-item.js`

  @return {Object} - React element
  *********************************************************************/
  function FormItemComponent (props) {

    return React.createElement(View, {
      style: { alignItems: 'flex-start' },
      testID: props.testID
    },
    // Bare string or number children render through the registry Text in
    // the container's compact type: raw text inside a View crashes a
    // native render
    React.Children.toArray(props.children).map(function (child, index) {
      return Utils.isString(child) || Utils.isNumber(child)
        ? React.createElement(ctx.Registry.Text, { key: index, type: 'body_compact_01' }, child)
        : child;
    }));

  }

  FormItemComponent.displayName = 'FormItem';

  return FormItemComponent;

}

FormItem.spec = SPEC;
