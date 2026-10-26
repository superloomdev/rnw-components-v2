// Info: TabsVertical measurement reference. Upstream mounts `Tabs` with the
// `vertical` prop; ours is the column list beside the panel.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    const items = Array.isArray(props.items) ? props.items : [];
    return React.createElement(upstream.Tabs, {
      vertical: true,
      selectedIndex: props.defaultSelectedIndex,
      onChange: function () {
        return undefined;
      }
    }, React.createElement(upstream.TabList, {
      'aria-label': props.accessibilityLabel || 'Sections',
      vertical: true
    }, items.map(function (item, index) {
      return React.createElement(upstream.Tab, { key: index }, item.label);
    })));
  },
  parts: Object.freeze({
    list: Object.freeze({ upstream: '.cds--tab--list', ours: '[role="tablist"]', measure: 'box' }),
    tab: Object.freeze({ upstream: '.cds--tabs__nav-link:first-of-type', ours: '[role="tab"]:first-of-type', measure: 'box', optional: true })
  })
});
