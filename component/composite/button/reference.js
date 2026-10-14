// Info: ComboButton measurement reference. The upstream combo button takes
// `label`, `size`, `disabled` and `menuAlignment` with its menu items as
// MenuItem children; the menu opens on the trigger's click and - for the
// plain alignments - spans the container edge to edge. The parts compare
// the container, the action, the trigger's face and chevron. No `open`
// interaction is driven: the upstream Menu portals to `document.body` and
// the upstream ComboButton forwards no `target`, so the open menu never
// appears in its cell shot - ours would draw in-cell, and no cell-scoped
// selector reaches the upstream surface either. The open menu's width and
// placement and the chevron's 180-degree turn are covered by the unit
// tests and the fire rows `combo-button-menu-width` and
// `combo-button-chevron-turn`.
// The container is `inline-flex` upstream: intrinsic in any body, so the
// sample carries no frame. No second reference: the second system has no
// split button.


export default Object.freeze({
  kind: 'render-web',
  mount: function (React, upstream, props) {
    const items = Array.isArray(props.items) ? props.items : [];
    return React.createElement(upstream.ComboButton, {
      label: props.label,
      size: props.size || 'lg',
      disabled: props.disabled === true,
      menuAlignment: props.menuAlignment || 'bottom'
    }, items.map(function (item, index) {
      return React.createElement(upstream.MenuItem, {
        key: index,
        label: item.label,
        disabled: item.disabled === true,
        kind: item.danger === true ? 'danger' : 'default',
        shortcut: item.shortcut,
        renderIcon: typeof item.icon === 'string' ? upstream.icon(item.icon) : undefined
      });
    }));
  },
  // The element a person hovers, presses and focuses - and clicks to open
  target: Object.freeze({ upstream: '.cds--combo-button__trigger', ours: '[aria-haspopup]' }),
  parts: Object.freeze({
    container: Object.freeze({ upstream: '.cds--combo-button__container', ours: ':scope > div', measure: 'box' }),
    action: Object.freeze({ upstream: '.cds--combo-button__primary-action .cds--btn', ours: ':scope > div > [role="button"]', measure: 'box' }),
    // The trigger's square is its face; the pressable above it is a wider,
    // transparent hit layer, as the IconButton row's is
    trigger: Object.freeze({ upstream: '.cds--combo-button__trigger', ours: ':scope > div [data-testid="icon-button-face"]', measure: 'box' }),
    chevron: Object.freeze({ upstream: '.cds--combo-button__trigger svg', ours: ':scope > div [data-testid="icon-button-face"] svg', measure: 'box' })
  })
});
