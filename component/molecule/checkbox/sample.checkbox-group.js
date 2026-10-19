// Info: CheckboxGroup sample states for the showcase, the browser gates
// and the docs. Each entry is one rendered instance: a label and the
// props it takes. Every state carries the same three items, ids
// alpha/beta/gamma, as the references mount them; `checked` and
// `indeterminate` are controlled sample data.

const ALPHA = Object.freeze({ id: 'alpha', label: 'Alpha' });
const BETA = Object.freeze({ id: 'beta', label: 'Beta' });
const GAMMA = Object.freeze({ id: 'gamma', label: 'Gamma' });

// A group's content width is its frame's, so the showcase, the walker
// and the browser gates lay its states out in a frame of this width
export const FRAME = Object.freeze({ width: 320 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ legendText: 'Options', items: Object.freeze([Object.freeze({ id: 'alpha', label: 'Alpha', checked: true }), BETA, GAMMA]) }) }),
  Object.freeze({ label: 'mixed', props: Object.freeze({ legendText: 'Options', items: Object.freeze([Object.freeze({ id: 'alpha', label: 'Alpha', indeterminate: true }), BETA, GAMMA]) }) }),
  Object.freeze({ label: 'helper', props: Object.freeze({ legendText: 'Options', helperText: 'Choose all that apply', items: Object.freeze([ALPHA, BETA, GAMMA]) }) }),
  Object.freeze({ label: 'invalid', props: Object.freeze({ legendText: 'Options', invalid: true, invalidText: 'Choose an option', items: Object.freeze([ALPHA, BETA, GAMMA]) }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ legendText: 'Options', disabled: true, items: Object.freeze([Object.freeze({ id: 'alpha', label: 'Alpha', checked: true }), BETA, GAMMA]) }) })
]);
