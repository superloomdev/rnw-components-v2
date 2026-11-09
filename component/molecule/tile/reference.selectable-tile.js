// Info: SelectableTile measurement reference. The upstream selectable is a
// `div` with `tabIndex 0` carrying the corner checkmark.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.SelectableTile, {
      disabled: props.disabled === true,
      id: 'reference-selectable',
      selected: props.selected === true
    }, props.children);
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--tile--selectable', ours: ':scope > div', measure: 'box' }),
    marks: Object.freeze({ upstream: '.cds--tile__checkmark', ours: ':scope > div > div:not([dir="auto"])', measure: 'box' }),
    // upstream's .cds--tile__checkmark svg carries border-radius 50% (_tile.scss:191-195)
    // over a transparent background (probe markGlyphs backgroundColor 'rgba(0, 0, 0, 0)') -
    // the radius paints nothing, so the glyph compares box + fill only
    markGlyphs: Object.freeze({ upstream: '.cds--tile__checkmark svg', ours: ':scope > div svg', measure: 'box', compare: ['x', 'y', 'width', 'height', 'fill'] })
  })
});
