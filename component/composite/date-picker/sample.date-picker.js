// Info: DatePicker sample states for the showcase, the browser gates and
// the docs: a closed single picker and the closed range pair. The open
// states arrive with the calendar; children come from the parent's own
// default fields.

export const FRAME = Object.freeze({ height: 420, width: 320 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ datePickerType: 'single' }) }),
  Object.freeze({ label: 'range', props: Object.freeze({ datePickerType: 'range' }) })
]);
