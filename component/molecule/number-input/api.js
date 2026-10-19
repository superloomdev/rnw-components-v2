// Info: NumberInput public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

import { FIELD_PRESENTATION_TOKENS } from '../../roles.js';

export default Object.freeze({
  name: 'NumberInput',
  props: Object.freeze({
    label: { type: 'string', required: false, description: 'Visible label; it names the field. Without it, pass `accessibilityLabel`.' },
    placeholder: { type: 'string', required: false, description: 'Hint shown in the empty field. Under a floating label it shows once the label has risen.' },
    value: { type: 'string or number', required: false, description: 'Controlled editing text. Absent: the field keeps its own text, starting at `defaultValue` or `0`.' },
    defaultValue: { type: 'string or number', required: false, description: 'Initial uncontrolled text; applied once.' },
    onChangeText: { type: 'function', required: false, description: 'Called with the next editing text on every change; keeps partial input verbatim.' },
    onChange: { type: 'function', required: false, description: 'Called with the parsed finite number, or the empty string when `allowEmpty` permits an empty field.' },
    min: { type: 'number', required: false, description: 'Lower bound; a typed value below it marks the field invalid and steps clamp to it.' },
    max: { type: 'number', required: false, description: 'Upper bound; a typed value above it marks the field invalid and steps clamp to it.' },
    step: { type: 'number', required: false, description: 'The amount the steppers and arrow keys move by. Default `1`.' },
    allowEmpty: { type: 'boolean', required: false, description: 'Permits an empty field; the empty edit reports the empty string through `onChange` instead of `0`.' },
    hideSteppers: { type: 'boolean', required: false, description: 'Hides the decrement and increment actions.' },
    decrementLabel: { type: 'string', required: false, description: 'Accessible name of the decrement action. Default `Decrement number`.' },
    incrementLabel: { type: 'string', required: false, description: 'Accessible name of the increment action. Default `Increment number`.' },
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
    'control.number_input_min_width', 'control.number_input_divider_height',
    'size.size_small', 'size.size_large', 'shape.radius_00', 'shape.radius_max',
    'border.width_01', 'spacing.spacing_05', 'anatomy.field_action',
    'color.text_input_container_hover',
    'color.field_action_container_hover', 'color.number_input_action_container_active',
    'color.field_indicator', 'color.field_indicator_disabled',
    'color.number_input_divider', 'color.field_outline',
    'color.field_focus_ring', 'color.field_ring_invalid'
  ])),
  colors: Object.freeze(['background', 'layer_01', 'layer_02', 'layer_03'])
});
