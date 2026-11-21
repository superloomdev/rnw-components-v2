// Info: Pagination public API, as data.
export default Object.freeze({
  name: 'Pagination',
  props: Object.freeze({
    backwardText: { type: 'string', required: false, description: 'Tooltip/name of the previous-page button. Default "Previous page".' },
    disabled: { type: 'boolean', required: false, description: 'Disables the whole bar.' },
    forwardText: { type: 'string', required: false, description: 'Tooltip/name of the next-page button. Default "Next page".' },
    onChange: { type: 'function', required: false, description: 'Called with `{ page, pageSize }`.' },
    page: { type: 'number', required: false, description: 'The 1-based page for the controlled form.' },
    pageSize: { type: 'number', required: false, description: 'Items per page; defaults to the first of `pageSizes`.' },
    pageSizes: { type: 'array', required: false, description: 'The selectable page sizes.' },
    pagesUnknown: { type: 'boolean', required: false, description: 'When the total is unknown: no page select, forward always live.' },
    size: { type: 'string', required: false, description: 'One of `sm`, `md`, `lg`: the bar\'s height. Default `md`.' },
    totalItems: { type: 'number', required: false, description: 'The item count the bar pages through.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the bar.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze([
    'size.size_small', 'size.size_medium', 'size.size_large',
    'control.pagination_divider_width', 'control.pagination_padding_inline', 'control.pagination_text_gap',
    'control.pagination_select_padding_start', 'control.pagination_select_padding_end', 'control.pagination_collapse_width',
    'color.pagination_container', 'color.pagination_divider', 'color.pagination_label', 'color.pagination_count_label',
    'color.pagination_select_container_hover', 'color.pagination_button_icon', 'color.pagination_button_icon_disabled',
    'color.pagination_button_container_hover', 'type.pagination', 'font.family.sans'
  ]),
  colors: Object.freeze([])
});
