// Info: PaginationNav public API, as data.
export default Object.freeze({
  name: 'PaginationNav',
  props: Object.freeze({
    itemsShown: { type: 'number', required: false, description: 'Pages to show when the window is wide enough. Default 10.' },
    loop: { type: 'boolean', required: false, description: 'Whether the direction buttons wrap past the ends.' },
    onChange: { type: 'function', required: false, description: 'Called with the selected page index.' },
    page: { type: 'number', required: false, description: 'The 0-based selected index for the controlled form.' },
    defaultPage: { type: 'number', required: false, description: 'The initial index for the uncontrolled form.' },
    size: { type: 'string', required: false, description: 'One of `sm`, `md`, `lg`: the page buttons\' height. Default `lg`.' },
    totalItems: { type: 'number', required: false, description: 'The number of pages. Default 0.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the nav.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze([
    'size.size_small', 'size.size_medium', 'size.size_large', 'breakpoint.sm', 'control.pagination_nav_indicator_width',
    'control.pagination_nav_page_padding_inline', 'control.pagination_nav_focus_width',
    'control.pagination_nav_indicator_height',
    'color.pagination_nav_page_label', 'color.pagination_nav_page_label_disabled',
    'color.pagination_nav_page_container_hover', 'color.pagination_nav_indicator', 'color.pagination_nav_focus',
    'color.pagination_button_icon', 'color.pagination_button_icon_disabled',
    'type.pagination_nav_page', 'type.pagination_nav_page_active', 'font.family.sans'
  ]),
  colors: Object.freeze([])
});
