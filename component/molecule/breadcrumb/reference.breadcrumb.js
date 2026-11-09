// Info: Breadcrumb measurement reference. Upstream draws the `nav`'s
// ordered list: `.cds--breadcrumb-item` per entry with a `/` `::after`
// between them, `cds--link` for the href entries and `aria-current` on
// the current; an `{ overflow: [labels] }` entry is a BreadcrumbItem
// holding an OverflowMenu whose menu mounts inside the
// `data-floating-menu-container` wrapper (position relative). The
// `overflowOpen` state re-presses the trigger when the panel has gone.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  body: Object.freeze({ width: 600, height: 200 }),
  mount: function (React, upstream, props) {
    const item = function (entry, index) {
      if (Array.isArray(entry.overflow)) {
        return React.createElement(upstream.BreadcrumbItem, { key: index },
          React.createElement(upstream.OverflowMenu, { 'aria-label': 'More pages' },
            entry.overflow.map(function (option, optionIndex) {
              return React.createElement(upstream.OverflowMenuItem, { itemText: option.label !== undefined ? option.label : option, key: optionIndex });
            })));
      }
      return React.createElement(upstream.BreadcrumbItem, { key: index, href: entry.href, isCurrentPage: entry.isCurrentPage === true }, entry.label);
    };
    return React.createElement('div', { 'data-floating-menu-container': true, style: { position: 'relative' } },
      React.createElement(upstream.Breadcrumb, { noTrailingSlash: props.noTrailingSlash === true, size: props.size }, props.items.map(item)));
  },
  // The element a person interacts with: the first link
  target: Object.freeze({ upstream: '.cds--breadcrumb-item:first-child .cds--link', ours: '[role="list"] [role="link"]' }),
  additionalTargets: Object.freeze([
    Object.freeze({
      name: 'overflow',
      interactions: Object.freeze(['hover', 'focus']),
      states: Object.freeze(['overflow', 'overflowSmall']),
      upstream: '.cds--breadcrumb-item .cds--overflow-menu',
      ours: '[role="listitem"] [role="button"]'
    })
  ]),
  reopen: Object.freeze({
    states: Object.freeze(['overflowOpen']),
    when: Object.freeze({ upstream: '.cds--breadcrumb-menu-options', ours: '[role="menu"]' }),
    upstream: '.cds--breadcrumb-item .cds--overflow-menu',
    ours: '[role="listitem"] [role="button"]'
  }),
  parts: Object.freeze({
    list: Object.freeze({ upstream: '.cds--breadcrumb', ours: '[role="navigation"]', measure: 'box', compare: ['fontSize', 'lineHeight', 'letterSpacing', 'fontWeight'] }),
    items: Object.freeze({ upstream: '.cds--breadcrumb-item', all: true, ours: '[role="listitem"]', measure: 'box', compare: ['marginRight'] }),
    separators: Object.freeze({ upstream: '.cds--breadcrumb-item', pseudo: '::after', all: true, ours: '[role="listitem"] > [dir="auto"]:last-child', measure: 'box', optional: true, compare: ['cssWidth', 'color', 'marginLeft'] }),
    links: Object.freeze({ upstream: '.cds--breadcrumb-item .cds--link', all: true, ours: '[role="link"], [role="listitem"] [dir="auto"]', measure: 'box', compare: ['color', 'minWidth', 'fontSize'], optional: true }),
    current: Object.freeze({ upstream: '.cds--breadcrumb-item--current .cds--link, [aria-current="page"]', ours: '[aria-current="page"]', measure: 'box', optional: true, compare: ['color'] }),
    overflow: Object.freeze({ upstream: '.cds--breadcrumb-item .cds--overflow-menu', ours: '[role="listitem"] [data-testid="icon-button-face"]', measure: 'box', optional: true, compare: ['width', 'height', 'backgroundColor'] }),
    overflowIcon: Object.freeze({ upstream: '.cds--breadcrumb-item .cds--overflow-menu__icon', ours: '[role="listitem"] [data-testid="icon-button-face"] svg', measure: 'box', optional: true, compare: ['width', 'height', 'fill', 'cssTop'] }),
    overflowUnderline: Object.freeze({ upstream: '.cds--breadcrumb-item .cds--overflow-menu', pseudo: '::after', ours: '[data-part="focusUnderline"]', measure: 'box', optional: true, compare: ['cssWidth', 'cssHeight', 'backgroundColor'] }),
    menu: Object.freeze({ upstream: '.cds--breadcrumb-menu-options', ours: '[role="menu"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'backgroundColor', 'boxShadow'] }),
    caret: Object.freeze({ upstream: '.cds--breadcrumb-menu-options', pseudo: '::after', ours: '[role="menu"] > div:first-child', measure: 'box', optional: true, compare: ['cssWidth', 'borderBottomWidth', 'borderBottomColor'] })
  })
});
