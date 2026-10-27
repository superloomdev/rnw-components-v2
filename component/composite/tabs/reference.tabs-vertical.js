// Info: TabsVertical measurement reference. Upstream mounts `TabsVertical` +
// `TabListVertical`; ours is the column list beside the panel.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    const items = Array.isArray(props.items) ? props.items : [];
    return React.createElement(upstream.TabsVertical, {
      height: Number.isFinite(props.height) ? props.height + 'px' : undefined,
      selectedIndex: props.defaultSelectedIndex,
      onChange: function () {
        return undefined;
      }
    }, React.createElement(upstream.TabListVertical, {
      'aria-label': props.accessibilityLabel || 'Sections'
    }, items.map(function (item, index) {
      return React.createElement(upstream.Tab, { key: index }, item.label);
    })),
    Array.isArray(props.panels) ? React.createElement(upstream.TabPanels, null, props.panels.map(function (text, i) {
      return React.createElement(upstream.TabPanel, { key: i }, text);
    })) : null);
  },
  parts: Object.freeze({
    list: Object.freeze({ upstream: '.cds--tab--list', ours: '[role="tablist"]', measure: 'box' }),
    tab: Object.freeze({ upstream: '.cds--tabs__nav-link:first-of-type', ours: '[role="tab"]:first-of-type', measure: 'box', optional: true })
  })
});
