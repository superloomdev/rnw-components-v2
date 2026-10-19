// Info: Multiple-choice field API; selected values are independent of rows.
import { FIELD_PRESENTATION_TOKENS, LIST_PRESENTATION_TOKENS } from '../../roles.js';

export default Object.freeze({
  name: 'MultiSelect',
  props: Object.freeze({
    items: { type: 'array', required: true, description: 'Flat options `{ value, label, disabled? }`; values are unique strings or finite numbers and labels are strings.' },
    value: { type: 'array', required: false, description: 'Controlled selected values; empty is `[]`. Unavailable values remain selected until explicitly cleared.' },
    defaultValue: { type: 'array', required: false, description: 'Initial uncontrolled selected values; applied once, else `[]`.' },
    onChange: { type: 'function', required: false, description: 'Requests the next fresh selected-value array after a user toggle or clear.' },
    label: { type: 'string', required: false, description: 'Visible label naming the field; absent requires `accessibilityLabel`.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible field name when no visible label is supplied.' },
    placeholder: { type: 'string', required: false, description: 'Field prompt. Default empty.' },
    open: { type: 'boolean', required: false, description: 'Controlled open state; absent the field opens and closes itself.' },
    onOpenChange: { type: 'function', required: false, description: 'Requests the next open state; matching states do not notify again.' },
    size: { type: 'string', required: false, description: '`sm`, `md` (default) or `lg`, sizing both field and option rows.' },
    disabled: { type: 'boolean', required: false, description: 'Closes the list and blocks all activation, text and clear requests.' },
    invalid: { type: 'boolean', required: false, description: 'Draws the error treatment and announces invalid while enabled.' },
    invalidText: { type: 'string', required: false, description: 'Error message below the field while invalid.' },
    helperText: { type: 'string', required: false, description: 'Supporting text below the field while not invalid.' },
    clearLabel: { type: 'string', required: false, description: 'Accessible count-chip clear name. Default `Clear selection`.' },
    selectionCountLabel: { type: 'function', required: false, description: 'Formats the committed selected-count announcement; must return a string.' },
    clearAnnouncement: { type: 'string', required: false, description: 'Live-region text after the committed selection becomes empty. Default `All items cleared`.' },
    surface: { type: 'string', required: false, description: 'Surface leaf used by the floating-label notch; defaults to `FIELD_SURFACE`, else `background`.' },
    testID: { type: 'string', required: false, description: 'Test identifier on the field root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze(FIELD_PRESENTATION_TOKENS.concat(LIST_PRESENTATION_TOKENS, [
    'control.field_height', 'control.field_radius', 'control.field_icon_size',
    'control.multi_select_checkbox_inset', 'control.checkbox_size', 'control.tag_close_gap', 'control.tag_padding_inline',
    'size.size_small', 'size.size_large', 'size.size_xsmall',
    'spacing.spacing_01', 'spacing.spacing_02', 'spacing.spacing_03', 'spacing.spacing_04',
    'spacing.spacing_05', 'spacing.spacing_08', 'spacing.spacing_09', 'spacing.spacing_10',
    'border.width_01', 'border.width_02',
    'color.background_inverse', 'color.background_inverse_hover',
    'color.text_inverse', 'color.icon_inverse', 'color.focus_inverse',
    'color.text_disabled', 'color.icon_disabled', 'color.layer_01',
    'color.border_subtle_01', 'color.select_outline_disabled', 'color.select_indicator_focus'
  ])),
  colors: Object.freeze(['background', 'layer_01', 'layer_02', 'layer_03'])
});
