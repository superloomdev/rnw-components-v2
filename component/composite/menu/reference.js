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
    return React.createElement(upstream.Menu, {
      open: true,
      x: props.x || 0,
      y: props.y || 0,
      target: null,
      label: props.accessibilityLabel,
      onClose: function () {
        return undefined;
      }
    }, items.map(function (item, index) {
      if (item.divider === true) {
        return React.createElement(upstream.MenuItemDivider, { key: index });
      }
      // A selectable item mounts the selectable element so its menu gains
      // the `with-selectable-items` class and the selection mark seat
      if (item.selected !== undefined) {
        return React.createElement(upstream.MenuItemSelectable, {
          disabled: item.disabled === true,
          key: index,
          label: item.label,
          selected: item.selected === true
        });
      }
      return React.createElement(upstream.MenuItem, {
        disabled: item.disabled === true,
        key: index,
        kind: item.danger === true ? 'danger' : 'default',
        label: item.label,
        renderIcon: item.icon ? upstream.icon(item.icon) : undefined,
        shortcut: item.shortcut
      });
    }));
  },
  // The element a person hovers, presses and focuses: the first enabled item
  target: Object.freeze({ upstream: '.cds--menu-item:not(.cds--menu-item--disabled)', ours: '[role="menuitem"], [role="menuitemcheckbox"]' }),
  // The fixed surface mounts inside its cell: the body stages it, matching
  // the sample's frame
  body: Object.freeze({ width: 400, height: 280, stage: true }),
  // `width` waits on the queued control.menu_min_width cells (the primary's
  // surface floors at 10rem, 12rem when its items carry icons)
  parts: Object.freeze({
    surface: Object.freeze({ upstream: '.cds--menu', ours: '[role="menu"]', measure: 'box', compare: ['x', 'y', 'paddingTop', 'paddingBottom', 'backgroundColor'] }),
    item: Object.freeze({ upstream: '.cds--menu-item', ours: '[role="menuitem"], [role="menuitemcheckbox"]', measure: 'box', compare: ['x', 'y', 'height', 'backgroundColor'] }),
    label: Object.freeze({ upstream: '.cds--menu-item .cds--menu-item__label', ours: '[role="menuitem"] [dir="auto"], [role="menuitemcheckbox"] [dir="auto"]', measure: 'text' }),
    icon: Object.freeze({ upstream: '.cds--menu-item__icon svg', ours: '[role="menuitem"] svg', measure: 'box', optional: true }),
    mark: Object.freeze({ upstream: '.cds--menu-item[aria-checked="true"] .cds--menu-item__selection-icon svg', ours: '[role="menuitemcheckbox"][aria-checked="true"] > div > div:first-child svg', measure: 'box', optional: true }),
    // The divider is full-bleed, so `width` waits on `control.menu_min_width`
    // with the surface
    divider: Object.freeze({ upstream: '.cds--menu-item-divider', ours: '[role="separator"]', measure: 'box', compare: ['height', 'backgroundColor', 'marginTop', 'marginBottom'] })
  }),
  second: Object.freeze({
    mount: function (React, upstream, props) {
      const items = Array.isArray(props.items) ? props.items : [];
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
          }, glyph, item.label);
        })));
    },
    // The fixed surface mounts inside its cell: the body stages it, matching
    // the sample's frame
    body: Object.freeze({ width: 400, height: 280, stage: true }),
    // The surface is `.items`: the `.menu` wrapper stays transparent while
    // `.items` carries the fill and radius. `width` waits on the queued
    // control.menu_min_width cell (md-menu's 112px floor)
    parts: Object.freeze({
      surface: Object.freeze({ upstream: 'md-menu >>> .items', ours: '[role="menu"]', measure: 'box', compare: ['x', 'y', 'height', 'backgroundColor', 'borderTopLeftRadius'] }),
      // The upstream `li` never paints (state layers live inside `md-item`);
      // `backgroundColor` on it would always read transparent
      item: Object.freeze({ upstream: 'md-menu-item >>> li.list-item', ours: '[role="menuitem"], [role="menuitemcheckbox"]', measure: 'box', compare: ['x', 'y', 'height'] }),
      label: Object.freeze({ upstream: 'md-menu-item', styleOf: 'md-menu-item >>> .list-item', ours: '[role="menuitem"] [dir="auto"], [role="menuitemcheckbox"] [dir="auto"]', measure: 'text' }),
      // `ink` waits on the queued color.menu_item_icon cells (the second
      // draws its start icon in on-surface-variant, not the label color)
      icon: Object.freeze({ upstream: 'md-menu-item svg[slot="start"]', ours: '[role="menuitem"] svg', measure: 'box', compare: ['x', 'y', 'width', 'height'], optional: true }),
      // The upstream divider paints its line on a `::before`; `width` waits
      // on `control.menu_min_width` with the surface
      divider: Object.freeze({ upstream: 'md-divider', pseudo: '::before', ours: '[role="separator"]', measure: 'box', compare: ['height', 'backgroundColor'] })
    }),
    omit: Object.freeze({
      mark: Object.freeze({ reason: 'the second reference knows no selectable menu item and draws no selection mark', upstream: 'md-menu-item >>> [class*="check"], md-menu-item >>> [class*="selected"]' })
    })
  })
});
