// Info: MenuItemGroup public API, as data.

export default Object.freeze({
  name: 'MenuItemGroup',
  props: Object.freeze({
    label: { type: 'string', required: true, description: 'Names the run of items for assistive technology.' },
    children: { type: 'node', required: false, description: 'The group\'s items.' }
  }),
  composition: Object.freeze({}),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([]),
  colors: Object.freeze([])
});
