// Info: ProgressIndicator public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'ProgressIndicator',
  props: Object.freeze({
    items: { type: 'array', required: true, description: 'The steps, in order: `{ label, secondaryLabel, invalid, disabled, description, complete }` ProgressStep prop objects; each mounts a ProgressStep.' },
    currentIndex: { type: 'number', required: false, description: 'The index of the current step. Default 0: steps before it are `complete`, the step at it `current` unless it already passed `complete`, steps after it incomplete - the reference\'s clone math.' },
    onChange: { type: 'function', required: false, description: 'Called with a step\'s index when it is pressed; each step receives it as `onPress`.' },
    spaceEqually: { type: 'boolean', required: false, description: 'Spreads the steps at equal widths (horizontal only, as upstream).' },
    vertical: { type: 'boolean', required: false, description: 'Stacks the steps in the column form.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([]),
  colors: Object.freeze([])
});
