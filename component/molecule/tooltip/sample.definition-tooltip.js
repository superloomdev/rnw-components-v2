// Info: DefinitionTooltip sample states. Each label renders the Showcase cell.

export default Object.freeze([
  { label: 'default', props: { children: 'Term', definition: 'The definition of the term' } },
  { label: 'open', props: { children: 'Term', definition: 'The definition of the term', defaultOpen: true } },
  { label: 'hover-mode', props: { children: 'Term', definition: 'The definition of the term', openOnHover: true } },
  { label: 'top', props: { children: 'Term', definition: 'The definition of the term', align: 'top', defaultOpen: true } }
]);
