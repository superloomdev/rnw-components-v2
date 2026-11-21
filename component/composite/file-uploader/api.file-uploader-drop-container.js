// Info: FileUploaderDropContainer public API, as data. The docs generator
// and the accessibility tests read this; the component implements exactly
// this and nothing more.

export default Object.freeze({
  name: 'FileUploaderDropContainer',
  props: Object.freeze({
    labelText: { type: 'string', required: false, description: 'The area\'s label; it is also its accessible name. Default "Add file".' },
    accept: { type: 'array', required: false, description: 'File types and extensions accepted; others are marked `invalidFileType`. Empty accepts all.' },
    pattern: { type: 'string', required: false, description: 'The expression that finds a name\'s extension. Default `\\.[0-9a-z]+$`.' },
    maxFileSize: { type: 'number', required: false, description: 'Largest accepted size in bytes; larger files are marked `invalidFileType`.' },
    multiple: { type: 'boolean', required: false, description: 'Adds every picked or dropped file instead of the first.' },
    disabled: { type: 'boolean', required: false, description: 'Disables picking and dropping.' },
    onAddFiles: { type: 'function', required: false, description: 'Called with `(event, { addedFiles })` after a pick or a drop.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name when the label alone does not say what the area takes.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the area.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.file_uploader_drop_outline', 'color.file_uploader_drop_outline_disabled', 'color.file_uploader_drop_outline_active',
    'color.file_uploader_drop_label', 'color.file_uploader_drop_label_active', 'color.text_disabled', 'type.file_uploader_item'
  ]),
  colors: Object.freeze([])
});
