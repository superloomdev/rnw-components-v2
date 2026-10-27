// Info: OperationalTag measurement reference. The primary's operational
// tag takes `text`, a kebab-case `type` (default `gray`), `size`,
// `disabled` and `renderIcon`; it renders as a button and the button is
// the target. The second reference was retired
// (batch R).

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.OperationalTag, {
      text: props.text,
      type: props.type ? String(props.type).replace(/_/g, '-') : undefined,
      size: props.size,
      disabled: props.disabled === true,
      renderIcon: props.icon ? upstream.icon(props.icon) : undefined,
      onClick: function () {}
    });
  },
  target: Object.freeze({ upstream: '.cds--tag--operational', ours: '[role="button"]' }),
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--tag--operational', ours: ':scope > div > div', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--tag__label', ours: ':scope > div > div > div > [dir="auto"]', measure: 'text' }),
    icon: Object.freeze({ upstream: '.cds--tag__custom-icon svg', ours: ':scope > div > div > div:has(> svg) svg', measure: 'box' })
  })
});
