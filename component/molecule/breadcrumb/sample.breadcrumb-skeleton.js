// Info: BreadcrumbSkeleton sample states for the showcase, the browser
// gates and the docs. Each entry is one rendered instance.

// The skeleton stands in for the breadcrumb's block-level flex line
// (`_breadcrumb.scss:28-29`), which fills its container, so the showcase,
// the walker and the browser gates lay its states out in a frame of this
// width
export const FRAME = Object.freeze({ width: 320 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({}) }),
  Object.freeze({ label: 'two', props: Object.freeze({ items: 2 }) }),
  Object.freeze({ label: 'noTrailingSlash', props: Object.freeze({ noTrailingSlash: true }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ size: 'sm' }) })
]);
