// Info: HeaderNavigation member. Every sample state under every template:
// from `breakpoint.lg` a navigation landmark across the header's height,
// `control.header_nav_padding_start` after its
// `control.header_nav_divider_height` rule in `color.header_border`,
// holding the links and menus of `items`; below lg nothing.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/header/sample.header-navigation.js';
import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { BAR, inBar, TEMPLATE_NAMES, atWindow, registryFor, renderSample, sides } from './header-shared.js';

afterEach(cleanup);

const LG = sides('lg');

describe('HeaderNavigation: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the menu bar comes from the theme', async function () {
        const t = buildNative(template).tokens;
        await atWindow(LG.above, async function () {
          const container = await renderSample(registryFor(template), 'HeaderNavigation', state);
          const nav = container.querySelector(inBar('nav'));
          assert.equal(nav !== null, true, 'the landmark from lg');
          assert.equal(nav.getAttribute('aria-label'), 'Acme Platform');
          assert.equal(nav.style.paddingLeft, t['control.header_nav_padding_start'] + 'px');
          const rule = nav.firstChild;
          assert.equal(rule.getAttribute('aria-hidden'), 'true');
          assert.equal(rule.style.height, t['control.header_nav_divider_height'] + 'px');
          assert.equal(rule.style.width, t['border.width_01'] + 'px');
          assert.equal(rule.style.marginTop, (-t['control.header_nav_divider_height'] / 2) + 'px', 'centered on the block axis');
          assert.equal(rule.style.backgroundColor, cssValue('backgroundColor', t['color.header_border']));
          const entries = nav.lastChild.children;
          assert.equal(entries.length, state.props.items.length);
          for (let index = 0; index < state.props.items.length; index++) {
            const item = state.props.items[index];
            const isMenu = Array.isArray(item.items);
            assert.equal(entries[index].querySelector('[aria-haspopup="menu"]') !== null, isMenu, 'a menu or a link');
            assert.equal(entries[index].textContent, item.label);
          }
        });
      });
    }
  }

  test('below lg the menu bar is not drawn', async function () {
    await atWindow(LG.below, async function () {
      const container = await renderSample(registryFor('carbon'), 'HeaderNavigation', SAMPLE[0]);
      assert.equal(container.querySelector(BAR) !== null, true);
      assert.equal(container.querySelector('nav') === null, true);
    });
  });

});
