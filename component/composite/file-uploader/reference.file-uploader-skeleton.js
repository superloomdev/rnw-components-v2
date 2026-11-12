// Info: FileUploaderSkeleton measurement reference. Upstream takes no
// props. The parts compared are the heading bar, the description bar and
// the button placeholder. A skeleton answers no interaction, so it has no
// target.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  mount: function (React, upstream) {
    return React.createElement(upstream.FileUploaderSkeleton, {});
  },
  parts: Object.freeze({
    title: Object.freeze({ upstream: '.cds--skeleton__heading', ours: '[data-part="title"] > div > div > div', measure: 'box' }),
    description: Object.freeze({ upstream: '.cds--label-description', ours: '[data-part="description"] > div > div > div', measure: 'box' }),
    button: Object.freeze({ upstream: '.cds--btn.cds--skeleton', ours: ':scope [data-part="root"] > div:last-child', measure: 'box' })
  })
});
