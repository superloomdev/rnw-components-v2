// Info: component/molecule/number-input/reference.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
    origin: 'frame',
    body: Object.freeze({ width: 320 }),
    mount: function (React, upstream, props) {
      if (props.size !== undefined && props.size !== 'md') {
        return null;
      }
      const text = props.value !== undefined ? String(props.value)
        : (props.defaultValue !== undefined ? String(props.defaultValue) : '0');
      const trimmed = text.trim();
      const empty = !trimmed;
      const number = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(trimmed) && Number.isFinite(Number(trimmed))
        ? Number(trimmed) : undefined;
      const outOfBounds = number !== undefined && (
        (props.min !== undefined && number < props.min) || (props.max !== undefined && number > props.max));
      const invalid = props.disabled === true ? false
        : (props.invalid === true || outOfBounds === true
          || (empty !== true && number === undefined) || (empty === true && props.allowEmpty !== true));
      return React.createElement('md-outlined-text-field', {
        label: props.label,
        'aria-label': typeof props.label === 'string' ? undefined : props.accessibilityLabel,
        type: 'number',
        placeholder: props.placeholder,
        value: empty === true ? undefined : text,
        min: props.min,
        max: props.max,
        disabled: props.disabled === true,
        error: invalid,
        errorText: props.invalidText,
        supportingText: props.helperText,
        style: { width: 320 }
      });
    },
    target: Object.freeze({ upstream: 'md-outlined-text-field', ours: 'input' }),
    parts: Object.freeze({
      frame: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .container', ours: 'div:has(> input)', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius'] }),
      edge: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .outline-start', pseudo: '::before', ours: 'div:has(> input)', measure: 'box', compare: ['borderTopWidth', 'borderBottomColor'] }),
      label: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .label:not(.hidden)', ours: ':scope > div > [dir="auto"]:first-child', measure: 'text' }),
      value: Object.freeze({ upstream: 'md-outlined-text-field >>> input', ours: 'input', measure: 'type' }),
      message: Object.freeze({ upstream: 'md-outlined-text-field >>> md-outlined-field >>> .supporting-text > span', ours: ':scope > div > [dir="auto"]:last-child', measure: 'text' })
    }),
    omit: Object.freeze({
      invalidIcon: Object.freeze({ reason: 'the second reference marks an invalid field by the error color alone and draws a trailing icon only when the page slots one; ours draws the template\'s error icon', upstream: 'md-outlined-text-field >>> .icon.trailing > svg, md-outlined-text-field > svg[slot="trailing-icon"]', mask: true }),
      decrementFace: Object.freeze({ reason: 'the second reference has no custom steppers; its browser stepper is native chrome', upstream: 'md-outlined-text-field >>> md-icon-button', mask: true }),
      decrementPaint: Object.freeze({ reason: 'the second reference has no custom steppers; its browser stepper is native chrome', upstream: 'md-outlined-text-field >>> md-icon-button' }),
      decrementIcon: Object.freeze({ reason: 'the second reference has no custom steppers; its browser stepper is native chrome', upstream: 'md-outlined-text-field >>> md-icon-button svg' }),
      incrementFace: Object.freeze({ reason: 'the second reference has no custom steppers; its browser stepper is native chrome', upstream: 'md-outlined-text-field >>> md-icon-button', mask: true }),
      incrementPaint: Object.freeze({ reason: 'the second reference has no custom steppers; its browser stepper is native chrome', upstream: 'md-outlined-text-field >>> md-icon-button' }),
      incrementIcon: Object.freeze({ reason: 'the second reference has no custom steppers; its browser stepper is native chrome', upstream: 'md-outlined-text-field >>> md-icon-button svg' }),
      dividerStart: Object.freeze({ reason: 'the second reference has no custom steppers, so no rule dividers', upstream: 'md-outlined-text-field >>> md-icon-button' }),
      dividerCenter: Object.freeze({ reason: 'the second reference has no custom steppers, so no rule dividers', upstream: 'md-outlined-text-field >>> md-icon-button' })
    })
  });
