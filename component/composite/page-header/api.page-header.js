// Info: PageHeader public API, as data.
export default Object.freeze({
  name: 'PageHeader',
  props: Object.freeze({
    breadcrumbs: { type: 'array', required: false, description: 'Breadcrumb items `{ label, href }` above the title.' },
    collapseHeader: { type: 'boolean', required: false, description: 'Collapses the header rows.' },
    pageActions: { type: 'array', required: false, description: 'Action items `{ label, onPress }` right of the title.' },
    scrollY: { type: 'number', required: false, description: 'Scroll offset driving the collapsed bar.' },
    subtitle: { type: 'string', required: false, description: 'The subtitle under the title.' },
    tags: { type: 'array', required: false, description: 'Tag items `{ label }` under the subtitle.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' },
    title: { type: 'string', required: true, description: 'The page title.' },
    titleIcon: { type: 'string', required: false, description: 'A semantic icon name beside the title.' },
    withoutBackground: { type: 'boolean', required: false, description: 'Transparent container.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.page_header_container', 'color.page_header_container_scrolled', 'color.page_header_shadow',
    'control.page_header_padding_inline', 'control.page_header_breadcrumb_height', 'control.page_header_breadcrumb_gap',
    'color.page_header_bar_collapsed', 'control.page_header_row_gap', 'type.page_header_title', 'color.page_header_title',
    'control.page_header_title_min_height', 'control.page_header_title_icon_size', 'control.page_header_title_icon_gap',
    'type.page_header_subtitle', 'color.page_header_subtitle', 'control.page_header_subtitle_gap',
    'control.page_header_tags_padding_block', 'control.page_header_tags_padding_end', 'type.heading03', 'type.heading04',
    'type.body01', 'type.body_compact_02', 'type.label01', 'type.breadcrumb_small', 'font.family.sans'
  ]),
  colors: Object.freeze([])
});
