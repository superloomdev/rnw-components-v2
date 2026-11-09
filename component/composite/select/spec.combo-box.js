// Info: ComboBox spec sheet. The field frame and the open list share the
// family's dropdown sheet; the editable input's own cells reserve the clear
// button's square, its end inset, the end paddings while populated and the
// invalid icon's inset. Every metric names a token.

import DROPDOWN_SPEC from './spec.dropdown.js';

export default Object.freeze(Object.assign({}, DROPDOWN_SPEC, {
  clearSize: 'control.combo_box_clear_size',
  clearInsetEnd: 'control.combo_box_clear_inset_end',
  inputPaddingEnd: 'control.combo_box_input_padding_end',
  inputPaddingEndInvalid: 'control.combo_box_input_padding_end_invalid',
  invalidIconInsetEnd: 'control.combo_box_invalid_icon_inset_end'
}));
