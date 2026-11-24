// Info: SideNavMenu measurement reference. Upstream draws an
// `li.cds--side-nav__item` holding the `button.cds--side-nav__submenu`
// (its optional icon box, its title span and its chevron box) and the
// `ul.cds--side-nav__menu` of links, in the navigation and list the
// sample's wrappers name; an active closed menu draws its bar as the
// button's `::before`.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  body: Object.freeze({ width: 320, height: 200, stage: true }),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.SideNavMenu, {
      defaultExpanded: props.defaultExpanded === true,
      isActive: props.isActive === true,
      large: props.large === true,
      renderIcon: typeof props.icon === 'string' ? upstream.icon(props.icon) : undefined,
      title: props.title
    }, (props.items || []).map(function (item, index) {
      return React.createElement(upstream.SideNavMenuItem, { href: item.href, isActive: item.isActive === true, key: index }, item.label);
    }));
  },
  target: Object.freeze({ upstream: 'button.cds--side-nav__submenu', ours: 'nav button[aria-expanded]' }),
  parts: Object.freeze({
    button: Object.freeze({ upstream: 'button.cds--side-nav__submenu', ours: 'nav button[aria-expanded]', measure: 'box' }),
    title: Object.freeze({ upstream: '.cds--side-nav__submenu-title', ours: 'nav button[aria-expanded] > [dir="auto"]', measure: 'text' }),
    chevron: Object.freeze({ upstream: '.cds--side-nav__submenu-chevron svg path', ours: 'nav button[aria-expanded] [data-part="chevron"] svg path', measure: 'box' }),
    icon: Object.freeze({ upstream: '.cds--side-nav__submenu > .cds--side-nav__icon:not(.cds--side-nav__submenu-chevron) svg path', ours: 'nav button[aria-expanded] > [data-part="icon"] svg path', measure: 'box', optional: true }),
    indicator: Object.freeze({ upstream: '.cds--side-nav__item--active > .cds--side-nav__submenu[aria-expanded="false"]', pseudo: '::before', ours: 'nav button[aria-expanded] > [data-part="indicator"]', measure: 'box', optional: true }),
    links: Object.freeze({ upstream: '.cds--side-nav__menu a.cds--side-nav__link', all: true, ours: 'nav button[aria-expanded] + * a, nav button[aria-expanded] + * [role="link"]', measure: 'box', optional: true }),
    linkText: Object.freeze({ upstream: '.cds--side-nav__menu .cds--side-nav__link-text', ours: 'nav button[aria-expanded] + * a [dir="auto"], nav button[aria-expanded] + * [role="link"] [dir="auto"]', measure: 'text', optional: true })
  })
});
