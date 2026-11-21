// Info: FileUploaderItem public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'FileUploaderItem',
  props: Object.freeze({
    name: { type: 'string', required: false, description: 'The file\'s name, one line cut with an ellipsis.' },
    status: { type: 'string', required: false, description: 'The status seat\'s state: `uploading`, `edit` or `complete`. Default `uploading`.' },
    iconDescription: { type: 'string', required: false, description: 'The status\'s accessible name.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `sm`, `md`; the large row when omitted.' },
    invalid: { type: 'boolean', required: false, description: 'Draws the error outline and, with `errorSubject`, the message.' },
    errorSubject: { type: 'string', required: false, description: 'The error message\'s title.' },
    errorBody: { type: 'string', required: false, description: 'The error message\'s text under the title.' },
    disabled: { type: 'boolean', required: false, description: 'Draws the name disabled and disables the close button.' },
    uuid: { type: 'string', required: false, description: 'The id `onDelete` reports; a generated one when omitted.' },
    onDelete: { type: 'function', required: false, description: 'Called with `(event, { uuid })` when the close button is pressed in the `edit` status.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md']),
  tokens: Object.freeze([
    'color.file_uploader_item_container', 'color.file_uploader_item_label', 'color.text_disabled',
    'color.file_uploader_item_outline_invalid', 'color.file_uploader_error_rule',
    'color.file_uploader_error_title', 'color.file_uploader_error_body',
    'type.file_uploader_item', 'type.file_uploader_error_title', 'type.file_uploader_error_body'
  ]),
  colors: Object.freeze([])
});
