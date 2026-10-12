// Info: Tag public API, as data. The docs generator and the accessibility
// tests read this; the component implements exactly this and nothing more.

// The hues a `type` picks, one token family per hue
const TYPES = Object.freeze(['red', 'magenta', 'purple', 'blue', 'cyan', 'teal', 'green', 'gray', 'cool_gray', 'warm_gray']);

export default Object.freeze({
  name: 'Tag',
  props: Object.freeze({
    children: { type: 'string', required: true, description: 'The tag\'s text. It is the accessible name.' },
    type: { type: 'string', required: false, description: 'One of `kinds`, a hue the theme draws from its `tag_*` cells. Absent: the neutral `tag` family cells.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `sm`, `md`, `lg`. Default `md`.' },
    icon: { type: 'string', required: false, description: 'Semantic icon name drawn before the label; decorative, the label names the tag.' },
    disabled: { type: 'boolean', required: false, description: 'Draws the disabled colors; a tag is not interactive, so this changes appearance only.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the tag.' }
  }),
  kinds: TYPES,
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze([
    'control.tag_height', 'control.tag_radius', 'control.tag_padding_inline', 'control.tag_padding_icon',
    'control.tag_outline_width', 'control.tag_icon_size',
    'size.icon_01', 'spacing.spacing_01', 'size.size_small', 'spacing.spacing_03', 'spacing.spacing_04',
    'type.tag_label', 'font.family.sans',
    'color.tag_container', 'color.tag_container_disabled',
    'color.tag_label', 'color.tag_label_disabled',
    'color.tag_outline', 'color.tag_outline_disabled',
    'color.tag_icon', 'color.tag_icon_disabled'
  ]),
  colors: Object.freeze(TYPES.flatMap(function (type) {
    return ['tag_background_' + type, 'tag_color_' + type];
  }))
});
