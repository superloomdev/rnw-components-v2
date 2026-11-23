// Info: HeaderMenuButton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'HeaderMenuButton',
  props: Object.freeze({
    accessibilityLabel: { type: 'string', required: true, description: 'The button\'s name (open or close the side navigation).' },
    isActive: { type: 'boolean', required: false, description: 'The side navigation is open: the close glyph on the selected fill with its side rules.' },
    isCollapsible: { type: 'boolean', required: false, description: 'Shown at every width. Without it the button shows below `breakpoint.lg` only.' },
    onPress: { type: 'function', required: false, description: 'Called when the button is pressed.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the button.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.header_action_container_hover', 'color.header_action_container_active', 'color.header_action_container_selected',
    'color.header_border', 'color.header_menu_button_icon', 'color.focus', 'icon.menu', 'icon.close'
  ]),
  colors: Object.freeze([])
});
