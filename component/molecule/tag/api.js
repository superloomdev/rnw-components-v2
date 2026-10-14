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
  composition: Object.freeze({
    containerLeaf: { type: 'string', required: false, description: 'Composition prop: a color leaf name that overrides the computed container leaf (the interactive tags).' },
    labelLeaf: { type: 'string', required: false, description: 'Composition prop: a color leaf name that overrides the computed label leaf (the interactive tags).' },
    iconLeaf: { type: 'string', required: false, description: 'Composition prop: a color leaf name that overrides the computed icon leaf (the interactive tags).' },
    iconHidden: { type: 'boolean', required: false, description: 'Composition prop: the icon seat mounts but draws nothing and takes no space, so the element tree is the same under every theme (the selectable tag\'s hidden selected mark).' },
    outlineWidth: { type: 'number', required: false, description: 'Composition prop: draws an outline of this width in `outlineLeaf`, replacing the tag\'s own outline (the interactive tags).' },
    outlineLeaf: { type: 'string', required: false, description: 'Composition prop: the outline\'s color leaf; used only with `outlineWidth`.' },
    outlineInLayout: { type: 'boolean', required: false, description: 'Composition prop: draws the outline as a real border the box grows by; `false` draws it as the inset shadow the tag\'s own outline uses, moving nothing (the interactive tags, per `anatomy.tag_interactive_outline`).' },
    height: { type: 'number', required: false, description: 'Composition prop: overrides the size\'s height (the interactive tags\' small height).' },
    paddingEnd: { type: 'number', required: false, description: 'Composition prop: overrides the computed end padding (the dismissible tag\'s close control sits at the end).' },
    trailing: { type: 'node', required: false, description: 'Composition prop: rendered after the label, inside the container (the dismissible tag\'s close control).' }
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
