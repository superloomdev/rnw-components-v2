// Info: Search measurement reference. The upstream search takes `labelText`
// (drawn visually hidden), a required `id`, the placeholder, value, size
// and disabled props, and `closeButtonLabelText` on its clear. The parts
// compared are the frame, the value, the leading magnifier and the clear's
// face, paint and glyph; the clear is an additional interaction target
// anchored on its face. Escape is the field's clear, not fixture cleanup,
// so `escapeOnLeave` stays false. The second reference was retired
// (batch R).

let counter = 0;


export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  escapeOnLeave: false,
  mount: function (React, upstream, props) {
    counter = counter + 1;
    return React.createElement(upstream.Search, {
      id: 'reference-search-' + counter,
      labelText: props.label || props.accessibilityLabel || 'Search',
      placeholder: props.placeholder,
      value: props.value,
      defaultValue: props.defaultValue,
      onChange: function () {
        return undefined;
      },
      closeButtonLabelText: 'Clear search input',
      size: props.size || 'md',
      disabled: props.disabled === true
    });
  },
  // The element a person hovers, presses and focuses
  target: Object.freeze({ upstream: 'input', ours: 'input' }),
  additionalTargets: Object.freeze([
    Object.freeze({
      name: 'clear',
      upstream: '.cds--search-close',
      ours: '[data-testid="search-clear"]',
      anchor: 'clearFace',
      states: ['filled', 'small', 'large']
    })
  ]),
  parts: Object.freeze({
    frame: Object.freeze({ upstream: '.cds--search-input', ours: 'div:has(> input)', measure: 'box' }),
    value: Object.freeze({ upstream: '.cds--search-input', ours: 'input', measure: 'type' }),
    leadingIcon: Object.freeze({ upstream: '.cds--search-magnifier-icon', ours: '[data-testid="search-leading-icon"] svg', measure: 'box' }),
    clearFace: Object.freeze({ upstream: '.cds--search-close', ours: '[data-testid="search-clear-face"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopLeftRadius'] }),
    clearPaint: Object.freeze({ upstream: '.cds--search-close', ours: '[data-testid="search-clear-paint"]', measure: 'box', compare: ['backgroundColor'] }),
    clearIcon: Object.freeze({ upstream: '.cds--search-close svg', ours: '[data-testid="search-clear-face"] svg', measure: 'box' })
  })
});
