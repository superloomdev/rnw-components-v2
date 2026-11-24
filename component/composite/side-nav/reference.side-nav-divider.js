// Info: SideNavDivider measurement reference. Upstream draws an
// `li.cds--side-nav__divider`, a 1 rule 8 below the link before it, 16 in
// from each side, in the list the sample's wrappers name.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  body: Object.freeze({ width: 320, height: 200, stage: true }),
  mount: function (React, upstream) {
    return React.createElement(React.Fragment, null,
      React.createElement(upstream.SideNavLink, { href: '#dashboard', key: 'link', renderIcon: upstream.icon('home') }, 'Dashboard'),
      React.createElement(upstream.SideNavDivider, { key: 'divider' }));
  },
  parts: Object.freeze({
    divider: Object.freeze({ upstream: '.cds--side-nav__divider', ours: 'nav [role="separator"]', measure: 'box' })
  })
});
