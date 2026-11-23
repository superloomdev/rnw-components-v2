// Info: HeaderGlobalAction public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'HeaderGlobalAction',
  props: Object.freeze({
    icon: { type: 'string', required: true, description: 'The icon token the action draws.' },
    accessibilityLabel: { type: 'string', required: true, description: 'The action\'s name, which its tooltip shows.' },
    isActive: { type: 'boolean', required: false, description: 'The action\'s panel is open: the selected fill with its side rules.' },
    onPress: { type: 'function', required: false, description: 'Called when the action is pressed.' },
    tooltipAlignment: { type: 'string', required: false, description: 'One of `start`, `center`, `end`: where the tooltip under the action aligns. Default `center`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the button.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.header_action_icon', 'color.header_action_icon_hover', 'color.header_action_icon_active', 'color.header_action_icon_selected',
    'color.header_action_container_hover', 'color.header_action_container_active', 'color.header_action_container_selected',
    'color.header_border', 'color.focus'
  ]),
  colors: Object.freeze([])
});
