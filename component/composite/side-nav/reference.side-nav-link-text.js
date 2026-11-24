// Info: SideNavLinkText measurement reference. Upstream draws the
// `.cds--side-nav__link-text` span a SideNavLink or a SideNavMenuItem
// wraps its children in; the sample's wrappers name the link, so the mount
// passes the text and the upstream link draws the span.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  body: Object.freeze({ width: 320, height: 200, stage: true }),
  mount: function (React, upstream, props) {
    return props.children;
  },
  parts: Object.freeze({
    text: Object.freeze({ upstream: '.cds--side-nav__link-text', ours: 'nav a [dir="auto"], nav [role="link"] [dir="auto"]', measure: 'text' })
  })
});
