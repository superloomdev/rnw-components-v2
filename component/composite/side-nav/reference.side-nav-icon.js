// Info: SideNavIcon measurement reference. Upstream draws a
// `div.cds--side-nav__icon` holding the glyph, alone in the item the
// sample's wrappers name: outside a flex row its box spans the item less
// its end margin and centers the glyph.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  body: Object.freeze({ width: 320, height: 200, stage: true }),
  mount: function (React, upstream, props) {
    const Glyph = upstream.icon(props.icon);
    return React.createElement(upstream.SideNavIcon, null, React.createElement(Glyph));
  },
  parts: Object.freeze({
    box: Object.freeze({ upstream: '.cds--side-nav__icon', ours: 'nav [data-part="icon"]', measure: 'box' }),
    glyph: Object.freeze({ upstream: '.cds--side-nav__icon svg path', ours: 'nav [role="listitem"] svg path', measure: 'box' })
  })
});
