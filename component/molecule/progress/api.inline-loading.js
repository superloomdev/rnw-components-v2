// Info: InlineLoading public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'InlineLoading',
  props: Object.freeze({
    status: { type: 'string', required: false, description: 'One of `kinds`: `inactive` (no mark), `active` (the default, the small Loading), `finished` (the success mark; calls `onSuccess` after `successDelay`), `error` (the error mark).' },
    description: { type: 'string', required: false, description: 'The status text beside the mark; absent draws no text.' },
    iconDescription: { type: 'string', required: false, description: 'The mark\'s accessible name; the status word by default, "loading" while `active`.' },
    successDelay: { type: 'number', required: false, description: 'Milliseconds after `finished` before `onSuccess` fires. Default 1500, as upstream.' },
    onSuccess: { type: 'function', required: false, description: 'Called once when `status` is `finished`, `successDelay` after it arrives.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze(['inactive', 'active', 'finished', 'error']),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.inline_loading_gap',
    'size.size_small', 'size.icon_01',
    'type.inline_loading_label', 'font.family.sans',
    'color.inline_loading_label', 'color.inline_loading_success', 'color.inline_loading_error'
  ]),
  colors: Object.freeze([])
});
