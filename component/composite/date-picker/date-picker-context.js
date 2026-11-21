// Info: the context a DatePicker provides its DatePickerInputs: the picker
// type, the shared flags and the open state the calendar handoff adds to.
// Module-level so every factory shares the one React context instance.
let datePickerContext = null;

export default function createDatePickerContext (ctx) {
  if (datePickerContext === null) {
    datePickerContext = ctx.React.createContext({ flags: Object.freeze({}), isReadOnly: false, type: 'single' });
  }
  return datePickerContext;
}
