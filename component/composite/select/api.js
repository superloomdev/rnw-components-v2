// Info: Select public API, as data. The docs generator and the accessibility
// tests read this; the component implements exactly this and nothing more.

export default Object.freeze({
  name: 'Select',
  props: Object.freeze({
    items: { type: 'array', required: true, description: 'Options, each `{ value, label }`; `value` is unique.' },
    label: { type: 'string', required: false, description: 'Visible label; it names the select. Without it, pass `accessibilityLabel`.' },
    placeholder: { type: 'string', required: false, description: 'Text shown while nothing is selected.' },
    value: { type: 'string', required: false, description: 'Controlled selected value. Absent: the select keeps its own selection, starting empty.' },
    onChange: { type: 'function', required: false, description: 'Called with the selected option\'s value.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `sm`, `md`, `lg`. Default `md`.' },
    disabled: { type: 'boolean', required: false, description: 'Disables opening, draws the disabled colors and announces the select as disabled.' },
    invalid: { type: 'boolean', required: false, description: 'Draws the error border and icon, shows `invalidText` and announces the select as invalid.' },
    invalidText: { type: 'string', required: false, description: 'Message shown below while `invalid`.' },
    helperText: { type: 'string', required: false, description: 'Message shown below while not `invalid`.' },
    surface: { type: 'string', required: false, description: 'Color leaf of the surface the select sits on; a floating label occludes the border with it. Default: config `FIELD_SURFACE`, else `background`.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name when there is no visible label.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the trigger.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze([
    'feedback.field', 'anatomy.label', 'anatomy.caret', 'border.width_01', 'border.width_02', 'spacing.spacing_02', 'spacing.spacing_03',
    'type.label01', 'type.body_compact_01', 'type.helper_text_01', 'font.family.sans',
    'color.border_disabled', 'color.support_error', 'color.border_strong_01',
    'color.field_01', 'color.field_hover_01', 'color.text_disabled', 'color.text_secondary',
    'color.text_primary', 'color.text_placeholder', 'color.text_error', 'color.text_helper',
    'color.icon_primary', 'color.icon_disabled', 'color.layer_01', 'color.layer_hover_01', 'color.layer_selected_01',
    'shadow.level_02'
  ]),
  colors: Object.freeze(['background', 'layer_01', 'layer_02', 'layer_03'])
});
