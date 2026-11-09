// Info: PasswordInput measurement reference. The upstream password field is
// a text input with a visibility toggle: `type` starts its internal
// password|text state, the toggle's tooltip carries the show/hide labels
// through `tooltipPosition`/`tooltipAlignment`. The parts compared are the
// label, the frame, the value, the invalid icon, the toggle's face, paint
// and glyph, and the message; the toggle is an additional interaction
// target anchored on its face. The second reference was retired (batch R).

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
  })
});
