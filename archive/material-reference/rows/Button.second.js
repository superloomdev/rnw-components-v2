// Info: component/molecule/button/reference.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
    mount: function (React, upstream, props) {
      const tag = SECOND_KINDS[props.kind || 'primary'];
      if (tag === undefined || props.selected === true || (props.size !== undefined && props.size !== 'lg')) {
        return null;
      }
      // A trailing icon is slotted as the template's own glyph (the second reference ships no glyphs)
      const literal = typeof props.icon === 'string' ? upstream.tokens['icon.' + props.icon] : null;
      return React.createElement(tag, { disabled: props.disabled === true, 'trailing-icon': literal !== null ? true : undefined },
        props.children,
        literal === null ? null : React.createElement('svg', { slot: 'icon', viewBox: literal.viewBox, 'aria-hidden': true },
          literal.paths.map(function (path, index) {
            return React.createElement('path', { key: index, d: path.d, fillRule: path.fillRule });
          })));
    },
    target: Object.freeze({ upstream: SECOND_HOST, ours: '[role="button"]' }),
    parts: Object.freeze({
      root: Object.freeze({ upstream: SECOND_HOST, ours: '[role="button"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius'], grows: 'label' }),
      fill: Object.freeze({ upstream: 'md-filled-button >>> .background, md-filled-tonal-button >>> .background, md-elevated-button >>> .background', ours: '[role="button"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor'], grows: 'label', optional: true }),
      label: Object.freeze({ upstream: SECOND_HOST, styleOf: SECOND_LABEL_STYLE, ours: '[role="button"] > [dir="auto"]', measure: 'text' }),
      icon: Object.freeze({ upstream: 'svg[slot="icon"] path', ours: '[role="button"] svg path', measure: 'box', optional: true })
    })
  });
