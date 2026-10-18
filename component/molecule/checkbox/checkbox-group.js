// Info: CheckboxGroup molecule. A fieldset: the legend, the items as
// Checkbox rows in a vertical stack and one group-owned helper or error
// message. Items carry their own checked meaning - controlled `checked`,
// uncontrolled `defaultChecked`, `indeterminate` and a per-item `onChange`
// - while the group owns the shared invalid presentation and never
// forwards member messages. A disabled group publishes the shared
// DisabledContext, so every checkbox inside renders disabled even when
// the item itself says `disabled: false`.
//
// Behavior: each item's checked state lives in its own `useCheckbox` -
// the member element is keyed by the stable item `id`, so a reorder keeps
// each item's state; a controlled item's `checked` always wins until the
// parent rerenders.
//
// Accessibility: `group` role named by the legend's generated id
// (`aria-labelledby`); a shown message is wired by `aria-describedby`;
// `aria-disabled` and `aria-invalid` report the group's own state.

import SPEC from './spec.checkbox-group.js';


/********************************************************************
CheckboxGroup factory.

@param {Object} ctx - Component context

@return {Function} - The CheckboxGroup component
*********************************************************************/
export default function CheckboxGroup (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { useA11yId, getA11yRelation, getA11yState, DisabledContext } = ctx.behaviors;


  /********************************************************************
  CheckboxGroup component.

  @param {Object} props - See `api.checkbox-group.js`

  @return {Object} - React element
  *********************************************************************/
  function CheckboxGroupComponent (props) {

    const items = Utils.isArray(props.items) ? props.items : [];

    // Item ids are the members' identity: each is a required non-empty
    // string, unique across the group, and becomes the React key
    const ids = new Set();
    for (const item of items) {
      const id = item === null || item === undefined ? undefined : item.id;
      if (!Utils.isString(id) || Utils.isEmptyString(id)) {
        throw new TypeError('CheckboxGroup: every item requires a non-empty string id');
      }
      if (ids.has(id)) {
        throw new TypeError('CheckboxGroup: duplicate item id ' + JSON.stringify(id));
      }
      ids.add(id);
      if (!Utils.isString(item.label)) {
        throw new TypeError('CheckboxGroup: item ' + JSON.stringify(id) + ' requires a string label');
      }
    }

    const legendId = useA11yId('legend');
    const messageId = useA11yId('message');
    const disabled = props.disabled === true;
    const invalid = props.invalid === true && !disabled;

    const rowGap = ctx.metric('CheckboxGroup', 'rowGap');
    const messageGap = ctx.metric('CheckboxGroup', 'messageGap');

    // The group's message: the error text and icon while invalid, else
    // the helper; the member rows never carry messages of their own
    const message = invalid && Utils.isString(props.invalidText)
      ? { text: props.invalidText, invalid: true }
      : !invalid && Utils.isString(props.helperText)
        ? { text: props.helperText, invalid: false }
        : null;

    // The source's adjacent block margins collapse, so the message's gap
    // shares the last row's bottom margin when rows precede it
    const messageTop = Utils.isEmptyArray(items) ? messageGap : Math.max(0, messageGap - rowGap);

    return React.createElement(DisabledContext.Provider, { value: disabled },
      React.createElement(View, Object.assign({
        role: 'group',
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
      // step above the rows
      React.createElement(ctx.Registry.Text, {
        color: disabled ? 'field_label_disabled' : 'field_label',
        id: legendId,
        style: { marginBottom: ctx.metric('CheckboxGroup', 'legendGap') },
        type: 'field_label'
      }, props.legendText),
      items.map(function (item, index) {
        // Each member answers its own state through `useCheckbox`, keyed by
        // the stable item `id` so a reorder keeps the item's answer
        return React.createElement(View, {
          key: item.id,
          style: {
            marginBottom: rowGap,
            marginTop: index === 0 ? -ctx.metric('CheckboxGroup', 'firstRowOverlap') : 0
          }
        },
        React.createElement(ctx.Registry.Checkbox, {
          label: item.label,
          checked: item.checked,
          defaultChecked: item.defaultChecked,
          indeterminate: item.indeterminate === true,
          disabled: item.disabled === true,
          invalid: invalid,
          onChange: item.onChange,
          testID: Utils.isString(item.testID) ? item.testID : 'checkbox-group-' + item.id
        }));
      }),
      message === null ? null : React.createElement(View, {
        style: { alignItems: 'flex-start', flexDirection: 'row', marginTop: messageTop }
      },
      message.invalid ? React.createElement(View, {
        style: {
          marginEnd: ctx.metric('CheckboxGroup', 'iconInsetEnd'),
          marginStart: ctx.metric('CheckboxGroup', 'iconInsetStart'),
          marginTop: ctx.metric('CheckboxGroup', 'iconInsetTop')
        }
      }, React.createElement(ctx.Registry.Icon, { name: 'invalid', size: ctx.metric('CheckboxGroup', 'iconSize'), color: 'selection_invalid_icon' })) : null,
      React.createElement(ctx.Registry.Text, {
        color: message.invalid ? 'field_message_invalid' : (disabled ? 'field_helper_disabled' : 'field_helper'),
        id: messageId,
        style: { marginStart: message.invalid ? ctx.metric('CheckboxGroup', 'messageTextGap') : 0 },
        type: 'field_helper'
      }, message.text))));

  }

  CheckboxGroupComponent.displayName = 'CheckboxGroup';

  return CheckboxGroupComponent;

}

CheckboxGroup.spec = SPEC;
