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
      return surface === null ? [] : Array.from(surface.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'));
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
        assert.equal(parts.surface.style.backgroundColor, cssValue('backgroundColor', t[props.backgroundToken === 'background' ? 'color.menu_container_background' : 'color.list_container']));
        assert.equal(parts.surface.style.paddingTop, t['control.menu_padding_block'] + 'px');
        assert.equal(parts.surface.style.paddingBottom, t['control.menu_padding_block'] + 'px');
        assert.equal(parts.surface.getAttribute('aria-label'), props.accessibilityLabel);

        // Each entry: an item or a separator; group and radio-group
        // entries' children are the items themselves (radio options may
        // be strings)
        const flatten = function (entries) {
          return entries.reduce(function (acc, item) {
            if (item.divider === true) {
              return acc;
            }
            if (item.group !== undefined || item.radioGroup !== undefined) {
              return acc.concat(flatten(item.items));
            }
            return acc.concat(item);
          }, []);
        };
        const entries = flatten(props.items).map(function (item) {
          return typeof item === 'string' ? { label: item } : item;
        });
        const radioEntry = props.items.find(function (item) {
          return item.radioGroup !== undefined;
        });
        const selectedItem = radioEntry === undefined ? undefined : radioEntry.selectedItem;
        assert.equal(items.length, entries.length);
        const dividerCount = function (entries) {
          return entries.reduce(function (count, item) {
            if (item.divider === true) {
              return count + 1;
            }
            if (item.group !== undefined || item.radioGroup !== undefined) {
              return count + dividerCount(item.items);
            }
            return count;
          }, 0);
        };
        assert.equal(parts.dividers().length, dividerCount(props.items));

        for (let index = 0; index < entries.length; index = index + 1) {
          const entry = entries[index];
          const item = items[index];
          const disabled = entry.disabled === true;
          const danger = entry.danger === true;
          const radio = radioEntry !== undefined && radioEntry.items.some(function (option) {
            return (typeof option === 'string' ? option : option.label) === entry.label;
          });
          const selected = radio ? entry.label === selectedItem : entry.selected === true;

          // The item's height, label and role
          const heights = { xs: 'size.size_xsmall', sm: 'control.menu_item_height', md: 'size.size_medium', lg: 'size.size_large' };
          assert.equal(item.style.height, t[heights[props.size || 'sm']] + 'px');
          assert.equal(item.getAttribute('aria-disabled'), disabled ? 'true' : null);
          const role = radio ? 'menuitemradio' : entry.selected === undefined ? 'menuitem' : 'menuitemcheckbox';
          assert.equal(item.getAttribute('role'), role);
          assert.equal(item.getAttribute('aria-checked'), radio ? String(selected) : entry.selected === undefined ? null : String(selected));
          const labelLeaf = disabled ? 'list_item_label_disabled' : danger ? (index === 0 ? 'menu_item_danger_label_hover' : 'menu_item_danger_label') : selected ? 'menu_item_label_selected' : 'list_item_label';
          const label = parts.label(item);
          assert.equal(label.textContent, entry.label);
          assert.equal(label.style.color, cssValue('color', t['color.' + labelLeaf]));

          // A selectable menu reserves the mark seat for every item, drawn
          // only where the anatomy says `shown`; a non-selectable menu
          // mounts no mark seat
          const selectable = props.items.some(function anySelectable (candidate) {
            return candidate.selected !== undefined || candidate.radioGroup !== undefined ||
              (Array.isArray(candidate.items) && candidate.items.some(anySelectable));
          });
          const marked = Array.from(parts.option(item).querySelectorAll('svg path')).some(function (path) {
            return t['icon.selected_indicator'].paths.some(function (glyph) {
              return path.getAttribute('d') === glyph.d;
            });
          });
          assert.equal(marked === selectable, true, 'the mark seat mounts in a selectable menu');
          if (selectable) {
            const markSvg = parts.option(item).querySelector('svg');
            assert.equal(markSvg === null ? null : markSvg.style.opacity, selected ? '1' : '0', 'the mark shows only on the selected item');
          }
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

        // Each separator reads the member divider cells, margin and rule alike
        for (const divider of parts.dividers()) {
          assert.equal(divider.style.height, t['control.menu_divider_width'] + 'px');
          assert.equal(divider.style.backgroundColor, cssValue('backgroundColor', t['color.menu_divider']));
          assert.equal(divider.style.marginTop, t['control.menu_divider_margin_block'] + 'px');
          assert.equal(divider.style.marginBottom, t['control.menu_divider_margin_block'] + 'px');
        }

        // Group and radio-group wrappers carry `role="group"` and name the run
        for (const item of props.items) {
          const kind = item.group !== undefined ? item.group : item.radioGroup;
          if (kind === undefined) {
            continue;
          }
          const group = parts.surface.querySelector('[role="group"][aria-label="' + kind + '"]');
          assert.notEqual(group, null, 'the ' + kind + ' run mounts role="group" named ' + kind);
        }

        // The border variant outlines the surface; the surface is capped
        assert.equal(parts.surface.style.outlineColor, props.border === true ? cssValue('color', t['color.menu_border']) : '');
        assert.equal(parts.surface.style.outlineWidth, props.border === true ? t['border.width_01'] + 'px' : '');
        assert.equal(parts.surface.style.maxWidth, t['control.menu_max_width'] + 'px');

        // A selected item reads the selected fill and label cells
        if (radioEntry !== undefined || props.items.some(function (item) { return item.selected === true; }) || props.items.some(function (item) { return (item.items || []).some(function (sub) { return sub.selected === true; }); })) {
          const chosen = parts.surface.querySelector('[aria-checked="true"]');
          assert.notEqual(chosen, null, 'the selected option mounts');
          assert.equal(chosen.style.backgroundColor, cssValue('backgroundColor', t['color.menu_item_container_selected']));
          const chosenLabel = chosen.querySelector('[dir="auto"]');
          assert.equal(chosenLabel.style.color, cssValue('color', t['color.menu_item_label_selected']), 'the selected label cell');
        }
      });
    }
  }

});


