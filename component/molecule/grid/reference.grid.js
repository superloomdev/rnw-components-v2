// Info: Grid measurement reference. The CSS grid paints padding and
// per-column margins; columns are the grid's direct children.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 1280 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Grid, props, (props.columns || []).map(function (c, i) {
      return React.createElement(upstream.Column, Object.assign({ key: i }, c),
        React.createElement('div', { style: upstream.fixtureTextStyle('bodyCompact01') }, c.children));
    }));
  },
  parts: Object.freeze({
    grid: Object.freeze({ upstream: '.cds--css-grid', ours: '[data-part="grid"]', measure: 'box' }),
    columns: Object.freeze({ upstream: '.cds--css-grid-column', ours: '[data-part="column"]', measure: 'box', all: true })
  })
});
