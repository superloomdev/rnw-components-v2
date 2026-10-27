// Info: component/molecule/tag/reference.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
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
      label: Object.freeze({ upstream: 'md-assist-chip >>> .label-text', ours: ':scope > div > div > [dir="auto"]', measure: 'text' }),
      icon: Object.freeze({ upstream: 'md-assist-chip >>> .leading.icon', ours: ':scope > div > div:has(> svg)', measure: 'box' })
    })
  });
