// Info: PrimaryButton measurement reference. The upstream PrimaryButton is
// the same kind wrapper over its Button (the caller's kind wins there too),
// so it takes the same props and draws the same tree as the Button
// reference mounts. A state with no upstream counterpart returns null and
// the harness counts it as unmeasured.

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

// Kind -> second reference element; a kind absent here has no counterpart there
const SECOND_KINDS = Object.freeze({
  primary: 'md-filled-button',
  tertiary: 'md-outlined-button',
  ghost: 'md-text-button',
  tonal: 'md-filled-tonal-button',
  elevated: 'md-elevated-button'
});
const SECOND_HOST = 'md-filled-button, md-outlined-button, md-text-button, md-filled-tonal-button, md-elevated-button';
// The shadow element that styles the slotted label (its color and its disabled opacity)
const SECOND_LABEL_STYLE = SECOND_HOST.split(', ').map(function (tag) {
  return tag + ' >>> .label';
}).join(', ');


export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    const kind = KINDS[props.kind || 'primary'];
    if (kind === undefined || props.selected === true) {
      return null;
    }
    return React.createElement(upstream.PrimaryButton, {
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
  // The second reference is the Button's for the primary kind the wrapper
  // draws; a caller kind is not the wrapper's own and is unmeasured here
  // (the Button row measures the kind itself)
  second: Object.freeze({
    mount: function (React, upstream, props) {
      if ((props.kind !== undefined && props.kind !== 'primary') || props.selected === true ||
          (props.size !== undefined && props.size !== 'lg')) {
        return null;
      }
      // A trailing icon is slotted as the template's own glyph (the second reference ships no glyphs)
      const literal = typeof props.icon === 'string' ? upstream.tokens['icon.' + props.icon] : null;
      return React.createElement(SECOND_KINDS.primary, { disabled: props.disabled === true, 'trailing-icon': literal !== null ? true : undefined },
        props.children,
        literal === null ? null : React.createElement('svg', { slot: 'icon', viewBox: literal.viewBox, 'aria-hidden': true },
          literal.paths.map(function (path, index) {
            return React.createElement('path', { key: index, d: path.d, fillRule: path.fillRule });
          })));
    },
    target: Object.freeze({ upstream: SECOND_KINDS.primary, ours: '[role="button"]' }),
    parts: Object.freeze({
      root: Object.freeze({ upstream: SECOND_KINDS.primary, ours: '[role="button"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius'], grows: 'label' }),
      fill: Object.freeze({ upstream: 'md-filled-button >>> .background', ours: '[role="button"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor'], grows: 'label', optional: true }),
      label: Object.freeze({ upstream: SECOND_KINDS.primary, styleOf: SECOND_LABEL_STYLE, ours: '[role="button"] > [dir="auto"]', measure: 'text' }),
      icon: Object.freeze({ upstream: 'svg[slot="icon"] path', ours: '[role="button"] svg path', measure: 'box', optional: true })
    })
  })
});
