// Info: Pagination sample states for the showcase, the browser gates and
// the docs.

// The bar fills its container (`inline-size: calc(100% - 1px)`), the
// probe's 800
export const FRAME = Object.freeze({ width: 800 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ pageSize: 10, pageSizes: [10, 20, 30, 40, 50], totalItems: 103 }) }),
  Object.freeze({ label: 'sm', props: Object.freeze({ pageSize: 10, pageSizes: [10, 20, 30, 40, 50], size: 'sm', totalItems: 103 }) }),
  Object.freeze({ label: 'lg', props: Object.freeze({ pageSize: 10, pageSizes: [10, 20, 30, 40, 50], size: 'lg', totalItems: 103 }) }),
  Object.freeze({ label: 'lastPage', props: Object.freeze({ page: 11, pageSize: 10, pageSizes: [10, 20, 30, 40, 50], totalItems: 103 }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ disabled: true, pageSize: 10, pageSizes: [10, 20, 30, 40, 50], totalItems: 103 }) }),
  Object.freeze({ label: 'unknown', props: Object.freeze({ pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pagesUnknown: true, totalItems: 103 }) }),
  Object.freeze({ label: 'selectHover', props: Object.freeze({ pageSize: 10, pageSizes: [10, 20, 30, 40, 50], totalItems: 103 }) })
]);
