// Info: RadioButtonGroup sample states for the showcase, the browser
// gates and the docs. Each entry is one rendered instance: a label and
// the props it takes. Every state carries the same three items, values
// alpha/beta/gamma, as the references mount them; `defaultValue` is
// uncontrolled sample data, so the group stays live in the showcase.

const ALPHA = Object.freeze({ value: 'alpha', label: 'Alpha' });
const BETA = Object.freeze({ value: 'beta', label: 'Beta' });
const GAMMA = Object.freeze({ value: 'gamma', label: 'Gamma' });
const BETA_DISABLED = Object.freeze({ value: 'beta', label: 'Beta', disabled: true });

// A group's content width is its frame's, so the showcase, the walker
// and the browser gates lay its states out in a frame of this width
export const FRAME = Object.freeze({ width: 320 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ legendText: 'Options', defaultValue: 'beta', items: Object.freeze([ALPHA, BETA, GAMMA]) }) }),
  Object.freeze({ label: 'vertical', props: Object.freeze({ legendText: 'Options', defaultValue: 'beta', orientation: 'vertical', items: Object.freeze([ALPHA, BETA, GAMMA]) }) }),
  Object.freeze({ label: 'helper', props: Object.freeze({ legendText: 'Options', helperText: 'Choose one option', items: Object.freeze([ALPHA, BETA, GAMMA]) }) }),
  Object.freeze({ label: 'invalid', props: Object.freeze({ legendText: 'Options', invalid: true, invalidText: 'Choose an option', items: Object.freeze([ALPHA, BETA, GAMMA]) }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ legendText: 'Options', defaultValue: 'beta', disabled: true, items: Object.freeze([ALPHA, BETA, GAMMA]) }) }),
  Object.freeze({ label: 'middle disabled', props: Object.freeze({ legendText: 'Options', defaultValue: 'gamma', items: Object.freeze([ALPHA, BETA_DISABLED, GAMMA]) }) })
]);
