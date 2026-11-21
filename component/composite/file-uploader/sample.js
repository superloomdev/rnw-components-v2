// Info: FileUploader sample states for the showcase, the browser gates and
// the docs: the uploader at the three sizes, the tertiary button, and
// disabled. The list fills only by a pick, so FileUploaderItem's samples
// show its rows. The description wraps in the frame's width.

export const FRAME = Object.freeze({ width: 320 });

const BASE = Object.freeze({
  labelTitle: 'Upload files',
  labelDescription: 'Max file size is 500 MB. Only .jpg files are supported.',
  buttonLabel: 'Add file',
  buttonKind: 'primary',
  size: 'md',
  filenameStatus: 'edit'
});

export default Object.freeze([
  Object.freeze({ label: 'default', props: BASE }),
  Object.freeze({ label: 'sm', props: Object.freeze(Object.assign({}, BASE, { size: 'sm' })) }),
  Object.freeze({ label: 'lg', props: Object.freeze(Object.assign({}, BASE, { size: 'lg' })) }),
  Object.freeze({ label: 'tertiary', props: Object.freeze(Object.assign({}, BASE, { buttonKind: 'tertiary' })) }),
  Object.freeze({ label: 'disabled', props: Object.freeze(Object.assign({}, BASE, { disabled: true })) })
]);
