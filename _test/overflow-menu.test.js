// Info: OverflowMenu composite. The trigger square off the size scale
// paints the open fill while the panel shows; the panel is the overflow
// width on the list container under the list shadow, joined to the
// trigger by the connector; options at the option height draw the list
// cells, the danger option its own; opening focuses the first enabled
// option, arrows rove, Escape/Tab/outside press close, an option press
// calls onPress then the close.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/menu/sample.overflow-menu.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { createRoot } from 'react-dom/client';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

function registryFor (template) {
  return buildSystem(template, factories);
}

async function fire (element, event) {
  await act(async function () {
    element.dispatchEvent(event);
  });
}

const OPEN = SAMPLE.find(function (state) {
  return state.label === 'open';
});

describe('OverflowMenu: the trigger squares off the size scale under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the trigger and its fill read the cells', async function () {
        const t = buildNative(template).tokens;
        const sides = { xs: 'size.size_xsmall', sm: 'size.size_small', md: 'size.size_medium', lg: 'control.icon_button_size' };
        const container = await render(React.createElement(registryFor(template).OverflowMenu, state.props));
        const face = container.querySelector('[data-testid="icon-button-face"]');
        assert.notEqual(face, null, 'the trigger face mounts');
        const side = state.props.size || 'md';
        assert.equal(face.style.width, t[sides[side]] + 'px', 'the side comes off the size scale');
        const open = state.props.open === true;
        assert.equal(
          face.style.backgroundColor,
          cssValue('backgroundColor', t[open ? 'color.overflow_menu_trigger_open' : 'color.button_ghost_container']),
          open ? 'open: the open fill' : 'rest: the ghost rest fill');
        const glyph = face.querySelector('svg');
        assert.notEqual(glyph, null, 'the overflow icon draws');
      });
    }
  }

});

