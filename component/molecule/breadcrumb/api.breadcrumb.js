// Info: Breadcrumb public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'Breadcrumb',
  props: Object.freeze({
    items: { type: 'array', required: true, description: 'The trail: `{ label, href, isCurrentPage, onPress, visited }` entries, or `{ overflow: [{ label, href, onPress }] }` for the overflow menu.' },
    noTrailingSlash: { type: 'boolean', required: false, description: 'Draws no separator after the last item.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `md` (the default) or `sm` - the breadcrumb type and gaps.' },
    accessibilityLabel: { type: 'string', required: false, description: 'The nav landmark\'s name. Default `Breadcrumb`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
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
