// Info: BreadcrumbItem public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'BreadcrumbItem',
  props: Object.freeze({
    label: { type: 'string', required: false, description: 'The link text; absent for an overflow item.' },
    href: { type: 'string', required: false, description: 'The destination the link carries; an item without one is link-styled text.' },
    onPress: { type: 'function', required: false, description: 'Called on activation.' },
    visited: { type: 'boolean', required: false, description: 'Draws the link\'s visited color.' },
    isCurrentPage: { type: 'boolean', required: false, description: 'The current page: `aria-current="page"`, `color.breadcrumb_current`, no underline.' },
    overflow: { type: 'array', required: false, description: '`[{ label, href, onPress }]` - composes an OverflowMenu of those options instead of a link.' },
    last: { type: 'boolean', required: false, description: 'Composition prop: the last item draws no separator.' },
    noTrailingSlash: { type: 'boolean', required: false, description: 'Composition prop: draws no separator.' },
    size: { type: 'string', required: false, description: 'Composition prop: `sm` or `md`, from Breadcrumb.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md']),
  tokens: Object.freeze([
    'color.link_primary', 'color.breadcrumb_separator', 'color.breadcrumb_current',
    'color.breadcrumb_overflow_icon', 'color.breadcrumb_overflow_icon_hover', 'color.breadcrumb_overflow_icon_active',
    'color.breadcrumb_overflow_caret', 'color.focus',
    'type.breadcrumb', 'type.breadcrumb_small',
    'control.breadcrumb_gap', 'control.breadcrumb_gap_small', 'control.breadcrumb_link_min_width_small',
    'control.breadcrumb_overflow_width', 'control.breadcrumb_overflow_height', 'control.breadcrumb_overflow_height_small',
    'control.breadcrumb_overflow_icon_offset', 'control.breadcrumb_overflow_underline_width', 'control.breadcrumb_overflow_caret_size',
    'size.icon_01', 'icon.overflow', 'icon.overflow_vertical'
  ])
});
