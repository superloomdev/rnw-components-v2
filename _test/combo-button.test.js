// Info: ComboButton composite. A primary action Button joined to an icon
// button that opens a Menu of further actions, the seats separated by the
// border-width seam; the chevron turns while the menu is open, and the
// plain alignments span the container edge to edge.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

const ITEMS = [
  { label: 'Edit' },
  { label: 'Duplicate' },
  { label: 'Delete', danger: true }
];

afterEach(cleanup);


/********************************************************************
Render a ComboButton and return its container and seats.

@param {Object} Registry - Registry
@param {Object} props    - ComboButton props

@return {Promise<Object>} - { container, root }
*********************************************************************/
async function renderCombo (Registry, props) {

  const container = await render(React.createElement(Registry.ComboButton, props));

  return { container: container, root: container.firstChild };

}


/********************************************************************
Seat the container at a rect: the open measurement reads it.

@param {HTMLElement} root - The container
@param {Object}    rect - The rect to report
*********************************************************************/
function seatAt (root, rect) {

  root.getBoundingClientRect = function () {
    return Object.assign({ x: rect.left, y: rect.top, right: rect.left + rect.width, bottom: rect.top + rect.height }, rect);
  };

}


for (const template of TEMPLATE_NAMES) {

  describe('ComboButton / ' + template, function () {

    test('the seats are a row separated by the border-width seam', async function () {
      const t = buildNative(template).tokens;
      const { root } = await renderCombo(buildSystem(template, factories), { label: 'Create', items: ITEMS });
      assert.equal(root.style.flexDirection, 'row', template);
      assert.equal(root.style.columnGap, t['border.width_01'] + 'px', template);
      assert.equal(root.children.length, 2, 'action and trigger seats, ' + template);
    });

    test('the action holds the combo width window less the seam and the trigger\'s side', async function () {
      const t = buildNative(template).tokens;
      const sides = { xs: 'size.size_small', sm: 'size.size_small', md: 'size.size_medium', lg: 'control.icon_button_size' };
      for (const size of Object.keys(sides)) {
        const { root } = await renderCombo(buildSystem(template, factories), { label: 'Create', items: ITEMS, size: size });
        const action = root.querySelector('[role="button"]');
        const min = t['control.combo_button_min_width'] - t['border.width_01'] - t[sides[size]];
        assert.equal(action.style.minWidth, min + 'px', size + ' min, ' + template);
        assert.equal(action.style.maxWidth, t['control.combo_button_max_width'] - t['border.width_01'] + 'px', size + ' max, ' + template);
      }
    });

    test('the trigger is the primary icon button, labeled and announcing the popup', async function () {
      const { root } = await renderCombo(buildSystem(template, factories), { label: 'Create', items: ITEMS });
      const trigger = root.querySelector('[aria-haspopup]');
      assert.notEqual(trigger, null, template);
      assert.equal(trigger.getAttribute('aria-label'), 'Additional actions', template);
      assert.equal(trigger.getAttribute('aria-expanded'), 'false', template);
      assert.equal(trigger.getAttribute('aria-haspopup'), 'true', template);
    });

    test('the xs size draws the small trigger (there is no extra-small icon button)', async function () {
      const t = buildNative(template).tokens;
      const { root } = await renderCombo(buildSystem(template, factories), { label: 'Create', items: ITEMS, size: 'xs' });
      const face = root.querySelector('[data-testid="icon-button-face"]');
      assert.notEqual(face, null, template);
      assert.equal(face.style.width, t['size.size_small'] + 'px', template);
      assert.equal(face.style.height, t['size.size_small'] + 'px', template);
    });

    test('pressing the action calls onPress, the menu never opens', async function () {
      let pressed = 0;
      const { container, root } = await renderCombo(buildSystem(template, factories), {
        items: ITEMS,
        label: 'Create',
        onPress: function () { pressed += 1; }
      });
      await act(async function () {
        root.querySelector('[role="button"]').click();
      });
      assert.equal(pressed, 1, template);
      assert.equal(container.querySelector('[role="menu"]'), null, template);
    });

    test('pressing the trigger opens the menu against the container\'s edges', async function () {
      const { container, root } = await renderCombo(buildSystem(template, factories), { label: 'Create', items: ITEMS });
      seatAt(root, { left: 100, top: 200, width: 320, height: 48 });
      const trigger = root.querySelector('[aria-haspopup]');
      await act(async function () {
        trigger.click();
      });
      const menu = container.querySelector('[role="menu"]');
      assert.notEqual(menu, null, 'the menu mounts, ' + template);
      assert.equal(trigger.getAttribute('aria-expanded'), 'true', template);
      // `bottom` opens at the container's bottom edge, at its left edge, at
      // its measured width
      assert.equal(menu.style.top, '248px', 'container bottom edge, ' + template);
      assert.equal(menu.style.left, '100px', 'container start edge, ' + template);
      assert.equal(menu.style.width, '320px', 'container width, ' + template);
      // The trigger announces the surface it controls
      const controls = trigger.getAttribute('aria-controls');
      assert.equal(controls !== null && controls.length > 0, true, template);
      assert.equal(container.querySelector('[role="menu"]').id, controls, template);
    });

    test('the chevron turns 180 degrees while the menu is open', async function () {
      const { container, root } = await renderCombo(buildSystem(template, factories), { label: 'Create', items: ITEMS });
      seatAt(root, { left: 0, top: 0, width: 320, height: 48 });
      // The face's second child is the glyph's wrapper (the state layer is first)
      const face = root.querySelector('[data-testid="icon-button-face"]');
      const glyph = face.querySelector('svg').parentElement;
      assert.equal(glyph.style.transform, 'rotate(0deg)', 'resting, ' + template);
      await act(async function () {
        root.querySelector('[aria-haspopup]').click();
      });
      assert.equal(glyph.style.transform, 'rotate(180deg)', 'open, ' + template);
      assert.notEqual(container.querySelector('[role="menu"]'), null, 'menu still open, ' + template);
    });

    test('a -start or -end alignment takes the menu\'s natural width and aligns the matching edge', async function () {
      const { container, root } = await renderCombo(buildSystem(template, factories), {
        items: ITEMS,
        label: 'Create',
        menuAlignment: 'bottom-end'
      });
      seatAt(root, { left: 100, top: 200, width: 320, height: 48 });
      await act(async function () {
        root.querySelector('[aria-haspopup]').click();
      });
      const menu = container.querySelector('[role="menu"]');
      assert.notEqual(menu, null, template);
      assert.equal(menu.style.width, '', 'natural width, ' + template);
      // The surface's end hangs on the container's end
      assert.equal(menu.style.left.endsWith('px'), true, template);
    });

    test('a chosen item reports onChange and closes the menu', async function () {
      let chosen = null;
      const { container, root } = await renderCombo(buildSystem(template, factories), {
        items: ITEMS,
        label: 'Create',
        onChange: function (item) { chosen = item; }
      });
      seatAt(root, { left: 0, top: 0, width: 320, height: 48 });
      await act(async function () {
        root.querySelector('[aria-haspopup]').click();
      });
      const item = container.querySelector('[role="menuitem"]');
      await act(async function () {
        item.click();
      });
      assert.deepEqual(chosen, ITEMS[0], template);
      assert.equal(container.querySelector('[role="menu"]'), null, 'closed after a choice, ' + template);
    });

    test('disabled silences both seats', async function () {
      const { container, root } = await renderCombo(buildSystem(template, factories), {
        disabled: true,
        items: ITEMS,
        label: 'Create'
      });
      const trigger = root.querySelector('[aria-haspopup]');
      await act(async function () {
        trigger.click();
      });
      assert.equal(container.querySelector('[role="menu"]'), null, 'a disabled trigger opens nothing, ' + template);
      assert.equal(trigger.getAttribute('aria-disabled'), 'true', template);
    });

  });

}
