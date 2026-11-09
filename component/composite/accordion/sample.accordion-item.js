// Info: AccordionItem's showcase samples. Standalone it draws one item with
// its own top rule; in the Accordion it shares the parent's context props.

export default Object.freeze([
  { label: 'open', props: { title: 'Section one', defaultOpen: true, children: 'Section one body text.' } },
  { label: 'closed', props: { title: 'Section one', children: 'Section one body text.' } },
  { label: 'disabled', props: { title: 'Section one', disabled: true, children: 'Section one body text.' } }
]);

export const FRAME = Object.freeze({ width: 320 });
