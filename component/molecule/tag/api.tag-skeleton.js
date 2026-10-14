// Info: TagSkeleton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'TagSkeleton',
  props: Object.freeze({
    size: { type: 'string', required: false, description: 'One of `variants`: `sm`, `md`. Default `md`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md']),
  tokens: Object.freeze([
    'control.tag_skeleton_width', 'control.tag_height', 'control.tag_radius',
    'size.icon_01', 'spacing.spacing_01'
  ])
});
