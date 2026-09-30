// Info: Button measurement reference. The upstream button takes the same
// label, size names and disabled flag; its two-part kinds are spelled with
// a double dash (`danger--tertiary`). The `tonal` and `elevated` kinds have
// no upstream counterpart, and the upstream draws selection only on an
// icon-only button, so for those states `mount` returns null and the
// harness counts them as unmeasured. The icon is mounted upstream through
// `upstream.icon(name)`, which resolves a semantic icon name to the
// upstream's own icon component.

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
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--btn', ours: '[role="button"]', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--btn', ours: '[role="button"] > [dir="auto"]', measure: 'text' }),
    icon: Object.freeze({ upstream: '.cds--btn__icon path', ours: '[role="button"] svg path', measure: 'box' })
  })
});
