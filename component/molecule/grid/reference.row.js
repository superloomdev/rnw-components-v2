// Info: Row measurement reference. The flexbox row paints negative
// inline margins; its columns are padded to re-form the gutter.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 1280 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.FlexGrid, null,
      React.createElement(upstream.Row, null, (props.columns || []).map(function (c, i) {
        return React.createElement(upstream.Column, Object.assign({ key: i }, c));
      })));
  },
  parts: Object.freeze({
    row: Object.freeze({ upstream: '.cds--row', ours: '[data-part="row"]', measure: 'box' }),
    columns: Object.freeze({ upstream: '.cds--col', ours: '[data-part="column"]', measure: 'box', all: true })
  })
});
