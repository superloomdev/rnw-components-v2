// Info: MenuButton composite. The trigger is a Button of the named kind
// and size, floored at the member minimum except the ghost kind, its
// chevron turning while open; the menu takes the button's size and, for
// the plain alignments, the trigger's measured width.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/menu/sample.menu-button.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

function registryFor (template) {
  return buildSystem(template, factories);
}

describe('MenuButton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the trigger and the menu read the cells', async function () {
        const t = buildNative(template).tokens;
        const container = await render(React.createElement(registryFor(template).MenuButton, state.props));
        const trigger = container.querySelector('button');
        assert.notEqual(trigger, null, 'the trigger mounts');
        const kind = state.props.kind || 'primary';
        if (kind !== 'ghost' && state.props.disabled !== true) {
          assert.equal(trigger.style.minWidth, t['control.menu_button_min_width'] + 'px', 'the floor applies where measurable');
        }
        const menu = container.querySelector('[role="menu"]');
        const open = state.props.open === true;
        if (open) {
          assert.notEqual(menu, null, 'the menu mounts while open');
          assert.equal(menu.style.backgroundColor, cssValue('backgroundColor', t['color.list_container']), 'the list container fill');
          const size = state.props.size || 'lg';
          const heights = { xs: 'size.size_xsmall', sm: 'control.menu_item_height', md: 'size.size_medium', lg: 'size.size_large' };
          const item = menu.querySelector('[role="menuitem"], [role="menuitemcheckbox"]');
          assert.notEqual(item, null);
          assert.equal(item.style.height, t[heights[size]] + 'px', 'the menu takes the button size');
        } else {
          assert.equal(menu, null, 'closed: no menu');
        }
      });
    }
  }

  test('the chevron turns 180 while open; a choice closes and refocuses the trigger', async function () {
    const chosen = [];
    const container = await render(React.createElement(registryFor('carbon').MenuButton, {
      items: SAMPLE[1].props.items,
      label: 'Actions',
      onChange: function (entry) {
        chosen.push(entry.label);
      }
    }));
    const trigger = container.querySelector('button');
    await act(async function () {
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    const menu = container.querySelector('[role="menu"]');
    assert.notEqual(menu, null, 'the trigger opens the menu');
    const rotator = trigger.querySelector('svg').parentElement;
    assert.ok(rotator.style.transform.includes('180deg'), 'the chevron turns while open');
    const first = menu.querySelector('[role="menuitem"], [role="menuitemcheckbox"]');
    await act(async function () {
      first.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.deepEqual(chosen, ['First action'], 'onChange got the chosen entry');
    assert.equal(container.querySelector('[role="menu"]'), null, 'the choice closes the menu');
    assert.equal(document.activeElement, trigger, 'the choice refocuses the trigger');
  });

});

describe('MenuButton: the menu takes the trigger width', function () {

  test('a bottom menu is exactly the trigger width inside the min/max cells', async function () {
    const container = await render(React.createElement(registryFor('carbon').MenuButton, {
      items: SAMPLE[1].props.items,
      label: 'Actions',
      open: true
    }));
    const menu = container.querySelector('[role="menu"]');
    assert.notEqual(menu, null, 'the menu mounts');
    const trigger = container.querySelector('button');
    trigger.getBoundingClientRect = function () {
      return { x: 37, y: 0, width: 192, height: 48, top: 0, right: 229, bottom: 48, left: 37 };
    };
    container.firstElementChild.getBoundingClientRect = function () {
      return { x: 37, y: 0, width: 320, height: 48, top: 0, right: 357, bottom: 48, left: 37 };
    };
    await act(async function () {
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('scroll'));
    });
    assert.equal(menu.style.width, '192px', 'the menu matches the 192 trigger, not the 320 container');
  });

});

describe('MenuButton: `open` seeds and re-syncs, never locks', function () {

  test('a passed open seeds the menu, and Escape still closes it once', async function () {
    let closed = 0;
    const container = await render(React.createElement(registryFor('carbon').MenuButton, {
      items: SAMPLE[1].props.items,
      label: 'Actions',
      open: true,
      onClose: function () {
        closed += 1;
      }
    }));
    const menu = container.querySelector('[role="menu"]');
    assert.notEqual(menu, null, 'open: true mounts the menu');
    await act(async function () {
      menu.querySelector('[role="menuitem"]').dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    });
    assert.equal(container.querySelector('[role="menu"]'), null, 'Escape closes a seeded menu');
    assert.equal(closed, 1, 'onClose fired once for the open -> close cycle');
  });

  test('a closed seeded menu re-opens when the prop flips back to true', async function () {
    const { createRoot } = await import('react-dom/client');
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      const el = function (open) {
        return React.createElement(registryFor('carbon').MenuButton, { items: SAMPLE[1].props.items, label: 'Actions', open: open });
      };
      await act(async function () { root.render(el(true)); });
      const menu = container.querySelector('[role="menu"]');
      await act(async function () {
        menu.querySelector('[role="menuitem"]').dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
      });
      assert.equal(container.querySelector('[role="menu"]'), null, 'Escape closed the seeded menu');
      await act(async function () { root.render(el(false)); });
      assert.equal(container.querySelector('[role="menu"]'), null, 'open: false keeps it closed');
      await act(async function () { root.render(el(true)); });
      assert.notEqual(container.querySelector('[role="menu"]'), null, 'open: true again re-syncs it open');
    } finally {
      await act(async function () { root.unmount(); });
      container.remove();
    }
  });

});
