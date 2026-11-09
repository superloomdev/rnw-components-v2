// Info: Dropdown measurement reference. The upstream dropdown is a
// list-box: it takes the label as `titleText`, the placeholder as `label`,
// its options as `items` (`{ id, text, disabled }`) and the selection as
// `selectedItem`. Its open list is a `ul` below the field; the selected item
// carries the active class and a checkmark icon, each item's option block
// draws the divider inside the inline padding. The parts compared are the
// label, the frame, the icons, the value, the helper, and while open the
// list, a middle item (divider drawn), the selected item's option and its
// mark. The open list is measured through the `open` interaction; the parts
// are `optional`, so they are not charged while either side mounts closed.

let counter = 0;


export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed', 'open']),
  mount: function (React, upstream, props) {
    counter = counter + 1;
    const options = (Array.isArray(props.items) ? props.items : []).map(function (item) {
      return { id: item.value, text: item.label, disabled: item.disabled === true };
    });
    const selected = props.value === undefined ? null : options.find(function (item) {
      return item.id === props.value;
    }) || null;
    return React.createElement(upstream.Dropdown, {
      id: 'reference-dropdown-' + counter,
      titleText: typeof props.label === 'string' ? props.label : props.accessibilityLabel,
      hideLabel: typeof props.label !== 'string',
      label: props.placeholder || '',
      items: options,
      itemToString: function (item) {
        return item === null || item === undefined ? '' : item.text;
      },
      selectedItem: selected,
      onChange: function () {
        return undefined;
      },
      size: props.size || 'md',
      disabled: props.disabled === true,
      invalid: props.invalid === true,
      invalidText: props.invalidText,
      helperText: props.helperText
    });
  },
  body: Object.freeze({ width: 320 }),
  // The element a person hovers, presses and focuses
  target: Object.freeze({ upstream: '.cds--list-box__field', ours: '[role="combobox"]' }),
  parts: Object.freeze({
    label: Object.freeze({ upstream: '.cds--label', ours: ':scope > div > [dir="auto"]:first-child', measure: 'text' }),
    frame: Object.freeze({ upstream: '.cds--dropdown', ours: 'div:has(> [role="combobox"])', measure: 'box', compare: ['x', 'y', 'width', 'height', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopLeftRadius', 'backgroundColor', 'borderBottomColor'] }),
    // The ring moves with the state: the field carries it on focus, the
    // host on invalid; `outlineOf` reads whichever draws it
    ring: Object.freeze({ upstream: '.cds--list-box__field', outlineOf: ['.cds--dropdown', '.cds--list-box__field'], ours: 'div:has(> [role="combobox"])', measure: 'box', compare: ['outline'], optional: true }),
    icon: Object.freeze({ upstream: '.cds--list-box__invalid-icon', ours: '[role="combobox"] > div:nth-child(2):not(:last-child) svg', measure: 'box' }),
    caret: Object.freeze({ upstream: '.cds--list-box__menu-icon', ours: '[role="combobox"] > div:last-child', measure: 'box' }),
    value: Object.freeze({ upstream: '.cds--list-box__label', ours: '[role="combobox"] > div:first-child > [dir="auto"]', measure: 'text' }),
    list: Object.freeze({ upstream: '.cds--list-box__menu', ours: '[role="listbox"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'borderTopLeftRadius', 'backgroundColor'] }),
    item: Object.freeze({ upstream: '.cds--list-box__menu-item:nth-child(2)', ours: '[role="option"]:nth-child(2)', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height', 'backgroundColor'] }),
    option: Object.freeze({ upstream: '.cds--list-box__menu-item:nth-child(2) .cds--list-box__menu-item__option', ours: '[role="option"]:nth-child(2) > div:first-child', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'borderTopWidth', 'borderTopColor', 'borderBottomColor'] }),
    mark: Object.freeze({ upstream: '.cds--list-box__menu-item--active .cds--list-box__menu-item__selected-icon', ours: '[role="option"][aria-selected="true"] > div:last-child', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height'] }),
    message: Object.freeze({ upstream: '.cds--form__helper-text, .cds--form-requirement', ours: ':scope > div > [dir="auto"]:last-child', measure: 'text' })
  })
});
