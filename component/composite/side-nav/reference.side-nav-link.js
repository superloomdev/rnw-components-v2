// Info: SideNavLink measurement reference. Upstream draws an `li` holding
// the `a.cds--side-nav__link` link, its optional icon box and its text
// span, in the navigation and list the sample's wrappers name; the current
// link draws its bar as the link's `::before`.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  body: Object.freeze({ width: 320, height: 200, stage: true }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.SideNavLink, {
      href: props.href,
      isActive: props.isActive === true,
      large: props.large === true,
      renderIcon: typeof props.icon === 'string' ? upstream.icon(props.icon) : undefined
    }, props.children);
  },
  target: Object.freeze({ upstream: 'a.cds--side-nav__link', ours: 'nav a, nav [role="link"]' }),
  parts: Object.freeze({
    link: Object.freeze({ upstream: 'a.cds--side-nav__link', ours: 'nav a, nav [role="link"]', measure: 'box' }),
    text: Object.freeze({ upstream: '.cds--side-nav__link-text', ours: 'nav a [dir="auto"], nav [role="link"] [dir="auto"]', measure: 'text' }),
    icon: Object.freeze({ upstream: 'a.cds--side-nav__link .cds--side-nav__icon svg path', ours: 'nav [data-part="icon"] svg path', measure: 'box', optional: true }),
    indicator: Object.freeze({ upstream: 'a.cds--side-nav__link--current', pseudo: '::before', ours: 'nav [aria-current] > [data-part="indicator"]', measure: 'box', optional: true })
  })
});
