// Info: SkeletonText measurement reference. The upstream skeleton text
// takes `paragraph`, `lineCount`, `width` (a `px` or percent string) and
// `heading`; a point width mounts as its `px` string. A single line renders
// as a bare `p`, several inside a wrapper `div` - `nth-of-type` finds the
// n-th line in both shapes. A skeleton answers no interaction, so it has no
// target. No second reference: the second system has no skeleton.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.SkeletonText, {
      paragraph: props.paragraph === true,
      lineCount: props.lineCount,
      width: typeof props.width === 'number' ? props.width + 'px' : props.width,
      heading: props.heading === true
    });
  },
  parts: Object.freeze({
    line1: Object.freeze({ upstream: 'p.cds--skeleton__text:nth-of-type(1)', ours: ':scope > div > div:nth-of-type(1) > div', measure: 'box' }),
    line2: Object.freeze({ upstream: 'p.cds--skeleton__text:nth-of-type(2)', ours: ':scope > div > div:nth-of-type(2) > div', measure: 'box' }),
    line3: Object.freeze({ upstream: 'p.cds--skeleton__text:nth-of-type(3)', ours: ':scope > div > div:nth-of-type(3) > div', measure: 'box' })
  })
});
