// Info: IconSkeleton measurement reference. The upstream skeleton icon is a
// `cds--icon--skeleton` div; ours is the placeholder's root inside its
// wrapper. A skeleton answers no interaction, so it has no target. No
// second reference: the second system has no skeleton.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream) {
    return React.createElement(upstream.IconSkeleton);
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--icon--skeleton', ours: ':scope > div > div', measure: 'box' })
  })
});
