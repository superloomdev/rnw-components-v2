// Info: component/molecule/search/reference.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
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
  });
