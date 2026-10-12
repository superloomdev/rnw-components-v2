// Info: TextArea public API, as data. The docs generator and the accessibility
// tests read this; the component implements exactly this and nothing more.

import { FIELD_PRESENTATION_TOKENS } from '../../roles.js';

export default Object.freeze({
  name: 'TextArea',
  props: Object.freeze({
    label: { type: 'string', required: false, description: 'Visible label; it names the field. Without it, pass `accessibilityLabel`.' },
    placeholder: { type: 'string', required: false, description: 'Hint shown in the empty field. Under a floating label it shows once the label has risen.' },
    value: { type: 'string', required: false, description: 'Controlled value. Absent: the field keeps its own value, starting empty.' },
    onChangeText: { type: 'function', required: false, description: 'Called with the next text on every change.' },
    rows: { type: 'number', required: false, description: 'Value lines the field shows without scrolling. Default 4.' },
    maxCount: { type: 'number', required: false, description: 'Character limit; shows the counter where `anatomy.field_counter` puts it and caps the input length.' },
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
  variants: Object.freeze([]),
  tokens: Object.freeze(FIELD_PRESENTATION_TOKENS.concat([
    'anatomy.field_counter', 'control.field_height', 'control.field_icon_size',
    'type.text_area_value', 'color.text_area_container_hover', 'color.text_area_outline_disabled'
  ])),
  colors: Object.freeze(['background', 'layer_01', 'layer_02', 'layer_03'])
});
