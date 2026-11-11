// Info: DatePicker composite. The date picker root: it publishes the
// compound context its DatePickerInputs read - the picker type (simple /
// single / range), `short`, `isReadOnly` and `disabled` - and lays its
// inputs out in a row. The calendar half arrives with the open overlay.
//
// Behavior: `open` is fixed false until the calendar lands; the inputs
// own their own text through `useTextField`.

import SPEC from './spec.date-picker.js';
import createDatePickerContext from './date-picker-context.js';


/********************************************************************
DatePicker factory.

@param {Object} ctx - Component context

@return {Function} - The DatePicker component
*********************************************************************/
export default function DatePicker (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const DatePickerContext = createDatePickerContext(ctx);


  /********************************************************************
  DatePicker component.

  @param {Object} props - See `api.date-picker.js`

  @return {Object} - React element
  *********************************************************************/
  function DatePickerComponent (props) {

    const type = Utils.isString(props.datePickerType) ? props.datePickerType : 'single';
    const context = Object.freeze({
      flags: Object.freeze({ short: props.short === true }),
      'isReadOnly': props['isReadOnly'] === true,
      type: type
    });

    // Hand each input its seat index: the first of a range pair carries
    // the end margin the two-pickup layout reads
    const inputs = React.Children.map(props.children, function (child, index) {
      return child === null ? null : React.cloneElement(child, { pickerIndex: index });
    });

    return React.createElement(DatePickerContext.Provider, { value: context },
      React.createElement(View, {
        dataSet: { part: 'root' },
        style: { alignSelf: 'flex-start', flexDirection: 'row' },
        testID: props.testID
      }, inputs));

  }

  DatePickerComponent.displayName = 'DatePicker';

  return DatePickerComponent;

}

DatePicker.spec = SPEC;
