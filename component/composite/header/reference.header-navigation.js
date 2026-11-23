// Info: HeaderNavigation measurement reference. Upstream draws a
// `nav.cds--header__nav` with its `::before` rule, holding the
// `ul.cds--header__menu-bar` of links and menus, inside the staged Header
// the sample's wrapper names. The parts compared are the landmark, its
// rule, the links and the current bar.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  body: Object.freeze({ width: 800, height: 240, stage: true }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.HeaderNavigation, { 'aria-label': props.accessibilityLabel },
      props.items.map(function (item, index) {
        if (Array.isArray(item.items)) {
          return React.createElement(upstream.HeaderMenu, { 'aria-label': item.label, key: index, menuLinkName: item.label },
            item.items.map(function (entry, entryIndex) {
              return React.createElement(upstream.HeaderMenuItem, { href: entry.href, key: entryIndex }, entry.label);
            }));
        }
        return React.createElement(upstream.HeaderMenuItem, { href: item.href, isActive: item.isActive === true, key: index }, item.label);
      }));
  },
  parts: Object.freeze({
    nav: Object.freeze({ upstream: '.cds--header__nav', ours: 'nav, [role="navigation"]', measure: 'box' }),
    rule: Object.freeze({ upstream: '.cds--header__nav', pseudo: '::before', ours: 'nav > div:first-child, [role="navigation"] > div:first-child', measure: 'box' }),
    links: Object.freeze({ upstream: '.cds--header__menu-bar > li > a', all: true, ours: 'nav > ul > li > a, nav > [role="list"] > [role="listitem"] > [role="link"]', measure: 'box' }),
    current: Object.freeze({ upstream: '.cds--header__menu-item--current', pseudo: '::after', ours: 'nav [aria-current] > div[aria-hidden="true"]', measure: 'box', optional: true })
  })
});
