// Info: ProgressBar public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'ProgressBar',
  props: Object.freeze({
    label: { type: 'string', required: false, description: 'Visible label; it names the bar through `aria-labelledby`. Without it, pass `accessibilityLabel`.' },
    value: { type: 'number', required: false, description: 'Progress toward `max`, clamped into it. Absent or not a number while `status` is `active`: the theme\'s indeterminate anatomy draws.' },
    max: { type: 'number', required: false, description: 'The value at which the bar is full. Default 100.' },
    status: { type: 'string', required: false, description: 'One of `kinds`: `active` (the default), `finished` (a full bar in the success color with the finished icon), `error` (a full bar in the error color with the error icon).' },
    helperText: { type: 'string', required: false, description: 'A line below the bar; the error color while `status` is `error`.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `sm`, `lg`. Default `lg`.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name when there is no visible label.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the bar.' }
  }),
  kinds: Object.freeze(['active', 'finished', 'error']),
  variants: Object.freeze(['sm', 'lg']),
  tokens: Object.freeze([
    'anatomy.progress_indeterminate',
    'control.progress_height', 'control.progress_radius',
    'spacing.spacing_02', 'spacing.spacing_03', 'spacing.spacing_05', 'spacing.spacing_09',
    'size.icon_01',
    'motion.duration_fast_02', 'motion.duration_extra_slow_04',
    'motion.easing_standard_productive', 'motion.easing_linear',
    'type.body_compact_01', 'type.helper_text_01', 'font.family.sans',
    'color.progress_track', 'color.progress_indicator',
    'color.progress_indicator_success', 'color.progress_indicator_error',
    'color.text_primary', 'color.text_secondary', 'color.text_error'
  ]),
  colors: Object.freeze([])
});
