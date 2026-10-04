// Info: Checkbox public API, as data. The docs generator and the accessibility
// tests read this; the component implements exactly this and nothing more.

export default Object.freeze({
  name: 'Checkbox',
  props: Object.freeze({
    label: { type: 'string', required: true, description: 'Visible label; it names the checkbox.' },
    checked: { type: 'boolean', required: false, description: 'Controlled checked state. Absent: the checkbox keeps its own state, starting unchecked.' },
    indeterminate: { type: 'boolean', required: false, description: 'Draws the mixed mark and announces the checkbox as mixed.' },
    disabled: { type: 'boolean', required: false, description: 'Disables toggling and feedback, draws the disabled colors and announces the checkbox as disabled.' },
    invalid: { type: 'boolean', required: false, description: 'Draws the error border, shows `invalidText` and announces the checkbox as invalid.' },
    invalidText: { type: 'string', required: false, description: 'Message shown below while `invalid`.' },
    helperText: { type: 'string', required: false, description: 'Message shown below while not `invalid`.' },
    onChange: { type: 'function', required: false, description: 'Called with the next checked value on activation (press, Space).' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the pressable root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.checkbox_size', 'control.checkbox_border',
    'type.body_compact_01', 'type.helper_text_01', 'font.family.sans',
    'color.icon_primary', 'color.icon_inverse', 'color.icon_disabled', 'color.support_error', 'color.control_checked',
    'color.text_primary', 'color.text_disabled', 'color.text_error', 'color.text_helper',
    'feedback.press', 'state.hover_opacity', 'state.pressed_opacity', 'state.focus_opacity',
    'motion.duration_fast_01', 'motion.easing_standard_productive'
  ]),
  colors: Object.freeze([])
});
