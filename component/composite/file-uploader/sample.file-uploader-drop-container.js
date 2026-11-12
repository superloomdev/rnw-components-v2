// Info: FileUploaderDropContainer sample states for the showcase, the
// browser gates and the docs: the area and the disabled area. It fills its
// frame up to its maximum width.

export const FRAME = Object.freeze({ width: 320 });

const BASE = Object.freeze({ labelText: 'Drag and drop files here or click to upload' });

export default Object.freeze([
  Object.freeze({ label: 'default', props: BASE }),
  Object.freeze({ label: 'disabled', props: Object.freeze(Object.assign({ disabled: true }, BASE)) })
]);
