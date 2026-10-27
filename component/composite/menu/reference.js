// Info: Menu measurement reference. The upstream menu is a `ul.cds--menu`
// of `li.cds--menu-item` entries: each item's selection-icon seat, icon
// seat, label and shortcut line up before any children a divider is; a
// `danger` kind reads its own cells and `aria-checked` shows the
// selection icon. Its `target: null` keeps the surface inside the measured
// cell where it defaults to a portal. The parts compared are the surface,
// a middle item, its label and icon, the selected item's mark, the danger
// item and a divider. The second reference was retired (batch R).

export default Object.freeze({
  kind: 'render-web',
  interactions: Object.freeze(['hover', 'focus', 'pressed']),
  mount: function (React, upstream, props) {
    const items = Array.isArray(props.items) ? props.items : [];

    function entry (item, index) {
      if (item.divider === true) {
        return React.createElement(upstream.MenuItemDivider, { key: index });
      }
      if (item.group !== undefined) {
        return React.createElement(upstream.MenuItemGroup, { key: index, label: item.group }, item.items.map(entry));
      }
      if (item.radioGroup !== undefined) {
        return React.createElement(upstream.MenuItemRadioGroup, { key: index, label: item.radioGroup, items: item.items, selectedItem: item.selectedItem });
      }
      if (item.selected !== undefined) {
        return React.createElement(upstream.MenuItemSelectable, { key: index, label: item.label, selected: item.selected === true });
      }
      if (Array.isArray(item.items)) {
        return React.createElement(upstream.MenuItem, { key: index, label: item.label }, item.items.map(entry));
      }
      return React.createElement(upstream.MenuItem, {
        disabled: item.disabled === true,
        key: index,
        kind: item.danger === true ? 'danger' : 'default',
        label: item.label,
        renderIcon: item.icon ? upstream.icon(item.icon) : undefined,
        shortcut: item.shortcut
      });
    }

    return React.createElement(upstream.Menu, {
      backgroundToken: props.backgroundToken,
      border: props.border === true,
      label: props.accessibilityLabel,
      onClose: function () {
        return undefined;
      },
      open: true,
      size: props.size,
      target: null,
      x: props.x || 0,
      y: props.y || 0
    }, items.map(entry));
  },
  // The element a person hovers, presses and focuses: the first enabled item
  target: Object.freeze({ upstream: '.cds--menu-item:not(.cds--menu-item--disabled)', ours: '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]' }),
  // The fixed surface mounts inside its cell: the body stages it, matching
  // the sample's frame
  body: Object.freeze({ width: 400, height: 280, stage: true }),
  // Every open menu grabs focus on mount, so without a refocus whichever
  // cell mounted last holds the ring at shot time; the read focuses the
  // measured cell's own first item (the deepest panel's, for a hover-opened
  // submenu) right before it shoots, as upstream's last-opened menu does
  refocus: Object.freeze({
    states: Object.freeze(['default']),
    menu: Object.freeze({ upstream: '.cds--menu', ours: '[role="menu"]' }),
    upstream: '.cds--menu-item:not(.cds--menu-item--disabled)',
    ours: '[role="menuitem"]:not([aria-disabled="true"]), [role="menuitemcheckbox"], [role="menuitemradio"]'
  }),
  parts: Object.freeze({
    surface: Object.freeze({ upstream: '.cds--menu', ours: '[role="menu"]', measure: 'box', compare: ['x', 'y', 'width', 'paddingTop', 'paddingBottom', 'backgroundColor'] }),
    item: Object.freeze({ upstream: '.cds--menu-item', ours: 'div:has(> [role="menuitem"]) > div, div:has(> [role="menuitemcheckbox"]) > div, div:has(> [role="menuitemradio"]) > div', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor'] }),
    label: Object.freeze({ upstream: '.cds--menu-item .cds--menu-item__label', ours: 'div:has(> [role="menuitem"]) > div [dir="auto"], div:has(> [role="menuitemcheckbox"]) > div [dir="auto"], div:has(> [role="menuitemradio"]) > div [dir="auto"]', measure: 'text' }),
    // The shortcut is its own text run: the item's last labelled text
    shortcut: Object.freeze({ upstream: '.cds--menu-item__shortcut', ours: 'div:has(> [role="menuitem"]) > div [dir="auto"]:last-of-type, div:has(> [role="menuitemcheckbox"]) > div [dir="auto"]:last-of-type, div:has(> [role="menuitemradio"]) > div [dir="auto"]:last-of-type', measure: 'text', optional: true }),
    icon: Object.freeze({ upstream: '.cds--menu-item__icon svg', ours: 'div:has(> [role="menuitem"]) > div svg', measure: 'box', optional: true }),
    mark: Object.freeze({ upstream: '.cds--menu-item[aria-checked="true"] .cds--menu-item__selection-icon svg', ours: 'div:has(> [role="menuitemcheckbox"][aria-checked="true"]) > div > div:first-child svg, div:has(> [role="menuitemradio"][aria-checked="true"]) > div > div:first-child svg', measure: 'box', optional: true }),
    divider: Object.freeze({ upstream: '.cds--menu-item-divider', ours: '[role="separator"]', measure: 'box', compare: ['width', 'height', 'backgroundColor', 'marginTop', 'marginBottom'] }),
    submenu: Object.freeze({ upstream: '.cds--menu .cds--menu', ours: '[role="menu"] [role="menu"]', measure: 'box', compare: ['width', 'paddingTop', 'backgroundColor'], optional: true }),
    caret: Object.freeze({ upstream: '.cds--menu-item__shortcut svg', ours: 'div:has(> [aria-haspopup="true"]) > div svg', measure: 'box', compare: ['x', 'y', 'width', 'height', 'fill'], optional: true }),
    selected: Object.freeze({ upstream: '.cds--menu-item[aria-checked="true"]', ours: 'div:has(> [aria-checked="true"]) > div', measure: 'box', compare: ['backgroundColor'], optional: true }),
    // The danger item names its kind on the row
    danger: Object.freeze({ upstream: '.cds--menu-item--danger', ours: '[data-part="danger"]', measure: 'box', compare: ['backgroundColor', 'boxShadow'], optional: true }),
    outline: Object.freeze({ upstream: '.cds--menu', ours: '[role="menu"]', measure: 'box', compare: ['outlineColor', 'outlineWidth', 'outlineStyle'] })
  })
});
