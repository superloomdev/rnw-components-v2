// Info: TagSkeleton measurement reference. The primary's skeleton tag
// takes only `size`; it draws the shared skeleton fill in the tag's shape.
// No target: a skeleton answers no interaction. The second system has no
// skeleton, so no second reference.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.TagSkeleton, {
      size: props.size === 'sm' ? 'sm' : undefined
    });
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--tag.cds--skeleton', ours: ':scope > div', measure: 'box' })
  })
});
