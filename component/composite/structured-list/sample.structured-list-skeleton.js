// Info: StructuredListSkeleton sample states for the showcase, the browser
// gates and the docs. Mirrors `recipes/probe/StructuredListSkeleton.mount.js`:
// the Skeleton story at its 800 width, five rows and one.

export const FRAME = Object.freeze({ width: 800 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({}) }),
  Object.freeze({ label: 'one', props: Object.freeze({ rowCount: 1 }) })
]);
