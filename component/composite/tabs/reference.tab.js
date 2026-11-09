// Info: Tab measurement reference. Upstream's Tab is the
// `cds--tabs__nav-link` button inside a TabList; ours is the same seat.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Tabs, { selectedIndex: -1 }, React.createElement(upstream.TabList, {
      'aria-label': 'Sections'
    }, React.createElement(upstream.Tab, { disabled: props.disabled === true, renderIcon: props.icon !== undefined ? function () {
      return React.createElement('span', { style: { display: 'inline-block', width: 16, height: 16 } });
    } : undefined }, props.label)));
  },
  target: Object.freeze({ upstream: '.cds--tabs__nav-link', ours: '[role="tab"]' }),
  parts: Object.freeze({
    tab: Object.freeze({ upstream: '.cds--tabs__nav-link', ours: 'div:has(> [role="tab"]) > div:first-child', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--tabs__nav-item-label', ours: 'div:has(> [role="tab"]) > div:first-child [dir="auto"]', measure: 'text' })
  })
});
