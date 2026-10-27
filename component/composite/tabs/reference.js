// Info: Tabs measurement reference. The upstream tabs mount a `Tabs` around
// a `TabList` of `Tab` buttons: the list is `ul.cds--tab--list`, each tab a
// `li > button.cds--tabs__nav-link` whose bottom border is the track and,
// on the selected tab, the indicator (the button's edge, measured as a
// `strip` against the indicator seat ours paints over the same rows). The
// `contained` prop draws the contained cells. The parts compared are the
// bar, an unselected tab, the selected tab's label and its indicator seat.
// The second reference was retired (batch R).

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  mount: function (React, upstream, props) {
    const items = Array.isArray(props.items) ? props.items : [];
    return React.createElement(upstream.Tabs, {
      selectedIndex: props.defaultSelectedIndex,
      onChange: function () {
        return undefined;
      }
    }, React.createElement(upstream.TabList, {
      'aria-label': props.accessibilityLabel || 'Sections',
      contained: props.variant === 'contained'
    }, items.map(function (item, index) {
      return React.createElement(upstream.Tab, { key: index, disabled: item.disabled === true }, item.label);
    })),
    // The with-panels sample draws its panels on both pages
    Array.isArray(props.panels) ? React.createElement(upstream.TabPanels, null, props.panels.map(function (text, index) {
      return React.createElement(upstream.TabPanel, { key: index }, text);
    })) : null);
  },
  // The element a person hovers, presses and focuses: a tab's button
  target: Object.freeze({ upstream: '.cds--tabs__nav-link:first-of-type', ours: 'div:has(> [role="tab"]):first-of-type > [role="tab"]' }),
  parts: Object.freeze({
    bar: Object.freeze({ upstream: '.cds--tab--list', ours: '[role="tablist"]', measure: 'box' }),
    tab: Object.freeze({ upstream: '.cds--tabs__nav-link:first-of-type', ours: 'div:has(> [role="tab"]):first-of-type > div:first-child', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--tabs__nav-item--selected .cds--tabs__nav-item-label', ours: 'div:has(> [role="tab"][aria-selected="true"]) > div:first-child [dir="auto"]', measure: 'text' }),
    indicator: Object.freeze({ upstream: '.cds--tabs__nav-item--selected', strip: 'borderBottom', ours: 'div:has(> [role="tab"][aria-selected="true"]) > div:first-child > [aria-hidden="true"]:last-of-type', measure: 'box', optional: true, compare: ['x', 'width', 'height', 'backgroundColor'] })
  })
});
