// Info: IconButton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

const KINDS = ['primary', 'secondary', 'ghost', 'tertiary'];

export default Object.freeze({
  name: 'IconButton',
  props: Object.freeze({
    icon: { type: 'string', required: true, description: 'The icon token the button draws.' },
    iconSize: { type: 'number', required: false, description: 'The glyph\'s size; default the icon button member cell. Composing parents pass their own cell (the dialog\'s close icon).' },
    iconColor: { type: 'string', required: false, description: 'The color leaf the glyph draws; default the kind\'s icon cell. Composing parents name their own cell (the notification\'s close icon).' },
    label: { type: 'string', required: true, description: 'The button\'s accessible name, which its compact tooltip shows.' },
    kind: { type: 'string', required: false, description: 'One of `primary`, `secondary`, `ghost`, `tertiary`: the role cells the button reads. Default `primary`.' },
    size: { type: 'string', required: false, description: 'One of `sm`, `md`, `lg`: the square\'s side. Default `lg`, the `icon_button` member cell.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the button.' },
    selected: { type: 'boolean', required: false, description: 'A toggle button\'s state: present makes it `aria-pressed`, true draws the kind\'s selected cells.' },
    onPress: { type: 'function', required: false, description: 'Called when the button is pressed.' },
    align: { type: 'string', required: false, description: 'The side the tooltip opens on. Default `top`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the button.' }
  }),
  kinds: Object.freeze(KINDS),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.icon_button_size', 'control.icon_button_icon_size',
    'size.size_small', 'size.size_medium',
    'control.button_radius', 'border.width_01',
    'control.button_focus_width', 'control.button_focus_offset', 'control.button_focus_gap_width',
    'color.button_focus_ring', 'color.button_focus_gap', 'feedback.focus_trigger',
    'feedback.press', 'state.hover_opacity', 'state.pressed_opacity',
    'motion.duration_fast_01', 'motion.easing_standard_productive'
  ].concat(KINDS.flatMap(function (kind) {
    // Every kind's role cells: fill and label per state, border and elevation per state
    return ['', '_hover', '_active', '_focus', '_disabled', '_selected'].flatMap(function (state) {
      return ['color.button_' + kind + '_container' + state, 'color.button_' + kind + '_label' + state];
    }).concat(['', '_hover', '_active', '_disabled'].flatMap(function (state) {
      return ['color.button_' + kind + '_border' + state, 'shadow.button_' + kind + state];
    }));
  })).concat(['ghost', 'tertiary'].flatMap(function (kind) {
    // The standard and outlined kinds' icon colors, per state
    return ['', '_hover', '_active', '_focus', '_disabled', '_selected'].map(function (state) {
      return 'color.icon_button_' + kind + '_icon' + state;
    });
  }))),
  colors: Object.freeze([])
});
