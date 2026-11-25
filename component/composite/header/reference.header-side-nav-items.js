// Info: HeaderSideNavItems measurement reference. Upstream draws the
// `ul.cds--side-nav__header-navigation` of `a.cds--header__menu-item`
// links below lg only (`ui-shell/side-nav/_side-nav.scss:466-476`), inside
// the expanded side navigation the sample's wrapper names; the divider is
// the list's `::after` (`:478-486`), the current link's bar its own
// `::after` (`:531-539`). The mount draws the sample's host row (the page
// in `layer_01`) and its expanded standalone SideNav, started at the staged
// body's top as SideNav's reference starts it. The narrow set draws a 320
// body in a 375 window, where the list is compared; from lg only the
// navigation is drawn, and `narrowOnly` names the parts both sides must
// then not draw (the wide window's gates assert it).

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  body: Object.freeze({ width: 320, height: 240, stage: true }),
  narrow: Object.freeze({ window: 375, width: 320 }),
  narrowOnly: Object.freeze(['list', 'links', 'linkText', 'current', 'divider']),
  mount: function (React, upstream, props) {
    const items = React.createElement(upstream.HeaderSideNavItems, { hasDivider: props.hasDivider === true },
      props.items.map(function (item, index) {
        return React.createElement(upstream.HeaderMenuItem, { href: item.href, isActive: item.isActive === true, key: index }, item.label);
      }));
    return React.createElement(React.Fragment, null,
      React.createElement('div', { key: 'page', style: { background: upstream.tokens['color.layer_01'], inset: 0, position: 'absolute' } }),
      React.createElement(upstream.SideNav, { expanded: true, isFixedNav: true, key: 'nav', style: { insetBlockStart: 0 } }, items));
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
