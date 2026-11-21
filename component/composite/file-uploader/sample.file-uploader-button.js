// Info: FileUploaderButton sample states for the showcase, the browser
// gates and the docs: the three sizes, the secondary, tertiary and ghost
// kinds, and disabled.

const BASE = Object.freeze({ labelText: 'Add file', buttonKind: 'primary', size: 'md' });

export default Object.freeze([
  Object.freeze({ label: 'default', props: BASE }),
  Object.freeze({ label: 'sm', props: Object.freeze(Object.assign({}, BASE, { size: 'sm' })) }),
  Object.freeze({ label: 'lg', props: Object.freeze(Object.assign({}, BASE, { size: 'lg' })) }),
  Object.freeze({ label: 'secondary', props: Object.freeze(Object.assign({}, BASE, { buttonKind: 'secondary' })) }),
  Object.freeze({ label: 'tertiary', props: Object.freeze(Object.assign({}, BASE, { buttonKind: 'tertiary' })) }),
  Object.freeze({ label: 'ghost', props: Object.freeze(Object.assign({}, BASE, { buttonKind: 'ghost' })) }),
  Object.freeze({ label: 'disabled', props: Object.freeze(Object.assign({}, BASE, { disabled: true })) })
]);
