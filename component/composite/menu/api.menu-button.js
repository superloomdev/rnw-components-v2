// Info: MenuButton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this
// and nothing more.

export default Object.freeze({
  name: 'MenuButton',
  props: Object.freeze({
    label: { type: 'string', required: true, description: 'The trigger\'s text.' },
    items: { type: 'array', required: true, description: 'The menu\'s entries, as Menu takes.' },
    kind: { type: 'string', required: false, description: 'The trigger\'s button kind: `primary` (default), `tertiary` or `ghost`.' },
    size: { type: 'string', required: false, description: 'One of `xs`, `sm`, `md`, `lg`: the trigger\'s and the menu\'s size. Default `lg`.' },
    menuAlignment: { type: 'string', required: false, description: '`bottom` (default), `top`, `bottom-start`, `bottom-end`, `top-start` or `top-end`: the edge the menu opens from and aligns to.' },
    open: { type: 'boolean', required: false, description: 'Whether the menu is open; when given the caller owns it, otherwise the trigger toggles it.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the trigger. Default false.' },
    menuBorder: { type: 'boolean', required: false, description: 'Draws the menu\'s border variant. Forwarded to Menu\'s `border`.' },
    menuBackgroundToken: { type: 'string', required: false, description: 'The menu surface\'s fill token (`layer` or `background`).' },
    onChange: { type: 'function', required: false, description: 'Called with the chosen entry\'s data.' },
    onClose: { type: 'function', required: false, description: 'Called when the menu closes (Escape, Tab, outside press or after a choice).' },
    accessibilityLabel: { type: 'string', required: false, description: 'Names the menu.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the container.' }
  }),
  kinds: Object.freeze(['primary', 'tertiary', 'ghost']),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.menu_button_min_width', 'control.button_icon_size',
    'control.menu_item_height', 'control.menu_padding_block',
    'size.size_xsmall', 'size.size_medium', 'size.size_large',
    'color.list_container', 'motion.duration_fast_02'
  ]),
  colors: Object.freeze([])
});
