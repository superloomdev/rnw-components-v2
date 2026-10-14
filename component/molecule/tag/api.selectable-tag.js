// Info: SelectableTag public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'SelectableTag',
  props: Object.freeze({
    text: { type: 'string', required: true, description: 'The tag\'s text.' },
    selected: { type: 'boolean', required: false, description: 'Controlled selected state; pairs with `onChange`. Omit for an uncontrolled tag.' },
    defaultSelected: { type: 'boolean', required: false, description: 'The uncontrolled initial selected state.' },
    onChange: { type: 'function', required: false, description: 'Called with the next selected state when the tag is pressed.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `sm`, `md`, `lg`. Default `md`.' },
    icon: { type: 'string', required: false, description: 'Semantic icon name drawn before the label; replaced by the selected mark while selected where the theme shows one.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the tag and draws the disabled colors.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the pressable.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze([
    'control.tag_interactive_outline_width', 'control.tag_interactive_height_small', 'control.tag_selectable_outline_width_selected',
    'color.tag_selectable_container', 'color.tag_selectable_container_hover',
    'color.tag_selectable_container_selected', 'color.tag_selectable_container_selected_hover',
    'color.tag_selectable_container_selected_disabled',
    'color.tag_selectable_label', 'color.tag_selectable_label_selected', 'color.tag_selectable_label_selected_disabled',
    'color.tag_selectable_outline', 'color.tag_selectable_layer_active', 'color.tag_interactive_outline_disabled',
    'color.tag_container_disabled', 'color.tag_label_disabled',
    'control.tag_focus_width', 'control.tag_focus_offset', 'feedback.focus_trigger', 'color.tag_focus_ring',
    'anatomy.tag_selected_mark', 'anatomy.tag_interactive_outline'
  ])
});
