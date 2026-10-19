// Info: RadioButtonGroup public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'RadioButtonGroup',
  props: Object.freeze({
    legendText: { type: 'string', required: true, description: 'The legend text; it names the group through `aria-labelledby`.' },
    items: { type: 'array', required: false, description: 'The radio buttons, as `{ value, label, disabled?, testID? }`. `value` is a required unique string or finite number (zero is valid). An item\'s `testID` overrides the generated `radio-group-<type>-<value>` (so `radio-group-string-alpha` or `radio-group-number-0`).' },
    value: { type: 'any', required: false, description: 'Controlled selected item value. A value matching no item checks nothing; it does not invent a selection.' },
    defaultValue: { type: 'any', required: false, description: 'Initial selection for the uncontrolled group; absent starts with nothing checked.' },
    orientation: { type: 'string', required: false, description: '`horizontal` (default) lays the items in a row; `vertical` stacks them.' },
    onChange: { type: 'function', required: false, description: 'Called with the next selected value when a member is chosen by press, Space, Enter or arrow navigation.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the group and every radio inside it, including an item passing `disabled: false`.' },
    invalid: { type: 'boolean', required: false, description: 'Marks the group invalid: every radio draws its error ring and `invalidText` shows below the group.' },
    invalidText: { type: 'string', required: false, description: 'Error message shown below the group while `invalid`.' },
    helperText: { type: 'string', required: false, description: 'Message shown below the group while not `invalid`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the group root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'type.field_label', 'type.field_helper', 'font.family.sans',
    'color.field_label', 'color.field_label_disabled', 'color.field_helper',
    'color.field_helper_disabled', 'color.field_message_invalid',
    'color.selection_invalid_icon'
  ]),
  colors: Object.freeze([])
});
