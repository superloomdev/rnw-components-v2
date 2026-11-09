// Info: TileGroup measurement reference. The upstream group is a fieldset
// of three RadioTiles with the third disabled; the legend names it.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.TileGroup, {
      defaultSelected: props.defaultSelected,
      legend: props.legend,
      name: props.name
    },
    ['one', 'two', 'three'].map(function (value) {
      return React.createElement(upstream.RadioTile, {
        disabled: value === 'three',
        id: 'reference-group-' + value,
        key: value,
        value: value
      }, 'Option ' + value);
    }));
  },
  parts: Object.freeze({
    legend: Object.freeze({ upstream: '.cds--tile-group legend', ours: ':scope > div > [dir="auto"]', measure: 'text' }),
    tiles: Object.freeze({ upstream: '.cds--tile', ours: ':scope > div > div[role=radio]', measure: 'box', all: true })
  })
});
