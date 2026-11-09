// Info: DefinitionTooltip public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'DefinitionTooltip',
  props: Object.freeze({
    children: { type: 'string', required: true, description: 'The term; it carries the dotted underline that toggles the definition bubble.' },
    definition: { type: 'string', required: true, description: 'The definition shown in the inverse bubble while the term is open.' },
    align: { type: 'string', required: false, description: 'The side and alignment the bubble opens on; the 12 Popover placements. Default `bottom`.' },
    autoAlign: { type: 'boolean', required: false, description: 'Flips the placement at the viewport edge.' },
    openOnHover: { type: 'boolean', required: false, description: 'Opens on the pointer entering the term and closes when it leaves. Default false: a press toggles.' },
    defaultOpen: { type: 'boolean', required: false, description: 'Initially open.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the term\'s pressable.' }
  }),
  composition: Object.freeze({}),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.text_primary', 'color.definition_term_underline', 'color.definition_term_underline_hover',
    'color.tooltip_container', 'color.tooltip_label',
    'control.definition_tooltip_max_width', 'control.definition_tooltip_padding_block',
    'control.definition_tooltip_padding_inline',
    'type.definition_term', 'border.width_01', 'stacking.floating'
  ]),
  colors: Object.freeze([])
});
