// Info: HeaderMenuItem measurement reference. Upstream draws an `li`
// holding the `a.cds--header__menu-item` link and its truncating span, in
// the menu bar of the staged Header the sample's wrappers name; the
// current link draws its bar as the link's `::after`.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  body: Object.freeze({ width: 800, height: 120, stage: true }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.HeaderMenuItem, { href: props.href, isActive: props.isActive === true }, props.children);
  },
  target: Object.freeze({ upstream: 'a.cds--header__menu-item', ours: 'nav [role="link"], nav a' }),
  parts: Object.freeze({
    link: Object.freeze({ upstream: 'a.cds--header__menu-item', ours: 'nav [role="link"], nav a', measure: 'box' }),
    label: Object.freeze({ upstream: 'a.cds--header__menu-item > span', ours: 'nav [role="link"] [dir="auto"], nav a [dir="auto"]', measure: 'text' }),
    indicator: Object.freeze({ upstream: '.cds--header__menu-item--current', pseudo: '::after', ours: 'nav [aria-current] > div[aria-hidden="true"]', measure: 'box', optional: true })
  })
});
