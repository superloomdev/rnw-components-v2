// Info: Header measurement reference. Upstream draws a fixed
// `header.cds--header` holding, in order, the menu toggle, the
// `a.cds--header__name`, the `nav.cds--header__nav` menu bar and the
// `.cds--header__global` actions; the body is staged so the fixed bar is
// the cell's. The parts compared are the bar, the toggle, the name, the
// menu bar with its rule, links and current bar, and the first action.

const BAR = 'header, [role="banner"]';

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze([]),
  body: Object.freeze({ width: 800, height: 120, stage: true }),
  // The menu bar shows from lg, the toggle without `isCollapsible` below
  // it, the name's end padding is 16 below md, all read from the window
  // (`ui-shell/header/_header.scss:149-153,173-175,205-213`): the narrow
  // set draws a 320 body in a 375 window
  narrow: Object.freeze({ window: 375, width: 320 }),
  mount: function (React, upstream, props) {
    const children = [];
    if (props.menuButton) {
      children.push(React.createElement(upstream.HeaderMenuButton, { 'aria-label': props.menuButton.label, isCollapsible: props.menuButton.isCollapsible === true, key: 'menuButton' }));
    }
    if (props.name) {
      children.push(React.createElement(upstream.HeaderName, { href: props.name.href, key: 'name', prefix: props.name.prefix || '' }, props.name.label));
    }
    if (props.navigation) {
      children.push(React.createElement(upstream.HeaderNavigation, { 'aria-label': props.navigation.accessibilityLabel, key: 'navigation' },
        props.navigation.items.map(function (item, index) {
          return React.createElement(upstream.HeaderMenuItem, { href: item.href, isActive: item.isActive === true, key: index }, item.label);
        })));
    }
    if (props.actions) {
      children.push(React.createElement(upstream.HeaderGlobalBar, { key: 'actions' },
        props.actions.map(function (action, index) {
          const Glyph = upstream.icon(action.icon);
          return React.createElement(upstream.HeaderGlobalAction, { 'aria-label': action.label, key: index, tooltipAlignment: index === props.actions.length - 1 ? 'end' : 'center' },
            React.createElement(Glyph, { size: 20 }));
        })));
    }
    return React.createElement(upstream.Header, { 'aria-label': props.accessibilityLabel }, children);
  },
  parts: Object.freeze({
    bar: Object.freeze({ upstream: '.cds--header', ours: BAR, measure: 'box' }),
    toggle: Object.freeze({ upstream: '.cds--header__menu-toggle', ours: 'header > button, [role="banner"] > button', measure: 'box', optional: true }),
    toggleIcon: Object.freeze({ upstream: '.cds--header__menu-toggle svg path', ours: 'header > button svg path, [role="banner"] > button svg path', measure: 'box', optional: true }),
    name: Object.freeze({ upstream: 'a.cds--header__name', ours: 'header > a, [role="banner"] > a', measure: 'box', optional: true }),
    nameType: Object.freeze({ upstream: 'a.cds--header__name > span:last-child', ours: 'header > a > [dir="auto"], [role="banner"] > a > [dir="auto"]', measure: 'type', optional: true }),
    nav: Object.freeze({ upstream: '.cds--header__nav', ours: 'nav, [role="navigation"]', measure: 'box', optional: true }),
    navRule: Object.freeze({ upstream: '.cds--header__nav', pseudo: '::before', ours: 'nav > div:first-child, [role="navigation"] > div:first-child', measure: 'box', optional: true }),
    links: Object.freeze({ upstream: 'a.cds--header__menu-item', all: true, ours: 'nav a, [role="navigation"] [role="link"]', measure: 'box', optional: true }),
    linkType: Object.freeze({ upstream: 'a.cds--header__menu-item > span', ours: 'nav a [dir="auto"], [role="navigation"] [role="link"] [dir="auto"]', measure: 'type', optional: true }),
    current: Object.freeze({ upstream: '.cds--header__menu-item--current', pseudo: '::after', ours: 'nav [aria-current] > div[aria-hidden="true"], [role="navigation"] [aria-current] > div[aria-hidden="true"]', measure: 'box', optional: true }),
    action: Object.freeze({ upstream: '.cds--header__global .cds--header__action', ours: 'header button[aria-label="Search"], [role="banner"] button[aria-label="Search"]', measure: 'box', optional: true }),
    actionIcon: Object.freeze({ upstream: '.cds--header__global .cds--header__action svg path', ours: 'header button[aria-label="Search"] svg path, [role="banner"] button[aria-label="Search"] svg path', measure: 'box', optional: true })
  })
});
