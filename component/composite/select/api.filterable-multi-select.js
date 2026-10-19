// Info: The same multiple-choice field with a separately controlled query.
import BASE from './api.multi-select.js';

export default Object.freeze({
  ...BASE,
  name: 'FilterableMultiSelect',
  props: Object.freeze({
    ...BASE.props,
    inputValue: { type: 'string', required: false, description: 'Controlled filter text, independent of selected values.' },
    defaultInputValue: { type: 'string', required: false, description: 'Initial uncontrolled filter text; applied once, else empty.' },
    onInputChange: { type: 'function', required: false, description: 'Requests the next text from user editing or clear, not from external prop echoes.' },
    shouldFilterItem: { type: 'function', required: false, description: 'Predicate `({ item, inputValue }) => boolean`; default case-insensitive label inclusion.' }
  })
});
