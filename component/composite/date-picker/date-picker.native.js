// Info: The native half of the DatePicker composite. When the theme's
// `anatomy.date_picker_widget` enum says `system`, the picker keeps its
// drawn labels, fields and messages and seats the host-injected
// `adapters.DatePicker` (the OS date picker) in each field in place of the
// text input, with no calendar; any other enum value, or an absent
// adapter, draws the web half's calendar. An absent adapter under
// `system` reports `adapter_missing` and never throws.
//
// This file never reads the platform: the `date-picker.js` dispatcher
// picks this half for the native platform answer.

import DatePickerWeb from './date-picker.web.js';


/********************************************************************
DatePickerNative factory.

@param {Object} ctx - Component context

@return {Function} - The DatePicker component for the native platform answer
*********************************************************************/
export default function DatePickerNative (ctx) {

  const React = ctx.React;
  const Adapter = ctx.adapters.DatePicker;
  const Drawn = DatePickerWeb(ctx);
  const System = Adapter === undefined ? null : DatePickerWeb(ctx, { Adapter: Adapter });


  /********************************************************************
  DatePickerNative component.

  @param {Object} props - See `api.date-picker.js`

  @return {Object} - React element
  *********************************************************************/
  function DatePickerNativeComponent (props) {

    const system = ctx.enum('anatomy.date_picker_widget') === 'system';
    if (system && System === null) {
      ctx.diagnostic({ code: 'adapter_missing', adapter: 'DatePicker', component: 'DatePicker' });
    }
    return React.createElement(system && System !== null ? System : Drawn, props);

  }

  DatePickerNativeComponent.displayName = 'DatePickerNative';

  return DatePickerNativeComponent;

}
