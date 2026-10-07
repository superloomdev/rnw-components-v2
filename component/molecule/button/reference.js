// Info: Button measurement reference. The upstream button takes the same
// label, size names and disabled flag; its two-part kinds are spelled with
// a double dash (`danger--tertiary`). The `tonal` and `elevated` kinds have
// no upstream counterpart, and the upstream draws selection only on an
// icon-only button, so for those states `mount` returns null and the
// harness counts them as unmeasured. The icon is mounted upstream through
// `upstream.icon(name)`, which resolves a semantic icon name to the
// upstream's own icon component.

// Kind -> second reference element; a kind absent here has no counterpart there
const SECOND_KINDS = Object.freeze({
  primary: 'md-filled-button',
  tertiary: 'md-outlined-button',
  ghost: 'md-text-button',
  tonal: 'md-filled-tonal-button',
  elevated: 'md-elevated-button'
});
const SECOND_HOST = 'md-filled-button, md-outlined-button, md-text-button, md-filled-tonal-button, md-elevated-button';
const SECOND_LABEL_STYLE = SECOND_HOST.split(', ').map(function (tag) {
  return tag + ' >>> .button';
}).join(', ');

// Kind -> upstream kind; a kind absent here has no upstream counterpart
const KINDS = Object.freeze({
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  ghost: 'ghost',
  danger: 'danger',
  danger_tertiary: 'danger--tertiary',
  danger_ghost: 'danger--ghost'
});


export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    const kind = KINDS[props.kind || 'primary'];
    if (kind === undefined || props.selected === true) {
      return null;
    }
    return React.createElement(upstream.Button, {
      kind: kind,
      size: props.size || 'lg',
      disabled: props.disabled === true,
      renderIcon: typeof props.icon === 'string' ? upstream.icon(props.icon) : undefined,
      iconDescription: typeof props.icon === 'string' ? props.children : undefined
    }, props.children);
  },
  // The element a person hovers, presses and focuses
  target: Object.freeze({ upstream: 'button.cds--btn', ours: '[role="button"]' }),
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--btn', ours: '[role="button"]', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--btn', ours: '[role="button"] > [dir="auto"]', measure: 'text' }),
    icon: Object.freeze({ upstream: '.cds--btn__icon path', ours: '[role="button"] svg path', measure: 'box' })
  }),
  // The second reference draws one size and has no secondary or danger kinds;
  // its fill is a separate element inside the host, so the root compares
  // geometry and radius against the host and the fill against that element;
  // the trailing icon is compared by the painted path.
  // It sets the label's family, size, line height and weight but draws no
  // tracking; the measurement reports the tracking difference and compares
  // the label's width net of it
  second: Object.freeze({
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
  })
});
