// Info: Grid sample states for the showcase, the browser gates and the
// docs. Mirrors the mount's states through the `columns` composition prop.

// The grid fills its container (`inline-size: 100%`), the reference's 1280;
// a shrink-to-fit cell gives it no width to divide (native gate 44882105186)
export const FRAME = Object.freeze({ width: 1280 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ columns: [{ children: 'Column', lg: 4 }, { children: 'Column', lg: 4 }, { children: 'Column', lg: 4 }, { children: 'Column', lg: 4 }] }) }),
  Object.freeze({ label: 'condensed', props: Object.freeze({ columns: [{ children: 'Column', lg: 4 }, { children: 'Column', lg: 4 }, { children: 'Column', lg: 4 }, { children: 'Column', lg: 4 }], condensed: true }) }),
  Object.freeze({ label: 'narrow', props: Object.freeze({ columns: [{ children: 'Column', lg: 4 }, { children: 'Column', lg: 4 }, { children: 'Column', lg: 4 }, { children: 'Column', lg: 4 }], narrow: true }) }),
  Object.freeze({ label: 'fullWidth', props: Object.freeze({ columns: [{ children: 'Column', lg: 4 }, { children: 'Column', lg: 4 }, { children: 'Column', lg: 4 }, { children: 'Column', lg: 4 }], fullWidth: true }) }),
  Object.freeze({ label: 'offset', props: Object.freeze({ columns: [{ children: 'Column', lg: { offset: 4, span: 4 } }, { children: 'Column', lg: 8 }] }) }),
  Object.freeze({ label: 'wrap', props: Object.freeze({ columns: [{ children: 'Column', lg: 8 }, { children: 'Column', lg: 8 }, { children: 'Column', lg: 16 }] }) }),
  Object.freeze({ label: 'rowGap', props: Object.freeze({ columns: [{ children: 'Column', lg: 8 }, { children: 'Column', lg: 8 }, { children: 'Column', lg: 8 }, { children: 'Column', lg: 8 }], withRowGap: true }) })
]);
