// Info: ButtonSet sample states for the showcase, the browser gates and
// the docs: a two-button row, a three-button row, the stacked column, a
// disabled member and the fluid set whose order and stack the measured
// width drives.

// The fluid set measures its own row, so the showcase, the walker and the
// browser gates lay its states out in a frame of this width
export const FRAME = Object.freeze({ width: 640 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ items: Object.freeze([
    Object.freeze({ children: 'Cancel', kind: 'secondary' }),
    Object.freeze({ children: 'Save', kind: 'primary' })
  ]) }) }),
  Object.freeze({ label: 'three', props: Object.freeze({ items: Object.freeze([
    Object.freeze({ children: 'Help', kind: 'ghost' }),
    Object.freeze({ children: 'Cancel', kind: 'secondary' }),
    Object.freeze({ children: 'Save', kind: 'primary' })
  ]) }) }),
  Object.freeze({ label: 'stacked', props: Object.freeze({ stacked: true, items: Object.freeze([
    Object.freeze({ children: 'Cancel', kind: 'secondary' }),
    Object.freeze({ children: 'Save', kind: 'primary' })
  ]) }) }),
  // The disabled member leads: the reference target is the second button,
  // which a disabled member there would leave unhoverable, and the paint
  // walk reads the cell's first control
  Object.freeze({ label: 'disabled item', props: Object.freeze({ items: Object.freeze([
    Object.freeze({ children: 'Save', kind: 'primary', disabled: true }),
    Object.freeze({ children: 'Cancel', kind: 'secondary' })
  ]) }) }),
  Object.freeze({ label: 'fluid', props: Object.freeze({ fluid: true, items: Object.freeze([
    Object.freeze({ children: 'Save', kind: 'primary' }),
    Object.freeze({ children: 'Cancel', kind: 'secondary' }),
    Object.freeze({ children: 'Help', kind: 'ghost' })
  ]) }) })
]);
