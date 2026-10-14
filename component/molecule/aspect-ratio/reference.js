// Info: AspectRatio measurement reference. The upstream box takes `ratio`
// (the same `W x H` names, default `1x1`) and renders its children inside
// it; its shape comes from a floated sliver whose padding is the ratio's
// percentage, so its measured box is the same rectangle our `aspectRatio`
// style produces. The mounted child is a span carrying the same string, so
// the cell draws the same content - but the label is not a measured part:
// the child string is fixture content the caller supplies, not the
// component's; the component is the box. The box is not interactive, so it
// has no target.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.AspectRatio, {
      ratio: props.ratio
    }, React.createElement('span', { className: 'cds--type-body-compact-02' }, props.children));
  },
  body: Object.freeze({ width: 320 }),
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--aspect-ratio', ours: ':scope > div', measure: 'box' })
  })
});
