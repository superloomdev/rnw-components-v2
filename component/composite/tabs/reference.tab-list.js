// Info: TabList measurement reference. Upstream mounts `Tabs` around a
// `TabList` of `Tab` buttons; ours is the same bar.

export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  mount: function (React, upstream, props) {
    const items = Array.isArray(props.items) ? props.items : [];
    return React.createElement(upstream.Tabs, {
      dismissable: props.dismissable === true,
      onTabCloseRequest: props.dismissable === true ? function () {
        return undefined;
      } : undefined,
      selectedIndex: props.defaultSelectedIndex,
      onChange: function () {
        return undefined;
      }
    }, React.createElement(upstream.TabList, {
      'aria-label': props.accessibilityLabel || 'Sections',
      contained: props.variant === 'contained'
    }, items.map(function (item, index) {
      return React.createElement(upstream.Tab, { key: index, disabled: item.disabled === true, secondaryLabel: item.secondaryLabel, renderIcon: item.icon !== undefined ? function () {
        return React.createElement('span', { style: { display: 'inline-block', width: 16, height: 16 } });
      } : undefined }, item.label);
    })));
  },
  target: Object.freeze({ upstream: '.cds--tabs__nav-link:first-of-type', ours: 'div:has(> [role="tab"]):first-of-type > [role="tab"]' }),
  parts: Object.freeze({
    bar: Object.freeze({ upstream: '.cds--tab--list', ours: '[role="tablist"]', measure: 'box' }),
    tab: Object.freeze({ upstream: '.cds--tabs__nav-link:first-of-type', ours: 'div:has(> [role="tab"]):first-of-type > div:first-child', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--tabs__nav-item--selected .cds--tabs__nav-item-label', ours: 'div:has(> [role="tab"][aria-selected="true"]) > div:first-child [dir="auto"]', measure: 'text' })
  })
});
