// Info: SideNav measurement reference. Upstream draws a fixed
// `nav.cds--side-nav` 48 under the window's top for its fixed header
// (`ui-shell/side-nav/_side-nav.scss:30-55`); ours is in flow under a
// header its host places, so the mount starts upstream's at the staged
// body's top (`insetBlockStart: 0`). Its overlay keeps upstream's 48 from
// the window's top and covers the window (`:77-101`), drawn below lg only;
// ours covers the layer space from the navigation's top, so it is no part
// here (the primary window never draws it) and the narrow set compares it
// by its pixels. Ours renders hosted so the layer space is the cell
// (`oursHosted`). The width follows the window (`:52-54`): the narrow set
// draws a 320 body in a 375 window. Both pages draw the page beside the
// navigation in `layer_01` (the sample's host row, a `div` here).


function entry (React, upstream, item, index) {
  if (item.divider === true) {
    return React.createElement(upstream.SideNavDivider, { key: index });
  }
  const renderIcon = typeof item.icon === 'string' ? upstream.icon(item.icon) : undefined;
  if (Array.isArray(item.items)) {
    return React.createElement(upstream.SideNavMenu, { defaultExpanded: item.defaultExpanded === true, isActive: item.isActive === true, key: index, large: item.large === true, renderIcon: renderIcon, title: item.title },
      item.items.map(function (link, linkIndex) {
        return React.createElement(upstream.SideNavMenuItem, { href: link.href, isActive: link.isActive === true, key: linkIndex }, link.label);
      }));
  }
  return React.createElement(upstream.SideNavLink, { href: item.href, isActive: item.isActive === true, key: index, large: item.large === true, renderIcon: renderIcon }, item.label);
}

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  body: Object.freeze({ width: 320, height: 320, stage: true }),
  narrow: Object.freeze({ window: 375, width: 320 }),
  oursHosted: true,
  mount: function (React, upstream, props) {
    const options = { isFixedNav: props.isFixedNav === true, isPersistent: props.isPersistent !== false, isRail: props.isRail === true, style: { insetBlockStart: 0 } };
    if (typeof props.expanded === 'boolean') {
      options.expanded = props.expanded;
    }
    // The page beside the navigation, as the sample's host row draws it,
    // in the primary template's `layer_01` (the page's own zone defines no
    // layer variable in the light scheme)
    return React.createElement(React.Fragment, null,
      React.createElement('div', { key: 'page', style: { background: upstream.tokens['color.layer_01'], inset: 0, position: 'absolute' } }),
      React.createElement(upstream.SideNav, Object.assign({ key: 'nav' }, options),
        React.createElement(upstream.SideNavItems, null, (props.items || []).map(function (item, index) {
          return entry(React, upstream, item, index);
        }))));
  },
  parts: Object.freeze({
    nav: Object.freeze({ upstream: 'nav.cds--side-nav', ours: 'nav, [role="navigation"]', measure: 'box', optional: true }),
    links: Object.freeze({ upstream: 'a.cds--side-nav__link', all: true, ours: 'nav a, nav [role="link"]', measure: 'box', optional: true }),
    menu: Object.freeze({ upstream: 'button.cds--side-nav__submenu', ours: 'nav button[aria-expanded]', measure: 'box', optional: true }),
    divider: Object.freeze({ upstream: '.cds--side-nav__divider', ours: 'nav [role="separator"]', measure: 'box', optional: true })
  })
});
