// Info: ContentSwitcher measurement reference. Upstream mounts
// `ContentSwitcher` of `Switch` segments; the second reference was
// retired (batch R).

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    const items = Array.isArray(props.items) ? props.items : [];
    return React.createElement(upstream.ContentSwitcher, {
      'aria-label': props.accessibilityLabel || 'Views',
      selectedIndex: props.defaultSelectedIndex || 0,
      size: props.size === 'lg' ? 'lg' : props.size === 'sm' ? 'sm' : 'md',
      lowContrast: props.lowContrast === true,
      onChange: function () {
        return undefined;
      }
    }, items.map(function (item, index) {
      if (item.icon !== undefined && item.text === undefined) {
        const literal = upstream.tokens['icon.' + item.icon];
        const sized = literal !== undefined && literal.sizes !== undefined && literal.sizes['16'] !== undefined ? literal.sizes['16'] : literal;
        return React.createElement(upstream.IconSwitch, {
          key: index,
          disabled: item.disabled === true,
          name: item.label
        }, React.createElement('svg', { viewBox: sized !== undefined ? sized.viewBox : '0 0 16 16', 'aria-hidden': true, fill: 'currentColor', width: 16, height: 16 },
          sized !== undefined && sized.children !== undefined ? sized.children.map(function (child, i) {
            return React.createElement('path', { key: i, d: child });
          }) : null));
      }
      return React.createElement(upstream.Switch, {
        'aria-label': item.label,
        key: index,
        disabled: item.disabled === true,
        text: item.text
      }, item.icon !== undefined ? React.createElement('span', { style: { display: 'inline-block', width: 16, height: 16 } }) : null);
    }));
  },
  target: Object.freeze({ upstream: '.cds--content-switcher-btn:first-of-type', ours: '[role="tab"]' }),
  parts: Object.freeze({
    container: Object.freeze({ upstream: '.cds--content-switcher', ours: '[role="tablist"]', measure: 'box' }),
    segment: Object.freeze({ upstream: '.cds--content-switcher-btn:first-of-type', ours: '[role="tab"]', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--content-switcher--selected .cds--content-switcher__label', ours: '[role="tab"][aria-selected="true"] [dir="auto"]', measure: 'text', optional: true }),
    slab: Object.freeze({ upstream: '.cds--content-switcher--selected', pseudo: '::after', ours: '[role="tab"][aria-selected="true"] > div:nth-child(2)', measure: 'box', compare: ['width', 'height', 'backgroundColor'] })
  })
});
