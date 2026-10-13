// Info: preview__ChatButton sample states for the showcase, the browser
// gates and the docs: the pill at each size, a kind, an icon, the quick
// action resting, selected and disabled, and the disabled pill.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Chat' }) }),
  Object.freeze({ label: 'secondary', props: Object.freeze({ children: 'Chat', kind: 'secondary' }) }),
  Object.freeze({ label: 'medium', props: Object.freeze({ children: 'Chat', size: 'md' }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ children: 'Chat', size: 'sm' }) }),
  Object.freeze({ label: 'with icon', props: Object.freeze({ children: 'Chat', icon: 'add' }) }),
  Object.freeze({ label: 'quick action', props: Object.freeze({ children: 'Quick action', isQuickAction: true }) }),
  Object.freeze({ label: 'quick action selected', props: Object.freeze({ children: 'Quick action', isQuickAction: true, isSelected: true }) }),
  Object.freeze({ label: 'quick action disabled', props: Object.freeze({ children: 'Quick action', isQuickAction: true, disabled: true }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ children: 'Chat', disabled: true }) })
]);
