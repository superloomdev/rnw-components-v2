// Info: Stack measurement reference. The upstream stack is a grid (an
// inline one in the horizontal direction) whose children mount as block
// boxes in the same compact type the registry Text gives a string child.
// The parts compared are the root and the three children's boxes, so the
// gap reads from where they sit. No second reference: the second system
// has no layout element.

function children (React, upstream, props) {

  return (props.children || []).map(function (child, index) {
    return React.createElement('span', {
      key: index,
      style: Object.assign({ display: 'block' }, upstream.fixtureTextStyle('bodyCompact02'))
    }, child);
  });

}

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Stack, {
      gap: props.gap,
      orientation: props.orientation
    }, children(React, upstream, props));
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: ':scope > div', ours: ':scope > div', measure: 'box' }),
    first: Object.freeze({ upstream: ':scope > div > :nth-child(1)', ours: ':scope > div > :nth-child(1)', measure: 'box' }),
    third: Object.freeze({ upstream: ':scope > div > :nth-child(3)', ours: ':scope > div > :nth-child(3)', measure: 'box' })
  })
});
