// Info: component/molecule/floating-action-button/reference.floating-action-button.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
    mount: function (React, upstream, props) {
      const sizes = { sm: 'small', md: 'medium', lg: 'large' };
      const size = props.size === 'lg' ? 36 : 24;
      const literal = upstream.tokens['icon.' + props.icon];
      const glyph = literal && literal.variants && literal.variants[size] !== undefined ? literal.variants[size] : literal;
      const children = [React.createElement('svg', {
        fill: 'currentColor',
        key: 'i',
        slot: 'icon',
        viewBox: glyph === undefined || glyph === null ? '0 0 24 24' : glyph.viewBox,
        width: size,
        height: size
      }, (glyph === undefined || glyph === null ? [] : glyph.paths).map(function (path, index) {
        return React.createElement('path', { key: index, d: path.d, 'fill-rule': path.fillRule === undefined ? undefined : path.fillRule });
      }))];
      return React.createElement('md-fab', {
        variant: props.kind === 'primary' || props.kind === 'secondary' || props.kind === 'tertiary' ? props.kind : 'surface',
        size: sizes[props.size] || 'medium',
        label: typeof props.label === 'string' ? props.label : undefined,
        'aria-label': typeof props.label === 'string' ? undefined : props.accessibilityLabel
      }, children);
    },
    body: Object.freeze({ width: 320 }),
    target: Object.freeze({ upstream: 'md-fab', ours: '[role="button"]' }),
    parts: Object.freeze({
      container: Object.freeze({ upstream: 'md-fab >>> .fab', ours: '[data-testid="fab-face"]', measure: 'box', compare: ['width', 'height', 'borderTopLeftRadius', 'backgroundColor', 'boxShadow'] }),
      icon: Object.freeze({ upstream: 'md-fab > svg path', ours: '[data-testid="fab-face"] svg path', measure: 'box', compare: ['width', 'height'] }),
      label: Object.freeze({ upstream: 'md-fab >>> .label', ours: 'div:has(> [role="button"]) > div > [dir="auto"]:last-child', measure: 'text', optional: true })
    })
  });
