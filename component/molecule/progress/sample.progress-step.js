// Info: ProgressStep sample states for the showcase, the browser gates
// and the docs: one state per glyph and coloring, a secondary line and a
// disabled step. The vertical and space-equal layouts are the indicator's
// composition props, covered through the indicator's own samples.

// A secondary label hangs below its step's box at the theme's offset, so
// the showcase lays the states out in a frame with room for it
export const FRAME = Object.freeze({ width: 160, height: 48 });

export default Object.freeze([
  Object.freeze({
    label: 'first',
    props: Object.freeze({
      label: 'First step'
    })
  }),
  Object.freeze({
    label: 'current',
    props: Object.freeze({
      current: true,
      label: 'Current step'
    })
  }),
  Object.freeze({
    label: 'complete',
    props: Object.freeze({
      complete: true,
      label: 'Complete step'
    })
  }),
  Object.freeze({
    label: 'invalid',
    props: Object.freeze({
      invalid: true,
      label: 'Invalid step'
    })
  }),
  Object.freeze({
    label: 'secondary',
    props: Object.freeze({
      label: 'Second step',
      secondaryLabel: 'Optional info'
    })
  }),
  Object.freeze({
    label: 'disabled',
    props: Object.freeze({
      disabled: true,
      label: 'Disabled step'
    })
  })
]);
