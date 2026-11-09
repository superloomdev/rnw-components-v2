// Info: Tag measurement reference. The upstream tag takes the label as its
// children, a kebab-case `type`, `size` and `disabled`, and a `renderIcon`
// component it draws only at `md` and `lg`. A read-only tag has no target:
// it answers no interaction. The second reference was retired
// (batch R).

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.Tag, {
      type: props.type ? String(props.type).replace(/_/g, '-') : undefined,
      size: props.size,
      disabled: props.disabled === true,
      renderIcon: props.icon ? upstream.icon(props.icon) : undefined
    }, props.children);
  },
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--tag', ours: ':scope > div', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--tag__label', ours: ':scope > div > div > [dir="auto"]', measure: 'text' }),
    icon: Object.freeze({ upstream: '.cds--tag__custom-icon svg', ours: ':scope > div > div > svg', measure: 'box' })
  })
});
