// Info: Popover sample states. Each label renders the Showcase cell.

export default Object.freeze([
  { label: 'default', props: { open: true, content: 'Popover content', children: 'Anchor' } },
  { label: 'caret-off', props: { open: true, caret: false, content: 'Popover content', children: 'Anchor' } },
  { label: 'border', props: { open: true, border: true, content: 'Popover content', children: 'Anchor' } },
  { label: 'high-contrast', props: { open: true, highContrast: true, content: 'Popover content', children: 'Anchor' } },
  { label: 'top', props: { open: true, align: 'top', content: 'Popover content', children: 'Anchor' } },
  { label: 'no-shadow', props: { open: true, dropShadow: false, content: 'Popover content', children: 'Anchor' } }
]);
