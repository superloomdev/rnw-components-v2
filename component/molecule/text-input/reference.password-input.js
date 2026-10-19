// Info: PasswordInput measurement reference. The upstream password field is
// a text input with a visibility toggle: `type` starts its internal
// password|text state, the toggle's tooltip carries the show/hide labels
// through `tooltipPosition`/`tooltipAlignment`. The parts compared are the
// label, the frame, the value, the invalid icon, the toggle's face, paint
// and glyph, and the message; the toggle is an additional interaction
// target anchored on its face. The second reference is the outlined text
// field with a slotted icon button; its tooltip is omitted where the
// second system mounts none.

let counter = 0;

// `bottom-end` -> position `bottom`, alignment `end`; a bare side centers
const ALIGN = function (align) {
  const split = align.split('-');
  return { position: split[0], alignment: split.length > 1 ? split[1] : 'center' };
};


export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  mount: function (React, upstream, props) {
    counter = counter + 1;
    const align = ALIGN(typeof props.tooltipAlign === 'string' ? props.tooltipAlign : 'bottom-end');
    return React.createElement(upstream.PasswordInput, {
      id: 'reference-password-input-' + counter,
      labelText: typeof props.label === 'string' ? props.label : props.accessibilityLabel,
      hideLabel: typeof props.label !== 'string',
      placeholder: props.placeholder,
      value: props.value,
      defaultValue: props.defaultValue,
      onChange: function () {
        return undefined;
      },
      type: props.visible === true ? 'text' : 'password',
      showPasswordLabel: props.showPasswordLabel,
      hidePasswordLabel: props.hidePasswordLabel,
      tooltipPosition: align.position,
      tooltipAlignment: align.alignment,
      size: props.size || 'md',
      disabled: props.disabled === true,
      invalid: props.invalid === true,
      invalidText: props.invalidText,
      helperText: props.helperText
    });
  },
  // The element a person hovers, presses and focuses
  target: Object.freeze({ upstream: 'input', ours: 'input' }),
  additionalTargets: Object.freeze([
    Object.freeze({
      name: 'toggle',
      upstream: '.cds--text-input--password__visibility__toggle',
      ours: '[data-testid="password-toggle"]',
      anchor: 'toggleFace'
    })
  ]),
  parts: Object.freeze({
    label: Object.freeze({ upstream: '.cds--label', ours: ':scope > div > [dir="auto"]:first-child', measure: 'text' }),
    frame: Object.freeze({ upstream: '.cds--password-input', ours: 'div:has(> input)', measure: 'box' }),
    value: Object.freeze({ upstream: '.cds--password-input', ours: 'input', measure: 'type' }),
    invalidIcon: Object.freeze({ upstream: '.cds--text-input__invalid-icon path', ours: 'div:has(> input) > div > svg path', measure: 'box' }),
    toggleFace: Object.freeze({ upstream: '.cds--text-input--password__visibility__toggle', ours: '[data-testid="password-toggle-face"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopLeftRadius'] }),
    togglePaint: Object.freeze({ upstream: '.cds--text-input--password__visibility__toggle', ours: '[data-testid="password-toggle-paint"]', measure: 'box', compare: ['backgroundColor'] }),
    toggleIcon: Object.freeze({ upstream: '.cds--text-input--password__visibility__toggle svg', ours: '[data-testid="password-toggle-face"] svg', measure: 'box' }),
    message: Object.freeze({ upstream: '.cds--form__helper-text, .cds--form-requirement', ours: ':scope > div > [dir="auto"]:last-child', measure: 'text' }),
    bubble: Object.freeze({ upstream: '.cds--popover-content', ours: '[role="tooltip"] > div', measure: 'box', optional: true, compare: ['backgroundColor', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'] })
  }),
  second: Object.freeze({
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
  })
});
