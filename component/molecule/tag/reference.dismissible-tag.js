// Info: DismissibleTag measurement reference. The primary's dismissible tag
// takes `text`, a kebab-case `type`, `size`, `disabled`, the close control's
// `title` and `onClose`. The close control is the target: hover paints its
// face, focus draws its inset ring, press keeps the hover fill (the
// primary draws no pressed fill). The second reference was retired (batch R).

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.DismissibleTag, {
      text: props.text,
      type: props.type ? String(props.type).replace(/_/g, '-') : undefined,
      size: props.size,
      disabled: props.disabled === true,
      title: props.title,
      renderIcon: props.icon ? upstream.icon(props.icon) : undefined,
      onClose: function () {}
    });
  },
  target: Object.freeze({ upstream: '.cds--tag__close-icon', ours: '[role="button"]' }),
  parts: Object.freeze({
    root: Object.freeze({ upstream: '.cds--tag--filter', ours: ':scope > div', measure: 'box' }),
    label: Object.freeze({ upstream: '.cds--tag__label', ours: ':scope > div > div > [dir="auto"]', measure: 'text' }),
    close: Object.freeze({ upstream: '.cds--tag__close-icon', ours: '[data-testid="tag-close-face"]', measure: 'box' }),
    icon: Object.freeze({ upstream: '.cds--tag__close-icon svg', ours: '[data-testid="tag-close-face"] svg', measure: 'box' }),
    bubble: Object.freeze({ upstream: '.cds--popover-content', ours: '[role="tooltip"] > div', measure: 'box', optional: true, compare: ['backgroundColor', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'] })
  })
});
