// Info: Slider public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

import { FIELD_PRESENTATION_TOKENS } from '../../roles.js';

export default Object.freeze({
  name: 'Slider',
  props: Object.freeze({
    label: { type: 'string', required: false, description: 'Visible label above the row; it names the thumb and the optional number field. With `hideLabel` the name falls back to `accessibilityLabel`, then `label`.' },
    hideLabel: { type: 'boolean', required: false, description: 'Hides the visible label; the control is then named by `accessibilityLabel`, falling back to `label`.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name when the visible label is hidden or absent.' },
    min: { type: 'number', required: false, description: 'Lower endpoint. Default `0`.' },
    max: { type: 'number', required: false, description: 'Upper endpoint. Default `100`.' },
    step: { type: 'number', required: false, description: 'Distance between selectable values on the min-anchored grid. Default `1`.' },
    stepMultiplier: { type: 'number', required: false, description: 'Grid steps a Shift+arrow or PageUp/PageDown press moves. Default `4`.' },
    value: { type: 'number', required: false, description: 'Controlled value. Absent: the slider keeps its own, starting at `defaultValue` or `min`.' },
    defaultValue: { type: 'number', required: false, description: 'Initial uncontrolled value; applied once, snapped to the grid.' },
    onChange: { type: 'function', required: false, description: 'Called with the next number on every accepted request.' },
    onRelease: { type: 'function', required: false, description: 'Called once when a pointer drag ends, with the last requested number.' },
    disabled: { type: 'boolean', required: false, description: 'Removes the thumb tab stop and all interaction, and draws the disabled paint.' },
    invalid: { type: 'boolean', required: false, description: 'Draws the error ring and icon on the number field and shows `invalidText`.' },
    invalidText: { type: 'string', required: false, description: 'Message shown below the row while `invalid`; it describes the thumb and the field.' },
    hideTextInput: { type: 'boolean', required: false, description: 'Hides the number field; a compact tooltip on the thumb then carries the formatted value.' },
    inputLabel: { type: 'string', required: false, description: 'Accessible name of the number field, else the slider label.' },
    minLabel: { type: 'string', required: false, description: 'Suffix appended to the minimum bound label.' },
    maxLabel: { type: 'string', required: false, description: 'Suffix appended to the maximum bound label.' },
    formatLabel: { type: 'function', required: false, description: 'Formats a bound or tooltip value: `(value, suffix)` must return a string. Default appends the suffix to the number.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(FIELD_PRESENTATION_TOKENS.concat([
    'control.field_height', 'control.field_radius', 'control.field_icon_size',
    'control.slider_gap', 'control.slider_min_width', 'control.slider_max_width',
    'control.slider_height', 'control.slider_track_height', 'control.slider_track_radius',
    'control.slider_track_inset', 'control.slider_handle_inset',
    'control.slider_handle_size', 'control.slider_handle_size_active',
    'control.slider_state_layer_size', 'control.slider_focus_size',
    'control.slider_focus_width', 'control.slider_focus_offset', 'control.slider_focus_gap_width',
    'control.slider_tick_height',
    'control.slider_input_width', 'control.slider_input_width_invalid',
    'control.slider_input_outline_width_disabled',
    'type.slider_range_label', 'anatomy.slider_focus', 'anatomy.slider_disabled_paint', 'feedback.focus_trigger',
    'border.width_01', 'border.width_02',
    'shadow.slider_handle', 'shadow.slider_handle_disabled',
    'color.slider_range_label', 'color.slider_track', 'color.slider_track_disabled',
    'color.slider_track_filled', 'color.slider_track_filled_focus',
    'color.slider_handle', 'color.slider_handle_focus', 'color.slider_handle_gap_focus',
    'color.slider_state_layer_hover', 'color.slider_state_layer_focus', 'color.slider_state_layer_active',
    'color.slider_disabled', 'color.slider_focus_ring'
  ])),
  colors: Object.freeze(['background', 'layer_01', 'layer_02', 'layer_03'])
});
