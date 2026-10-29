// Info: ComposedModal public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'ComposedModal',
  props: Object.freeze({
    open: { type: 'boolean', required: true, description: 'Whether the dialog shows. The caller owns the state; `onClose` asks for a close.' },
    onClose: { type: 'function', required: false, description: 'Called on Escape, the close button, and a passive dialog\'s outside press. Returning `false` vetoes the close.' },
    size: { type: 'string', required: false, description: 'One of `xs`, `sm`, `md`, `lg`: the width and height ratio step. Default `md`.' },
    danger: { type: 'boolean', required: false, description: 'Draws the footer primary as a danger button and lands initial focus on the secondary.' },
    isFullWidth: { type: 'boolean', required: false, description: 'Spans the layer space instead of the size\'s width ratio.' },
    preventCloseOnClickOutside: { type: 'boolean', required: false, description: 'Default: outside press closes only a passive dialog (no footer).' },
    returnFocusRef: { type: 'object', required: false, description: 'Ref of the launcher; focused when the dialog closes.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name; the heading names the dialog when this is not given.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the dialog container.' },
    header: { type: 'object', required: false, description: 'ModalHeader props: { label, title, iconDescription, buttonOnClick }.' },
    children: { type: 'node', required: false, description: 'The body content.' },
    body: { type: 'object', required: false, description: 'ModalBody props: { hasScrollingContent, hasForm, accessibilityLabel }.' },
    footer: { type: 'object', required: false, description: 'ModalFooter props: { primaryButtonText, primaryButtonDisabled, onRequestSubmit, secondaryButtonText, secondaryButtons, onRequestClose, danger, loadingStatus, loadingDescription }. Absent draws a passive dialog.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['xs', 'sm', 'md', 'lg']),
  tokens: Object.freeze([
    'anatomy.dialog_actions', 'anatomy.dialog_close', 'anatomy.dialog_label', 'anatomy.dialog_scroll_fade', 'stacking.overlay',
    'color.dialog_scrim', 'color.dialog_container', 'color.dialog_border', 'color.dialog_heading', 'color.dialog_body', 'color.text_secondary',
    'control.dialog_border_width', 'control.dialog_radius', 'control.dialog_min_width', 'control.dialog_max_width', 'control.dialog_min_height',
    'control.dialog_width_ratio', 'control.dialog_width_ratio_xs', 'control.dialog_width_ratio_sm', 'control.dialog_width_ratio_lg',
    'control.dialog_height_ratio', 'control.dialog_height_ratio_xs', 'control.dialog_height_ratio_sm', 'control.dialog_height_ratio_lg',
    'control.dialog_enter_offset', 'control.dialog_text_gutter_ratio', 'control.dialog_padding_inline', 'control.dialog_padding_top',
    'control.dialog_header_gap', 'control.dialog_header_space', 'control.dialog_body_padding_top', 'control.dialog_body_padding_bottom',
    'control.dialog_scroll_fade_height', 'control.dialog_scroll_fade_min_height', 'control.dialog_scroll_fade_start', 'control.dialog_scroll_end_space',
    'control.dialog_actions_height', 'control.dialog_actions_gap', 'control.dialog_actions_padding', 'control.dialog_action_ratio',
    'control.dialog_action_ratio_three', 'control.dialog_action_padding_top', 'control.dialog_action_padding_bottom',
    'control.dialog_close_icon_size', 'control.icon_button_size', 'spacing.spacing_05', 'spacing.spacing_07', 'shadow.dialog',
    'type.dialog_heading', 'type.dialog_body', 'type.label01', 'font.family.sans', 'motion.duration_moderate_02', 'icon.close'
  ])
});
