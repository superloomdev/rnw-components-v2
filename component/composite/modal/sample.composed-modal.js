// Info: ComposedModal sample states for the showcase, the browser gates
// and the docs. Each entry renders the dialog open inside its cell: the
// scrim, the container, the header, the body and the footer are all
// measured. The cell is a stage for the layer: the body frames it and
// becomes the scrim's containing block, as the anchor's frame.

const LONG = Array.from({ length: 12 }, function (unused, index) {
  return 'Line ' + (index + 1) + ' of the long body text, long enough to overflow the dialog and scroll.';
}).join(' ');

// The stage: the scrim covers the body and the container centers in it
export const FRAME = Object.freeze({ width: 640, height: 400, stage: true });

const HEADER = Object.freeze({ label: 'Account', title: 'Confirm the change' });
const FOOTER = Object.freeze({ primaryButtonText: 'Save', secondaryButtonText: 'Cancel' });

export default Object.freeze([
  Object.freeze({
    label: 'default',
    props: Object.freeze({
      children: 'The dialog body.',
      footer: FOOTER,
      header: HEADER,
      open: true,
      preventCloseOnClickOutside: true
    })
  }),
  Object.freeze({
    label: 'xs',
    props: Object.freeze({
      children: 'The dialog body.',
      footer: FOOTER,
      header: HEADER,
      open: true,
      preventCloseOnClickOutside: true,
      size: 'xs'
    })
  }),
  Object.freeze({
    label: 'sm',
    props: Object.freeze({
      children: 'The dialog body.',
      footer: FOOTER,
      header: HEADER,
      open: true,
      preventCloseOnClickOutside: true,
      size: 'sm'
    })
  }),
  Object.freeze({
    label: 'lg',
    props: Object.freeze({
      children: 'The dialog body.',
      footer: FOOTER,
      header: HEADER,
      open: true,
      preventCloseOnClickOutside: true,
      size: 'lg'
    })
  }),
  Object.freeze({
    label: 'danger',
    props: Object.freeze({
      children: 'The dialog body.',
      danger: true,
      footer: Object.freeze({ primaryButtonText: 'Delete', secondaryButtonText: 'Cancel' }),
      header: HEADER,
      open: true,
      preventCloseOnClickOutside: true
    })
  }),
  Object.freeze({
    label: 'three',
    props: Object.freeze({
      children: 'The dialog body.',
      footer: Object.freeze({
        primaryButtonText: 'Save',
        secondaryButtons: Object.freeze([Object.freeze({ buttonText: 'Keep both' }), Object.freeze({ buttonText: 'Cancel' })])
      }),
      header: HEADER,
      open: true,
      preventCloseOnClickOutside: true
    })
  }),
  Object.freeze({
    label: 'passive',
    props: Object.freeze({
      children: 'Read the details, then press outside or Escape to dismiss.',
      header: HEADER,
      open: true,
      preventCloseOnClickOutside: true
    })
  }),
  Object.freeze({
    label: 'scrolling',
    props: Object.freeze({
      body: Object.freeze({ hasScrollingContent: true }),
      children: LONG,
      footer: FOOTER,
      header: HEADER,
      open: true,
      preventCloseOnClickOutside: true
    })
  })
]);
