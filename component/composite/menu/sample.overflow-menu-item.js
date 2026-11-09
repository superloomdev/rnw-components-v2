// Info: OverflowMenuItem sample state for the showcase, the browser gates
// and the docs. Standalone the item draws one option row on the list
// container - its measured form is the panel row inside OverflowMenu's
// opened states.

// The option face is 48 at the compact form class (control.target_min);
// the frame must hold it the way a group's own frame does
export const FRAME = Object.freeze({ width: 160, height: 48 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ label: 'Edit' }) })
]);
