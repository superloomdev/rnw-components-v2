// Info: TimePickerSelect public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more. The member renders only inside a TimePicker - it reads its
// parent through the family's compound context and composes Registry.Select's
// compact form.

export default Object.freeze({
  name: 'TimePickerSelect',
  props: Object.freeze({
    items: { type: 'array', required: true, description: 'Options, each `{ value, label }`; `value` is unique.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name of the option list. Default `Choose time option`; the parent\'s label also names the trigger.' },
    value: { type: 'string', required: false, description: 'Controlled selected value. Absent: the member keeps its own selection, starting at `defaultValue`, else the first item\'s value.' },
    defaultValue: { type: 'string', required: false, description: 'Initial uncontrolled selection; applied once.' },
    onChange: { type: 'function', required: false, description: 'Called with the selected option\'s value.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `sm`, `md`, `lg`. Default: the parent TimePicker\'s size.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the member; a disabled parent disables it too.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the trigger.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze([
    'control.field_height', 'size.size_small', 'size.size_large',
    'spacing.spacing_05'
  ]),
  colors: Object.freeze(['background', 'layer_01', 'layer_02', 'layer_03'])
});
