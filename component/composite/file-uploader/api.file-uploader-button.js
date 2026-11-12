// Info: FileUploaderButton public API, as data. The docs generator and
// the accessibility tests read this; the component implements exactly this
// and nothing more.

export default Object.freeze({
  name: 'FileUploaderButton',
  props: Object.freeze({
    labelText: { type: 'string', required: false, description: 'The button\'s label. Default "Add file".' },
    buttonKind: { type: 'string', required: false, description: 'The Button kind. Default `primary`.' },
    size: { type: 'string', required: false, description: 'The Button size: `sm`, `md`, `lg`. Default `md`.' },
    accept: { type: 'array', required: false, description: 'File types and extensions the chooser offers.' },
    multiple: { type: 'boolean', required: false, description: 'Lets the chooser return several files.' },
    disableLabelChanges: { type: 'boolean', required: false, description: 'Keeps the label after a pick instead of naming the chosen files.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the button.' },
    onChange: { type: 'function', required: false, description: 'Called with the chosen entries (`{ name, size, type }`).' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name when the label alone does not say what the button picks.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the button.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze([]),
  colors: Object.freeze([])
});
