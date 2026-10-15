// Info: ToggleSkeleton measurement reference. The upstream toggle
// skeleton is a flex row of the handle-sized circle and a short bar a
// spacing step later; ours is the same pair of skeleton placeholders.
// The parts compared are the two shapes' boxes. No second reference: the
// second system has no skeleton.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream) {
    return React.createElement(upstream.ToggleSkeleton, null);
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: ':scope > div', ours: ':scope > div', measure: 'box' }),
    circle: Object.freeze({ upstream: ':scope > div > .cds--toggle__skeleton-circle', ours: ':scope > div > :nth-child(1)', measure: 'box' }),
    bar: Object.freeze({ upstream: ':scope > div > .cds--toggle__skeleton-rectangle', ours: ':scope > div > :nth-child(2)', measure: 'box' })
  })
});
