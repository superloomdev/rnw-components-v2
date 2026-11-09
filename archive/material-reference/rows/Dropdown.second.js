// Info: component/composite/select/reference.dropdown.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
    origin: 'frame',
    interactions: Object.freeze(['hover', 'focus', 'pressed', 'open']),
    body: Object.freeze({ width: 320 }),
    mount: function (React, upstream, props) {
      // One size; and no placeholder, so an unlabelled empty dropdown draws nothing there
      if ((props.size !== undefined && props.size !== 'md') || (typeof props.label !== 'string' && props.value === undefined)) {
        return null;
      }
      return React.createElement('md-outlined-select', {
        label: props.label,
        'aria-label': typeof props.label === 'string' ? undefined : props.accessibilityLabel,
        value: props.value || '',
        disabled: props.disabled === true,
        error: props.invalid === true,
        errorText: props.invalidText,
        supportingText: props.helperText,
        style: { width: 320 }
      }, (Array.isArray(props.items) ? props.items : []).map(function (item) {
        return React.createElement('md-select-option', { key: item.value, value: item.value, disabled: item.disabled === true },
          React.createElement('div', { slot: 'headline' }, item.label));
      }));
    },
    target: Object.freeze({ upstream: 'md-outlined-select', ours: '[role="combobox"]' }),
    parts: Object.freeze({
      frame: Object.freeze({ upstream: 'md-outlined-select >>> md-outlined-field >>> .container', ours: 'div:has(> [role="combobox"])', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopLeftRadius'] }),
      // The upstream outline splits its resting and active borders across the
      // ::before and ::after of one segment, so a single pseudo cannot track
      // the width; the color still is, and the pixels cover the width
      edge: Object.freeze({ upstream: 'md-outlined-select >>> md-outlined-field >>> .outline-start', pseudo: '::before', ours: 'div:has(> [role="combobox"])', measure: 'box', compare: ['borderBottomColor'] }),
      label: Object.freeze({ upstream: 'md-outlined-select >>> md-outlined-field >>> .label:not(.hidden)', ours: ':scope > div > [dir="auto"]:first-child', measure: 'text' }),
      value: Object.freeze({ upstream: 'md-outlined-select >>> #label', ours: '[role="combobox"] > div:first-child > [dir="auto"]', measure: 'text' }),
      // The upstream caret svg is sized to its glyph, and while open it swaps
      // `polygon.down` for `polygon.up` (the losing polygon draws nothing), so
      // measure the svg box upstream against the glyph's extents on ours
      caret: Object.freeze({ upstream: 'md-outlined-select >>> .icon.trailing svg', ours: '[role="combobox"] > div:last-child svg path', measure: 'box' }),
      // The menu's surface paint lives on its inner `.items` block; `.menu` is transparent
      list: Object.freeze({ upstream: 'md-outlined-select >>> md-menu >>> .items', ours: '[role="listbox"]', measure: 'box', optional: true, compare: ['width', 'borderRadius', 'backgroundColor'] }),
      item: Object.freeze({ upstream: 'md-outlined-select md-select-option:nth-child(2) >>> .list-item', ours: '[role="option"]:nth-child(2)', measure: 'box', optional: true, compare: ['width', 'height', 'backgroundColor'] }),
      message: Object.freeze({ upstream: 'md-outlined-select >>> md-outlined-field >>> .supporting-text > span', ours: ':scope > div > [dir="auto"]:last-child', measure: 'text' })
    }),
    omit: Object.freeze({
      icon: Object.freeze({ reason: 'the second reference marks an invalid select by the error color alone and draws no error icon unless the page slots one; ours draws the template\'s error icon before the caret', upstream: 'md-outlined-select [slot="leading-icon"], md-outlined-select [slot="trailing-icon"]', mask: true }),
      ring: Object.freeze({ reason: 'the second focuses its field through the outline segments the edge part already reads; it draws no separate ring element', upstream: 'md-outlined-select >>> md-focus-ring, md-outlined-select >>> [class*="focus-ring"]' }),
      option: Object.freeze({ reason: 'the second\'s list-item row is its whole option; it draws no inner option block', upstream: 'md-select-option >>> .option, md-select-option >>> .list-item > [class*="option"]' }),
      mark: Object.freeze({ reason: 'the second marks a selected option by its filled state layer alone and draws no checkmark', upstream: 'md-select-option >>> svg, md-select-option >>> [class*="check"]' })
    })
  });
