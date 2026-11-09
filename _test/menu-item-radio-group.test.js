// Info: MenuItemRadioGroup member. A named `role="group"` of
// `menuitemradio` options of which exactly one is `aria-checked`.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

describe('MenuItemRadioGroup: the named group of radio options', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': role=group, one checked radio, the cells', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const container = await render(React.createElement(Registry.Menu, {
        accessibilityLabel: 'Actions',
        items: [{ items: ['Small', 'Medium', 'Large'], radioGroup: 'Size', selectedItem: 'Medium' }],
        open: true
      }));
      const group = container.querySelector('[role="group"]');
      assert.notEqual(group, null, 'the radio group mounts role="group"');
      assert.equal(group.getAttribute('aria-label'), 'Size', 'the group is named');
      const options = group.querySelectorAll('[role="menuitemradio"]');
      assert.equal(options.length, 3, 'three radio options');
      assert.equal(options[1].getAttribute('aria-checked'), 'true', 'the selectedItem is checked');
      assert.equal(options[0].getAttribute('aria-checked'), 'false', 'the others are unchecked');
      assert.equal(options[1].previousElementSibling.style.backgroundColor, cssValue('backgroundColor', t['color.menu_item_container_selected']), 'the selected fill cell');
    });
  }

  test('a radio pick reports the picked option', async function () {
    const chosen = [];
    const Registry = buildSystem('carbon', factories);
    const container = await render(React.createElement(Registry.Menu, {
      accessibilityLabel: 'Actions',
      items: [{ items: ['Small', 'Medium', 'Large'], radioGroup: 'Size', selectedItem: 'Medium' }],
      open: true,
      onChange: function (entry) {
        chosen.push(entry.label);
      },
      onClose: function () {
        return undefined;
      }
    }));
    const option = container.querySelectorAll('[role="menuitemradio"]')[2];
    await render;
    await new Promise(function (resolve) {
      option.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      setTimeout(resolve, 0);
    });
    assert.deepEqual(chosen, ['Large'], 'the picked option reports its entry');
  });

});
