// Info: DismissibleTag measurement reference. The primary's dismissible tag
// takes `text`, a kebab-case `type`, `size`, `disabled`, the close control's
// `title` and `onClose`. The close control is the target: hover paints its
// face, focus draws its inset ring, press keeps the hover fill (the
// primary draws no pressed fill). The second reference is the input chip:
// it has no sizes, hues or leading icon, so a sample naming any of those is
// unmeasured there; its close control is the trailing action, whose painted
// layer is the centered circle.

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
  }),
  second: Object.freeze({
    origin: 'root',
    interactions: Object.freeze(['hover', 'focus', 'pressed']),
    target: Object.freeze({ upstream: 'md-input-chip >>> .trailing.action', ours: '[role="button"]' }),
    mount: function (React, upstream, props) {
      // No sizes, hues or leading icon exist there; a sample naming one is
      // unmeasured for this reference
      if ((props.size !== undefined && props.size !== 'md') || props.type !== undefined || props.icon !== undefined) {
        return null;
      }
      return React.createElement('md-input-chip', {
        label: props.text,
        disabled: props.disabled === true ? true : undefined,
        'aria-label-remove': props.title
      });
    },
    parts: Object.freeze({
      // The chip paints its container on .container::before; the element
      // itself is transparent in every state
      root: Object.freeze({ upstream: 'md-input-chip >>> .container', pseudo: '::before', ours: ':scope > div', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopLeftRadius', 'borderBottomColor', 'outline'] }),
      label: Object.freeze({ upstream: 'md-input-chip >>> .label-text', ours: ':scope > div > div > [dir="auto"]', measure: 'text' }),
      // The painted layer is the centered circle, not the action's own box
      // (the action box includes the trailing padding; the layer does not).
      // The second's disabled chip drops its remove affordance entirely,
      // where the primary's disabled filter tag keeps the glyph
      close: Object.freeze({ upstream: 'md-input-chip >>> .trailing.action md-ripple', ours: '[data-testid="tag-close-face"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopLeftRadius', 'borderBottomColor', 'outline'] }),
      icon: Object.freeze({ upstream: 'md-input-chip >>> .trailing.action .trailing.icon', ours: '[data-testid="tag-close-face"] svg', measure: 'box' })
    }),
    omit: Object.freeze({
      bubble: Object.freeze({ reason: 'the second input-chip mounts no tooltip; the close action is named directly', upstream: 'md-input-chip [role="tooltip"], md-input-chip >>> [role="tooltip"]', mask: true })
    })
  })
});
