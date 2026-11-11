// Info: DatePicker public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'DatePicker',
  props: Object.freeze({
    datePickerType: { type: 'string', required: false, description: 'The picker form: `simple`, `single` or `range`. Default `single`.' },
    value: { type: 'string', required: false, description: 'Controlled date (`m/d/Y`), or a start/end pair for `range`.' },
    short: { type: 'boolean', required: false, description: 'Narrows a `simple` picker to the short input width.' },
    'isReadOnly': { type: 'boolean', required: false, description: 'Read-only inputs; the calendar never opens.' },
    disabled: { type: 'boolean', required: false, description: 'Disables every input.' },
    children: { type: 'node', required: false, description: 'The DatePickerInput fields - one, or two for `range`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze(['simple', 'single', 'range']),
  variants: Object.freeze(['simple', 'single', 'range']),
  tokens: Object.freeze([]),
  colors: Object.freeze([])
});
