// Info: Text public API, as data. The docs generator and the accessibility
// tests read this; the component implements exactly this and nothing more.

export default Object.freeze({
  name: 'Text',
  props: Object.freeze({
    text: { type: 'string', required: false, description: 'Text to render. When absent, `children` render instead.' },
    children: { type: 'node', required: false, description: 'Content to render when `text` is absent.' },
    type: { type: 'string', required: false, description: 'Type set leaf under `type.` (`body_compact_01`, `heading03`, `label01`, `code01`, ...). Default `body_compact_02`. A leaf the theme lacks throws.' },
    color: { type: 'string', required: false, description: 'Color token leaf under `color.`. Default `text_primary`.' },
    breakMode: { type: 'string', required: false, description: 'Where a single line is cut: `head`, `middle` or `tail` render one line with an ellipsis there; `wrap` or absent wraps freely.' },
    accessibilityRole: { type: 'string', required: false, description: 'Role forwarded to the text element, for example `header` for a heading.' },
    id: { type: 'string', required: false, description: 'Element id forwarded to the text element, for the legend and label relationships a form row wires.' },
    focusable: { type: 'boolean', required: false, description: 'Whether the text sits in the tab order; a tooltip gives its bare string anchor a tab stop this way.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the text element.' },
    style: { type: 'object', required: false, description: 'Style merged last (layout only; type and color are props).' }
  }),
  composition: Object.freeze({
    headingLevel: { type: 'number', required: false, description: 'Composition prop: the heading level (1 through 6) a Section hierarchy sets; emitted as the level of a `header` role.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['type.body_compact_02', 'color.text_primary', 'font.family.sans']),
  colors: Object.freeze([
    'text_primary', 'text_secondary', 'text_placeholder', 'text_helper', 'text_error',
    'text_disabled', 'text_inverse', 'text_on_color', 'text_on_color_disabled', 'link_primary'
  ])
});
