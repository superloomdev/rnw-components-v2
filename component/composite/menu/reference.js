// Info: Menu measurement reference. The upstream menu is a `ul.cds--menu`
// of `li.cds--menu-item` entries: each item's selection-icon seat, icon
// seat, label and shortcut line up before any children a divider is; a
// `danger` kind reads its own cells and `aria-checked` shows the
// selection icon. Its `target: null` keeps the surface inside the measured
// cell where it defaults to a portal. The parts compared are the surface,
// a middle item, its label and icon, the selected item's mark, the danger
// item and a divider. The second reference is `md-menu` of
// `md-menu-item` elements (with `md-divider` for a separator); it has no
// danger kind or selected marks, so those are unmeasured there, and its
// icon slots in `start`.

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
  parts: Object.freeze({
    surface: Object.freeze({ upstream: '.cds--menu', ours: '[role="menu"]', measure: 'box', compare: ['x', 'y', 'width', 'paddingTop', 'paddingBottom', 'backgroundColor'] }),
    item: Object.freeze({ upstream: '.cds--menu-item', ours: '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor'] }),
    label: Object.freeze({ upstream: '.cds--menu-item .cds--menu-item__label', ours: '[role="menuitem"] [dir="auto"], [role="menuitemcheckbox"] [dir="auto"], [role="menuitemradio"] [dir="auto"]', measure: 'text' }),
    // The shortcut is its own text run: the item's last labelled text
    shortcut: Object.freeze({ upstream: '.cds--menu-item__shortcut', ours: '[role="menuitem"] [dir="auto"]:last-of-type, [role="menuitemcheckbox"] [dir="auto"]:last-of-type, [role="menuitemradio"] [dir="auto"]:last-of-type', measure: 'text', optional: true }),
    icon: Object.freeze({ upstream: '.cds--menu-item__icon svg', ours: '[role="menuitem"] svg', measure: 'box', optional: true }),
    mark: Object.freeze({ upstream: '.cds--menu-item[aria-checked="true"] .cds--menu-item__selection-icon svg', ours: '[role="menuitemcheckbox"][aria-checked="true"] > div > div:first-child svg, [role="menuitemradio"][aria-checked="true"] > div > div:first-child svg', measure: 'box', optional: true }),
    divider: Object.freeze({ upstream: '.cds--menu-item-divider', ours: '[role="separator"]', measure: 'box', compare: ['width', 'height', 'backgroundColor', 'marginTop', 'marginBottom'] }),
    submenu: Object.freeze({ upstream: '.cds--menu .cds--menu', ours: '[role="menu"] [role="menu"]', measure: 'box', compare: ['width', 'paddingTop', 'backgroundColor'], optional: true }),
    caret: Object.freeze({ upstream: '.cds--menu-item__shortcut svg', ours: '[aria-haspopup="true"] svg', measure: 'box', compare: ['x', 'y', 'width', 'height', 'fill'], optional: true }),
    selected: Object.freeze({ upstream: '.cds--menu-item[aria-checked="true"]', ours: '[aria-checked="true"]', measure: 'box', compare: ['backgroundColor'], optional: true }),
    // The danger item names its kind on the row
    danger: Object.freeze({ upstream: '.cds--menu-item--danger', ours: '[data-part="danger"]', measure: 'box', compare: ['backgroundColor', 'boxShadow'], optional: true }),
    outline: Object.freeze({ upstream: '.cds--menu', ours: '[role="menu"]', measure: 'box', compare: ['outlineColor', 'outlineWidth', 'outlineStyle'] })
  }),
  second: Object.freeze({
    mount: function (React, upstream, props) {
      const items = Array.isArray(props.items) ? props.items : [];
      // The new states name no md-menu element: size, border, background
      // token, danger, group, radio and submenu are unmeasured there
      if (props.size !== undefined || props.border === true || props.backgroundToken !== undefined || items.some(function (item) {
        return item.group !== undefined || item.radioGroup !== undefined || Array.isArray(item.items) || item.danger === true;
      })) {
        return null;
      }
      // The upstream menu opens against an anchor element, not a point: a
      // one-pixel anchor at the state's fixed point, both corners at the
      // start, lands the surface's top left on it
      const anchorId = 'menu-anchor-' + (props.x || 0) + '-' + (props.y || 0);
      return React.createElement(React.Fragment, null,
        React.createElement('div', {
          id: anchorId,
          style: { height: 1, left: props.x || 0, position: 'fixed', top: props.y || 0, width: 1 }
        }),
        React.createElement('md-menu', {
          open: true,
          anchor: anchorId,
          'anchor-corner': 'start-start',
          'menu-corner': 'start-start',
          positioning: 'fixed',
          'aria-label': props.accessibilityLabel,
          // The mounted menu is a static exhibit: nothing dismisses it, and it
          // re-shows once its anchor has connected. The host carries our
          // list_item type so the shadow items' unset typescale vars inherit it
          ref: function (element) {
            if (element !== null) {
              const type = upstream.tokens['type.list_item'];
              element.stayOpenOnFocusout = true;
              element.style.color = upstream.tokens['color.list_item_label'];
              element.style.fontFamily = String(upstream.tokens['font.family.' + type.fontFamily] || type.fontFamily);
              element.style.fontSize = String(type.fontSize) + 'px';
              element.style.fontWeight = String(type.fontWeight);
              element.style.lineHeight = String(type.lineHeight) + 'px';
              element.style.letterSpacing = String(type.letterSpacing) + 'px';
              window.requestAnimationFrame(function () {
                element.show();
                // The menu writes the anchor's viewport rect into its layer's
                // fixed position; inside the staged body those numbers resolve
                // against the stage instead, so the exhibit pins the layer to
                // the point the sample names
                const layer = element.shadowRoot && element.shadowRoot.querySelector('.menu');
                if (layer !== null) {
                  layer.style.left = String(props.x || 0) + 'px';
                  layer.style.top = String(props.y || 0) + 'px';
                }
              });
            }
          }
        }, items.map(function (item, index) {
          if (item.divider === true) {
            return React.createElement('md-divider', { key: index });
          }
          const glyph = item.icon && upstream.tokens['icon.' + item.icon]
            ? React.createElement('svg', {
              height: upstream.tokens['control.menu_icon_size'],
              slot: 'start',
              viewBox: upstream.tokens['icon.' + item.icon].viewBox,
              width: upstream.tokens['control.menu_icon_size']
            },
            upstream.tokens['icon.' + item.icon].paths.map(function (path, pathIndex) {
              return React.createElement('path', { key: pathIndex, d: path.d, fillRule: path.fillRule });
            }))
            : null;
          return React.createElement('md-menu-item', {
            disabled: item.disabled === true ? true : undefined,
            key: index
          }, glyph, item.label,
          item.shortcut === undefined ? null : React.createElement('span', { slot: 'trailing-supporting-text' }, item.shortcut));
        })));
    },
    // The fixed surface mounts inside its cell: the body stages it, matching
    // the sample's frame
    body: Object.freeze({ width: 400, height: 280, stage: true }),
    // The surface is `.items`: the `.menu` wrapper stays transparent while
    // `.items` carries the fill and radius
    parts: Object.freeze({
      surface: Object.freeze({ upstream: 'md-menu >>> .items', ours: '[role="menu"]', measure: 'box', compare: ['x', 'y', 'width', 'height', 'backgroundColor', 'borderTopLeftRadius'] }),
      // The upstream `li` never paints (state layers live inside `md-item`);
      // `backgroundColor` on it would always read transparent
      item: Object.freeze({ upstream: 'md-menu-item >>> li.list-item', ours: '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
      label: Object.freeze({ upstream: 'md-menu-item', styleOf: 'md-menu-item >>> .list-item', ours: '[role="menuitem"] [dir="auto"], [role="menuitemcheckbox"] [dir="auto"]', measure: 'text' }),
      shortcut: Object.freeze({ upstream: 'md-menu-item [slot="trailing-supporting-text"]', ours: '[role="menuitem"] [dir="auto"]:last-of-type, [role="menuitemcheckbox"] [dir="auto"]:last-of-type', measure: 'text', optional: true }),
      icon: Object.freeze({ upstream: 'md-menu-item svg[slot="start"]', ours: '[role="menuitem"] svg', measure: 'box', compare: ['x', 'y', 'width', 'height', 'ink'], optional: true }),
      // The upstream divider paints its line on a `::before`
      divider: Object.freeze({ upstream: 'md-divider', pseudo: '::before', ours: '[role="separator"]', measure: 'box', compare: ['width', 'height', 'backgroundColor'] })
    }),
    omit: Object.freeze({
      mark: Object.freeze({ reason: 'the second reference knows no selectable menu item and draws no selection mark', upstream: 'md-menu-item >>> [class*="check"], md-menu-item >>> [class*="selected"]' })
    })
  })
});
