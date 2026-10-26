// Info: SkipToContent public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this
// and nothing more.

export default Object.freeze({
  name: 'SkipToContent',
  props: Object.freeze({
    children: { type: 'string', required: false, description: 'The link text. Default `Skip to main content`.' },
    href: { type: 'string', required: false, description: 'The anchor the link jumps to. Default `#main-content`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the link.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.skip_link_height', 'control.skip_link_padding_inline', 'control.skip_link_border_width',
    'color.skip_link_container', 'color.skip_link_label', 'color.skip_link_border',
    'type.skip_link', 'stacking.skip_link'
  ]),
  colors: Object.freeze([])
});
