// Info: ExpandableSearch measurement reference. The upstream expandable is
// the Search's `isExpanded` prop: collapsed draws the magnifier trigger,
// expanded the full field. The parts compared are the collapsed trigger's
// face and glyph, and the expanded frame, value, magnifier and clear.
// Escape is the field's collapse, not fixture cleanup, so
// `escapeOnLeave` stays false. No second reference: the second system has
// no expandable search element.

let counter = 0;


export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320 }),
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  escapeOnLeave: false,
  mount: function (React, upstream, props) {
    counter = counter + 1;
    return React.createElement(upstream.ExpandableSearch, {
      id: 'reference-expandable-search-' + counter,
      labelText: props.label || props.accessibilityLabel || 'Search',
      placeholder: props.placeholder,
      value: props.value,
      defaultValue: props.defaultValue,
      onChange: function () {
        return undefined;
      },
      isExpanded: props.expanded === true,
      size: props.size || 'md',
      disabled: props.disabled === true
    });
  },
  // The element a person hovers, presses and focuses: the collapsed
  // trigger or, expanded, the input. The state-qualified selectors keep a
  // bare magnifier match from landing on the expanded field's inert glyph
  target: Object.freeze({ upstream: '.cds--search--expanded input, .cds--search:not(.cds--search--expanded) .cds--search-magnifier', ours: 'input, [data-testid="search-expand"]' }),
  // The collapsed trigger answers the pointer too, anchored on its face
  additionalTargets: Object.freeze([
    Object.freeze({
      name: 'trigger',
      upstream: '.cds--search:not(.cds--search--expanded) .cds--search-magnifier',
      ours: '[data-testid="search-expand"]',
      anchor: 'triggerFace',
      states: ['collapsed']
    })
  ]),
  parts: Object.freeze({
    triggerFace: Object.freeze({ upstream: '.cds--search:not(.cds--search--expanded) .cds--search-magnifier', ours: '[data-testid="search-expand-face"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopLeftRadius'] }),
    triggerPaint: Object.freeze({ upstream: '.cds--search:not(.cds--search--expanded) .cds--search-magnifier', ours: '[data-testid="search-expand-paint"]', measure: 'box', optional: true, compare: ['backgroundColor'] }),
    triggerIcon: Object.freeze({ upstream: '.cds--search:not(.cds--search--expanded) .cds--search-magnifier-icon', ours: '[data-testid="search-expand-face"] svg', measure: 'box', optional: true }),
    frame: Object.freeze({ upstream: '.cds--search--expanded .cds--search-input', ours: 'div:has(> input)', measure: 'box', optional: true }),
    value: Object.freeze({ upstream: '.cds--search--expanded .cds--search-input', ours: 'input', measure: 'type', optional: true }),
    leadingIcon: Object.freeze({ upstream: '.cds--search--expanded .cds--search-magnifier-icon', ours: '[data-testid="search-leading-icon"] svg', measure: 'box', optional: true }),
    clearFace: Object.freeze({ upstream: '.cds--search--expanded .cds--search-close', ours: '[data-testid="search-clear-face"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopLeftRadius'] }),
    clearPaint: Object.freeze({ upstream: '.cds--search--expanded .cds--search-close', ours: '[data-testid="search-clear-paint"]', measure: 'box', optional: true, compare: ['backgroundColor'] }),
    clearIcon: Object.freeze({ upstream: '.cds--search--expanded .cds--search-close svg', ours: '[data-testid="search-clear-face"] svg', measure: 'box', optional: true })
  })
});
