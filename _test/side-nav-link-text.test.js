// Info: SideNavLinkText member. Every sample state under every template:
// one truncated line in `type.side_nav_link` (`type.side_nav_menu_link` in
// a menu) and `color.side_nav_link_label`, `color.side_nav_link_label_selected`
// when current, `color.side_nav_link_label_hover` under the pointer.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/side-nav/sample.side-nav-link-text.js';
import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { TEMPLATE_NAMES, fire, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('SideNavLinkText: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the text comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const container = await renderSample(registryFor(template), 'SideNavLinkText', state);
        const link = container.querySelector('nav a');
        const text = link.querySelector('[dir="auto"]');
        assert.equal(text.textContent, state.props.children);
        const type = t[state.label === 'inMenu' ? 'type.side_nav_menu_link' : 'type.side_nav_link'];
        assert.equal(text.style.fontSize, type.fontSize + 'px');
        assert.equal(text.style.fontWeight, String(type.fontWeight));
        const current = state.label === 'current';
        assert.equal(text.style.color, cssValue('color', t[current ? 'color.side_nav_link_label_selected' : 'color.side_nav_link_label']));
        if (!current) {
          await fire(link, new Event('mouseenter', { bubbles: false }));
          assert.equal(text.style.color, cssValue('color', t['color.side_nav_link_label_hover']));
        }
      });
    }
  }

});
