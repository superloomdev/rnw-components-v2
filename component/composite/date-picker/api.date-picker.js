// Info: DatePicker public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'DatePicker',
  props: Object.freeze({
    datePickerType: { type: 'string', required: false, description: 'The picker form: `simple` (a typed field, no calendar), `single` or `range`. Default `single`.' },
    value: { type: 'string', required: false, description: 'Controlled date as `m/d/Y` text, or a `[start, end]` pair of texts for `range`.' },
    defaultValue: { type: 'string', required: false, description: 'Uncontrolled initial date, in the same shape as `value`.' },
    onChange: { type: 'function', required: false, description: 'Called with the new value (text, or the pair for `range`) when a day is pressed or typed text parses.' },
    open: { type: 'boolean', required: false, description: 'Controlled open state of the calendar.' },
    onOpenChange: { type: 'function', required: false, description: 'Called with the next open state.' },
    minDate: { type: 'string', required: false, description: 'Earliest selectable date, `m/d/Y`; earlier days draw disabled.' },
    maxDate: { type: 'string', required: false, description: 'Latest selectable date, `m/d/Y`; later days draw disabled.' },
    locale: { type: 'object', required: false, description: 'Calendar names: `{ months, weekdays, firstDayOfWeek }`; English with Sunday first by default.' },
    short: { type: 'boolean', required: false, description: 'Narrows a `simple` picker to the short input width.' },
    'isReadOnly': { type: 'boolean', required: false, description: 'Read-only inputs; the calendar never opens.' },
    disabled: { type: 'boolean', required: false, description: 'Disables every input.' },
    inputs: { type: 'array', required: false, description: 'The fields as data (DatePickerInput props each), used when no children are given.' },
    children: { type: 'node', required: false, description: 'The DatePickerInput fields - one, or two for `range`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze(['simple', 'single', 'range']),
  variants: Object.freeze(['simple', 'single', 'range']),
  tokens: Object.freeze([
    'color.date_picker_calendar_container', 'color.date_picker_label', 'color.date_picker_nav_icon',
    'color.date_picker_container_hover', 'color.date_picker_day_label_outside', 'color.date_picker_day_label_today',
    'color.date_picker_day_container_selected', 'color.date_picker_day_label_selected', 'color.date_picker_day_container_range',
    'color.date_picker_day_label_disabled', 'color.date_picker_day_focus', 'color.date_picker_day_focus_selected',
    'type.date_picker_month', 'type.date_picker_day', 'type.date_picker_day_today',
    'shadow.date_picker_calendar', 'stacking.dropdown', 'anatomy.date_picker_widget',
    'icon.chevron_left', 'icon.chevron_right'
  ]),
  colors: Object.freeze([])
});
