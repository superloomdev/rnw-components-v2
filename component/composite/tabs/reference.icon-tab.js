// Info: IconTab measurement reference. Upstream's icon tab is a `Tab` with
// `renderIcon` inside `TabList` whose `iconSize` prop is set; the second
// reference was retired (batch R).

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Tabs, { selectedIndex: -1 }, React.createElement(upstream.TabList, {
      'aria-label': 'Sections', iconSize: 'default'
    }, React.createElement(upstream.IconTab, { disabled: props.disabled === true, label: props.label }, React.createElement('span', { style: { display: 'inline-block', width: 16, height: 16 } }))));
  },
  parts: Object.freeze({
    tab: Object.freeze({ upstream: '.cds--tabs__nav-item--icon-only', ours: '[role="tab"]', measure: 'box' })
  })
});
