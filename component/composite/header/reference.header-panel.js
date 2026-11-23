// Info: HeaderPanel measurement reference. Upstream draws a fixed
// `div.cds--header-panel` under the header at the end edge, 0 wide until
// expanded, inside the staged Header the sample's wrapper names. Ours
// renders hosted so its layer covers the same cell box (`oursHosted`).

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  body: Object.freeze({ width: 800, height: 320, stage: true }),
  oursHosted: true,
  mount: function (React, upstream, props) {
    return React.createElement(upstream.HeaderPanel, { expanded: props.expanded === true }, props.children);
  },
  parts: Object.freeze({
    bar: Object.freeze({ upstream: '.cds--header', ours: 'header, [role="banner"]', measure: 'box' }),
    panel: Object.freeze({ upstream: '.cds--header-panel--expanded', ours: '[data-testid="header-panel"]', measure: 'box', optional: true })
  })
});
