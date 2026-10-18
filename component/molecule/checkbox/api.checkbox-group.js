// Info: CheckboxGroup public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'CheckboxGroup',
  props: Object.freeze({
    legendText: { type: 'string', required: true, description: 'The legend text; it names the group through `aria-labelledby`.' },
    items: { type: 'array', required: false, description: 'The checkboxes, as `{ id, label, checked?, defaultChecked?, indeterminate?, disabled?, onChange?, testID? }`. `id` is a required unique string; `checked`, `indeterminate`, `disabled` and `onChange` have the Checkbox meanings; `defaultChecked` starts an uncontrolled item checked. An item\'s `testID` overrides the generated `checkbox-group-<id>`.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the group and every checkbox inside it, including an item passing `disabled: false`.' },
    invalid: { type: 'boolean', required: false, description: 'Marks the group invalid: every checkbox draws its error edge and `invalidText` shows below the group.' },
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
