// Info: RadioButton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'RadioButton',
  props: Object.freeze({
    label: { type: 'string', required: true, description: 'Visible label; it names the radio button.' },
    checked: { type: 'boolean', required: false, description: 'Controlled checked state. Absent: the radio keeps its own state, starting unchecked. A press checks it; a radio never unchecks itself.' },
    disabled: { type: 'boolean', required: false, description: 'Disables selection and feedback, draws the disabled colors and announces the radio as disabled.' },
    invalid: { type: 'boolean', required: false, description: 'Draws the error ring and announces the radio as invalid. The message belongs to the group.' },
    focusable: { type: 'boolean', required: false, description: 'Whether the radio sits in the tab order. A group passes false to every member but the checked one so the group roves as a unit.' },
    onChange: { type: 'function', required: false, description: 'Called with `true` when a press or Space checks the radio; a checked radio does not call it again.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the pressable root.' }
  }),
  composition: Object.freeze({
    rootRef: { type: 'object', required: false, description: 'Composition prop: a ref the group attaches to the pressable root so arrow navigation can move DOM focus to the member.' },
    onGroupFocus: { type: 'function', required: false, description: 'Composition prop: called on focus; the group records which member holds the focus for keyboard movement.' },
    groupVertical: { type: 'boolean', required: false, description: 'Composition prop: the row takes the vertical group geometry - top padding on the row instead of the ring\'s top and bottom insets - so the member is the group\'s vertical row height.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.radio_size', 'control.radio_border', 'control.radio_dot_size', 'control.radio_focus_offset',
    'control.selection_focus_width', 'control.selection_layer_size', 'feedback.focus_trigger',
    'type.selection_label', 'font.family.sans'
  ].concat([
    'outline', 'outline_hover', 'outline_active', 'outline_focus', 'outline_disabled', 'outline_invalid',
    'container', 'container_hover', 'container_active', 'container_focus', 'container_disabled', 'container_invalid',
    'layer_hover', 'layer_active', 'layer_selected_hover', 'layer_selected_active',
    'label', 'label_disabled', 'focus_ring'
  ].map(function (cell) {
    return 'color.selection_' + cell;
  }), [
    'color.radio_outline_selected', 'color.radio_outline_selected_hover',
    'color.radio_outline_selected_focus', 'color.radio_outline_selected_active'
  ])),
  colors: Object.freeze([])
});
