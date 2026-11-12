// Info: Filename public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'Filename',
  props: Object.freeze({
    name: { type: 'string', required: false, description: 'The file\'s name; it completes the close button\'s accessible name.' },
    status: { type: 'string', required: false, description: 'One of `kinds`: `uploading` (a small spinner), `edit` (the close button) or `complete` (a checkmark). Default `uploading`.' },
    iconDescription: { type: 'string', required: false, description: 'The status\'s accessible name. Default "Uploading file".' },
    invalid: { type: 'boolean', required: false, description: 'Draws the error glyph before the close button.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the close button.' },
    onPress: { type: 'function', required: false, description: 'Called when the close button is pressed (press, Enter, Space).' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the close button.' }
  }),
  kinds: Object.freeze(['uploading', 'edit', 'complete']),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.file_uploader_close_icon', 'color.file_uploader_close_icon_disabled', 'color.file_uploader_invalid_icon',
    'color.file_uploader_complete_icon', 'icon.close', 'icon.warning_filled', 'icon.checkmark_filled'
  ]),
  colors: Object.freeze([])
});
