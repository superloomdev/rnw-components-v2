// Info: MenuItemRadioGroup public API, as data.

export default Object.freeze({
  name: 'MenuItemRadioGroup',
  props: Object.freeze({
    label: { type: 'string', required: true, description: 'Names the set for assistive technology.' },
    children: { type: 'node', required: false, description: 'The radio options (MenuItemSelectable or MenuItem with `radio`).' },
    selectedItem: { type: 'string', required: false, description: 'The selected option\'s label.' }
  }),
  composition: Object.freeze({}),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([]),
  colors: Object.freeze([])
});
