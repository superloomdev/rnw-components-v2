// Info: component/molecule/text-input/reference.password-input.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
    origin: 'frame',
    body: Object.freeze({ width: 320 }),
    mount: function (React, upstream, props) {
      if (props.size !== undefined && props.size !== 'md') {
        return null;
      }
      const glyph = upstream.tokens['icon.' + (props.visible === true ? 'visibility_off' : 'visibility_on')];
      // Composition rule: the field owns the disabled trailing opacity, so
      // the slotted action must not apply it a second time
      const action = glyph ? React.createElement('md-icon-button', {
        slot: 'trailing-icon',
        'aria-label': props.visible === true ? (props.hidePasswordLabel || 'Hide password') : (props.showPasswordLabel || 'Show password'),
        disabled: props.disabled === true ? true : undefined,
        style: { '--md-icon-button-disabled-icon-opacity': 1 }
      }, React.createElement('svg', { viewBox: glyph.viewBox, fill: 'currentColor' },
        glyph.paths.map(function (path, index) {
          return React.createElement('path', { key: index, d: path.d, fillRule: path.fillRule });
        }))) : null;
      return React.createElement('md-outlined-text-field', {
        label: props.label,
        'aria-label': typeof props.label === 'string' ? undefined : props.accessibilityLabel,
        type: props.visible === true ? 'text' : 'password',
        placeholder: props.placeholder,
        value: props.value !== undefined ? props.value : (props.defaultValue || ''),
        disabled: props.disabled === true,
        error: props.invalid === true,
        errorText: props.invalidText,
        supportingText: props.helperText,
        style: { width: 320 }
      }, action);
    },
    target: Object.freeze({ upstream: 'md-outlined-text-field', ours: 'input' }),
    additionalTargets: Object.freeze([
      Object.freeze({
        name: 'toggle',
        upstream: 'md-outlined-text-field md-icon-button >>> button',
        ours: '[data-testid="password-toggle"]',
        anchor: 'toggleFace'
      })
    ]),
    parts: Object.freeze({
      frame: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .container', ours: 'div:has(> input)', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius'] }),
      edge: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .outline-start', pseudo: '::before', ours: 'div:has(> input)', measure: 'box', compare: ['borderTopWidth', 'borderBottomColor'] }),
      label: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .label:not(.hidden)', ours: ':scope > div > [dir="auto"]:first-child', measure: 'text' }),
      value: Object.freeze({ upstream: 'md-outlined-text-field >>> input', ours: 'input', measure: 'type' }),
      toggleFace: Object.freeze({ upstream: 'md-outlined-text-field md-icon-button >>> button', ours: '[data-testid="password-toggle-face"]', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
      toggleLayer: Object.freeze({ upstream: 'md-outlined-text-field md-icon-button >>> md-ripple', ours: '[data-testid="password-toggle-face"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius'] }),
      togglePaint: Object.freeze({ upstream: 'md-outlined-text-field md-icon-button >>> button', ours: '[data-testid="password-toggle-paint"]', measure: 'box', compare: ['backgroundColor'] }),
      toggleIcon: Object.freeze({ upstream: 'md-outlined-text-field md-icon-button svg', ours: '[data-testid="password-toggle-face"] svg', measure: 'box' }),
      message: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .supporting-text > span', ours: ':scope > div > [dir="auto"]:last-child', measure: 'text' })
    }),
    omit: Object.freeze({
      invalidIcon: Object.freeze({ reason: 'the second reference marks an invalid field by the error color alone and draws a trailing icon only when the page slots one; ours draws the template\'s error icon', upstream: 'md-outlined-text-field >>> .icon.trailing > svg, md-outlined-text-field > svg[slot="trailing-icon"]', mask: true }),
      bubble: Object.freeze({ reason: 'the second reference mounts no tooltip; ours names the action with one', upstream: 'md-outlined-text-field [role="tooltip"], md-outlined-text-field [role="tooltip"]' })
    })
  });
