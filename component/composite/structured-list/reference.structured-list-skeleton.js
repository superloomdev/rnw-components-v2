// Info: StructuredListSkeleton measurement reference. Upstream draws a
// table of a head row of three cells holding a bar each and `rowCount`
// rows of three empty cells (`_structured-list.scss:231-262`). Its
// collapsed borders give a row's box half of each rule on either side: a
// row compares its whole box (within half a pixel), a cell its box but
// its height; the closing rule is the perceptual gate's (upstream draws
// it on the last row's box, ours on the body's).

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  // Taller than the measurement grid's 160 pitch: the body declares its
  // height so the cell spans its rows
  body: Object.freeze({ width: 800, height: 260, stage: true }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.StructuredListSkeleton, { rowCount: props.rowCount });
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--structured-list', ours: '[data-part="root"]', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
    headCells: Object.freeze({ upstream: '.cds--structured-list-th', all: true, ours: '[data-part="headCell"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'paddingTop', 'paddingLeft', 'paddingRight'] }),
    bars: Object.freeze({ upstream: '.cds--structured-list-th span', all: true, ours: '[data-part="headCell"] > *', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor'] }),
    rows: Object.freeze({ upstream: '.cds--structured-list-tbody > .cds--structured-list-row', all: true, ours: '[data-part="rowGroup"] > [data-part="row"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopWidth', 'borderTopColor'] })
  })
});
