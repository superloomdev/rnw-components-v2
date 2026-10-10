// Info: Tabs measurement reference. The upstream tabs mount a `Tabs` around
// a `TabList` of `Tab` buttons: the list is `ul.cds--tab--list`, each tab a
// `li > button.cds--tabs__nav-link` whose bottom border is the track and,
// on the selected tab, the indicator (the button's edge, measured as a
// `strip` against the indicator seat ours paints over the same rows). The
// `contained` prop draws the contained cells. The parts compared are the
// bar, an unselected tab, the selected tab's label and its indicator seat.
// The second reference is `md-tabs` of `md-primary-tab` elements (the
// content-width indicator); it has no contained variant, so a `contained`
// sample is unmeasured there.

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
    })));
  },
  // The element a person hovers, presses and focuses: a tab's button
  target: Object.freeze({ upstream: '.cds--tabs__nav-link:first-of-type', ours: '[role="tab"]:first-of-type' }),
  parts: Object.freeze({
    bar: Object.freeze({ upstream: '.cds--tab--list', ours: '[role="tablist"]', measure: 'box' }),
    tab: Object.freeze({ upstream: '.cds--tabs__nav-link:first-of-type', ours: '[role="tab"]:first-of-type', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--tabs__nav-item--selected .cds--tabs__nav-item-label', ours: '[role="tab"][aria-selected="true"] [dir="auto"]', measure: 'text' }),
    indicator: Object.freeze({ upstream: '.cds--tabs__nav-item--selected', strip: 'borderBottom', ours: '[role="tab"][aria-selected="true"] > [aria-hidden="true"]:last-of-type', measure: 'box', optional: true, compare: ['x', 'width', 'height', 'backgroundColor'] })
  }),
  second: Object.freeze({
    origin: 'bar',
    mount: function (React, upstream, props) {
      if (props.variant === 'contained') {
        return null;
      }
      const items = Array.isArray(props.items) ? props.items : [];
      return React.createElement('md-tabs', {
        'aria-label': props.accessibilityLabel || 'Sections'
      }, items.map(function (item, index) {
        return React.createElement('md-primary-tab', {
          key: index,
          active: index === (props.defaultSelectedIndex || 0) ? true : undefined,
          'aria-disabled': item.disabled === true ? true : undefined,
          // The page loads no upstream typescale, so the label's tracking
          // falls back to normal; the mount restores the label-large value
          style: { letterSpacing: 0.1 }
        }, item.label);
      }));
    },
    parts: Object.freeze({
      bar: Object.freeze({ upstream: 'md-tabs >>> .tabs', ours: '[role="tablist"]', measure: 'box' }),
      tab: Object.freeze({ upstream: 'md-primary-tab', ours: '[role="tab"]:first-of-type', measure: 'box' }),
      label: Object.freeze({ upstream: 'md-primary-tab[active]', ours: '[role="tab"][aria-selected="true"] [dir="auto"]', measure: 'text' }),
      indicator: Object.freeze({ upstream: 'md-primary-tab[active] >>> .indicator', ours: '[role="tab"][aria-selected="true"] > div:nth-of-type(3) > [aria-hidden="true"]', measure: 'box', compare: ['x', 'width', 'height', 'backgroundColor', 'borderTopLeftRadius'] })
    })
  })
});
