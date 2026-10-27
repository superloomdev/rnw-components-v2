// Info: TabsSkeleton public API, as data.

export default Object.freeze({
  name: 'TabsSkeleton',
  props: Object.freeze({
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the skeleton.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.tab_skeleton_width', 'control.tab_skeleton_bar_height', 'control.tab_padding_inline',
    'color.skeleton_element', 'color.skeleton_background'
  ]),
  colors: Object.freeze([])
});