describe('Menu: the surface floors and the item icon ink come from the theme', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': the surface floors at the menu and icon-menu minimum widths', async function () {
      const t = buildNative(template).tokens;
      const Registry = registryFor(template);
      const plain = await renderMenu(Registry, { items: [{ label: 'A' }, { label: 'B' }], open: true });
      assert.equal(plain.surface.style.minWidth, t['control.menu_min_width'] + 'px');
      const icons = await renderMenu(Registry, { items: [{ label: 'A', icon: 'add' }, { label: 'B' }], open: true });
      assert.equal(icons.surface.style.minWidth, t['control.menu_icon_min_width'] + 'px');
    });

    test(template + ': a width prop fixes the surface\'s width, floored at the minimum', async function () {
      const t = buildNative(template).tokens;
      const fixed = await renderMenu(registryFor(template), { items: [{ label: 'A' }, { label: 'B' }], open: true, width: 217 });
      assert.equal(fixed.surface.style.width, '217px');
      assert.equal(fixed.surface.style.minWidth, t['control.menu_min_width'] + 'px');
      const natural = await renderMenu(registryFor(template), { items: [{ label: 'A' }], open: true });
      assert.equal(natural.surface.style.width, '');
    });

    test(template + ': the item icon reads the menu icon cells, hover and disabled included', async function () {
      const t = buildNative(template).tokens;
      const parts = await renderMenu(registryFor(template), {
        items: [{ label: 'A', icon: 'add' }, { label: 'B', disabled: true, icon: 'add' }],
        open: true
      });
      const items = parts.items();
      const icon = function (item) {
        return parts.option(item).querySelector('svg');
      };
      assert.equal(icon(items[0]).getAttribute('fill'), t['color.menu_item_icon']);
      assert.equal(icon(items[1]).getAttribute('fill'), t['color.menu_item_icon_disabled']);
      await act(async function () {
        items[0].dispatchEvent(new Event('pointerover', { bubbles: true }));
      });
      assert.equal(icon(items[0]).getAttribute('fill'), t['color.menu_item_icon_hover']);
    });

    test(template + ': the item shortcut reads the menu shortcut type and ink cells', async function () {
      const t = buildNative(template).tokens;
      const parts = await renderMenu(registryFor(template), {
        items: [{ label: 'A', shortcut: 'Ctrl+A' }],
        open: true
      });
      const runs = parts.items()[0].querySelectorAll('[dir="auto"]');
      const shortcut = runs[runs.length - 1];
      const type = t['type.menu_item_shortcut'];
      assert.equal(shortcut.style.fontSize, type.fontSize + 'px');
      assert.equal(shortcut.style.lineHeight, type.lineHeight + 'px');
      assert.equal(shortcut.style.fontWeight, String(type.fontWeight));
      assert.equal(shortcut.style.color, cssValue('color', t['color.menu_item_shortcut']));
      await act(async function () {
        parts.items()[0].dispatchEvent(new Event('pointerover', { bubbles: true }));
      });
      assert.equal(shortcut.style.color, cssValue('color', t['color.menu_item_shortcut_hover']));
    });
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


describe('Menu: a focused danger item draws the ring, the fill and the label cell', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': danger focus draws fill, white label and the inset ring', async function () {
      const t = buildNative(template).tokens;
      const Registry = registryFor(template);
      const parts = await renderMenu(Registry, { items: [{ danger: true, label: 'Delete' }, { label: 'Archive' }], open: true });
      const item = parts.items()[0];
      await act(async function () {
        item.dispatchEvent(new Event('focus', { bubbles: false }));
      });
      assert.equal(item.style.backgroundColor, cssValue('backgroundColor', t['color.menu_item_danger_container_hover']), 'the danger fill');
      const label = parts.label(item);
      assert.equal(label.style.color, cssValue('color', t['color.menu_item_danger_label_hover']), 'the danger label on focus');
      assert.equal(item.style.boxShadow.includes('inset'), true, 'the inset ring draws');
      assert.equal(item.style.boxShadow.includes(String(t['color.menu_item_danger_focus_inset'])), true, 'the ring colour');
      assert.equal(item.style.boxShadow.includes(' ' + t['control.menu_item_danger_focus_inset_width'] + 'px '), true, 'the ring width');
    });
  }

});

describe('Menu: a nested selectable still reserves the mark seat', function () {

  test('a menu whose only selectable sits inside a group reserves the seat on a plain top-level item', async function () {
    const parts = await renderMenu(registryFor('carbon'), {
      items: [
        { label: 'Plain' },
        { group: 'Views', items: [{ label: 'Grid view', selected: true }] }
      ],
      open: true,
      x: 8,
      y: 8
    });
    const item = parts.items()[0];
    assert.notEqual(parts.mark(item).querySelector('svg'), null, 'the plain top-level item mounts the mark seat');
  });

});
