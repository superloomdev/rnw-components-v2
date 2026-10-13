// Info: ButtonSkeleton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'ButtonSkeleton',
  props: Object.freeze({
    size: { type: 'string', required: false, description: 'One of `variants`: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`. Default `lg`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the placeholder\'s root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  tokens: Object.freeze([
    'control.button_skeleton_width', 'control.button_height', 'control.button_radius',
    'size.size_xsmall', 'size.size_small', 'size.size_medium', 'size.size_xlarge', 'size.size_2xlarge'
  ]),
  colors: Object.freeze([])
});
