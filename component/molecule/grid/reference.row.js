// Info: Row measurement reference. The flexbox row paints negative
// inline margins; its columns are padded to re-form the gutter. The mount is
// the probe's: the FlexGrid (with the state's grid props) around the Row,
// each column holding a text div.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 1280 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.FlexGrid, {
      condensed: props.condensed === true,
      narrow: props.narrow === true,
      withRowGap: props.withRowGap === true
    },
    React.createElement(upstream.Row, null, (props.columns || []).map(function (c, i) {
      return React.createElement(upstream.Column, { key: i, lg: c.lg, md: c.md, sm: c.sm },
        React.createElement('div', { style: upstream.fixtureTextStyle('bodyCompact01') }, c.children));
    })));
  },
  parts: Object.freeze({
    row: Object.freeze({ upstream: '.cds--row', ours: '[data-part="row"]', measure: 'box' }),
    columns: Object.freeze({ upstream: '.cds--row > *', ours: '[data-part="column"]', measure: 'box', all: true })
  })
});