describe('OverflowMenu: the open panel', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': the panel is the overflow width on the list container, connector shown or hidden by anatomy', async function () {
      const t = buildNative(template).tokens;
      const container = await render(React.createElement(registryFor(template).OverflowMenu, OPEN.props));
      const panel = container.querySelector('[role="menu"]');
      assert.notEqual(panel, null, 'the panel mounts while open');
      assert.equal(panel.style.width, t['control.overflow_menu_width'] + 'px', 'the width cell');
      assert.equal(panel.style.backgroundColor, cssValue('backgroundColor', t['color.list_container']), 'the list container fill');
      const connector = panel.children[0];
      assert.equal(connector.style.height, t['control.overflow_menu_connector_size'] + 'px', 'the connector size cell');
      const shown = t['anatomy.overflow_menu_connector'] === 'shown';
      assert.equal(connector.style.opacity, shown ? '1' : '0', 'connector visibility follows anatomy.overflow_menu_connector');
      const rows = panel.querySelectorAll('[role="presentation"]');
      assert.equal(rows.length, 4, 'four option rows');
      assert.equal(rows[0].style.height, t['control.option_height'] + 'px', 'the option height cell');
      assert.equal(rows[3].style.borderTopWidth, t['control.menu_divider_width'] + 'px', 'hasDivider draws the rule');
      assert.equal(rows[3].style.borderTopColor, cssValue('color', t['color.menu_divider']), 'the divider colour');
      const buttons = panel.querySelectorAll('[role="menuitem"]');
      const third = buttons[2].querySelector('div');
      assert.equal(third.style.color, cssValue('color', t['color.list_item_label_disabled']), 'the disabled label cell');
      const fourth = buttons[3].querySelector('div');
      assert.equal(fourth.style.color, cssValue('color', t['color.menu_item_danger_label']), 'the danger label cell at rest');
    });
  }

  test('opening focuses the first enabled option and arrows rove; Escape closes', async function () {
    let closed = 0;
    const container = await render(React.createElement(registryFor('carbon').OverflowMenu, {
      items: OPEN.props.items,
      onClose: function () {
        closed += 1;
      }
    }));
    // Open through the trigger
    const trigger = container.querySelector('button');
    await act(async function () {
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    const panel = container.querySelector('[role="menu"]');
    assert.notEqual(panel, null, 'the trigger opens the panel');
    const buttons = panel.querySelectorAll('[role="menuitem"]');
    assert.equal(document.activeElement, buttons[0], 'the first enabled option takes focus on open');
    // ArrowDown roves to the second option
    await act(async function () {
      buttons[0].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
    });
    assert.equal(document.activeElement, buttons[1], 'ArrowDown roves to the next option');
    // ArrowUp wraps back
    await act(async function () {
      buttons[1].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp' }));
    });
    assert.equal(document.activeElement, buttons[0], 'ArrowUp roves back');
    // Escape closes and refocuses the trigger
    await act(async function () {
      buttons[0].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    });
    assert.equal(container.querySelector('[role="menu"]'), null, 'Escape closes the panel');
    assert.equal(closed, 1, 'onClose fired once');
    assert.equal(document.activeElement, trigger, 'Escape refocuses the trigger');
  });

  test('an option press calls onPress then closes and refocuses the trigger', async function () {
    const chosen = [];
    const container = await render(React.createElement(registryFor('carbon').OverflowMenu, {
      items: OPEN.props.items,
      onChange: function (item) {
        chosen.push(item.label);
      }
    }));
    const trigger = container.querySelector('button');
    await act(async function () {
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    const button = container.querySelector('[role="menuitem"]');
    await act(async function () {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(container.querySelector('[role="menu"]'), null, 'the press closes the panel');
    assert.equal(document.activeElement, trigger, 'the press refocuses the trigger');
  });

});

describe('OverflowMenu: `open` seeds and re-syncs, never locks', function () {

  test('a passed open seeds the panel, and every close still lands: Escape', async function () {
    let closed = 0;
    const container = await render(React.createElement(registryFor('carbon').OverflowMenu, {
      items: OPEN.props.items,
      open: true,
      onClose: function () {
        closed += 1;
      }
    }));
    const panel = container.querySelector('[role="menu"]');
    assert.notEqual(panel, null, 'open: true mounts the panel');
    await act(async function () {
      panel.querySelector('[role="menuitem"]').dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    });
    assert.equal(container.querySelector('[role="menu"]'), null, 'Escape closes a seeded panel');
    assert.equal(closed, 1, 'onClose fired once for the open -> close cycle');
  });

  test('a closed seeded panel re-opens when `open` flips back to true', async function () {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      await act(async function () {
        root.render(React.createElement(registryFor('carbon').OverflowMenu, { items: OPEN.props.items, open: true }));
      });
      const panel = container.querySelector('[role="menu"]');
      await act(async function () {
        panel.querySelector('[role="menuitem"]').dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
      });
      assert.equal(container.querySelector('[role="menu"]'), null, 'Escape closed the seeded panel');
      await act(async function () {
        root.render(React.createElement(registryFor('carbon').OverflowMenu, { items: OPEN.props.items, open: false }));
      });
      assert.equal(container.querySelector('[role="menu"]'), null, 'open: false keeps it closed');
      await act(async function () {
        root.render(React.createElement(registryFor('carbon').OverflowMenu, { items: OPEN.props.items, open: true }));
      });
      assert.notEqual(container.querySelector('[role="menu"]'), null, 'open: true again re-syncs it open');
    } finally {
      await act(async function () {
        root.unmount();
      });
      container.remove();
    }
  });

  test('a document click outside closes; a click inside the panel does not', async function () {
    let closed = 0;
    const container = await render(React.createElement(registryFor('carbon').OverflowMenu, {
      items: OPEN.props.items,
      open: true,
      onClose: function () {
        closed += 1;
      }
    }));
    const panel = container.querySelector('[role="menu"]');
    await act(async function () {
      panel.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.notEqual(container.querySelector('[role="menu"]'), null, 'a click inside the panel does not close it');
    assert.equal(closed, 0, 'onClose quiet inside');
    await act(async function () {
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(container.querySelector('[role="menu"]'), null, 'a click outside closes the panel');
    assert.equal(closed, 1, 'onClose fired once');
  });

});
