// Info: Select public API, as data. The docs generator and the accessibility
// tests read this; the component implements exactly this and nothing more.

import { FIELD_PRESENTATION_TOKENS } from '../../roles.js';

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
  tokens: Object.freeze(FIELD_PRESENTATION_TOKENS.concat([
    'control.field_height', 'control.field_radius', 'control.field_icon_size', 'control.option_height',
    'size.size_small', 'size.size_large', 'stacking.dropdown', 'shadow.level_02',
    'color.select_outline_disabled', 'color.select_indicator_focus', 'color.text_primary', 'color.layer_01', 'color.layer_hover_01', 'color.layer_selected_01'
  ])),
  colors: Object.freeze(['background', 'layer_01', 'layer_02', 'layer_03'])
});
