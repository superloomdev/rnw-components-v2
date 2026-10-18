// Info: ExpandableSearch public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

import { FIELD_PRESENTATION_TOKENS } from '../../roles.js';

export default Object.freeze({
  name: 'ExpandableSearch',
  props: Object.freeze({
    label: { type: 'string', required: false, description: 'The control\'s name; names the trigger and the input. Default `Search`.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name when `label` is absent.' },
    placeholder: { type: 'string', required: false, description: 'Hint shown in the empty field once expanded. Default `Search`.' },
    value: { type: 'string', required: false, description: 'Controlled value. Absent: the field keeps its own value, starting at `defaultValue` or empty.' },
    defaultValue: { type: 'string', required: false, description: 'Initial uncontrolled value; applied once.' },
    onChangeText: { type: 'function', required: false, description: 'Called with the next text on every change.' },
    onClear: { type: 'function', required: false, description: 'Called when the clear action or Escape empties the field.' },
    onSubmit: { type: 'function', required: false, description: 'Called with the current text on submission.' },
    expanded: { type: 'boolean', required: false, description: 'Controlled open state. Absent: the control keeps its own state, starting collapsed.' },
    onExpandedChange: { type: 'function', required: false, description: 'Called with the next open state on every expand or collapse.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `sm`, `md`, `lg`. Default `md`.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the control and announces it as disabled.' },
    surface: { type: 'string', required: false, description: 'Color leaf of the surface the expanded field sits on. Default: config `FIELD_SURFACE`, else `background`.' },
    onFocus: { type: 'function', required: false, description: 'Called when the input gains focus.' },
    onBlur: { type: 'function', required: false, description: 'Called when the input loses focus.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the control.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze(FIELD_PRESENTATION_TOKENS.concat([
    'control.field_height', 'control.field_radius', 'control.field_icon_size',
    'control.field_action_inset', 'control.field_action_size', 'control.field_action_gap',
    'size.size_small', 'size.size_large', 'shape.radius_00', 'shape.radius_max',
    'border.width_01', 'anatomy.field_action',
    'color.text_input_container_hover',
    'color.field_action_container_hover', 'color.field_action_container_active',
    'color.field_indicator', 'color.field_indicator_disabled', 'color.field_leading_icon',
    'color.search_placeholder_disabled',
    'color.background_hover',
    'motion.duration_fast_02', 'motion.easing_standard_productive'
  ])),
  colors: Object.freeze(['background', 'layer_01', 'layer_02', 'layer_03'])
});
