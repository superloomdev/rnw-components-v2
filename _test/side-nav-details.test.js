// Info: SideNavDetails member. Every sample state under every template:
// `control.side_nav_items_padding_top` above and below,
// `control.side_nav_link_padding_inline` in, a level-2 heading in
// `type.side_nav_menu_title`, the text in `type.side_nav_menu_link`.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/side-nav/sample.side-nav-details.js';
import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { TEMPLATE_NAMES, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('SideNavDetails: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the details come from the theme', async function () {
        const t = buildNative(template).tokens;
        const container = await renderSample(registryFor(template), 'SideNavDetails', state);
        const heading = container.querySelector('nav [role="heading"], nav h2');
        assert.equal(heading !== null, true, 'the heading');
        assert.equal(heading.textContent, state.props.title);
        assert.equal(heading.style.fontSize, t['type.side_nav_menu_title'].fontSize + 'px');
        assert.equal(heading.style.color, cssValue('color', t['color.side_nav_link_label_selected']));
        const block = heading.parentElement;
        assert.equal(block.style.paddingTop, t['control.side_nav_items_padding_top'] + 'px');
        assert.equal(block.style.paddingLeft, t['control.side_nav_link_padding_inline'] + 'px');
        const text = heading.nextElementSibling;
        assert.equal(text.textContent, state.props.children);
        assert.equal(text.style.fontWeight, String(t['type.side_nav_menu_link'].fontWeight));
        assert.equal(text.style.color, cssValue('color', t['color.side_nav_link_label']));
      });
    }
  }

});
