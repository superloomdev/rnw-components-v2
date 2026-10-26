// Info: OverflowMenu measurement reference. The upstream trigger is a
// `button.cds--overflow-menu` inside a `data-floating-menu-container`
// div (position relative, so the FloatingMenu panel mounts inside the
// cell); the opened states re-press the trigger when the panel has gone
// (an outside press or Escape closes it). The parts compared are the
// trigger, its icon and tooltip, the panel, the connector, and every
// option row, button and label. The danger row's hover fill paints on
// its button while the row keeps the standard grey.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  mount: function (React, upstream, props) {
    const items = Array.isArray(props.items) ? props.items : [];
    return React.createElement('div', { 'data-floating-menu-container': true, style: { position: 'relative' } },
      React.createElement(upstream.OverflowMenu, {
        direction: props.direction,
        flipped: props.flipped === true,
        iconDescription: props.iconDescription,
        open: props.open === true,
        size: props.size,
        'aria-label': props.accessibilityLabel
      }, items.map(function (item, index) {
        return React.createElement(upstream.OverflowMenuItem, {
          disabled: item.disabled === true,
          hasDivider: item.divider === true,
          isDelete: item.danger === true,
          itemText: item.label,
          key: index
        });
      })));
  },
  // The element a person hovers, presses and focuses: the trigger while
  // closed; the option buttons on the opened-target states. Ours is the
  // covering pressable, not the face it paints over (IconButton's pattern)
  target: Object.freeze({ upstream: '.cds--overflow-menu', ours: '[role="button"]' }),
  // Re-press the trigger when an interaction closed the panel on an
  // opened state (the upstream menu unmounts its options)
  reopen: Object.freeze({
    states: Object.freeze(['open', 'openLg', 'openFlipped', 'openTop', 'openOption', 'openDanger']),
    when: Object.freeze({ upstream: '.cds--overflow-menu-options', ours: '[role="menu"]' }),
    upstream: '.cds--overflow-menu',
    ours: '[role="button"]'
  }),
  body: Object.freeze({ width: 320, height: 240 }),
  parts: Object.freeze({
    trigger: Object.freeze({ upstream: '.cds--overflow-menu', ours: '[data-testid="icon-button-face"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor', 'boxShadow'] }),
    icon: Object.freeze({ upstream: '.cds--overflow-menu__icon', ours: '[data-testid="icon-button-face"] svg', measure: 'box', compare: ['x', 'y', 'width', 'height', 'fill'] }),
    tooltip: Object.freeze({ upstream: '.cds--popover-content', ours: '[role="tooltip"] > div', measure: 'box', optional: true }),
    panel: Object.freeze({ upstream: '.cds--overflow-menu-options', ours: '[role="menu"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor', 'boxShadow'], optional: true }),
    connector: Object.freeze({ upstream: '.cds--overflow-menu-options', pseudo: '::after', ours: '[role="menu"] > div:first-child', measure: 'box', compare: ['cssWidth', 'cssHeight', 'cssTop', 'cssLeft', 'backgroundColor'], optional: true }),
    option: Object.freeze({ upstream: '.cds--overflow-menu-options__option', all: true, ours: '[role="presentation"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor', 'borderTopWidth', 'borderTopColor'], optional: true }),
    optionButton: Object.freeze({ upstream: '.cds--overflow-menu-options__btn', all: true, ours: '[role="menuitem"]', measure: 'box', compare: ['paddingLeft', 'paddingRight', 'color', 'maxWidth', 'boxShadow'], optional: true }),
    optionText: Object.freeze({ upstream: '.cds--overflow-menu-options__option-content', all: true, ours: '[role="menuitem"] [dir="auto"]', measure: 'text', optional: true })
  }),
  additionalTargets: Object.freeze([
    Object.freeze({
      name: 'option',
      upstream: '.cds--overflow-menu-options__option:nth-child(1) .cds--overflow-menu-options__btn',
      ours: '[data-part="option"][data-index="0"] [role="menuitem"]',
      states: Object.freeze(['openOption']),
      interactions: Object.freeze(['hover', 'focus'])
    }),
    Object.freeze({
      name: 'danger option',
      upstream: '.cds--overflow-menu-options__option:nth-child(4) .cds--overflow-menu-options__btn',
      ours: '[data-part="option"][data-index="3"] [role="menuitem"]',
      states: Object.freeze(['openDanger']),
      interactions: Object.freeze(['hover', 'focus'])
    })
  ])
});
