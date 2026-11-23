// Info: HeaderName measurement reference. Upstream draws an
// `a.cds--header__name` holding the prefix span, a no-break space and the
// name span, inside the staged Header the sample's wrapper names. The
// parts compared are the bar, the link and the name's text style.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus']),
  body: Object.freeze({ width: 800, height: 120, stage: true }),
  // The end padding is 16 below md, read from the window
  // (`ui-shell/header/_header.scss:173-175`): the narrow set draws a 320
  // body in a 375 window
  narrow: Object.freeze({ window: 375, width: 320 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.HeaderName, { href: props.href, prefix: props.prefix || '' }, props.children);
  },
  target: Object.freeze({ upstream: 'a.cds--header__name', ours: 'header > a, [role="banner"] > a' }),
  parts: Object.freeze({
    bar: Object.freeze({ upstream: '.cds--header', ours: 'header, [role="banner"]', measure: 'box' }),
    name: Object.freeze({ upstream: 'a.cds--header__name', ours: 'header > a, [role="banner"] > a', measure: 'box' }),
    nameType: Object.freeze({ upstream: 'a.cds--header__name > span:last-child', ours: 'header > a > [dir="auto"], [role="banner"] > a > [dir="auto"]', measure: 'type' }),
    prefixType: Object.freeze({ upstream: '.cds--header__name--prefix', ours: 'header > a span, [role="banner"] > a span', measure: 'type', optional: true })
  })
});
