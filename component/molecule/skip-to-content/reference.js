// Info: SkipToContent measurement reference. The upstream link is an
// `a.cds--skip-to-content`: a one-pixel clipped box at rest, drawn at the
// top start of its containing block on focus. The parts compared are the
// link's box and its text.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['focus']),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.SkipToContent, { href: props.href }, props.children);
  },
  // The element a person focuses: the link itself
  target: Object.freeze({ upstream: '.cds--skip-to-content', upstreamFocus: '.cds--skip-to-content', ours: 'a[href]' }),
  // The link is `position: absolute` at the top start of its containing
  // block; the staged body is that block
  body: Object.freeze({ width: 320, height: 64, stage: true }),
  parts: Object.freeze({
    link: Object.freeze({ upstream: '.cds--skip-to-content', ours: 'a[href]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'paddingLeft', 'paddingRight', 'borderTopWidth', 'borderTopColor', 'backgroundColor', 'color', 'zIndex', 'fontSize', 'lineHeight', 'fontWeight', 'letterSpacing'] })
  })
});
