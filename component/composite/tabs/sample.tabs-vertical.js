// Info: TabsVertical sample states.

const ITEMS = Object.freeze([1, 2, 3].map(function (n) {
  return Object.freeze({ label: 'Tab ' + n });
}));
const LONG = Object.freeze(Array.from({ length: 12 }, function (_, i) {
  return Object.freeze({ label: 'Tab number ' + (i + 1) });
}));

// The vertical list is measured inside a 400-high box on both pages
export const FRAME = Object.freeze({ width: 640, height: 400 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ items: ITEMS, panels: Object.freeze(['Panel one', 'Panel two', 'Panel three']), accessibilityLabel: 'Sections', defaultSelectedIndex: 1 }) }),
  Object.freeze({ label: 'overflow', props: Object.freeze({ items: LONG, height: 320, accessibilityLabel: 'Sections' }) })
]);
