// Info: MenuButton measurement reference. The upstream button is a
// `button.cds--menu-button__trigger` whose menu opens at its edge inside
// a positioned wrapper (`menuTarget`, a DOM descendant of the cell body);
// the opened states press the trigger when the menu has gone. The parts
// compared are the trigger, its label and chevron, the menu and its first
// item.

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  mount: function (React, upstream, props) {
    const items = Array.isArray(props.items) ? props.items : [];
    return React.createElement('div', { style: { position: 'relative' } },
      React.createElement(upstream.MenuButton, {
        disabled: props.disabled === true,
        kind: props.kind,
        label: props.label,
        menuAlignment: props.menuAlignment,
        open: props.open === true,
        size: props.size
      }, items.map(function (item, index) {
        return React.createElement(upstream.MenuItem, { key: index, label: item.label });
      })));
  },
  // The element a person hovers, presses and focuses: the trigger
  target: Object.freeze({ upstream: '.cds--menu-button__trigger', upstreamFocus: '.cds--menu-button__trigger', ours: '[role="button"]' }),
  // Re-press the trigger when an interaction closed the menu on an opened
  // state
  reopen: Object.freeze({
    states: Object.freeze(['open', 'sm', 'alignStart']),
    when: Object.freeze({ upstream: '.cds--menu', ours: '[role="menu"]' }),
    upstream: '.cds--menu-button__trigger',
    ours: '[role="button"]'
  }),
  body: Object.freeze({ width: 320, height: 280 }),
  parts: Object.freeze({
    trigger: Object.freeze({ upstream: '.cds--menu-button__trigger', ours: '[role="button"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor'] }),
    label: Object.freeze({ upstream: '.cds--menu-button__trigger', ours: '[role="button"] [dir="auto"]', measure: 'text' }),
    chevron: Object.freeze({ upstream: '.cds--menu-button__trigger svg', ours: '[role="button"] svg', measure: 'box', compare: ['x', 'y', 'width', 'height', 'fill'] }),
    menu: Object.freeze({ upstream: '.cds--menu', ours: '[role="menu"]', measure: 'box', compare: ['x', 'y', 'width', 'paddingTop', 'backgroundColor'], optional: true }),
    item: Object.freeze({ upstream: '.cds--menu-item', ours: '[role="menuitem"], [role="menuitemcheckbox"]', measure: 'box', compare: ['height'], optional: true })
  })
});
