// Info: PasswordInput public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

import { FIELD_PRESENTATION_TOKENS } from '../../roles.js';

export default Object.freeze({
  name: 'PasswordInput',
  props: Object.freeze({
    label: { type: 'string', required: false, description: 'Visible label; it names the field. Without it, pass `accessibilityLabel`.' },
    placeholder: { type: 'string', required: false, description: 'Hint shown in the empty field. Under a floating label it shows once the label has risen.' },
    value: { type: 'string', required: false, description: 'Controlled value. Absent: the field keeps its own value, starting at `defaultValue` or empty.' },
    defaultValue: { type: 'string', required: false, description: 'Initial uncontrolled value; applied once.' },
    onChangeText: { type: 'function', required: false, description: 'Called with the next text on every change.' },
    visible: { type: 'boolean', required: false, description: 'Controlled reveal state; the value is readable while true. Absent: the field keeps its own reveal state, starting hidden.' },
    defaultVisible: { type: 'boolean', required: false, description: 'Initially visible while uncontrolled. Default `false`.' },
    onVisibilityChange: { type: 'function', required: false, description: 'Called with the next visibility on every reveal or hide.' },
    showPasswordLabel: { type: 'string', required: false, description: 'Accessible name and tooltip of the reveal action while hidden. Default `Show password`.' },
    hidePasswordLabel: { type: 'string', required: false, description: 'Accessible name and tooltip of the hide action while visible. Default `Hide password`.' },
    tooltipAlign: { type: 'string', required: false, description: 'The side and alignment the action\'s tooltip opens on. Default `bottom-end`.' },
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
  tokens: Object.freeze(FIELD_PRESENTATION_TOKENS.concat([
    'control.field_height', 'control.field_radius', 'control.field_icon_size',
    'control.field_action_inset', 'control.field_action_size', 'control.field_action_gap',
    'size.size_small', 'size.size_large', 'shape.radius_00', 'shape.radius_max',
    'anatomy.field_action',
    'color.text_input_container_hover',
    'color.password_toggle_container_hover', 'color.password_toggle_container_active',
    'color.field_indicator', 'color.field_indicator_disabled'
  ])),
  colors: Object.freeze(['background', 'layer_01', 'layer_02', 'layer_03'])
});
