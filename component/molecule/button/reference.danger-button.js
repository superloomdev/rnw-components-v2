// Info: DangerButton measurement reference. The upstream DangerButton is
// the same kind wrapper over its Button and its `kind` always wins over the
// caller's, so a `kind` prop is forwarded to prove it is ignored there too.
// A state with no upstream counterpart returns null and the harness counts
// it as unmeasured. The second system has no button set member for the
// danger wrapper, so there is no `second`.


export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    if (props.selected === true) {
      return null;
    }
    return React.createElement(upstream.DangerButton, {
      kind: props.kind,
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
