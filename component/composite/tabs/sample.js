// Info: Tabs sample states for the showcase, the browser gates and the
// docs. Each entry is one rendered instance: a label and the props it takes.

const ITEMS = Object.freeze([
  Object.freeze({ label: 'First' }),
  Object.freeze({ label: 'Second' }),
  Object.freeze({ label: 'Third' })
]);

// A disabled tab among the enabled ones, for the disabled cells
const DISABLED_ITEMS = Object.freeze([
  Object.freeze({ label: 'First' }),
  Object.freeze({ label: 'Second', disabled: true }),
  Object.freeze({ label: 'Third' })
]);

// A tab bar stretches to the width its container gives it
export const FRAME = Object.freeze({ width: 400 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ items: ITEMS, accessibilityLabel: 'Sections', defaultSelectedIndex: 1 }) }),
  Object.freeze({ label: 'contained', props: Object.freeze({ items: ITEMS, accessibilityLabel: 'Sections', variant: 'contained', defaultSelectedIndex: 1 }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ items: DISABLED_ITEMS, accessibilityLabel: 'Sections' }) })
]);
