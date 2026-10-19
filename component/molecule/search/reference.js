// Info: Search measurement reference. The upstream search takes `labelText`
// (drawn visually hidden), a required `id`, the placeholder, value, size
// and disabled props, and `closeButtonLabelText` on its clear. The parts
// compared are the frame, the value, the leading magnifier and the clear's
// face, paint and glyph; the clear is an additional interaction target
// anchored on its face. Escape is the field's clear, not fixture cleanup,
// so `escapeOnLeave` stays false. The second reference is the outlined
// text field with a slotted leading search glyph and a trailing clear
// icon button.

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
  }),
  second: Object.freeze({
    origin: 'frame',
    body: Object.freeze({ width: 320 }),
    escapeOnLeave: false,
    mount: function (React, upstream, props) {
      if (props.size !== undefined && props.size !== 'md') {
        return null;
      }
      const glyph = upstream.tokens['icon.search'];
      const close = upstream.tokens['icon.close'];
      const leading = glyph ? React.createElement('svg', { slot: 'leading-icon', viewBox: glyph.viewBox, fill: 'currentColor' },
        glyph.paths.map(function (path, index) {
          return React.createElement('path', { key: index, d: path.d, fillRule: path.fillRule });
        })) : null;
      const clear = props.value !== undefined && String(props.value).length >= 1 && close
        // Composition rule: the field owns the disabled trailing opacity,
        // so the slotted action must not apply it a second time
        ? React.createElement('md-icon-button', {
          slot: 'trailing-icon',
          'aria-label': 'Clear search input',
          disabled: props.disabled === true ? true : undefined,
          style: { '--md-icon-button-disabled-icon-opacity': 1 }
        }, React.createElement('svg', { viewBox: close.viewBox, fill: 'currentColor' },
          close.paths.map(function (path, index) {
            return React.createElement('path', { key: index, d: path.d, fillRule: path.fillRule });
          })))
        : null;
      return React.createElement('md-outlined-text-field', {
        'aria-label': props.label || props.accessibilityLabel || 'Search',
        type: 'search',
        placeholder: props.placeholder,
        value: props.value !== undefined ? props.value : (props.defaultValue || ''),
        disabled: props.disabled === true,
        style: { width: 320 }
      }, leading, clear);
    },
    target: Object.freeze({ upstream: 'md-outlined-text-field', ours: 'input' }),
    additionalTargets: Object.freeze([
      Object.freeze({
        name: 'clear',
        upstream: 'md-outlined-text-field md-icon-button >>> button',
        ours: '[data-testid="search-clear"]',
        anchor: 'clearFace',
        states: ['filled']
      })
    ]),
    parts: Object.freeze({
      frame: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .container', ours: 'div:has(> input)', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius'] }),
      edge: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .outline-start', pseudo: '::before', ours: 'div:has(> input)', measure: 'box', compare: ['borderTopWidth', 'borderBottomColor'] }),
      value: Object.freeze({ upstream: 'md-outlined-text-field >>> input', ours: 'input', measure: 'type' }),
      leadingIcon: Object.freeze({ upstream: 'md-outlined-text-field svg[slot="leading-icon"]', ours: '[data-testid="search-leading-icon"] svg', measure: 'box' }),
      clearFace: Object.freeze({ upstream: 'md-outlined-text-field md-icon-button >>> button', ours: '[data-testid="search-clear-face"]', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
      clearLayer: Object.freeze({ upstream: 'md-outlined-text-field md-icon-button >>> md-ripple', ours: '[data-testid="search-clear-face"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius'] }),
      clearPaint: Object.freeze({ upstream: 'md-outlined-text-field md-icon-button >>> button', ours: '[data-testid="search-clear-paint"]', measure: 'box', compare: ['backgroundColor'] }),
      clearIcon: Object.freeze({ upstream: 'md-outlined-text-field md-icon-button svg', ours: '[data-testid="search-clear-face"] svg', measure: 'box' })
    })
  })
});
