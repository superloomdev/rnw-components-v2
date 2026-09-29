// Info: The library's declared token requirements, exported as data.
//
// REQUIRED_TOKENS is the union of every token name a component's `spec.js`
// names plus the tokens the context itself reads; SUPPORTED_TOKENS adds the
// tokens a component reads optionally. REQUIRED_ICONS is the union of the
// icon names components draw on their own initiative (a checkbox's mark, a
// select's caret), not the names a host passes to `Icon`. The purity test
// asserts these lists against the spec sheets, so a token read that is not
// declared here fails before it reaches a theme.

// Tokens `component/context.js` reads for every component
const CONTEXT_TOKENS = [
  'color.focus',
  'feedback.focus',
  'focus.offset',
  'focus.width'
];

export const REQUIRED_TOKENS = Object.freeze([].concat(CONTEXT_TOKENS));

export const SUPPORTED_TOKENS = Object.freeze([].concat(REQUIRED_TOKENS));

export const REQUIRED_ICONS = Object.freeze([]);
