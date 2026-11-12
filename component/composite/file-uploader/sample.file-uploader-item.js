// Info: FileUploaderItem sample states for the showcase, the browser
// gates and the docs: the three sizes in the `edit` status, the checkmark,
// the spinner, an invalid item with its message, and disabled. The row
// fills its frame up to its maximum width.

export const FRAME = Object.freeze({ width: 320 });

const BASE = Object.freeze({ name: 'report.pdf', status: 'edit', iconDescription: 'Delete file' });

export default Object.freeze([
  Object.freeze({ label: 'default', props: BASE }),
  Object.freeze({ label: 'md', props: Object.freeze(Object.assign({}, BASE, { size: 'md' })) }),
  Object.freeze({ label: 'sm', props: Object.freeze(Object.assign({}, BASE, { size: 'sm' })) }),
  Object.freeze({ label: 'complete', props: Object.freeze(Object.assign({}, BASE, { status: 'complete' })) }),
  Object.freeze({ label: 'uploading', props: Object.freeze(Object.assign({}, BASE, { status: 'uploading' })) }),
  Object.freeze({ label: 'invalid', props: Object.freeze(Object.assign({}, BASE, { invalid: true, errorSubject: 'File size exceeds limit', errorBody: '500 MB max file size. Select a new file and try again.' })) }),
  Object.freeze({ label: 'disabled', props: Object.freeze(Object.assign({}, BASE, { disabled: true })) })
]);
