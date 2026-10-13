// Info: ButtonSkeleton measurement reference. The upstream skeleton button
// takes `size` and draws the skeleton div in the button's shape; ours is
// the skeleton placeholder's root. A skeleton answers no interaction, so it
// has no target. No second reference: the second system has no skeleton.


export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.ButtonSkeleton, { size: props.size });
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--skeleton.cds--btn', ours: ':scope > div', measure: 'box' })
  })
});
