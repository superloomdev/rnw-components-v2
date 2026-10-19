// Info: RadioButtonGroup molecule. A fieldset: the legend, the items as
// RadioButton members in a horizontal row or a vertical stack, and one
// group-owned helper or error message. The `useRadioGroup` behavior owns
// the shared selection, the single roving tab stop and arrow/Home/End
// navigation by member value; each member composes the RadioButton
// molecule through its private composition props, so the member's
// drawing, press and Space handling stay the control's own.
//
// Behavior: `useRadioGroup` - value-keyed selection and navigation; a
// disabled group publishes the shared DisabledContext, so every member
// renders disabled even when the item itself says `disabled: false`.
//
// Accessibility: `radiogroup` role named by the legend's generated id
// (`aria-labelledby`); a shown message is wired by `aria-describedby`;
// `aria-disabled` and `aria-invalid` report the group's own state.

import SPEC from './spec.radio-button-group.js';


/********************************************************************
RadioButtonGroup factory.

@param {Object} ctx - Component context

@return {Function} - The RadioButtonGroup component
*********************************************************************/
export default function RadioButtonGroup (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { useA11yId, getA11yRelation, getA11yState, useRadioGroup, DisabledContext } = ctx.behaviors;


  /********************************************************************
  RadioButtonGroup component.

  @param {Object} props - See `api.radio-button-group.js`

  @return {Object} - React element
  *********************************************************************/
  function RadioButtonGroupComponent (props) {

    const items = Utils.isArray(props.items) ? props.items : [];
    const legendId = useA11yId('legend');
    const messageId = useA11yId('message');
    const disabled = props.disabled === true;
    const invalid = props.invalid === true && !disabled;
    const vertical = props.orientation === 'vertical';

    // The behavior owns the members' values, the shared selection and the
    // keyboard contract; it throws on a bad or duplicate member value
    const group = useRadioGroup({
      items: items,
      value: props.value,
      defaultValue: props.defaultValue,
      onChange: props.onChange,
      disabled: disabled
    });

    // Labels are strings, like the group's own legend
    for (const item of items) {
      if (!Utils.isString(item === null || item === undefined ? undefined : item.label)) {
        throw new TypeError('RadioButtonGroup: item ' + JSON.stringify(item === null || item === undefined ? undefined : item.value) + ' requires a string label');
      }
    }

    const messageGap = ctx.metric('RadioButtonGroup', 'messageGap');

    // The group's message: the error text and icon while invalid, else
    // the helper; the member rows never carry messages of their own
    const message = invalid && Utils.isString(props.invalidText)
      ? { text: props.invalidText, invalid: true }
      : !invalid && Utils.isString(props.helperText)
        ? { text: props.helperText, invalid: false }
        : null;

    // The source's message sits the spec's spacing below the items; a
    // vertical stack's per-item bottom margin already supplies it
    const messageTop = vertical && !Utils.isEmptyArray(items)
      ? Math.max(0, messageGap - ctx.metric('RadioButtonGroup', 'itemGapVertical'))
      : messageGap;

    return React.createElement(DisabledContext.Provider, { value: disabled },
      React.createElement(View, Object.assign({}, group.containerProps, {
        role: 'radiogroup',
        testID: props.testID
      },
      getA11yRelation({
        describedby: message !== null ? messageId : undefined,
        labelledby: legendId
      }),
      getA11yState({
        disabled: disabled ? true : undefined,
        invalid: props.invalid === true ? true : undefined
      })),
      // The legend names the group in the field label cells, one spacing
      // step above the items
      React.createElement(ctx.Registry.Text, {
        color: disabled ? 'field_label_disabled' : 'field_label',
        id: legendId,
        style: { marginBottom: ctx.metric('RadioButtonGroup', 'legendGap') },
        type: 'field_label'
      }, props.legendText),
      // The items row or column: horizontal shrink-wraps with its own
      // gap; vertical stacks members at the start edge, each carrying
      // the group's vertical gap as its bottom margin
      Utils.isEmptyArray(items) ? null : React.createElement(View, {
        style: vertical
          ? { alignItems: 'flex-start' }
          : { alignSelf: 'flex-start', columnGap: ctx.metric('RadioButtonGroup', 'itemGapHorizontal'), flexDirection: 'row' }
      },
      items.map(function (item, index) {
        const member = group.getItemProps(index);
        // The key keeps the value's type: number 0 and string "0" are
        // different members, and React's key stringify must not merge them
        const memberKey = typeof item.value + ':' + String(item.value);
        const radio = React.createElement(ctx.Registry.RadioButton, {
          key: memberKey,
          label: item.label,
          checked: member.checked,
          disabled: member.disabled,
          focusable: member.focusable,
          invalid: invalid,
          onChange: member.onChange,
          testID: Utils.isString(item.testID) ? item.testID : 'radio-group-' + typeof item.value + '-' + String(item.value),
          rootRef: member.rootRef,
          onGroupFocus: member.onGroupFocus,
          groupVertical: vertical
        });
        return vertical
          ? React.createElement(View, { key: memberKey, style: { marginBottom: ctx.metric('RadioButtonGroup', 'itemGapVertical') } }, radio)
          : radio;
      })),
      message === null ? null : React.createElement(View, {
        style: { alignItems: 'flex-end', flexDirection: 'row', marginTop: messageTop }
      },
      message.invalid ? React.createElement(View, {
        style: {
          marginEnd: ctx.metric('RadioButtonGroup', 'iconInsetEnd'),
          marginStart: ctx.metric('RadioButtonGroup', 'iconInsetStart')
        }
      }, React.createElement(ctx.Registry.Icon, { name: 'invalid', size: ctx.metric('RadioButtonGroup', 'iconSize'), color: 'selection_invalid_icon' })) : null,
      React.createElement(ctx.Registry.Text, {
        color: message.invalid ? 'field_message_invalid' : (disabled ? 'field_helper_disabled' : 'field_helper'),
        id: messageId,
        style: { marginStart: message.invalid ? ctx.metric('RadioButtonGroup', 'messageTextGap') : 0 },
        type: 'field_helper'
      }, message.text))));

  }

  RadioButtonGroupComponent.displayName = 'RadioButtonGroup';

  return RadioButtonGroupComponent;

}

RadioButtonGroup.spec = SPEC;
