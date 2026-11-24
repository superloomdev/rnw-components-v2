// Info: SideNavMenuItem member. Every sample state under every template: a
// link of an open menu `control.side_nav_link_height` tall from
// `control.side_nav_menu_link_padding_start`, its text in
// `type.side_nav_menu_link` (`type.side_nav_link` when current); current,
// the selected fill kept under the pointer and the bar.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/side-nav/sample.side-nav-menu-item.js';
import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { TEMPLATE_NAMES, fire, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('SideNavMenuItem: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the menu link comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const container = await renderSample(registryFor(template), 'SideNavMenuItem', state);
        const link = container.querySelector('nav button[aria-expanded] + * a');
        assert.equal(link !== null, true, 'the link in the open menu');
        assert.equal(link.style.height, t['control.side_nav_link_height'] + 'px');
        assert.equal(link.style.paddingLeft, t['control.side_nav_menu_link_padding_start'] + 'px');
        const current = state.props.isActive === true;
        const text = link.querySelector('[dir="auto"]');
        assert.equal(text.style.fontWeight, String(t[current ? 'type.side_nav_link' : 'type.side_nav_menu_link'].fontWeight));
        const rest = current ? cssValue('backgroundColor', t['color.side_nav_link_container_selected']) : 'rgba(0, 0, 0, 0)';
        assert.equal(link.style.backgroundColor, rest);
        assert.equal(link.querySelector('[data-part="indicator"]') !== null, current);
        await fire(link, new Event('mouseenter', { bubbles: false }));
        assert.equal(link.style.backgroundColor, current ? rest : cssValue('backgroundColor', t['color.side_nav_link_container_hover']), 'a current menu link keeps its fill');
      });
    }
  }

});
