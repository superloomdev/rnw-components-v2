// Info: Filename sample states for the showcase, the browser gates and
// the docs: the close button, with the error glyph, disabled, the
// checkmark and the spinner. The state seat spans its frame and centers
// its glyphs, as the upstream state container does.

export const FRAME = Object.freeze({ width: 320 });

const BASE = Object.freeze({ name: 'report.pdf', status: 'edit', iconDescription: 'Delete file' });

export default Object.freeze([
  Object.freeze({ label: 'default', props: BASE }),
  Object.freeze({ label: 'invalid', props: Object.freeze(Object.assign({ invalid: true }, BASE)) }),
  Object.freeze({ label: 'disabled', props: Object.freeze(Object.assign({}, BASE, { disabled: true })) }),
  Object.freeze({ label: 'complete', props: Object.freeze(Object.assign({}, BASE, { status: 'complete' })) }),
  Object.freeze({ label: 'uploading', props: Object.freeze(Object.assign({}, BASE, { status: 'uploading' })) })
]);
