// Info: Modal sample states for the showcase, the browser gates and the
// docs. Each entry is one rendered instance: a label and the props it
// takes. The dialog renders open inside its cell so the scrim, the
// container, the header, the body and the actions are all measured. The
// cell is a stage for the layer: the body frames it and becomes the
// scrim's containing block, as the second reference's fixed dialog.

// The stage: the scrim covers the body and the container centers in it
export const FRAME = Object.freeze({ width: 640, height: 400, stage: true });

export default Object.freeze([
  Object.freeze({
    label: 'default',
    props: Object.freeze({
      actions: Object.freeze([
        Object.freeze({ label: 'Cancel' }),
        Object.freeze({ label: 'Save' })
      ]),
      children: 'The dialog body.',
      open: true,
      title: 'Confirm the change'
    })
  }),
  Object.freeze({
    label: 'passive',
    props: Object.freeze({
      children: 'Read the details, then press outside or Escape to dismiss.',
      label: 'Notice',
      open: true,
      passive: true,
      title: 'No actions'
    })
  })
]);
