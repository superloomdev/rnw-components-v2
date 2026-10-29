// Info: ModalHeader public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more. ModalHeader must be composed inside ComposedModal.

export default Object.freeze({
  name: 'ModalHeader',
  props: Object.freeze({
    label: { type: 'string', required: false, description: 'The eyebrow text above the heading, shown where `anatomy.dialog_label` says so.' },
    title: { type: 'string', required: true, description: 'The heading text; names the dialog unless the parent gives an `accessibilityLabel`.' },
    iconDescription: { type: 'string', required: false, description: 'Accessible name of the close button. Default `Close`.' },
    buttonOnClick: { type: 'function', required: false, description: 'Called by the close button; defaults to the parent\'s close request.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'anatomy.dialog_close', 'anatomy.dialog_label',
    'color.dialog_heading', 'color.text_secondary',
    'control.dialog_padding_top', 'control.dialog_padding_inline', 'control.dialog_header_gap', 'control.dialog_header_space',
    'control.dialog_close_icon_size', 'control.icon_button_size',
    'type.dialog_heading', 'type.label01', 'font.family.sans', 'icon.close'
  ])
});
