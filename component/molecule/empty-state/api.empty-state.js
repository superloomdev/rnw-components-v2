// Info: EmptyState public API, as data.
export default Object.freeze({
  name: 'EmptyState',
  props: Object.freeze({
    action: { type: 'object', required: false, description: 'The action button `{ text, onClick, kind }` - `tertiary` `sm` by default.' },
    illustration: { type: 'node', required: false, description: 'The illustration (Image or node).' },
    illustrationPosition: { type: 'string', required: false, description: 'One of `top`, `left`. Default `top`.' },
    link: { type: 'object', required: false, description: 'The learn-more link `{ text, href }`.' },
    size: { type: 'string', required: false, description: 'One of `lg`, `sm`. Default `lg`.' },
    subtitle: { type: 'string', required: false, description: 'The supporting text under the title.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' },
    title: { type: 'string', required: true, description: 'The title.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['lg', 'sm']),
  tokens: Object.freeze([
    'type.empty_state_title', 'type.empty_state_title_small', 'type.empty_state_subtitle',
    'type.empty_state_subtitle_small', 'color.empty_state_title', 'color.empty_state_subtitle',
    'control.empty_state_title_gap', 'control.empty_state_subtitle_gap', 'control.empty_state_illustration_size',
    'control.empty_state_illustration_size_small', 'control.empty_state_illustration_gap',
    'control.empty_state_action_gap', 'font.family.sans'
  ]),
  colors: Object.freeze([])
});
