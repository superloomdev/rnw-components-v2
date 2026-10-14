// Info: SkeletonPlaceholder measurement reference. The upstream placeholder
// takes `style` for its width and height; its shimmer is the `::before`
// pseudo at full cover. A skeleton answers no interaction, so it has no
// target. No second reference: the second system has no skeleton.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    const sized = props.width !== undefined || props.height !== undefined;
    return React.createElement(upstream.SkeletonPlaceholder, {
      style: sized ? { width: props.width, height: props.height } : undefined
    });
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--skeleton__placeholder', ours: ':scope > div', measure: 'box' }),
    shimmer: Object.freeze({ upstream: '.cds--skeleton__placeholder', pseudo: '::before', ours: ':scope > div > div', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor'] })
  })
});
