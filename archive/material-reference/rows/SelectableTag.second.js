// Info: component/molecule/tag/reference.selectable-tag.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
    origin: 'root',
    interactions: Object.freeze(['hover', 'focus', 'pressed']),
    target: Object.freeze({ upstream: 'md-filter-chip >>> .primary.action', ours: '[role="button"]' }),
    mount: function (React, upstream, props) {
      if (props.size !== undefined && props.size !== 'md') {
        return null;
      }
      const icon = props.icon && props.selected !== true && upstream.tokens['icon.' + props.icon]
        ? React.createElement('svg', { slot: 'icon', viewBox: upstream.tokens['icon.' + props.icon].viewBox },
          upstream.tokens['icon.' + props.icon].paths.map(function (path, index) {
            return React.createElement('path', { key: index, d: path.d, fillRule: path.fillRule });
          }))
        : null;
      return React.createElement('md-filter-chip', {
        label: props.text,
        selected: props.selected === true ? true : undefined,
        disabled: props.disabled === true ? true : undefined
      }, icon);
    },
    parts: Object.freeze({
      // The chip paints its container on .container::before; the element
      // itself is transparent in every state
      root: Object.freeze({ upstream: 'md-filter-chip >>> .container', pseudo: '::before', ours: ':scope > div > div', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopLeftRadius', 'borderBottomColor', 'outline'] }),
      label: Object.freeze({ upstream: 'md-filter-chip >>> .label-text', ours: ':scope > div > div > div > [dir="auto"]', measure: 'text' }),
      // The chip draws its own checkmark while selected; ours is the
      // selected mark icon at the same slot
      icon: Object.freeze({ upstream: 'md-filter-chip >>> .leading.icon', ours: ':scope > div > div > div:has(> svg)', measure: 'box', optional: true })
    })
  });
