// Info: ModalFooter public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more. ModalFooter must be composed inside ComposedModal.

export default Object.freeze({
  name: 'ModalFooter',
  props: Object.freeze({
    primaryButtonText: { type: 'string', required: false, description: 'The primary action label.' },
    primaryButtonDisabled: { type: 'boolean', required: false, description: 'Disables the primary action.' },
    onRequestSubmit: { type: 'function', required: false, description: 'Called by the primary action.' },
    secondaryButtonText: { type: 'string', required: false, description: 'The secondary action label; mutually exclusive with `secondaryButtons`.' },
    secondaryButtons: { type: 'array', required: false, description: 'Two `{ buttonText, onClick }` entries draw the three-button layout; one draws the two-button.' },
    onRequestClose: { type: 'function', required: false, description: 'Called by the secondary actions; defaults to the parent\'s close request.' },
    danger: { type: 'boolean', required: false, description: 'Draws the primary as a danger button.' },
    loadingStatus: { type: 'string', required: false, description: 'Anything but `inactive` shows an InlineLoading in the primary.' },
    loadingDescription: { type: 'string', required: false, description: 'Accessible description of the primary\'s InlineLoading.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'anatomy.dialog_actions',
    'control.dialog_actions_height', 'control.dialog_actions_gap', 'control.dialog_actions_padding', 'control.dialog_action_ratio',
    'control.dialog_action_ratio_three', 'control.dialog_action_padding_top', 'control.dialog_action_padding_bottom',
    'spacing.spacing_05', 'font.family.sans'
  ])
});
