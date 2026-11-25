// Info: BreadcrumbSkeleton measurement reference. Upstream draws a plain
// row of `.cds--breadcrumb-item` shimmer bars with the `/` separators; no
// landmark. The parts compared are the items and the bars.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  body: Object.freeze({ width: 600, height: 80 }),
  // Below md the list is inline around block-level items, read from the
  // window (`breadcrumb/_breadcrumb.scss:24-33`): the narrow set draws a
  // 320 body in a 375 window
  narrow: Object.freeze({ window: 375, width: 320 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.BreadcrumbSkeleton, {
      items: props.items,
      noTrailingSlash: props.noTrailingSlash === true,
      size: props.size
    });
  },
  target: Object.freeze({ upstream: null, ours: null }),
  parts: Object.freeze({
    items: Object.freeze({ upstream: '.cds--breadcrumb-item', all: true, ours: '[data-part="item"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'marginRight'] }),
    bars: Object.freeze({ upstream: '.cds--breadcrumb-item .cds--skeleton .cds--link, .cds--breadcrumb-item .cds--link', all: true, ours: '[data-part="item"] > div:first-child', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor'], optional: true })
  })
});
