// Info: SideNavMenuItem measurement reference. Upstream draws an
// `li.cds--side-nav__menu-item` holding the `a.cds--side-nav__link` link
// and its text span, in the open menu the sample's wrappers name; the
// current link draws its bar as the link's `::before`.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  body: Object.freeze({ width: 320, height: 200, stage: true }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.SideNavMenuItem, { href: props.href, isActive: props.isActive === true }, props.children);
  },
  // Between reads the harness's Escape closes upstream's menu: each state
  // opens it again from its button
  reopen: Object.freeze({
    states: Object.freeze(['default', 'current']),
    upstream: 'button.cds--side-nav__submenu',
    ours: 'nav button[aria-expanded]',
    when: Object.freeze({ upstream: '.cds--side-nav__menu a.cds--side-nav__link', ours: 'nav button[aria-expanded] + * a' })
  }),
  target: Object.freeze({ upstream: '.cds--side-nav__menu a.cds--side-nav__link', ours: 'nav button[aria-expanded] + * a, nav button[aria-expanded] + * [role="link"]' }),
  parts: Object.freeze({
    link: Object.freeze({ upstream: '.cds--side-nav__menu a.cds--side-nav__link', ours: 'nav button[aria-expanded] + * a, nav button[aria-expanded] + * [role="link"]', measure: 'box' }),
    text: Object.freeze({ upstream: '.cds--side-nav__menu .cds--side-nav__link-text', ours: 'nav button[aria-expanded] + * a [dir="auto"], nav button[aria-expanded] + * [role="link"] [dir="auto"]', measure: 'text' }),
    indicator: Object.freeze({ upstream: '.cds--side-nav__menu a.cds--side-nav__link--current', pseudo: '::before', ours: 'nav [aria-current] > [data-part="indicator"]', measure: 'box', optional: true })
  })
});
