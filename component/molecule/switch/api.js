// Info: Public API of the Toggle molecule. The on/off text and the label
// are plain strings; the small variant draws the selected mark through the
// icon registry. The component reads the switch family, the shared
// selection layer size and the two switch anatomy enums, and implements
// both values of each.


/********************************************************************
Public API contract.

@type {Object}
*********************************************************************/
export default {

  name: 'Toggle',
  summary: 'A control that toggles a setting between its on and off states.',
  tier: 'molecule',
  composes: ['Icon'],

  props: {
    label: 'string',
    checked: 'boolean',
    disabled: 'boolean',
    size: 'string',
    offText: 'string',
    onText: 'string',
    onChange: 'function',
    testID: 'string'
  },

  variants: ['sm', 'md'],

  tokens: [
    'control.switch_track_width',
    'control.switch_track_height',
    'control.switch_outline_width',
    'control.switch_handle_size',
    'control.switch_handle_size_selected',
    'control.switch_handle_size_pressed',
    'control.switch_focus_width',
    'control.switch_focus_offset',
    'control.selection_layer_size',
    'anatomy.switch_handle',
    'anatomy.switch_state_text',
    'anatomy.switch_edge',
    'feedback.press',
    'feedback.focus_trigger',
    'state.hover_opacity',
    'state.pressed_opacity',
    'motion.duration_fast_01',
    'motion.duration_moderate_02',
    'motion.easing_standard_productive',
    'type.label01',
    'type.body01',
    'font.family.sans',
    'color.text_primary',
    'color.text_secondary',
    'color.text_disabled',
    'color.switch_outline',
    'color.switch_outline_hover',
    'color.switch_outline_focus',
    'color.switch_outline_active',
    'color.switch_outline_disabled',
    'color.switch_track',
    'color.switch_track_hover',
    'color.switch_track_focus',
    'color.switch_track_active',
    'color.switch_track_selected',
    'color.switch_track_selected_hover',
    'color.switch_track_selected_focus',
    'color.switch_track_selected_active',
    'color.switch_track_disabled',
    'color.switch_track_selected_disabled',
    'color.switch_handle',
    'color.switch_handle_hover',
    'color.switch_handle_focus',
    'color.switch_handle_active',
    'color.switch_handle_selected',
    'color.switch_handle_selected_hover',
    'color.switch_handle_selected_focus',
    'color.switch_handle_selected_active',
    'color.switch_handle_disabled',
    'color.switch_handle_selected_disabled',
    'color.switch_layer_hover',
    'color.switch_layer_active',
    'color.switch_layer_selected_hover',
    'color.switch_layer_selected_active',
    'color.switch_mark',
    'color.switch_mark_disabled',
    'color.switch_focus_ring'
  ]

};
