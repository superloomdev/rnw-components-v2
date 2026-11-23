// Info: HeaderSideNavItems member. Every sample state under every template:
// below `breakpoint.lg` a list of the header's links as lines, with
// `control.header_side_nav_items_space` under it and, with `hasDivider`, a
// `border.width_01` rule in `color.header_border` halfway into it,
// `control.header_side_nav_divider_inset` in from each side; from lg
// nothing.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/header/sample.header-side-nav-items.js';
import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { TEMPLATE_NAMES, atWindow, registryFor, renderSample, sides } from './header-shared.js';

afterEach(cleanup);

const LG = sides('lg');

describe('HeaderSideNavItems: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the list comes from the theme below lg', async function () {
        const t = buildNative(template).tokens;
        await atWindow(LG.below, async function () {
          const container = await renderSample(registryFor(template), 'HeaderSideNavItems', state);
          const list = container.querySelector('ul, [role="list"]');
          assert.equal(list !== null, true, 'drawn below lg');
          assert.equal(list.style.marginBottom, t['control.header_side_nav_items_space'] + 'px');
          const links = list.querySelectorAll('a');
          assert.equal(links.length, state.props.items.length);
          assert.equal(links[0].style.height, '', 'a line as tall as its text');
          assert.equal(list.querySelectorAll('[aria-current]').length, 1, 'the current link');
          const rule = list.querySelector(':scope > div[aria-hidden="true"]');
          assert.equal(rule !== null, state.props.hasDivider === true, 'the rule with hasDivider');
          if (rule !== null) {
            const inset = t['control.header_side_nav_divider_inset'];
            assert.equal(rule.style.height, t['border.width_01'] + 'px');
            assert.equal(rule.style.left, inset + 'px');
            assert.equal(rule.style.right, inset + 'px');
            assert.equal(rule.style.bottom, (-inset) + 'px');
            assert.equal(rule.style.backgroundColor, cssValue('backgroundColor', t['color.header_border']));
          }
        });
      });
    }
  }

  test('from lg the list is not drawn', async function () {
    await atWindow(LG.above, async function () {
      const container = await renderSample(registryFor('carbon'), 'HeaderSideNavItems', SAMPLE[0]);
      assert.equal(container.querySelector('ul, [role="list"]') === null, true);
    });
  });

});
