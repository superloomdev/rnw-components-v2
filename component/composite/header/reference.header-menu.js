// Info: HeaderMenu measurement reference. Upstream draws an
// `li.cds--header__submenu` holding the `a.cds--header__menu-title` with
// its `.cds--header__menu-arrow` and the `ul.cds--header__menu` it opens,
// in the menu bar of the staged Header the sample's wrappers name. The
// `open` states press the title open again when the list has gone.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  body: Object.freeze({ width: 800, height: 240, stage: true }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.HeaderMenu, { 'aria-label': props.menuLinkName, menuLinkName: props.menuLinkName },
      props.items.map(function (item, index) {
        return React.createElement(upstream.HeaderMenuItem, { href: item.href, isActive: item.isActive === true, key: index }, item.label);
      }));
  },
  target: Object.freeze({ upstream: 'a.cds--header__menu-title', ours: 'nav [aria-haspopup="menu"]' }),
  reopen: Object.freeze({
    states: Object.freeze(['open', 'openCurrent']),
    when: Object.freeze({ upstream: 'a.cds--header__menu-title[aria-expanded="true"]', ours: 'nav [aria-haspopup="menu"][aria-expanded="true"]' }),
    upstream: 'a.cds--header__menu-title',
    ours: 'nav [aria-haspopup="menu"]'
  }),
  parts: Object.freeze({
    title: Object.freeze({ upstream: 'a.cds--header__menu-title', ours: 'nav [aria-haspopup="menu"]', measure: 'box' }),
    titleLabel: Object.freeze({ upstream: 'a.cds--header__menu-title', ours: 'nav [aria-haspopup="menu"] > [dir="auto"]', measure: 'type' }),
    arrow: Object.freeze({ upstream: '.cds--header__menu-arrow path', ours: 'nav [aria-haspopup="menu"] svg path', measure: 'box' }),
    titleBar: Object.freeze({ upstream: 'a.cds--header__menu-title.cds--header__menu-item--current', pseudo: '::after', ours: 'nav [aria-haspopup="menu"] > div[aria-hidden="true"]', measure: 'box', optional: true }),
    menu: Object.freeze({ upstream: '.cds--header__menu-title[aria-expanded="true"] + .cds--header__menu', ours: 'nav [aria-haspopup="menu"] + [role="list"], nav [aria-haspopup="menu"] + ul', measure: 'box', optional: true }),
    rows: Object.freeze({ upstream: '.cds--header__menu a.cds--header__menu-item', all: true, ours: 'nav [aria-haspopup="menu"] + * [role="link"], nav [aria-haspopup="menu"] + * a', measure: 'box', optional: true }),
    rowBar: Object.freeze({ upstream: '.cds--header__menu .cds--header__menu-item--current', pseudo: '::after', ours: 'nav [aria-haspopup="menu"] + * [aria-current] > div[aria-hidden="true"]', measure: 'box', optional: true })
  })
});
