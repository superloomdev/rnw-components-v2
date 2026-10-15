// Info: FormGroup molecule. The fieldset: a labelled group of related
// fields whose legend sits a spacing step above them. A disabled group
// publishes the shared DisabledContext so every registry control inside
// it - and inside a nested group that passes `disabled: false` - renders
// and behaves disabled.
//
// Behavior: `DisabledContext.Provider` - the group's disabled state is
// the inherited disabled of everything inside it.
//
// Accessibility: `group` role named by its legend (`aria-labelledby` to
// the legend's generated id); `aria-invalid` marks an invalid group; a
// shown message is wired by `aria-describedby`.

import SPEC from './spec.form-group.js';


/********************************************************************
FormGroup factory.

@param {Object} ctx - Component context

@return {Function} - The FormGroup component
*********************************************************************/
export default function FormGroup (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { useA11yId, getA11yRelation, getA11yState, DisabledContext } = ctx.behaviors;


  /********************************************************************
  FormGroup component.

  @param {Object} props - See `api.form-group.js`

  @return {Object} - React element
  *********************************************************************/
  function FormGroupComponent (props) {

    const legendId = useA11yId('legend');
    const messageId = useA11yId('message');
    const disabled = props.disabled === true;
    const message = props.message === true;

    return React.createElement(DisabledContext.Provider, { value: disabled },
      React.createElement(View, Object.assign({
        role: 'group',
        testID: props.testID
      },
      getA11yRelation({
        describedby: message ? messageId : undefined,
        labelledby: legendId
      }),
      getA11yState({
        disabled: disabled ? true : undefined,
        invalid: props.invalid === true ? true : undefined
      })),
      // The legend is a Text in the label cells, one spacing step above
      // the fields
      React.createElement(ctx.Registry.Text, {
        color: disabled ? 'field_label_disabled' : 'field_label',
        id: legendId,
        style: { marginBottom: ctx.metric('FormGroup', 'legendGap') },
        type: 'field_label'
      }, props.legendText),
      // Bare string or number children render through the registry Text:
      // raw text inside a View crashes a native render
      React.Children.toArray(props.children).map(function (child, index) {
        return Utils.isString(child) || Utils.isNumber(child)
          ? React.createElement(ctx.Registry.Text, { key: index, type: 'body_compact_01' }, child)
          : child;
      }),
      message
        ? React.createElement(ctx.Registry.Text, { id: messageId, type: 'body_compact_01' }, props.messageText)
        : null));

  }

  FormGroupComponent.displayName = 'FormGroup';

  return FormGroupComponent;

}

FormGroup.spec = SPEC;
