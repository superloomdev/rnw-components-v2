// Info: FormGroup public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'FormGroup',
  props: Object.freeze({
    legendText: { type: 'string', required: true, description: 'The legend text; it names the group through `aria-labelledby`.' },
    children: { type: 'node', required: false, description: 'The fields the group gathers; a disabled group disables them all.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the group and every control inside it, including a nested group that passes `disabled: false`.' },
    invalid: { type: 'boolean', required: false, description: 'Marks the group invalid (`aria-invalid`); it does not disable the fields.' },
    message: { type: 'boolean', required: false, description: 'Draws `messageText` under the fields and wires it by `aria-describedby`. Default `false`.' },
    messageText: { type: 'string', required: false, description: 'The message text, drawn when `message` is true.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'type.field_label', 'color.field_label', 'color.field_label_disabled',
    'type.body_compact_01', 'color.text_primary', 'font.family.sans', 'spacing.spacing_03'
  ]),
  colors: Object.freeze([])
});
