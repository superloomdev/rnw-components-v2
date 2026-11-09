// Info: BreadcrumbSkeleton public API, as data. The docs generator and
// the accessibility tests read this; the component implements exactly this
// and nothing more.

export default Object.freeze({
  name: 'BreadcrumbSkeleton',
  props: Object.freeze({
    items: { type: 'number', required: false, description: 'The number of shimmer bars. Default 3.' },
    noTrailingSlash: { type: 'boolean', required: false, description: 'Draws no separator after the last bar.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `md` (the default) or `sm` - the gap.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md']),
  tokens: Object.freeze([
    'color.breadcrumb_separator',
    'type.breadcrumb', 'type.breadcrumb_small',
    'control.breadcrumb_gap', 'control.breadcrumb_gap_small',
    'control.breadcrumb_skeleton_width', 'control.breadcrumb_skeleton_height'
  ])
});
