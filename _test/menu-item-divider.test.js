// Info: MenuItemDivider member. A `role="separator"` rule on the
// menu-divider cells: the rule's width and color and the block margin
// come from the member cells.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

describe('MenuItemDivider: the rule reads the member divider cells', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': height, color and block margins', async function () {
      const t = buildNative(template).tokens;
      const container = await render(React.createElement(buildSystem(template, factories).MenuItemDivider, {}));
      const rule = container.querySelector('[role="separator"]');
      assert.notEqual(rule, null, 'the separator mounts');
      assert.equal(rule.style.height, t['control.menu_divider_width'] + 'px', 'the rule\'s width cell');
      assert.equal(rule.style.backgroundColor, cssValue('backgroundColor', t['color.menu_divider']), 'the divider color');
      assert.equal(rule.style.marginTop, t['control.menu_divider_margin_block'] + 'px', 'the block margin');
      assert.equal(rule.style.marginBottom, t['control.menu_divider_margin_block'] + 'px', 'the block margin');
    });
  }

});
