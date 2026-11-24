// Info: SideNavItems measurement reference. Upstream draws a
// `ul.cds--side-nav__items` growing to the navigation's height with 16
// above its links, in the navigation the sample's wrapper names. Ours
// grows to the navigation's height only where a host gives the navigation
// one (a row); in the staged body the list is its content, so its height
// is left out.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  body: Object.freeze({ width: 320, height: 200, stage: true }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.SideNavItems, null, props.items.map(function (item, index) {
      return React.createElement(upstream.SideNavLink, { href: item.href, isActive: item.isActive === true, key: index, renderIcon: upstream.icon(item.icon) }, item.label);
    }));
  },
  parts: Object.freeze({
    // The height is the navigation's upstream, the content's in our staged body
    list: Object.freeze({ upstream: 'ul.cds--side-nav__items', ours: 'nav [role="list"], nav ul', measure: 'box', compare: ['x', 'y', 'width', 'paddingTop'], except: ['height'] }),
    links: Object.freeze({ upstream: 'a.cds--side-nav__link', all: true, ours: 'nav a, nav [role="link"]', measure: 'box' })
  })
});
