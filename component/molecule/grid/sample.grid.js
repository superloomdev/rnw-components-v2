// Info: Grid sample states for the showcase, the browser gates and the
// docs. Mirrors the mount's states through the `columns` composition prop.

// The grid fills its container (`inline-size: 100%`), the reference's 1280;
// a shrink-to-fit cell gives it no width to divide (native gate 44882105186)
export const FRAME = Object.freeze({ width: 1280 });

// A column's text, narrower than every column it is drawn in: 20.8 wide
// against the 48 a column keeps at the sm breakpoint in a 320 body and the
// 33.5 of the 262 device walk (`notes.md`, the narrow set)
const LABEL = 'Col';

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ columns: [{ children: LABEL, lg: 4 }, { children: LABEL, lg: 4 }, { children: LABEL, lg: 4 }, { children: LABEL, lg: 4 }] }) }),
  Object.freeze({ label: 'condensed', props: Object.freeze({ columns: [{ children: LABEL, lg: 4 }, { children: LABEL, lg: 4 }, { children: LABEL, lg: 4 }, { children: LABEL, lg: 4 }], condensed: true }) }),
  Object.freeze({ label: 'narrow', props: Object.freeze({ columns: [{ children: LABEL, lg: 4 }, { children: LABEL, lg: 4 }, { children: LABEL, lg: 4 }, { children: LABEL, lg: 4 }], narrow: true }) }),
  Object.freeze({ label: 'fullWidth', props: Object.freeze({ columns: [{ children: LABEL, lg: 4 }, { children: LABEL, lg: 4 }, { children: LABEL, lg: 4 }, { children: LABEL, lg: 4 }], fullWidth: true }) }),
  Object.freeze({ label: 'offset', props: Object.freeze({ columns: [{ children: LABEL, lg: { offset: 4, span: 4 } }, { children: LABEL, lg: 8 }] }) }),
  Object.freeze({ label: 'wrap', props: Object.freeze({ columns: [{ children: LABEL, lg: 8 }, { children: LABEL, lg: 8 }, { children: LABEL, lg: 16 }] }) }),
  Object.freeze({ label: 'rowGap', props: Object.freeze({ columns: [{ children: LABEL, lg: 8 }, { children: LABEL, lg: 8 }, { children: LABEL, lg: 8 }, { children: LABEL, lg: 8 }], withRowGap: true }) })
]);
