// Info: HeaderName public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'HeaderName',
  props: Object.freeze({
    children: { type: 'string', required: true, description: 'The product name.' },
    prefix: { type: 'string', required: false, description: 'A lighter word before the name (a company, before its product). Default none.' },
    href: { type: 'string', required: false, description: 'Where the name links to.' },
    onPress: { type: 'function', required: false, description: 'Called when the name is pressed.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the link.' }
  }),
  composition: Object.freeze({
    afterToggle: { type: 'boolean', required: false, description: 'Composition prop: a collapsible menu button precedes the name, which then starts closer to it (the header sets it).' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['type.header_name', 'type.header_name_prefix', 'color.header_name_label', 'color.focus']),
  colors: Object.freeze([])
});
