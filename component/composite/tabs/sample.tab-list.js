// Info: TabList sample states.

const ITEMS = Object.freeze([1, 2, 3].map(function (n) {
  return Object.freeze({ label: 'Tab ' + n });
}));
const MANY = Object.freeze(Array.from({ length: 10 }, function (_, i) {
  return Object.freeze({ label: 'Tab number ' + (i + 1) });
}));

export default Object.freeze([
  Object.freeze({ label: 'line', props: Object.freeze({ items: ITEMS, accessibilityLabel: 'Sections', defaultSelectedIndex: 1 }) }),
  Object.freeze({ label: 'contained', props: Object.freeze({ items: ITEMS, accessibilityLabel: 'Sections', variant: 'contained', defaultSelectedIndex: 1 }) }),
  Object.freeze({ label: 'contained-tall', props: Object.freeze({ items: Object.freeze(ITEMS.map(function (i, n) {
    return Object.freeze({ label: i.label, secondaryLabel: 'Line ' + n });
  })), accessibilityLabel: 'Sections', variant: 'contained' }) }),
  Object.freeze({ label: 'dismissable', props: Object.freeze({ items: ITEMS, accessibilityLabel: 'Sections', dismissable: true }) }),
  Object.freeze({ label: 'icons', props: Object.freeze({ items: Object.freeze(ITEMS.map(function (i) {
    return Object.freeze({ label: i.label, icon: 'info' });
  })), accessibilityLabel: 'Sections' }) }),
  Object.freeze({ label: 'overflow', props: Object.freeze({ items: MANY, accessibilityLabel: 'Sections' }) }),
  Object.freeze({ label: 'disabled-item', props: Object.freeze({ items: Object.freeze([Object.freeze({ label: 'Tab 1' }), Object.freeze({ label: 'Tab 2', disabled: true }), Object.freeze({ label: 'Tab 3' })]), accessibilityLabel: 'Sections' }) })
]);
