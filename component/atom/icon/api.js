// Info: Icon public API, as data. The docs generator and the accessibility
// tests read this; the component implements exactly this and nothing more.

export default Object.freeze({
  name: 'Icon',
  props: Object.freeze({
    name: { type: 'string', required: true, description: 'Semantic icon name; a token `icon.<name>` in the theme. A name the theme lacks throws.' },
    size: { type: 'number', required: false, description: 'Rendered size in points. Default: the `size` metric (`size.icon_02`). The set\'s own glyph is used when it draws one at this size.' },
    color: { type: 'string', required: false, description: 'Color token leaf under `color.`. Default `icon_primary`.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Announced name. Absent means decorative: the icon is hidden from assistive technology.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' },
    style: { type: 'object', required: false, description: 'Style forwarded to the root Svg (layout only; color and size are props).' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['size.icon_02', 'color.icon_primary']),
  colors: Object.freeze(['icon_primary', 'icon_secondary', 'icon_interactive', 'icon_disabled', 'icon_inverse', 'icon_on_color', 'icon_on_color_disabled'])
});
