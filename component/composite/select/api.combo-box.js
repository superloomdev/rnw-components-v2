// Info: ComboBox public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

import { FIELD_PRESENTATION_TOKENS, LIST_PRESENTATION_TOKENS } from '../../roles.js';

export default Object.freeze({
  name: 'ComboBox',
  props: Object.freeze({
    items: { type: 'array', required: true, description: 'Options, each `{ value, label, disabled? }`; `value` is unique. The input filters them as you type.' },
    label: { type: 'string', required: false, description: 'Visible label; it names the combo box. Without it, pass `accessibilityLabel`.' },
    placeholder: { type: 'string', required: false, description: 'Text shown while the input is empty.' },
    value: { type: 'string', required: false, description: 'Controlled selected value. Absent: the combo box keeps its own selection, starting empty.' },
    defaultValue: { type: 'string', required: false, description: 'Initial selected value for an uncontrolled combo box.' },
    onChange: { type: 'function', required: false, description: 'Called with the selected option\'s value, or `null` when the selection clears.' },
    inputValue: { type: 'string', required: false, description: 'Controlled input text. Absent: the combo box keeps its own query.' },
    defaultInputValue: { type: 'string', required: false, description: 'Initial input text for an uncontrolled combo box.' },
    onInputChange: { type: 'function', required: false, description: 'Called with the next input text whenever it changes.' },
    shouldFilterItem: { type: 'function', required: false, description: 'Filter predicate `(item, query)`; defaults to case-insensitive label inclusion.' },
    open: { type: 'boolean', required: false, description: 'Controlled open state of the list. Absent: the combo box opens and closes itself.' },
    onOpenChange: { type: 'function', required: false, description: 'Called with the next open state whenever the list opens or closes.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `sm`, `md`, `lg`. Default `md`.' },
    disabled: { type: 'boolean', required: false, description: 'Disables input and opening, draws the disabled colors and announces the combo box as disabled.' },
    invalid: { type: 'boolean', required: false, description: 'Draws the error border and icon, shows `invalidText` and announces the combo box as invalid.' },
    invalidText: { type: 'string', required: false, description: 'Message shown below while `invalid`.' },
    helperText: { type: 'string', required: false, description: 'Message shown below while not `invalid`.' },
    clearLabel: { type: 'string', required: false, description: 'The clear button\'s accessible name. Default from the behavior.' },
    surface: { type: 'string', required: false, description: 'Color leaf of the surface the combo box sits on; a floating label occludes the border with it. Default: config `FIELD_SURFACE`, else `background`.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name when there is no visible label.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the input.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze(FIELD_PRESENTATION_TOKENS.concat(LIST_PRESENTATION_TOKENS, [
    'anatomy.list_selected_mark',
    'control.field_height', 'control.field_radius', 'control.field_icon_size', 'control.field_padding_inline',
    'control.combo_box_clear_size', 'control.combo_box_clear_inset_end',
    'control.combo_box_input_padding_end', 'control.combo_box_input_padding_end_invalid',
    'control.combo_box_invalid_icon_inset_end',
    'size.size_small', 'size.size_large', 'size.size_xsmall',
    'spacing.spacing_01', 'spacing.spacing_02', 'spacing.spacing_04', 'spacing.spacing_06',
    'font.family.sans',
    'color.border_subtle_00',
    'color.select_outline_disabled', 'color.select_indicator_focus'
  ])),
  colors: Object.freeze(['background', 'layer_01', 'layer_02', 'layer_03'])
});
