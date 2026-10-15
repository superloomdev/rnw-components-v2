// Info: VStack measurement reference. The upstream column stack is a grid
// whose children mount as block boxes in the same compact type the
// registry Text gives a string child. The parts compared are the root and
// the three children's boxes. No second reference: the second system has
// no layout element.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.VStack, {
      gap: props.gap
    }, (props.children || []).map(function (child, index) {
      return React.createElement('span', {
        key: index,
        style: Object.assign({ display: 'block' }, upstream.fixtureTextStyle('bodyCompact02'))
      }, child);
    }));
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: ':scope > div', ours: ':scope > div', measure: 'box' }),
    first: Object.freeze({ upstream: ':scope > div > :nth-child(1)', ours: ':scope > div > :nth-child(1)', measure: 'box' }),
    second: Object.freeze({ upstream: ':scope > div > :nth-child(2)', ours: ':scope > div > :nth-child(2)', measure: 'box' }),
    third: Object.freeze({ upstream: ':scope > div > :nth-child(3)', ours: ':scope > div > :nth-child(3)', measure: 'box' })
  })
});
