// Info: component/composite/menu/reference.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
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
  });
