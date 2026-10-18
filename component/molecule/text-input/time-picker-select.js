// Info: TimePickerSelect molecule, the text-input family's time-option
// member. One compact select in the parent TimePicker's row - the
// field-sized option trigger the primary draws as a native select. It
// renders only inside a TimePicker: the family's compound context carries
// the parent's size and disabled state, the trigger keeps its own
// accessible name, and reading the context outside the parent fails
// loudly.
//
// Behavior: `useControllableState` owns the selection (controlled
// `value` wins; uncontrolled starts at `defaultValue`, else the first
// item's value, as a native select does); Registry.Select owns the
// trigger and the list.

import SPEC from './spec.time-picker-select.js';


/********************************************************************
TimePickerSelect factory.

@param {Object} ctx - Component context

@return {Function} - The TimePickerSelect component
*********************************************************************/
export default function TimePickerSelect (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { getCompoundContext, useControllableState } = ctx.behaviors;

  // The same named context the parent publishes on this behavior system
  const Compound = getCompoundContext('TimePicker');


  /********************************************************************
  TimePickerSelect component.

  @param {Object} props - See `api.time-picker-select.js`

  @return {Object} - React element
  *********************************************************************/
  function TimePickerSelectComponent (props) {

    // Reading the parent throws when the member renders alone
    const parent = Compound.useContext();

    const items = Utils.isArray(props.items) ? props.items : [];
    const pair = useControllableState({
      value: props.value,
      // Uncontrolled starts at the first item, as a native select does
      defaultValue: props.defaultValue !== undefined ? props.defaultValue
        : !Utils.isEmptyArray(items) ? items[0].value : undefined,
      onChange: props.onChange
    });

    return React.createElement(ctx.Registry.Select, {
      accessibilityLabel: Utils.isString(props.accessibilityLabel) ? props.accessibilityLabel : 'Choose time option',
      compact: true,
      disabled: props.disabled === true || parent.disabled === true,
      items: items,
      onChange: pair[1],
      // An explicit size wins over the inherited one, including `md`
      size: props.size === 'sm' || props.size === 'md' || props.size === 'lg' ? props.size : parent.size,
      testID: props.testID,
      value: pair[0]
    });

  }

  TimePickerSelectComponent.displayName = 'TimePickerSelect';

  return TimePickerSelectComponent;

}

TimePickerSelect.spec = SPEC;
