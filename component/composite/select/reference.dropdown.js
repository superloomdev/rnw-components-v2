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
  }),
  // The second reference draws one size and shares its field with the text field;
  // its menu is the `md-menu` surface in the select's shadow root and its items
  // are the option's `li.list-item`; parts are measured from the frame
  second: Object.freeze({
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
  })
});
