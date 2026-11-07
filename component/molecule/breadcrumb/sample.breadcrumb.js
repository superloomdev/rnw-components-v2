// Info: Breadcrumb sample states for the showcase, the browser gates and
// the docs. Each entry is one rendered instance.

// The overflow icon is translateY(4px) inside an 18 px trigger (_breadcrumb.scss:106-109,162-167)
export const FRAME = Object.freeze({ hang: Object.freeze({ bottom: 4 }) });

const TRAIL = Object.freeze([
  Object.freeze({ href: '#home', label: 'Home' }),
  Object.freeze({ href: '#products', label: 'Products' }),
  Object.freeze({ isCurrentPage: true, label: 'Product A' })
]);
const OVERFLOW = Object.freeze([
  Object.freeze({ href: '#home', label: 'Home' }),
  Object.freeze({ overflow: Object.freeze([Object.freeze({ href: '#category', label: 'Category' }), Object.freeze({ href: '#sub-category', label: 'Sub-category' })]) }),
  Object.freeze({ isCurrentPage: true, label: 'Product A' })
]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ items: TRAIL }) }),
  Object.freeze({ label: 'noTrailingSlash', props: Object.freeze({ items: TRAIL, noTrailingSlash: true }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ items: TRAIL, size: 'sm' }) }),
  Object.freeze({ label: 'overflow', props: Object.freeze({ items: OVERFLOW }) }),
  Object.freeze({ label: 'overflowSmall', props: Object.freeze({ items: OVERFLOW, size: 'sm' }) }),
  Object.freeze({ label: 'overflowOpen', props: Object.freeze({ items: OVERFLOW }) })
]);
