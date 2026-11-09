// Info: ExpandableTile measurement reference. The upstream tile carries
// `TileAboveTheFoldContent` and `TileBelowTheFoldContent`; `interactive`
// mounts a Link in the fold so the chevron alone toggles.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    const below = props.interactive === true
      ? React.createElement(upstream.Link, { href: '#' }, 'Below the fold link')
      : 'Below the fold content';
    return React.createElement(upstream.ExpandableTile, {
      expanded: props.expanded === true,
      id: 'reference-expandable',
      tileCollapsedIconText: 'Expand',
      tileExpandedIconText: 'Collapse'
    },
    React.createElement(upstream.TileAboveTheFoldContent, null, 'Above the fold content'),
    React.createElement(upstream.TileBelowTheFoldContent, null, below));
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--tile--expandable', ours: ':scope > button, :scope > div', measure: 'box' }),
    chevron: Object.freeze({ upstream: '.cds--tile__chevron', ours: ':scope > button > div:last-child, :scope > div > button', measure: 'box' }),
    chevronGlyph: Object.freeze({ upstream: '.cds--tile__chevron svg', ours: ':scope svg', measure: 'box' }),
    contents: Object.freeze({ upstream: '.cds--tile-content', ours: ':scope > button > div:not(:last-child), :scope > div > div', measure: 'box', all: true }),
    belowFold: Object.freeze({ upstream: '.cds--tile-content__below-the-fold', ours: ':scope > button > div:nth-child(2), :scope > div > div:nth-child(2)', measure: 'box', compare: ['x', 'y', 'width', 'height', 'opacity'] })
  })
});
