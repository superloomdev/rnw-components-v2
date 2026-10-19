// Info: OperationalTag measurement reference. The primary's operational
// tag takes `text`, a kebab-case `type` (default `gray`), `size`,
// `disabled` and `renderIcon`; it renders as a button and the button is
// the target. The second reference is the assist chip - no sizes or hues,
// so a sample naming either is unmeasured there; its icon is a slotted
// glyph the mount draws from the theme's own icon token.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.OperationalTag, {
      text: props.text,
      type: props.type ? String(props.type).replace(/_/g, '-') : undefined,
      size: props.size,
      disabled: props.disabled === true,
      renderIcon: props.icon ? upstream.icon(props.icon) : undefined,
      onClick: function () {}
    });
  },
  target: Object.freeze({ upstream: '.cds--tag--operational', ours: '[role="button"]' }),
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--tag--operational', ours: ':scope > div > div', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--tag__label', ours: ':scope > div > div > div > [dir="auto"]', measure: 'text' }),
    icon: Object.freeze({ upstream: '.cds--tag__custom-icon svg', ours: ':scope > div > div > div:has(> svg) svg', measure: 'box' })
  }),
  second: Object.freeze({
    origin: 'root',
    interactions: Object.freeze(['hover', 'focus', 'pressed']),
    target: Object.freeze({ upstream: 'md-assist-chip >>> button', ours: '[role="button"]' }),
    mount: function (React, upstream, props) {
      if ((props.size !== undefined && props.size !== 'md') || props.type !== undefined) {
        return null;
      }
      const icon = props.icon && upstream.tokens['icon.' + props.icon]
        ? React.createElement('svg', { slot: 'icon', viewBox: upstream.tokens['icon.' + props.icon].viewBox },
          upstream.tokens['icon.' + props.icon].paths.map(function (path, index) {
            return React.createElement('path', { key: index, d: path.d, fillRule: path.fillRule });
          }))
        : null;
      return React.createElement('md-assist-chip', {
        label: props.text,
        disabled: props.disabled === true ? true : undefined
      }, icon);
    },
    parts: Object.freeze({
      // The chip paints its container on .container::before; the element
      // itself is transparent in every state
      root: Object.freeze({ upstream: 'md-assist-chip >>> .container', pseudo: '::before', ours: ':scope > div > div', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopLeftRadius', 'borderBottomColor', 'outline'] }),
      label: Object.freeze({ upstream: 'md-assist-chip >>> .label-text', ours: ':scope > div > div > div > [dir="auto"]', measure: 'text' }),
      icon: Object.freeze({ upstream: 'md-assist-chip >>> .leading.icon', ours: ':scope > div > div > div:has(> svg)', measure: 'box' })
    })
  })
});
