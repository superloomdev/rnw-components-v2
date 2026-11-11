// Info: DatePickerInput public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'DatePickerInput',
  props: Object.freeze({
    id: { type: 'string', required: false, description: 'The input element id the label names.' },
    labelText: { type: 'string', required: true, description: 'The label drawn above the field.' },
    hideLabel: { type: 'boolean', required: false, description: 'Skips the label element.' },
    placeholder: { type: 'string', required: false, description: 'The empty value hint, `mm/dd/yyyy` by default.' },
    size: { type: 'string', required: false, description: 'Field height on the field scale: `sm`, `md`, `lg`. Default `md`.' },
    helperText: { type: 'string', required: false, description: 'Message under the field while valid.' },
    invalid: { type: 'boolean', required: false, description: 'Marks the field invalid.' },
    invalidText: { type: 'string', required: false, description: 'Message under the field while invalid.' },
    warn: { type: 'boolean', required: false, description: 'Marks the field warned.' },
    warnText: { type: 'string', required: false, description: 'Message under the field while warned.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the field.' },
    'isReadOnly': { type: 'boolean', required: false, description: 'Read-only value; the picker never opens.' },
    pickerIndex: { type: 'number', required: false, description: 'The seat index the parent DatePicker assigns.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze([
    'control.field_height', 'control.field_icon_size', 'control.field_icon_inset', 'control.field_radius',
    'control.date_picker_input_width', 'control.date_picker_range_input_width',
    'control.date_picker_simple_input_width', 'control.date_picker_simple_input_width_message',
    'control.date_picker_short_input_width', 'type.date_picker_value',
    'icon.calendar', 'size.size_small', 'size.size_large'
  ]),
  colors: Object.freeze([])
});
