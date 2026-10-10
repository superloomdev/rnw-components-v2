// Info: Menu composite. Every sample state renders under all three
// templates with the surface, items, labels, icons, mark and separators
// read from the `list` family and the menu's member cells; a danger item
// reads its own cells; a selectable menu reserves the mark seat for every
// item, drawn only where `anatomy.list_selected_mark` says `shown`; arrows
// rove the focus and Escape calls `onClose`.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/menu/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Build a registry for a template.

@param {String} template - Template name

@return {Object} - Registry
*********************************************************************/
function registryFor (template) {

  return buildSystem(template, factories);

}


/********************************************************************
Render one Menu and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Menu props

@return {Promise<Object>} - { root, surface, items, dividers }
*********************************************************************/
async function renderMenu (Registry, props) {

  const container = await render(React.createElement(Registry.Menu, props));
  const surface = container.querySelector('[role="menu"]');

  return {
    surface: surface,
    items: function () {
      return surface === null ? [] : Array.from(surface.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"]'));
    },
    option: function (item) {
      return item.children[0];
    },
    mark: function (item) {
      return item.children[0].children[0];
    },
    label: function (item) {
      return item.querySelector('[dir="auto"]');
    },
    dividers: function () {
      return surface === null ? [] : Array.from(surface.querySelectorAll('[role="separator"]'));
    }
  };

}


describe('Menu: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': surface, items and dividers come from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const parts = await renderMenu(registryFor(template), props);
        const items = parts.items();

        // The surface's container cells
        assert.notEqual(parts.surface, null);
        assert.equal(parts.surface.style.backgroundColor, cssValue('backgroundColor', t['color.list_container']));
        assert.equal(parts.surface.style.paddingTop, t['control.menu_padding_block'] + 'px');
        assert.equal(parts.surface.style.paddingBottom, t['control.menu_padding_block'] + 'px');
        assert.equal(parts.surface.getAttribute('aria-label'), props.accessibilityLabel);

        // Each entry: an item or a separator
        const entries = props.items.filter(function (item) {
          return item.divider !== true;
        });
        assert.equal(items.length, entries.length);
        assert.equal(parts.dividers().length, props.items.length - entries.length);

        for (let index = 0; index < entries.length; index = index + 1) {
          const entry = entries[index];
          const item = items[index];
          const disabled = entry.disabled === true;
          const danger = entry.danger === true;

          // The item's height, label and role
          assert.equal(item.style.height, t['control.menu_item_height'] + 'px');
          assert.equal(item.getAttribute('aria-disabled'), disabled ? 'true' : null);
          const role = entry.selected === undefined ? 'menuitem' : 'menuitemcheckbox';
          assert.equal(item.getAttribute('role'), role);
          assert.equal(item.getAttribute('aria-checked'), entry.selected === undefined ? null : String(entry.selected === true));
          const labelLeaf = disabled ? 'list_item_label_disabled' : danger ? 'menu_item_danger_label' : entry.selected === true ? 'list_item_label_selected' : 'list_item_label';
          const label = parts.label(item);
          assert.equal(label.textContent, entry.label);
          assert.equal(label.style.color, cssValue('color', t['color.' + labelLeaf]));

          // A selectable menu reserves the mark seat for every item, drawn
          // only where the anatomy says `shown`; a non-selectable menu
          // mounts no mark seat
          const selectable = props.items.some(function (candidate) {
            return candidate.selected !== undefined;
          });
          const marked = Array.from(parts.option(item).querySelectorAll('svg path')).some(function (path) {
            return t['icon.selected_indicator'].paths.some(function (glyph) {
              return path.getAttribute('d') === glyph.d;
            });
          });
          assert.equal(marked, selectable);
          if (selectable) {
            const mark = parts.mark(item);
            assert.equal(mark.style.display, t['anatomy.list_selected_mark'] === 'shown' ? 'flex' : 'none');
            const markIcon = mark.querySelector('svg');
            assert.equal(markIcon.getAttribute('width'), String(t['size.icon_01']));
          }

          // The icon seat, when an icon is named, is the member cell's size
          if (entry.icon !== undefined) {
            const icon = parts.option(item).children[selectable ? 1 : 0].querySelector('svg');
            assert.equal(icon.getAttribute('width'), String(t['control.menu_icon_size']));
          }
        }

        // Each separator reads the member divider cells
        for (const divider of parts.dividers()) {
          assert.equal(divider.style.height, t['control.menu_divider_width'] + 'px');
          assert.equal(divider.style.backgroundColor, cssValue('backgroundColor', t['color.menu_divider']));
        }
      });
    }
  }

});


describe('Menu: behavior through the DOM', function () {

  test('closed renders nothing; choosing an item reports and closes; Escape closes', async function () {
    let chosen = null;
    let closed = 0;
    const Registry = registryFor('carbon');
    const container = await render(React.createElement(Registry.Menu, {
      items: [{ label: 'A' }, { label: 'B' }],
      open: false,
      onClose: function () {
        closed = closed + 1;
      }
    }));
    assert.equal(container.querySelector('[role="menu"]'), null);

    const parts = await renderMenu(Registry, {
      items: [{ label: 'A' }, { label: 'B', disabled: true }, { label: 'C' }],
      open: true,
      x: 4,
      y: 4,
      onChange: function (item) {
        chosen = item.label;
      },
      onClose: function () {
        closed = closed + 1;
      }
    });
    await act(async function () {
      parts.items()[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(chosen, 'A');
    assert.equal(closed, 1);

    await act(async function () {
      parts.surface.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    });
    assert.equal(closed, 2);
  });

  test('a danger item paints its own cells on hover', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderMenu(registryFor('carbon'), { items: [{ label: 'Delete', danger: true }], open: true });
    const item = parts.items()[0];
    await act(async function () {
      item.dispatchEvent(new Event('pointerover', { bubbles: true }));
    });
    assert.equal(item.style.backgroundColor, cssValue('backgroundColor', t['color.menu_item_danger_container_hover']));
    assert.equal(parts.label(item).style.color, cssValue('color', t['color.menu_item_danger_label_hover']));
  });

});
