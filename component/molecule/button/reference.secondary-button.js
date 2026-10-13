// Info: SecondaryButton measurement reference. The upstream SecondaryButton
// is the same kind wrapper over its Button (the caller's kind wins there
// too), so it takes the same props and draws the same tree as the Button
// reference mounts. A state with no upstream counterpart returns null and
// the harness counts it as unmeasured. The second system has no button set
// member for the secondary wrapper, so there is no `second`.

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
    const kind = KINDS[props.kind || 'secondary'];
    if (kind === undefined || props.selected === true) {
      return null;
    }
    return React.createElement(upstream.SecondaryButton, {
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
  })
});
