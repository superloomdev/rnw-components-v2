// Info: preview__ChatButton measurement reference. The upstream chat
// button takes the same props; its quick action mounts as a ghost Button
// with the chat-button overrides, which our `quick_action` kind's cells
// draw. Parts and target are the Button's. No second reference: the second
// system has no chat button.


export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    return React.createElement(upstream.preview__ChatButton, {
      kind: props.kind,
      size: props.size,
      disabled: props.disabled === true,
      isQuickAction: props.isQuickAction === true,
      isSelected: props.isSelected === true,
      renderIcon: typeof props.icon === 'string' ? upstream.icon(props.icon) : undefined
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
