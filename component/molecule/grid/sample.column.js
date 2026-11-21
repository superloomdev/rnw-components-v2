// Info: Column sample states for the showcase and the docs. Column is
// `no_reference` and `requires_parent`: it draws inside a Grid, which the
// `wrappers` composition supplies (as Row's samples do). Bare, its auto
// track (`flex-grow: 1`, basis 0) grows along a column container's height:
// on native a cell's body in a scrolling walk grew past 189000 points and
// never settled (iOS walk, M6 gate).

// The grid fills its container (`inline-size: 100%`), the reference's 1280;
// a shrink-to-fit cell gives it no width to divide (native gate 44882105186)
export const FRAME = Object.freeze({ width: 1280 });

// The parent holds the Column
const PARENT = Object.freeze({
  component: 'Grid',
  props: Object.freeze({}),
  reference: false
});

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Column' }), wrappers: Object.freeze([PARENT]) })
]);
