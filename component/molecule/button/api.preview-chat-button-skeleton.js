// Info: preview__ChatButtonSkeleton public API, as data. The docs
// generator and the accessibility tests read this; the component
// implements exactly this and nothing more.

export default Object.freeze({
  name: 'preview__ChatButtonSkeleton',
  props: Object.freeze({
    size: { type: 'string', required: false, description: 'One of `variants`: `sm`, `md`, `lg`. Default `lg`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the placeholder\'s root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze([
    'control.button_skeleton_width', 'control.button_height', 'size.size_small', 'size.size_medium'
  ]),
  colors: Object.freeze([])
});
