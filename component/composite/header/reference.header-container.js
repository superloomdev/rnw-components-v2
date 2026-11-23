// Info: HeaderContainer measurement reference. Upstream's container
// renders the component it is given with the expansion state; the mount
// gives it a Header with a collapsible HeaderMenuButton that shows the
// state, and the name. The parts compared are the bar, the toggle and the
// name.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  body: Object.freeze({ width: 800, height: 120, stage: true }),
  // The name's end padding is 16 below md, read from the window
  // (`ui-shell/header/_header.scss:173-175`): the narrow set draws a 320
  // body in a 375 window
  narrow: Object.freeze({ window: 375, width: 320 }),
  mount: function (React, upstream, props) {
    const header = props.header;
    const Shell = function (shellProps) {
      return React.createElement(upstream.Header, { 'aria-label': header.accessibilityLabel },
        React.createElement(upstream.HeaderMenuButton, {
          'aria-label': header.menuButton.label,
          isActive: shellProps.isSideNavExpanded,
          isCollapsible: true,
          onClick: shellProps.onClickSideNavExpand
        }),
        React.createElement(upstream.HeaderName, { href: header.name.href, prefix: header.name.prefix }, header.name.label));
    };
    return React.createElement(upstream.HeaderContainer, { isSideNavExpanded: props.isSideNavExpanded === true, render: Shell });
  },
  parts: Object.freeze({
    bar: Object.freeze({ upstream: '.cds--header', ours: 'header, [role="banner"]', measure: 'box' }),
    toggle: Object.freeze({ upstream: '.cds--header__menu-toggle', ours: 'header > button, [role="banner"] > button', measure: 'box' }),
    glyph: Object.freeze({ upstream: '.cds--header__menu-toggle svg path', ours: 'header > button svg path, [role="banner"] > button svg path', measure: 'box' }),
    name: Object.freeze({ upstream: 'a.cds--header__name', ours: 'header > a, [role="banner"] > a', measure: 'box' })
  })
});
