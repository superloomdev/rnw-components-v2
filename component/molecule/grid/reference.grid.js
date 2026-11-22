// Info: Grid measurement reference. The CSS grid paints padding and
// per-column margins; columns are the grid's direct children.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 1280 }),
  // The span classes and the margin follow the window's breakpoint
  // (`Grid/Column.tsx:360-400`): the narrow set draws the sm side, a 320
  // body in a 375 window
  narrow: Object.freeze({ window: 375, width: 320 }),
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
