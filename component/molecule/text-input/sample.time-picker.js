// Info: TimePicker sample states for the showcase, the browser gates and
// the docs: a labelled time field with a period and a zone select, in the
// states the references draw.

// The row shrink-wraps its members; the showcase, the walker and the
// browser gates lay its states out in a frame of this width
export const FRAME = Object.freeze({ width: 320 });

const SELECTS = Object.freeze([
  Object.freeze({ accessibilityLabel: 'Period', testID: 'time-select-period', items: Object.freeze([
    Object.freeze({ value: 'AM', label: 'AM' }),
    Object.freeze({ value: 'PM', label: 'PM' })
  ]) }),
  Object.freeze({ accessibilityLabel: 'Time zone', testID: 'time-select-zone', items: Object.freeze([
    Object.freeze({ value: 'UTC', label: 'UTC' }),
    Object.freeze({ value: 'GMT', label: 'GMT' })
  ]) })
]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ label: 'Time', value: '12:00', selects: SELECTS }) }),
  Object.freeze({ label: 'invalid', props: Object.freeze({ label: 'Time', value: '12:00', invalid: true, invalidText: 'Enter a valid time', selects: SELECTS }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ label: 'Time', value: '12:00', disabled: true, selects: SELECTS }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ label: 'Time', value: '12:00', size: 'sm', selects: SELECTS }) }),
  Object.freeze({ label: 'large', props: Object.freeze({ label: 'Time', value: '12:00', size: 'lg', selects: SELECTS }) })
]);
