// Info: NotificationActionButton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

const KINDS = Object.freeze(['info', 'success', 'warning', 'error']);

export default Object.freeze({
  name: 'NotificationActionButton',
  props: Object.freeze({
    variant: { type: 'string', required: true, description: '`inline` (the ghost action) or `toast` (the tertiary-inverse action).' },
    lowContrast: { type: 'boolean', required: false, description: 'The inline action\'s hover reads the low-contrast fill leaf.' },
    label: { type: 'string', required: true, description: 'The action label.' },
    onPress: { type: 'function', required: false, description: 'Called by the action.' },
    'aria-describedby': { type: 'string', required: false, description: 'Forwarded to the button root.' },
    marginEnd: { type: 'number', required: false, description: 'Composition prop: the end margin a toast without a close takes (`control.notification_action_end_space`).' }
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
  ].concat(KINDS.flatMap(function (kind) {
    return ['color.notification_marker_' + kind, 'color.notification_background_' + kind, 'color.notification_outline_' + kind];
  })))
});
