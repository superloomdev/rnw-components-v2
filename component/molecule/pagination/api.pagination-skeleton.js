// Info: PaginationSkeleton public API, as data.

export default Object.freeze({
  name: 'PaginationSkeleton',
  props: Object.freeze({
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the bar.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'size.size_medium', 'control.pagination_divider_width', 'control.pagination_padding_inline',
    'control.pagination_text_gap', 'control.pagination_skeleton_width_short',
    'control.pagination_skeleton_width_medium', 'control.pagination_skeleton_width_long',
    'color.pagination_container', 'color.pagination_divider'
  ]),
  colors: Object.freeze([])
});
