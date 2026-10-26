// Info: MenuItem member. The caret cells on a submenu entry; ArrowRight,
// Enter, Space or a press opens the submenu and focuses its first item;
// ArrowLeft and Escape inside close only the submenu and refocus the
// parent item; hover opens only after the 100 ms delay; placement and
// flip read the submenu-offset cells.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

const SUB_ITEMS = [
  { label: 'Share', items: [{ label: 'Email' }, { label: 'Copy link' }] },
  { label: 'Export' },
  { label: 'Rename' }
];

async function renderSubmenuMenu (template) {
  const Registry = buildSystem(template, factories);
  const container = await render(React.createElement(Registry.Menu, { accessibilityLabel: 'Actions', items: SUB_ITEMS, open: true }));
  const item = container.querySelector('[aria-haspopup="true"]');
  return { container: container, item: item };
}

describe('MenuItem: a submenu entry draws the caret cell', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': the caret is the caret_right glyph at the icon seat size', async function () {
      const t = buildNative(template).tokens;
      const { item } = await renderSubmenuMenu(template);
      assert.equal(item.getAttribute('aria-haspopup'), 'true');
      assert.equal(item.getAttribute('aria-expanded'), 'false');
      const svg = item.querySelector('svg');
      assert.notEqual(svg, null, 'the caret draws');
      const path = svg.querySelector('path');
      assert.equal(t['icon.caret_right'].paths.some(function (glyph) {
        return glyph.d === path.getAttribute('d');
      }), true, 'the caret_right glyph');
      assert.equal(svg.getAttribute('width'), String(t['control.menu_icon_size']));
      assert.equal(svg.getAttribute('fill'), String(t['color.menu_item_icon']));
    });
  }

});

