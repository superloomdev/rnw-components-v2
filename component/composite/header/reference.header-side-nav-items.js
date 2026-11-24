// Info: HeaderSideNavItems measurement reference. Upstream draws the
// `ul.cds--side-nav__header-navigation` of `a.cds--header__menu-item`
// links below lg only (`ui-shell/side-nav/_side-nav.scss:466-476`), inside
// the expanded side navigation the sample's wrapper names; the divider is
// the list's `::after` (`:478-486`), the current link's bar its own
// `::after` (`:531-539`). The narrow set draws a 320 body in a 375 window;
// from lg only the navigation is drawn.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  body: Object.freeze({ width: 320, height: 240, stage: true }),
  narrow: Object.freeze({ window: 375, width: 320 }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.HeaderSideNavItems, { hasDivider: props.hasDivider === true },
      props.items.map(function (item, index) {
        return React.createElement(upstream.HeaderMenuItem, { href: item.href, isActive: item.isActive === true, key: index }, item.label);
      }));
  },
  target: Object.freeze({ upstream: '.cds--side-nav__header-navigation a.cds--header__menu-item', ours: 'nav [role="list"] a, nav [role="list"] [role="link"]' }),
  parts: Object.freeze({
    nav: Object.freeze({ upstream: 'nav.cds--side-nav', ours: 'nav, [role="navigation"]', measure: 'box' }),
    list: Object.freeze({ upstream: '.cds--side-nav__header-navigation', ours: 'nav [role="list"]', measure: 'box', optional: true }),
    links: Object.freeze({ upstream: '.cds--side-nav__header-navigation a.cds--header__menu-item', all: true, ours: 'nav [role="list"] a, nav [role="list"] [role="link"]', measure: 'box', optional: true }),
    linkText: Object.freeze({ upstream: '.cds--side-nav__header-navigation a.cds--header__menu-item > span', ours: 'nav [role="list"] a [dir="auto"], nav [role="list"] [role="link"] [dir="auto"]', measure: 'text', optional: true }),
    current: Object.freeze({ upstream: '.cds--side-nav__header-navigation .cds--header__menu-item--current', pseudo: '::after', ours: 'nav [aria-current] > div[aria-hidden="true"]', measure: 'box', optional: true }),
    divider: Object.freeze({ upstream: '.cds--side-nav__header-divider', pseudo: '::after', ours: 'nav [role="list"] > div[aria-hidden="true"]', measure: 'box', optional: true })
  })
});
