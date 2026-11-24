// Info: SideNavDivider member. Every sample state under every template: a
// `border.width_01` rule in `color.side_nav_divider`,
// `control.side_nav_divider_margin_block` above and below,
// `control.side_nav_divider_inset` in from each side.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/side-nav/sample.side-nav-divider.js';
import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { TEMPLATE_NAMES, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('SideNavDivider: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the rule comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const container = await renderSample(registryFor(template), 'SideNavDivider', state);
        const rule = container.querySelector('nav [role="separator"]');
        assert.equal(rule !== null, true, 'the rule');
        assert.equal(rule.style.height, t['border.width_01'] + 'px');
        assert.equal(rule.style.marginTop, t['control.side_nav_divider_margin_block'] + 'px');
        assert.equal(rule.style.marginBottom, t['control.side_nav_divider_margin_block'] + 'px');
        assert.equal(rule.style.marginLeft, t['control.side_nav_divider_inset'] + 'px');
        assert.equal(rule.style.marginRight, t['control.side_nav_divider_inset'] + 'px');
        assert.equal(rule.style.backgroundColor, cssValue('backgroundColor', t['color.side_nav_divider']));
      });
    }
  }

});
