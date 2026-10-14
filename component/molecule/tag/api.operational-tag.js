// Info: OperationalTag public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

// The hues a `type` picks, one token family per hue - the Tag family's own
const TYPES = Object.freeze(['red', 'magenta', 'purple', 'blue', 'cyan', 'teal', 'green', 'gray', 'cool_gray', 'warm_gray']);

export default Object.freeze({
  name: 'OperationalTag',
  props: Object.freeze({
    text: { type: 'string', required: true, description: 'The tag\'s text.' },
    type: { type: 'string', required: false, description: 'One of `kinds`, a hue the theme draws from its `tag_*` cells. Absent: the neutral `tag` family cells.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `sm`, `md`, `lg`. Default `md`.' },
    icon: { type: 'string', required: false, description: 'Semantic icon name drawn before the label; decorative, the label names the tag.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the tag and draws the disabled colors.' },
    onPress: { type: 'function', required: false, description: 'Called when the tag is pressed; an operational tag performs an action.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the pressable.' }
  }),
  kinds: TYPES,
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze([
    'control.tag_interactive_outline_width', 'control.tag_interactive_height_small', 'color.tag_interactive_layer_active',
    'color.tag_interactive_outline', 'color.tag_interactive_outline_disabled', 'color.tag_container_disabled',
    'color.tag_container', 'color.tag_container_hover', 'color.tag_label', 'color.tag_label_disabled',
    'color.tag_icon', 'color.tag_icon_disabled', 'color.tag_outline',
    'control.tag_focus_width', 'control.tag_focus_offset', 'feedback.focus_trigger', 'color.tag_focus_ring',
    'anatomy.tag_interactive_outline'
  ]),
  colors: Object.freeze([].concat(
    TYPES.map(function (type) {
      return 'tag_background_' + type;
    }),
    TYPES.map(function (type) {
      return 'tag_hover_' + type;
    }),
    TYPES.map(function (type) {
      return 'tag_border_' + type;
    }),
    TYPES.map(function (type) {
      return 'tag_color_' + type;
    })))
});
