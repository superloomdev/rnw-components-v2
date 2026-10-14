// Info: ProgressStep public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'ProgressStep',
  props: Object.freeze({
    label: { type: 'string', required: true, description: 'The step\'s text; it names the step with the state sentence.' },
    description: { type: 'string', required: false, description: 'The state glyph\'s accessible name.' },
    current: { type: 'boolean', required: false, description: 'The step is the current one: the incomplete glyph in the interactive color, the complete line; not pressable.' },
    complete: { type: 'boolean', required: false, description: 'The step is done: the checkmark glyph and the complete line.' },
    invalid: { type: 'boolean', required: false, description: 'The step is invalid: the warning glyph and the invalid colors, overriding the state.' },
    secondaryLabel: { type: 'string', required: false, description: 'A second line under the label, in the secondary-label type and color.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the step and draws the disabled colors; not pressable.' },
    onPress: { type: 'function', required: false, description: 'Makes the step pressable; ProgressIndicator supplies it from `onChange`. Dropped while `current`, as upstream.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the pressable.' }
  }),
  composition: Object.freeze({
    vertical: { type: 'boolean', required: false, description: 'Composition prop: the column layout the indicator injects.' },
    spaceEqually: { type: 'boolean', required: false, description: 'Composition prop: the equal-width layout the indicator injects.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.progress_step_width', 'control.progress_step_min_width', 'control.progress_step_vertical_min_height',
    'control.progress_step_icon_top', 'control.progress_step_icon_gap', 'control.progress_step_vertical_icon_top',
    'control.progress_step_line_width', 'control.progress_step_vertical_line_width',
    'control.progress_step_focus_width',
    'control.progress_step_label_max_width', 'control.progress_step_label_max_width_vertical',
    'control.progress_step_label_gap',
    'control.progress_step_secondary_label_top', 'control.progress_step_secondary_label_start',
    'spacing.spacing_04',
    'size.icon_01', 'shape.radius_max',
    'type.progress_step_label', 'type.progress_step_secondary_label', 'font.family.sans',
    'color.progress_step_icon', 'color.progress_step_icon_incomplete', 'color.progress_step_icon_disabled', 'color.progress_step_icon_invalid',
    'color.progress_step_line', 'color.progress_step_line_complete',
    'color.progress_step_label', 'color.progress_step_label_hover', 'color.progress_step_label_focus', 'color.progress_step_label_disabled',
    'color.progress_step_secondary_label',
    'feedback.focus_trigger',
    'motion.duration_fast_02', 'motion.easing_standard_productive'
  ]),
  colors: Object.freeze([])
});
