// Info: AccordionItem's public API and the tokens it reads. The member is
// measured through Accordion's samples; it has no upstream visual reference.

export default Object.freeze({
  name: 'AccordionItem',
  props: Object.freeze({
    title: { type: 'string', required: true, description: 'The heading text.' },
    children: { type: 'node', required: false, description: 'The collapsible body.' },
    open: { type: 'boolean', required: false, description: 'Controlled open state. Absent: the item keeps its own from `defaultOpen`.' },
    defaultOpen: { type: 'boolean', required: false, description: 'Initially open while uncontrolled.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the heading.' },
    id: { type: 'string', required: false, description: 'Composition prop: the content element\'s id the heading\'s `aria-controls` names; a stable id is generated when absent.' },
    onOpenChange: { type: 'function', required: false, description: 'Called with the next open state.' }
  }),
  composition: Object.freeze({
    align: { type: 'string', description: '`start` | `end`  -  the chevron side the parent passes.' },
    size: { type: 'string', description: '`sm` | `md` | `lg`  -  the heading height the parent passes.' },
    flush: { type: 'boolean', description: 'The heading reads the flush inset the parent passes.' },
    dividerHover: { type: 'boolean', description: 'This heading is hovered; the item\'s top rule reads the hover cell.' },
    previousHover: { type: 'boolean', description: 'The previous item\'s heading is hovered; the item\'s top rule reads the hover cell.' },
    contentId: { type: 'string', description: 'The content region\'s id the heading\'s `aria-controls` names.' },
    last: { type: 'boolean', description: 'The last item draws the closing rule under it.' },
    onHoverChange: { type: 'function', description: 'Reports heading hover to the parent so the next rule blends.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.accordion_divider_width', 'control.accordion_flush_inset',
    'control.accordion_heading_padding_inline', 'control.accordion_focus_width',
    'control.accordion_icon_size', 'control.accordion_icon_top', 'control.accordion_title_gap',
    'control.accordion_content_padding_top', 'control.accordion_content_padding_bottom',
    'control.accordion_content_padding_end', 'control.accordion_content_end_ratio',
    'color.accordion_divider', 'color.accordion_divider_hover',
    'color.accordion_heading_label', 'color.accordion_heading_label_disabled',
    'color.accordion_heading_container_hover', 'color.accordion_focus',
    'color.accordion_icon', 'color.accordion_icon_disabled',
    'color.text_primary',
    'type.accordion_title', 'type.body_compact_01', 'font.family.sans',
    'feedback.focus_trigger', 'motion.duration_fast_02'
  ]),
  colors: Object.freeze([])
});
