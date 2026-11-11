// Info: RadioTile measurement reference. The upstream radio is a hidden
// input plus its labelled tile.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.RadioTile, {
      checked: props.checked === true,
      disabled: props.disabled === true,
      id: 'reference-radio',
      name: 'reference-radio',
      value: 'one'
    }, props.children);
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--tile--radio', ours: ':scope > div', measure: 'box' }),
    marks: Object.freeze({ upstream: '.cds--tile__checkmark', ours: ':scope > div > div:last-child', measure: 'box', optional: true }),
    // upstream's .cds--tile__checkmark svg carries border-radius 50% (_tile.scss:191-195)
    // over a transparent background (probe markGlyphs backgroundColor: zero alpha) -
    // the radius paints nothing, so the glyph compares box + fill only
    markGlyphs: Object.freeze({ upstream: '.cds--tile__checkmark svg', ours: ':scope > div svg', measure: 'box', compare: ['x', 'y', 'width', 'height', 'fill'], optional: true }),
    inputs: Object.freeze({ upstream: '.cds--tile-input', ours: ':scope input', measure: 'box', all: true, optional: true })
  })
});
