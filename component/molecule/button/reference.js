// Info: Button measurement reference. The upstream button takes the same
// label, size names and disabled flag; its two-part kinds are spelled with
// a double dash (`danger--tertiary`). The `tonal` and `elevated` kinds have
// no upstream counterpart, so `mount` returns null and the harness counts
// those states as unmeasured. The icon is not mounted upstream: the parts
// compared are the root and its label.

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
    if (kind === undefined) {
      return null;
    }
    return React.createElement(upstream.Button, {
      kind: kind,
      size: props.size || 'lg',
      disabled: props.disabled === true,
      isSelected: props.selected === true
    }, props.children);
  },
  parts: Object.freeze({ root: '.cds--btn' })
});
