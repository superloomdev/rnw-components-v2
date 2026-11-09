// Info: SelectItem public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

import { LIST_PRESENTATION_TOKENS } from '../../roles.js';

export default Object.freeze({
  name: 'SelectItem',
  props: Object.freeze({
    label: { type: 'string', required: true, description: 'The option text, drawn on one line.' },
    value: { type: 'string', required: true, description: 'The option\'s value; a string or a finite number.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the option and draws the disabled label.' },
    selected: { type: 'boolean', required: false, description: 'Draws the option as selected; Select supplies it from its value.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the row.' }
  }),
  composition: Object.freeze({
    highlighted: { type: 'boolean', required: false, description: 'Composition prop: the keyboard highlight; Select supplies it from its highlight index.' },
    divider: { type: 'boolean', required: false, description: 'Composition prop: draws the divider hairline above the row.' },
    optionProps: { type: 'object', required: false, description: 'Composition prop: the props Select\'s behavior mints for the option, spread onto the row.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(LIST_PRESENTATION_TOKENS),
  colors: Object.freeze([])
});
