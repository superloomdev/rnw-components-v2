// Info: ToastNotification public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

const KINDS = Object.freeze(['info', 'success', 'warning', 'error']);

export default Object.freeze({
  name: 'ToastNotification',
  props: Object.freeze({
    kind: { type: 'string', required: false, description: 'One of `kinds`: the status the marker, the icon and (under `lowContrast`) the fill draw. Default `info`.' },
    lowContrast: { type: 'boolean', required: false, description: 'Draws the status fill, the plain support marker and primary text instead of the inverse container.' },
    title: { type: 'string', required: true, description: 'The title text.' },
    subtitle: { type: 'string', required: false, description: 'The body text under the title.' },
    caption: { type: 'string', required: false, description: 'The caption text at the foot of the details.' },
    action: { type: 'object', required: false, description: '{ label, onPress }: a link-styled action under the subtitle.' },
    onClose: { type: 'function', required: false, description: 'Called when the close button is pressed.' },
    closeLabel: { type: 'string', required: false, description: 'Accessible name of the close button. Default `Close`.' },
    role: { type: 'string', required: false, description: '`status` (the default, polite) or `alert` (assertive, for urgent kinds).' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: KINDS,
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'anatomy.status_marker', 'shadow.notification',
    'color.notification_container', 'color.notification_text', 'color.notification_close_icon', 'color.notification_action', 'color.notification_action_hover',
    'color.text_primary', 'color.icon_primary', 'font.family.sans',
    'control.notification_width', 'control.notification_radius', 'control.notification_min_height', 'control.notification_marker_width',
    'control.notification_outline_width', 'control.notification_icon_size', 'control.notification_icon_top', 'control.notification_toast_icon_top',
    'control.notification_icon_gap', 'control.notification_text_padding_block', 'control.notification_toast_text_padding_bottom', 'control.notification_title_gap',
    'control.notification_details_inset', 'control.notification_details_inset_end', 'control.icon_button_size',
    'spacing.spacing_03',
    'type.notification_title', 'type.notification_body',
    'icon.error_filled', 'icon.checkmark_filled', 'icon.information_filled', 'icon.warning_filled', 'icon.close'
  ].concat(KINDS.flatMap(function (kind) {
    return ['color.notification_marker_' + kind, 'color.notification_background_' + kind, 'color.notification_outline_' + kind, 'color.support_' + kind];
  })))
});
