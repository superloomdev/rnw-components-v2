// Info: Multiple-choice list box. Its closed Escape clears values, so the
// fixture resets by an outside click instead of invoking that real action.
export function createMultiSelectReference (filterable) {
  const prefix = filterable ? 'filterable-multi-select' : 'multi-select';
  let counter = 0;
  const selector = function (name) {
    return '[data-testid="' + prefix + '-' + name + '"]';
  };
  return Object.freeze({
    kind: 'render-web',
    body: Object.freeze({ width: 320 }),
    escapeOnLeave: false,
    clickOutsideOnLeave: true,
    interactions: Object.freeze(['hover', 'focus', 'pressed', 'open']),
    mount: function (React, upstream, props) {
      counter = counter + 1;
      const items = (props.items || []).map(function (item) {
        return { id: typeof item.value + '-' + String(item.value), text: item.label, disabled: item.disabled === true, value: item.value };
      });
      const values = props.value === undefined ? props.defaultValue || [] : props.value;
      const selected = items.filter(function (item) {
        return values.includes(item.value);
      });
      const options = {
        id: prefix + '-reference-' + counter,
        titleText: typeof props.label === 'string' ? props.label : false,
        hideLabel: typeof props.label !== 'string',
        label: props.placeholder || '',
        placeholder: props.placeholder || '',
        items: items,
        itemToString: function (item) {
          return item ? item.text : '';
        },
        size: props.size || 'md',
        disabled: props.disabled === true,
        invalid: props.invalid === true,
        invalidText: props.invalidText,
        helperText: props.helperText,
        // The carried API preserves host order within each partition.
        sortItems: function (all, state) {
          return all.filter(item => state.selectedItems.includes(item))
            .concat(all.filter(item => !state.selectedItems.includes(item)));
        },
        onChange: function () {}
      };
      if (props.value === undefined) {
        options.initialSelectedItems = selected;
      } else {
        options.selectedItems = selected;
      }
      if (filterable) {
        options.filterItems = function (all, state) {
          const query = state.inputValue || '';
          return all.filter(function (item) {
            if (typeof props.shouldFilterItem === 'function') {
              const original = (props.items || []).find(candidate => candidate.value === item.value);
              return props.shouldFilterItem({ item: original, inputValue: query }) === true;
            }
            return item.text.toLowerCase().includes(query.toLowerCase());
          });
        };
      }
      return React.createElement(filterable ? upstream.FilterableMultiSelect : upstream.MultiSelect, options);
    },
    target: Object.freeze({
      upstream: filterable ? 'input.cds--text-input' : 'button.cds--list-box__field',
      ours: selector('trigger')
    }),
    parts: Object.freeze({
      label: Object.freeze({ upstream: '.cds--label:not(.cds--visually-hidden)', ours: selector('label'), measure: 'text' }),
      frame: Object.freeze({
        upstream: '.cds--list-box', ours: selector('frame'), measure: 'box',
        compare: ['x', 'y', 'width', 'height', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopLeftRadius', 'backgroundColor', 'borderBottomColor']
      }),
      ring: Object.freeze({
        upstream: '.cds--list-box__field',
        outlineOf: ['.cds--list-box', '.cds--list-box__field--wrapper', '.cds--list-box__field'],
        ours: selector('frame'), measure: 'box', compare: ['outline'], optional: true
      }),
      value: Object.freeze({
        upstream: filterable ? 'input.cds--text-input' : '.cds--list-box__label',
        ours: filterable ? selector('trigger') : selector('value'), measure: filterable ? 'type' : 'text'
      }),
      caret: Object.freeze({ upstream: '.cds--list-box__menu-icon', ours: selector('caret'), measure: 'box' }),
      icon: Object.freeze({ upstream: '.cds--list-box__invalid-icon', ours: selector('invalid') + ' svg', measure: 'box' }),
      count: Object.freeze({ upstream: '.cds--tag--filter', ours: selector('count'), measure: 'box', optional: true }),
      countText: Object.freeze({ upstream: '.cds--tag--filter .cds--tag__label', ours: selector('count') + ' [dir="auto"]', measure: 'text', optional: true }),
      countClose: Object.freeze({ upstream: '.cds--tag--filter .cds--tag__close-icon', ours: selector('count') + ' [data-testid="tag-close-face"]', measure: 'box', optional: true }),
      list: Object.freeze({
        upstream: '.cds--list-box__menu', ours: selector('list'), measure: 'box', optional: true,
        compare: ['x', 'y', 'width', 'borderTopLeftRadius', 'backgroundColor']
      }),
      item: Object.freeze({
        upstream: '.cds--list-box__menu-item:nth-child(2)', ours: '[role="option"]:nth-child(2)', measure: 'box', optional: true,
        compare: ['x', 'y', 'width', 'height', 'backgroundColor']
      }),
      option: Object.freeze({
        upstream: '.cds--list-box__menu-item:nth-child(2) .cds--list-box__menu-item__option',
        ours: '[role="option"]:nth-child(2) > [data-part="option-content"]', measure: 'box', optional: true,
        compare: ['x', 'y', 'width', 'borderTopWidth', 'borderTopColor', 'borderBottomColor']
      }),
      box: Object.freeze({
        upstream: '.cds--list-box__menu-item:nth-child(2) .cds--checkbox-label', pseudo: '::before',
        ours: '[role="option"]:nth-child(2) div:has(> [role="checkbox"]) > div:nth-child(1) > div:nth-child(1)',
        measure: 'box', optional: true
      }),
      optionLabel: Object.freeze({
        upstream: '.cds--list-box__menu-item:nth-child(2) .cds--checkbox-label-text',
        ours: '[role="option"]:nth-child(2) > [data-part="option-content"] > [dir="auto"]',
        measure: 'text', optional: true
      }),
      message: Object.freeze({ upstream: '.cds--form__helper-text, .cds--form-requirement', ours: selector('message'), measure: 'text' })
    }),
    additionalTargets: Object.freeze([
      Object.freeze({
        name: 'count clear',
        upstream: '.cds--tag--filter .cds--tag__close-icon',
        ours: selector('count') + ' [role="button"]',
        states: Object.freeze(['selected', 'two selected', 'invalid', 'small', 'large', 'unlabelled']),
        interactions: Object.freeze(['hover', 'focus', 'pressed']),
        anchor: 'countClose'
      }),
      Object.freeze({
        name: 'caret',
        point: true,
        upstream: '.cds--list-box__menu-icon',
        ours: selector('caret'),
        states: Object.freeze(['default', 'selected']),
        interactions: Object.freeze(['hover', 'pressed']),
        anchor: 'frame'
      })
    ])
  });
}

export default createMultiSelectReference(false);
