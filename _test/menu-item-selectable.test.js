// Info: MenuItemSelectable member. A `role="menuitemcheckbox"` entry that
// toggles on and off; `aria-checked` and the selection mark read the
// selected cells.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

describe('MenuItemSelectable: the checkbox role and the mark cells', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': role, aria-checked and the selected cells', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const container = await render(React.createElement(Registry.Menu, {
        accessibilityLabel: 'Views',
        items: [{ label: 'List view', selected: false }, { label: 'Grid view', selected: true }],
        open: true
      }));
      const items = container.querySelectorAll('[role="menuitemcheckbox"]');
      assert.equal(items.length, 2, 'two checkbox options');
      assert.equal(items[1].getAttribute('aria-checked'), 'true', 'the selected one is checked');
      assert.equal(items[0].getAttribute('aria-checked'), 'false', 'the other is unchecked');
      assert.equal(items[1].previousElementSibling.style.backgroundColor, cssValue('backgroundColor', t['color.menu_item_container_selected']), 'the selected fill cell');
      const label = items[1].previousElementSibling.querySelector('[dir="auto"]');
      assert.equal(label.style.color, cssValue('color', t['color.menu_item_label_selected']), 'the selected label cell');
      const mark = items[1].previousElementSibling.querySelector('svg');
      assert.notEqual(mark, null, 'the selection mark draws');
      assert.equal(mark.style.opacity, '1', 'the mark shows on the selected item');
      assert.equal(items[0].previousElementSibling.querySelector('svg').style.opacity, '0', 'and hides on the unselected');
    });
  }

});
