// Info: Toggletip sample states. Each label renders the Showcase cell.

// The cell holds the open bubble, so both pages compare it (D38)
export const FRAME = Object.freeze({ width: 320, height: 200 });

export default Object.freeze([
  { label: 'default', props: { label: 'Toggletip label', content: 'Helpful information for this field' } },
  { label: 'open', props: { label: 'Toggletip label', content: 'Helpful information for this field', defaultOpen: true } },
  { label: 'with-actions', props: { label: 'Toggletip label', content: 'Helpful information for this field', defaultOpen: true, actions: [{ kind: 'link', label: 'Learn more', href: '#' }, { kind: 'button', label: 'Apply' }] } },
  { label: 'bottom', props: { label: 'Toggletip label', content: 'Helpful information for this field', align: 'bottom', defaultOpen: true } }
]);
