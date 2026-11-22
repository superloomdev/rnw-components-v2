// Info: TabsVertical measurement reference. Upstream mounts `TabsVertical` +
// `TabListVertical`; ours is the column list beside the panel. The page
// grid's margin and gutters are zeroed: the list is measured as its column
// share of the frame (census list ratio). The wrapper is the frame's width;
// the list part is the element that paints the layer, the tab part the item
// that draws the end divider.

import { FRAME } from './sample.tabs-vertical.js';

export default Object.freeze({
  kind: 'render-web',
  // Below md upstream draws a contained horizontal TabList instead of the
  // vertical list, read from the window (`Tabs.tsx:91,990,1116-1126`): the
  // narrow set draws a 320 body in a 375 window
  narrow: Object.freeze({ window: 375, width: 320 }),
  mount: function (React, upstream, props) {
    const items = Array.isArray(props.items) ? props.items : [];
    // The frame's width, held inside a narrow set's body
    return React.createElement('div', { style: { maxWidth: '100%', width: FRAME.width } },
      React.createElement('style', null, '.cds--css-grid{margin-inline:0;padding-inline:0;column-gap:0;max-inline-size:none}'),
      React.createElement(upstream.TabsVertical, {
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
      })) : null));
  },
  parts: Object.freeze({
    list: Object.freeze({ upstream: '.cds--tabs.cds--tabs--vertical', ours: 'div:has(> div > [role="tablist"])', measure: 'box' }),
    tab: Object.freeze({ upstream: '.cds--tabs__nav-item:first-of-type', ours: '[role="tab"]:first-of-type', measure: 'box', optional: true })
  })
});
