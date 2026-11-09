// Info: AccordionSkeleton's public API and the tokens it reads.

export default Object.freeze({
  name: 'AccordionSkeleton',
  props: Object.freeze({
    count: { type: 'number', required: false, description: 'How many placeholder sections draw. Default 4.' },
    open: { type: 'boolean', required: false, description: 'Whether the first section draws its content bars. Default true.' },
    align: { type: 'string', required: false, description: 'Chevron side: `start` or `end`. Default `end`.' },
    isFlush: { type: 'boolean', required: false, description: 'Pulls the heading to the page edge.' },
    ordered: { type: 'boolean', required: false, description: 'Draws the ordered list element.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.accordion_divider_width', 'control.accordion_flush_inset',
    'control.accordion_heading_padding_inline',
    'control.accordion_icon_size', 'control.accordion_icon_top', 'control.accordion_title_gap',
    'control.accordion_content_padding_end', 'control.accordion_content_end_ratio',
    'size.size_medium', 'control.skeleton_text_height', 'control.skeleton_text_gap',
    'color.accordion_divider', 'color.accordion_icon',
    'type.accordion_title', 'font.family.sans'
  ]),
  colors: Object.freeze([])
});
