// Info: ComboBox measurement reference. The upstream combo box is a
// labelled text input with the same open list the dropdown's reference
// draws; the parts compared are the label, the frame, the input text, the
// clear seat, the invalid icon, the caret and the message. The open list is
// measured through the `open` interaction, as the dropdown's parts are.

let counter = 0;

export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    counter = counter + 1;
    return React.createElement(upstream.ComboBox, {
      id: 'reference-combo-box-' + counter,
      titleText: typeof props.label === 'string' ? props.label : props.accessibilityLabel,
      items: Array.isArray(props.items) ? props.items : [],
      itemToString: function (item) {
        return item ? item.label : '';
      },
      initialSelectedItem: props.value === undefined ? undefined
        : (Array.isArray(props.items) ? props.items : []).find(function (item) {
          return item.value === props.value;
        }),
      placeholder: props.placeholder,
      size: props.size || 'md',
      disabled: props.disabled === true,
      invalid: props.invalid === true,
      invalidText: props.invalidText,
      helperText: props.helperText
    });
  },
  body: Object.freeze({ width: 320 }),
  interactions: Object.freeze(['hover', 'focus', 'pressed', 'open']),
  target: Object.freeze({ upstream: '.cds--list-box__field', ours: 'input[role="combobox"]', upstreamFocus: '.cds--combo-box input' }),
  parts: Object.freeze({
    label: Object.freeze({ upstream: '.cds--label', ours: ':scope > div > [dir="auto"]:first-child', measure: 'text' }),
    frame: Object.freeze({ upstream: '.cds--combo-box', ours: 'input[role="combobox"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopLeftRadius', 'backgroundColor', 'borderBottomColor'] }),
    input: Object.freeze({ upstream: '.cds--combo-box input', ours: 'input[role="combobox"]', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
    clear: Object.freeze({ upstream: '.cds--list-box__selection', ours: '[role="button"][aria-label*="Clear"]', measure: 'box', optional: true }),
    icon: Object.freeze({ upstream: '.cds--list-box__invalid-icon', ours: 'div:has(> input[role="combobox"]) > div:nth-child(2)', measure: 'box', optional: true }),
    caret: Object.freeze({ upstream: '.cds--list-box__menu-icon', ours: 'div:has(> input[role="combobox"]) > div:last-child', measure: 'box' }),
    list: Object.freeze({ upstream: '.cds--list-box__menu', ours: '[role="listbox"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'borderTopLeftRadius', 'backgroundColor'] }),
    item: Object.freeze({ upstream: '.cds--list-box__menu-item:nth-child(2)', ours: '[role="option"]:nth-child(2)', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height', 'backgroundColor'] }),
    option: Object.freeze({ upstream: '.cds--list-box__menu-item:nth-child(2) .cds--list-box__menu-item__option', ours: '[role="option"]:nth-child(2) > div:first-child', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'borderTopWidth', 'borderTopColor', 'borderBottomColor'] }),
    message: Object.freeze({ upstream: '.cds--form__helper-text, .cds--form-requirement', ours: ':scope > div > [dir="auto"]:last-child', measure: 'text' })
  }),
  omit: Object.freeze({
    mark: Object.freeze({ reason: 'the reference draws no selected mark in its option list', upstream: '.cds--list-box__menu-item__selected-icon' })
  })
});
