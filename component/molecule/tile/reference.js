// Info: Tile measurement reference. The upstream tile takes the content as
// its children; a plain tile has no interaction target.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Tile, null, props.children);
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--tile', ours: ':scope > div', measure: 'box' })
  })
});
