// Info: DismissibleTag public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

// The hues a `type` picks, one token family per hue - the Tag family's own
const TYPES = Object.freeze(['red', 'magenta', 'purple', 'blue', 'cyan', 'teal', 'green', 'gray', 'cool_gray', 'warm_gray']);

export default Object.freeze({
  name: 'DismissibleTag',
  props: Object.freeze({
    text: { type: 'string', required: true, description: 'The tag\'s text.' },
    type: { type: 'string', required: false, description: 'One of `kinds`, a hue the theme draws the tag and its close control\'s hover from. Absent: the neutral tag cells.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `sm`, `md`, `lg`. Default `md`.' },
    icon: { type: 'string', required: false, description: 'Semantic icon name drawn before the label; decorative, the label names the tag.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the close control and draws the disabled colors.' },
    title: { type: 'string', required: false, description: 'The close control\'s accessible name and tooltip label. Default `Dismiss`.' },
    onClose: { type: 'function', required: false, description: 'Called when the close control is pressed.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the tag.' }
  }),
  composition: Object.freeze({
    containerLeaf: { type: 'string', required: false, description: 'Composition prop: a color leaf name that overrides the tag\'s container leaf (a host\'s high-contrast member).' },
    labelLeaf: { type: 'string', required: false, description: 'Composition prop: a color leaf name that overrides the tag\'s label leaf (a host\'s high-contrast member).' },
    iconLeaf: { type: 'string', required: false, description: 'Composition prop: a color leaf name that overrides the tag\'s icon leaf and the close glyph\'s (a host\'s high-contrast member).' },
    closeHoverLeaf: { type: 'string', required: false, description: 'Composition prop: a color leaf name that overrides the close face\'s hovered fill (a host\'s high-contrast member).' },
    closeFocusLeaf: { type: 'string', required: false, description: 'Composition prop: a color leaf name that overrides the close focus ring\'s color (a host\'s high-contrast member).' },
    tooltip: { type: 'boolean', required: false, description: 'Composition prop: `false` renders the close control without its tooltip; `title` still names it. Default `true`.' },
    closeGap: { type: 'number', required: false, description: 'Composition prop: the raw gap ahead of the close control, before its face bleed (a host member\'s legacy spacing). The default keeps the theme cell and the standalone small size\'s half-height adjustment.' },
    paddingStart: { type: 'number', required: false, description: 'Composition prop: forwarded to the tag\'s start padding override (a host member\'s legacy leading edge).' }
  }),
  kinds: TYPES,
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze([
    'anatomy.tag_close',
    'control.tag_height', 'control.tag_close_gap', 'control.tag_close_inset',
    'control.tag_close_icon_size', 'control.tag_close_focus_offset', 'border.width_01',
    'size.icon_01', 'spacing.spacing_01', 'size.size_small',
    'color.tag_close_container_hover', 'color.tag_close_layer_active', 'color.tag_close_focus_ring',
    'color.tag_icon_disabled',
    'color.tag_label', 'color.tag_dismissible_label', 'color.tag_container_disabled', 'color.tag_label_disabled',
    'control.tag_focus_width', 'control.tag_focus_offset', 'feedback.focus_trigger', 'color.tag_focus_ring'
  ]),
  colors: Object.freeze(TYPES.flatMap(function (type) {
    return ['tag_hover_' + type, 'tag_color_' + type];
  }))
});
