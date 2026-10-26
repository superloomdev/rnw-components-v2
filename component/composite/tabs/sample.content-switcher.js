// Info: ContentSwitcher sample states.

const TEXTS = Object.freeze([1, 2, 3].map(function (n) {
  return Object.freeze({ text: 'Section ' + n });
}));
const ICONS = Object.freeze([
  Object.freeze({ icon: 'info', label: 'Information' }),
  Object.freeze({ icon: 'settings', label: 'Settings' }),
  Object.freeze({ icon: 'notification', label: 'Notifications' })
]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ items: TEXTS, accessibilityLabel: 'Views', defaultSelectedIndex: 1 }) }),
  Object.freeze({ label: 'icons', props: Object.freeze({ items: ICONS, accessibilityLabel: 'Views', defaultSelectedIndex: 0 }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ items: TEXTS, accessibilityLabel: 'Views', size: 'sm' }) }),
  Object.freeze({ label: 'large', props: Object.freeze({ items: TEXTS, accessibilityLabel: 'Views', size: 'lg' }) }),
  Object.freeze({ label: 'low-contrast', props: Object.freeze({ items: TEXTS, accessibilityLabel: 'Views', lowContrast: true, defaultSelectedIndex: 1 }) }),
  Object.freeze({ label: 'disabled-item', props: Object.freeze({ items: Object.freeze([Object.freeze({ text: 'One' }), Object.freeze({ text: 'Two', disabled: true }), Object.freeze({ text: 'Three' })]), accessibilityLabel: 'Views' }) })
]);
