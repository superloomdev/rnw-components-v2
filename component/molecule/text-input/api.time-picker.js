// Info: TimePicker public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

import { FIELD_PRESENTATION_TOKENS } from '../../roles.js';

export default Object.freeze({
  name: 'TimePicker',
  props: Object.freeze({
    label: { type: 'string', required: false, description: 'Visible label above the field; it names the whole row - the input and every select member.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name when there is no visible label.' },
    placeholder: { type: 'string', required: false, description: 'Hint shown in the empty field. Default `hh:mm`.' },
    value: { type: 'string', required: false, description: 'Controlled time text. Absent: the field keeps its own text, starting at `defaultValue` or empty. Plain text entry only - no auto-format and no clock popup.' },
    defaultValue: { type: 'string', required: false, description: 'Initial uncontrolled text; applied once.' },
    onChangeText: { type: 'function', required: false, description: 'Called with the next text on every change.' },
    maxLength: { type: 'number', required: false, description: 'Maximum editable length. Default 5.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `sm`, `md`, `lg`. Default `md`; select members inherit it unless they set their own.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the field and every select member, draws the disabled colors and announces them as disabled.' },
    invalid: { type: 'boolean', required: false, description: 'Widens the field for the error icon, draws the error border and icon, shows `invalidText` and announces the field as invalid.' },
    invalidText: { type: 'string', required: false, description: 'Message shown below the whole row while `invalid`.' },
    helperText: { type: 'string', required: false, description: 'Message shown below the whole row while not `invalid`.' },
    surface: { type: 'string', required: false, description: 'Color leaf of the surface the field sits on; a floating label occludes the border with it. Default: config `FIELD_SURFACE`, else `background`.' },
    selects: { type: 'array', required: false, description: 'TimePickerSelect props to compose after the field - the data form of passing members as children.' },
    children: { type: 'node', required: false, description: 'TimePickerSelect members, composed after the field.' },
    onFocus: { type: 'function', required: false, description: 'Called when the input gains focus.' },
    onBlur: { type: 'function', required: false, description: 'Called when the input loses focus.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the input.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze(FIELD_PRESENTATION_TOKENS.concat([
    'control.field_height', 'control.field_radius', 'control.field_icon_size',
    'control.time_picker_input_width', 'control.time_picker_input_width_invalid',
    'control.time_picker_select_gap',
    'size.size_small', 'size.size_large',
    'type.time_picker_value',
    'spacing.spacing_01'
  ])),
  colors: Object.freeze(['background', 'layer_01', 'layer_02', 'layer_03'])
});
