// Info: Card public API, as data.
export default Object.freeze({
  name: 'Card',
  props: Object.freeze({
    actionIcons: { type: 'array', required: false, description: 'Icon seats `{ icon, label, onPress }` - ghost IconButtons, sm at the top, md at the bottom.' },
    actionsPlacement: { type: 'string', required: false, description: 'One of `top`, `bottom`. Default `bottom`.' },
    children: { type: 'node', required: false, description: 'The body content.' },
    clickZone: { type: 'string', required: false, description: 'One of `one`, `two`, `three`. Only `one` puts the role, tab stop and keys on the root.' },
    description: { type: 'string', required: false, description: 'The description under the title.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the card and removes interaction.' },
    label: { type: 'string', required: false, description: 'The small label over the title.' },
    onClick: { type: 'function', required: false, description: 'Called on activation in the click zone.' },
    overflowActions: { type: 'array', required: false, description: '`{ label, onPress }` items inside an OverflowMenu.' },
    primaryButtonText: { type: 'string', required: false, description: 'The primary footer button\'s label.' },
    secondaryButtonText: { type: 'string', required: false, description: 'The secondary footer button\'s label.' },
    onPrimaryButtonClick: { type: 'function', required: false, description: 'Called by the primary footer button.' },
    onSecondaryButtonClick: { type: 'function', required: false, description: 'Called by the secondary footer button.' },
    title: { type: 'string', required: false, description: 'The card title.' },
    titleSize: { type: 'string', required: false, description: 'One of `default`, `large`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the card.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.card_container', 'color.card_label', 'control.card_border_width', 'color.card_outline_clickable',
    'color.card_container_hover', 'color.card_focus', 'control.card_focus_width', 'control.card_padding',
    'control.card_header_padding_bottom_label', 'control.card_actions_space', 'type.card_label', 'type.card_description',
    'type.card_title', 'type.card_title_large', 'control.card_text_gap', 'type.card_body', 'control.card_body_padding_top',
    'color.card_divider', 'control.card_divider_width', 'control.card_actions_height', 'control.card_action_padding_inline',
    'control.card_actions_offset', 'control.card_action_divider_height', 'control.card_action_divider_width',
    'color.card_action_divider', 'control.card_icon_padding', 'control.card_icon_gap', 'color.card_icon_container_hover',
    'color.card_icon_active', 'font.family.sans'
  ]),
  colors: Object.freeze([])
});
