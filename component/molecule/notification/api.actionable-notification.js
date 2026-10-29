// Info: ActionableNotification public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

const KINDS = Object.freeze(['info', 'success', 'warning', 'error', 'info-square', 'warning-alt']);

export default Object.freeze({
  name: 'ActionableNotification',
  props: Object.freeze({
    kind: { type: 'string', required: false, description: 'One of `kinds`: the status the marker, the icon and (under `lowContrast`) the fill and outline draw. Default `info`.' },
    lowContrast: { type: 'boolean', required: false, description: 'Draws the kind fill, the kind outline and primary text instead of the inverse container.' },
    inline: { type: 'boolean', required: false, description: 'Draws the inline layout with the ghost action; the default draws the toast layout with the tertiary-inverse action.' },
    title: { type: 'string', required: true, description: 'The title text.' },
    subtitle: { type: 'string', required: false, description: 'The body text beside the title.' },
    caption: { type: 'string', required: false, description: 'The caption text under the title and subtitle.' },
    actionButtonLabel: { type: 'string', required: true, description: 'The action label.' },
    onActionButtonClick: { type: 'function', required: false, description: 'Called by the action.' },
    hideCloseButton: { type: 'boolean', required: false, description: 'Draws no close button; the toast action then takes `control.notification_action_end_space` before the end.' },
    onCloseButtonClick: { type: 'function', required: false, description: 'Called by the close button, before `onClose`.' },
    onClose: { type: 'function', required: false, description: 'Called by the close button after `onCloseButtonClick`; returning `false` vetoes the close and the unmount.' },
    closeOnEscape: { type: 'boolean', required: false, description: 'Escape asks for the close; default `true`.' },
    closeLabel: { type: 'string', required: false, description: 'Accessible name of the close button. Default `Close`.' },
    role: { type: 'string', required: false, description: '`alertdialog` (the default, which traps focus), `alert` or `status`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: KINDS,
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.notification_container', 'color.notification_text', 'color.notification_close_icon', 'color.notification_action',
    'color.notification_action_hover', 'color.notification_action_container_hover', 'color.notification_action_tertiary_inverse',
    'color.notification_action_tertiary_inverse_hover', 'color.notification_action_tertiary_inverse_active', 'color.notification_action_tertiary_inverse_text',
    'color.notification_warning_icon_inner', 'color.text_primary', 'color.icon_primary', 'color.focus', 'color.focus_ring_inverse', 'font.family.sans',
    'control.notification_inline_width', 'control.notification_width', 'control.notification_min_height', 'control.notification_marker_width',
    'control.notification_outline_width', 'control.notification_details_inset', 'control.notification_details_inset_end', 'control.notification_icon_top',
    'control.notification_toast_icon_top', 'control.notification_icon_gap', 'control.notification_icon_size', 'control.notification_text_padding_block',
    'control.notification_toast_text_padding_bottom', 'control.notification_title_gap', 'control.notification_action_height', 'control.notification_action_inset',
    'control.notification_toast_action_inset', 'control.notification_action_end_space', 'control.notification_radius', 'control.icon_button_size',
    'spacing.spacing_03', 'shadow.notification',
    'type.notification_title', 'type.notification_body',
    'icon.error_filled', 'icon.success', 'icon.information_filled', 'icon.warning_filled', 'icon.information_square_filled', 'icon.warning_alt_filled', 'icon.close'
  ].concat(['info', 'success', 'warning', 'error'].flatMap(function (kind) {
    return ['color.notification_marker_' + kind, 'color.notification_background_' + kind, 'color.notification_outline_' + kind];
  })))
});
