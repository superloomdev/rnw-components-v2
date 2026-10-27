// Info: OverflowMenuItem public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this
// and nothing more. Composed inside OverflowMenu it is one option of the
// panel; standalone it draws a single option row on the list container.

export default Object.freeze({
  name: 'OverflowMenuItem',
  props: Object.freeze({
    label: { type: 'string', required: true, description: 'The option\'s text.' },
    disabled: { type: 'boolean', required: false, description: 'Draws the disabled cells and skips the roving focus. Default false.' },
    danger: { type: 'boolean', required: false, description: 'The destructive kind: the label in the danger color, the hover fill on the button. Default false.' },
    divider: { type: 'boolean', required: false, description: 'Draws the top rule on the row (`hasDivider` upstream). Default false.' },
    href: { type: 'string', required: false, description: 'Turns the option into a link (web).' },
    size: { type: 'string', required: false, description: 'Composition prop: the panel\'s size (`md` rows at the option cell, `lg` at the large size). Default `md`.' },
    onPress: { type: 'function', required: false, description: 'Called on activation, before the panel closes.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the option pressable.' }
  }),
  composition: Object.freeze({
    registerItem: { type: 'function', required: false, description: 'Composition prop: registers the pressable with the parent\'s roving collection.' },
    index: { type: 'number', required: false, description: 'Composition prop: the option\'s position, for ordered part reads.' },
    onRequestClose: { type: 'function', required: false, description: 'Composition prop: closes the panel (the parent\'s) and refocuses the trigger after the option fires.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.option_height', 'size.size_large', 'control.list_item_padding_inline',
    'control.overflow_menu_option_max_width', 'control.menu_divider_width', 'control.menu_item_danger_focus_inset_width',
    'color.list_container', 'color.list_item_container_hover',
    'color.list_item_label', 'color.list_item_label_hover', 'color.list_item_label_disabled',
    'color.menu_divider', 'color.menu_item_danger_container_hover',
    'color.menu_item_danger_label', 'color.menu_item_danger_label_hover', 'color.menu_item_danger_focus_inset',
    'type.list_item'
  ]),
  colors: Object.freeze([])
});
