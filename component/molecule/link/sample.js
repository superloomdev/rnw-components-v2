// Info: Link sample states for the showcase, the browser gates and the
// docs: rest, inline, visited, disabled, the three sizes and the trailing
// icon.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Link', href: '#' }) }),
  Object.freeze({ label: 'inline', props: Object.freeze({ children: 'Link', href: '#', inline: true }) }),
  Object.freeze({ label: 'visited', props: Object.freeze({ children: 'Link', href: '#', visited: true }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ children: 'Link', href: '#', disabled: true }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ children: 'Link', href: '#', size: 'sm' }) }),
  Object.freeze({ label: 'large', props: Object.freeze({ children: 'Link', href: '#', size: 'lg' }) }),
  Object.freeze({ label: 'icon', props: Object.freeze({ children: 'Link', href: '#', icon: 'arrow_right' }) }),
  Object.freeze({ label: 'large icon', props: Object.freeze({ children: 'Link', href: '#', size: 'lg', icon: 'arrow_right' }) })
]);
