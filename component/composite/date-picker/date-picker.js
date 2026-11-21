// Info: DatePicker composite dispatcher. The web platform answer always
// draws the calendar (`date-picker.web.js`): no browser can draw the
// operating system's picker. The native answer renders
// `date-picker.native.js`, which seats the host's OS date picker adapter
// when the theme's `anatomy.date_picker_widget` enum says `system` and
// draws the calendar otherwise. This dispatcher is the only DatePicker
// file that reads the platform answer.

import SPEC from './spec.date-picker.js';
import DatePickerNative from './date-picker.native.js';
import DatePickerWeb from './date-picker.web.js';


/********************************************************************
DatePicker factory.

@param {Object} ctx - Component context

@return {Function} - The DatePicker component
*********************************************************************/
export default function DatePicker (ctx) {

  const React = ctx.React;
  const NativeComponent = DatePickerNative(ctx);
  const WebComponent = DatePickerWeb(ctx);


  /********************************************************************
  DatePicker component: dispatch to the platform's half.

  @param {Object} props - See `api.date-picker.js`

  @return {Object} - React element
  *********************************************************************/
  function DatePickerComponent (props) {

    return ctx.platform.split({
      web: React.createElement(WebComponent, props),
      native: React.createElement(NativeComponent, props)
    });

  }

  DatePickerComponent.displayName = 'DatePicker';

  return DatePickerComponent;

}

DatePicker.spec = SPEC;