describe('MenuItem: submenu keyboard and pointer behavior', function () {

  test('ArrowRight opens and focuses the first sub-item; ArrowLeft and Escape close only the submenu', async function () {
    const { container, item } = await renderSubmenuMenu('carbon');
    await act(async function () {
      item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    });
    const submenu = container.querySelector('[role="menu"] [role="menu"]');
    assert.notEqual(submenu, null, 'ArrowRight opens the submenu');
    const subItem = submenu.querySelector('[role="menuitem"]');
    assert.equal(document.activeElement, subItem, 'the first sub-item takes focus');
    // ArrowLeft closes only the submenu and refocuses the parent item
    await act(async function () {
      subItem.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowLeft' }));
    });
    assert.equal(container.querySelector('[role="menu"] [role="menu"]'), null, 'the submenu closed');
    assert.notEqual(container.querySelector('[role="menu"]'), null, 'the root stays open');
    assert.equal(document.activeElement, item, 'focus returns to the parent item');
    // Reopen, then Escape closes only the submenu too
    await act(async function () {
      item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    });
    const again = container.querySelector('[role="menu"] [role="menu"]');
    assert.notEqual(again, null, 'the submenu reopened');
    const againItem = again.querySelector('[role="menuitem"]');
    await act(async function () {
      againItem.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    });
    assert.equal(container.querySelector('[role="menu"] [role="menu"]'), null, 'Escape closed the submenu');
    assert.notEqual(container.querySelector('[role="menu"]'), null, 'the root survives the submenu Escape');
    assert.equal(document.activeElement, item, 'Escape refocuses the parent item');
  });

  test('hover opens only after the 100 ms delay: closed inside it', async function () {
    const { container, item } = await renderSubmenuMenu('carbon');
    await act(async function () {
      item.dispatchEvent(new Event('pointerover', { bubbles: true }));
    });
    assert.equal(container.querySelector('[role="menu"] [role="menu"]'), null, 'inside the delay: still closed');
    await act(async function () {
      await new Promise(function (resolve) {
        setTimeout(resolve, 110);
      });
    });
    assert.notEqual(container.querySelector('[role="menu"] [role="menu"]'), null, 'after 100 ms the submenu opens');
  });

  test('a leaf choice inside the submenu reports, closes the submenu and leaves the controlled root open', async function () {
    let closed = 0;
    const chosen = [];
    const Registry = buildSystem('carbon', factories);
    const container = await render(React.createElement(Registry.Menu, {
      accessibilityLabel: 'Actions',
      items: SUB_ITEMS,
      open: true,
      onChange: function (entry) {
        chosen.push(entry.label);
      },
      onClose: function () {
        closed += 1;
      }
    }));
    const item = container.querySelector('[aria-haspopup="true"]');
    await act(async function () {
      item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    });
    const leaf = container.querySelector('[role="menu"] [role="menu"] [role="menuitem"]');
    await act(async function () {
      leaf.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.deepEqual(chosen, ['Email'], 'the leaf entry reports');
    assert.equal(closed, 1, 'onClose fired once');
    assert.equal(container.querySelector('[role="menu"] [role="menu"]'), null, 'the submenu closed');
    assert.notEqual(container.querySelector('[role="menu"]'), null, 'the controlled root stays open');
  });

  test('a leaf choice inside the submenu unmounts an uncontrolled root', async function () {
    function Harness () {
      const [open, setOpen] = React.useState(true);
      return React.createElement(buildSystem('carbon', factories).Menu, {
        accessibilityLabel: 'Actions',
        items: SUB_ITEMS,
        open: open,
        onClose: function () {
          setOpen(false);
        }
      });
    }
    const container = await render(React.createElement(Harness));
    const item = container.querySelector('[aria-haspopup="true"]');
    await act(async function () {
      item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    });
    const leaf = container.querySelector('[role="menu"] [role="menu"] [role="menuitem"]');
    await act(async function () {
      leaf.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(container.querySelector('[role="menu"]'), null, 'the root closed');
  });

});

describe('MenuItem: the submenu placement reads the member cells', function () {

  test('x = itemEnd + submenu_offset_end, y = itemTop + submenu_offset_block', async function () {
    const t = buildNative('carbon').tokens;
    const { container, item } = await renderSubmenuMenu('carbon');
    const rect = { bottom: 82, height: 32, left: 200, right: 300, top: 50, width: 100, x: 200, y: 50 };
    Object.defineProperty(item, 'getBoundingClientRect', { value: function () { return rect; } });
    await act(async function () {
      item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    });
    const submenu = container.querySelector('[role="menu"] [role="menu"]');
    assert.notEqual(submenu, null, 'the submenu opened');
    assert.equal(submenu.style.left, 300 + t['control.menu_submenu_offset_end'] + 'px', 'x = itemEnd + offset_end');
    assert.equal(submenu.style.top, 50 + t['control.menu_submenu_offset_block'] + 'px', 'y = itemTop + offset_block');
  });

  test('past the viewport less the margin it flips: x = itemStart - width - submenu_offset_start', async function () {
    const t = buildNative('carbon').tokens;
    const Registry = buildSystem('carbon', factories);
    const container = await render(React.createElement(Registry.Menu, { accessibilityLabel: 'Actions', items: SUB_ITEMS, open: true }));
    const item = container.querySelector('[aria-haspopup="true"]');
    const rect = { bottom: 82, height: 32, left: 900, right: 1000, top: 50, width: 100, x: 900, y: 50 };
    Object.defineProperty(item, 'getBoundingClientRect', { value: function () { return rect; } });
    // The submenu measures 600 wide: its end-side right edge passes the viewport
    const original = Element.prototype.getBoundingClientRect;
    const restoreRect = function () {
      Element.prototype.getBoundingClientRect = original;
    };
    // The mock follows the element's own `style.left`, so the positioner's
    // re-measure after a flip sees the flipped spot (a static rect would
    // flip it back and forth forever)
    Element.prototype.getBoundingClientRect = function () {
      if (this.getAttribute && this.getAttribute('role') === 'menu' && this.parentElement && this.parentElement.parentElement && this.parentElement.parentElement.getAttribute('aria-haspopup') === 'true') {
        const left = Number.isFinite(parseFloat(this.style.left)) ? parseFloat(this.style.left) : 994;
        return { bottom: 256, height: 200, left: left, right: left + 600, top: 56, width: 600, x: left, y: 56 };
      }
      return original.call(this);
    };
    await act(async function () {
      item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    });
    const submenu = container.querySelector('[role="menu"] [role="menu"]');
    assert.notEqual(submenu, null, 'the submenu opened');
    try {
      assert.equal(submenu.style.left, 900 - 600 - t['control.menu_submenu_offset_start'] + 'px', 'x = itemStart - width - offset_start');
    } finally {
      restoreRect();
    }
  });

  test('a disabled submenu entry ignores press and keys', async function () {
    const Registry = buildSystem('carbon', factories);
    const container = await render(React.createElement(Registry.Menu, {
      accessibilityLabel: 'Actions',
      items: [{ disabled: true, items: [{ label: 'Email' }], label: 'Share' }, { label: 'Export' }],
      open: true
    }));
    const item = container.querySelector('[aria-haspopup="true"]');
    await act(async function () {
      item.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    });
    assert.equal(container.querySelector('[role="menu"] [role="menu"]'), null, 'disabled: no submenu');
  });

});




