// Info: Tooltip sample states for the showcase, the browser gates and the
// docs. Each entry is one rendered instance: a label and the props it takes.
// The `open`-marked states mount the popover statically, so the bubble and
// the caret render under every template.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Anchor', label: 'Tooltip text' }) }),
  Object.freeze({ label: 'open', props: Object.freeze({ children: 'Anchor', label: 'Tooltip text', defaultOpen: true }) }),
  Object.freeze({ label: 'compact', props: Object.freeze({ children: 'Anchor', label: 'Saved', compact: true, defaultOpen: true }) }),
  Object.freeze({ label: 'bottom', props: Object.freeze({ children: 'Anchor', label: 'Tooltip text', align: 'bottom', defaultOpen: true }) })
]);
