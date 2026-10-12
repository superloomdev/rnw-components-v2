// Info: Tag measurement reference. The upstream tag takes the label as its
// children, a kebab-case `type`, `size` and `disabled`, and a `renderIcon`
// component it draws only at `md` and `lg`. A read-only tag has no target:
// it answers no interaction. The second reference is the assist chip, which
// has no sizes or hues, so a sample naming either is unmeasured there; its
// icon is a slotted glyph the mount draws from the theme's own icon token.

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Tag, {
      type: props.type ? String(props.type).replace(/_/g, '-') : undefined,
      size: props.size,
      disabled: props.disabled === true,
      renderIcon: props.icon ? upstream.icon(props.icon) : undefined
    }, props.children);
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--tag', ours: ':scope > div', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--tag__label', ours: ':scope > div > [dir="auto"]', measure: 'text' }),
    icon: Object.freeze({ upstream: '.cds--tag__custom-icon svg', ours: ':scope > div > div > svg', measure: 'box' })
  }),
  second: Object.freeze({
    origin: 'root',
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
        label: props.children,
        disabled: props.disabled === true ? true : undefined
      }, icon);
    },
    parts: Object.freeze({
      root: Object.freeze({ upstream: 'md-assist-chip >>> .container', ours: ':scope > div', measure: 'box' }),
      label: Object.freeze({ upstream: 'md-assist-chip >>> .label-text', ours: ':scope > div > [dir="auto"]', measure: 'text' }),
      icon: Object.freeze({ upstream: 'md-assist-chip >>> .leading.icon', ours: ':scope > div > div:has(> svg)', measure: 'box' })
    })
  })
});
