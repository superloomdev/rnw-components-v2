// Info: component/molecule/tag/reference.dismissible-tag.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
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
  });
