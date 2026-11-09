// Info: IconButton measurement reference. The upstream icon button is the
// button base inside a compact tooltip: `label` names it, the kind and the
// size class it, `isSelected` marks the toggle, and the one icon is a
// cloned element. The parts compared are the square and its icon; the
// tooltip itself is the Tooltip row's concern, so the popover part here is
// optional and only proves the compact cells it shares. The second
// reference was retired (batch R).

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  mount: function (React, upstream, props) {
    return React.createElement(upstream.IconButton, {
      label: props.label,
      kind: props.kind,
      size: props.size,
      disabled: props.disabled === true,
      isSelected: props.selected
    }, React.createElement(upstream.icon(props.icon), { size: 16 }));
  },
  // The element a person hovers, presses and focuses
  target: Object.freeze({ upstream: '.cds--btn--icon-only', ours: '[role="button"]' }),
  parts: Object.freeze({
    // The measured square is the face; the pressable above it is a wider,
    // transparent hit layer
    root: Object.freeze({ upstream: '.cds--btn--icon-only', ours: '[data-testid="icon-button-face"]', measure: 'box' }),
    icon: Object.freeze({ upstream: '.cds--btn--icon-only svg', ours: '[data-testid="icon-button-face"] svg', measure: 'box' }),
    bubble: Object.freeze({ upstream: '.cds--popover-content', ours: '[role="tooltip"] > div', measure: 'box', optional: true, compare: ['backgroundColor', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'] })
  })
});
