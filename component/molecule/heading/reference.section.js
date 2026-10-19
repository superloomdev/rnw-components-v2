// Info: Section measurement reference. The upstream section mounts the
// same text child in the compact type the registry Text gives a string
// child, as a block box inside the section. The part compares the text:
// its set, its color and where it sits. No second reference: the second
// system's composition guidance carries no measurement twin.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Section, null,
      React.createElement('div', { style: upstream.fixtureTextStyle('bodyCompact02') }, props.children));
  },
  parts: Object.freeze({
    text: Object.freeze({ upstream: 'div', ours: '[dir="auto"]', measure: 'text' })
  })
});
