// Info: Layer measurement reference. The upstream layer is a div of the
// level's class; ours is a View under the level provider (providers emit
// no element, so the first div inside the body is the layer on both
// pages). The text child mounts as a block box in the same compact type
// the registry Text gives a string child. No second reference: the
// second system has no layer element.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Layer, {
      level: props.level,
      withBackground: props.withBackground === true
    }, React.createElement('div', { style: upstream.fixtureTextStyle('bodyCompact02') }, props.children));
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: ':scope > div', ours: ':scope > div', measure: 'box' })
  })
});
