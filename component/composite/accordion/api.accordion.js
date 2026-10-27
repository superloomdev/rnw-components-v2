// Info: Accordion's public API and the tokens it reads.

export default Object.freeze({
  name: 'Accordion',
  props: Object.freeze({
    items: { type: 'array', required: true, description: 'The sections, each `{ title, children, open, defaultOpen, disabled, id }`  -  `open` controls, `defaultOpen` seeds uncontrolled.' },
    align: { type: 'string', required: false, description: 'Chevron side: `start` (before the title) or `end` (after). Default `end`, upstream\'s `align` prop.' },
    size: { type: 'string', required: false, description: 'Heading size: `sm`, `md`, `lg`. Default `md`.' },
    isFlush: { type: 'boolean', required: false, description: 'Pulls the heading text to the page edge (`control.accordion_flush_inset`).' },
    ordered: { type: 'boolean', required: false, description: 'Numbers the sections (an ordered list element instead of an unordered one).' },
    disabled: { type: 'boolean', required: false, description: 'Disables every section heading; an item\'s own `disabled` also applies.' },
    onChange: { type: 'function', required: false, description: 'Called as `{ index, open }` when a section toggles.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.accordion_divider_width', 'control.accordion_flush_inset',
    'control.accordion_heading_padding_inline', 'control.accordion_focus_width',
    'control.accordion_icon_size', 'control.accordion_icon_top', 'control.accordion_title_gap',
    'control.accordion_content_padding_top', 'control.accordion_content_padding_bottom',
    'control.accordion_content_padding_end', 'control.accordion_content_end_ratio',
    'size.size_small', 'size.size_medium', 'size.size_large',
    'color.accordion_divider', 'color.accordion_divider_hover',
    'color.accordion_heading_label', 'color.accordion_heading_label_disabled',
    'color.accordion_heading_container_hover', 'color.accordion_focus',
    'color.accordion_icon', 'color.accordion_icon_disabled',
    'type.accordion_title', 'type.body_compact_01', 'font.family.sans',
    'feedback.focus_trigger', 'feedback.press', 'motion.duration_fast_02'
  ]),
  colors: Object.freeze([])
});
