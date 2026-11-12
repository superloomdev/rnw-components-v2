// Info: FileUploader public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'FileUploader',
  props: Object.freeze({
    labelTitle: { type: 'string', required: false, description: 'The title over the description.' },
    labelDescription: { type: 'string', required: false, description: 'The description over the button; it describes the button.' },
    buttonLabel: { type: 'string', required: false, description: 'The picking button\'s label.' },
    buttonKind: { type: 'string', required: false, description: 'The picking button\'s Button kind. Default `primary`.' },
    size: { type: 'string', required: false, description: 'The button and list size: `sm`, `md`, `lg`. Default `md`.' },
    filenameStatus: { type: 'string', required: false, description: 'Every listed file\'s status: `uploading`, `edit` or `complete`. Default `uploading`.' },
    iconDescription: { type: 'string', required: false, description: 'The listed files\' status accessible name.' },
    accept: { type: 'array', required: false, description: 'File types and extensions the chooser offers.' },
    maxFileSize: { type: 'number', required: false, description: 'Largest listed size in bytes; larger picks are reported, not listed.' },
    multiple: { type: 'boolean', required: false, description: 'Lets the chooser return several files and adds them to the list.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the button and draws the labels and files disabled.' },
    onAddFiles: { type: 'function', required: false, description: 'Called with `{ addedFiles }` after a pick, oversize entries marked `invalidFileType`.' },
    onChange: { type: 'function', required: false, description: 'Called with the listed files after each change.' },
    onDelete: { type: 'function', required: false, description: 'Called with the removed file\'s entry.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze([
    'color.file_uploader_title', 'color.file_uploader_description', 'color.file_uploader_label_disabled',
    'type.file_uploader_title', 'type.file_uploader_description'
  ]),
  colors: Object.freeze([])
});
