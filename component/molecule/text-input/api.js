// Info: TextInput public API, as data. The docs generator and the accessibility
// tests read this; the component implements exactly this and nothing more.

export default Object.freeze({
  name: 'TextInput',
  props: Object.freeze({
    label: { type: 'string', required: false, description: 'Visible label; it names the field. Without it, pass `accessibilityLabel`.' },
    placeholder: { type: 'string', required: false, description: 'Hint shown in the empty field. Under a floating label it shows once the label has risen.' },
    value: { type: 'string', required: false, description: 'Controlled value. Absent: the field keeps its own value, starting empty.' },
    onChangeText: { type: 'function', required: false, description: 'Called with the next text on every change.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `sm`, `md`, `lg`. Default `md`.' },
    disabled: { type: 'boolean', required: false, description: 'Makes the field read-only, draws the disabled colors and announces it as disabled.' },
    invalid: { type: 'boolean', required: false, description: 'Draws the error border and icon, shows `invalidText` and announces the field as invalid.' },
    invalidText: { type: 'string', required: false, description: 'Message shown below while `invalid`.' },
    helperText: { type: 'string', required: false, description: 'Message shown below while not `invalid`.' },
    surface: { type: 'string', required: false, description: 'Color leaf of the surface the field sits on; a floating label occludes the border with it. Default: config `FIELD_SURFACE`, else `background`.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name when there is no visible label.' },
    onFocus: { type: 'function', required: false, description: 'Called when the input gains focus.' },
    onBlur: { type: 'function', required: false, description: 'Called when the input loses focus.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the input.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze([
    'feedback.field', 'anatomy.label', 'border.width_01', 'border.width_02', 'spacing.spacing_02', 'spacing.spacing_03',
    'control.field_height', 'control.field_radius', 'control.field_icon_size',
    'type.label01', 'type.field_label_raised', 'type.body_compact_01', 'type.helper_text_01', 'font.family.sans',
    'color.border_disabled', 'color.support_error', 'color.border_strong_01',
    'color.field_01', 'color.field_hover_01', 'color.text_disabled', 'color.text_secondary',
    'color.text_primary', 'color.text_placeholder', 'color.text_error', 'color.text_helper'
  ]),
  colors: Object.freeze(['background', 'layer_01', 'layer_02', 'layer_03'])
});
