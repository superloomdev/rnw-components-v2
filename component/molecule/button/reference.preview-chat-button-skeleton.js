// Info: preview__ChatButtonSkeleton measurement reference. The upstream
// chat button skeleton takes `size` and draws the skeleton div in the chat
// button's shape; ours is the skeleton placeholder's root. A skeleton
// answers no interaction, so it has no target. No second reference: the
// second system has no skeleton.


export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.preview__ChatButtonSkeleton, { size: props.size });
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--skeleton.cds--chat-btn', ours: ':scope > div', measure: 'box' })
  })
});
