// Info: Content measurement reference. Upstream draws a `main.cds--content`
// with 2rem padding and the page's primary text color; its text keeps the
// page's own type, which ours names (`type.body01`), so the region's
// height is left out.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  body: Object.freeze({ width: 400 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Content, null, props.children);
  },
  parts: Object.freeze({
    // The height follows the text's line, the page's upstream and ours `type.body01`
    region: Object.freeze({ upstream: '.cds--content', ours: 'main, [role="main"]', measure: 'box', compare: ['x', 'y', 'width', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'], except: ['height'] })
  })
});
