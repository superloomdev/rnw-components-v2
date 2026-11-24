// Info: SideNavHeader member. Every sample state under every template: a
// row at least `control.side_nav_link_height_large` tall,
// `control.side_nav_link_padding_inline` in, the icon and the text in
// `type.side_nav_menu_title` and `color.side_nav_link_label_selected`.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/side-nav/sample.side-nav-header.js';
import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { TEMPLATE_NAMES, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('SideNavHeader: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the header comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const container = await renderSample(registryFor(template), 'SideNavHeader', state);
        const icon = container.querySelector('nav [data-part="icon"]');
        assert.equal(icon !== null, true, 'the icon');
        const row = icon.parentElement;
        assert.equal(row.style.minHeight, t['control.side_nav_link_height_large'] + 'px');
        assert.equal(row.style.paddingLeft, t['control.side_nav_link_padding_inline'] + 'px');
        const text = row.querySelector(':scope > [dir="auto"]');
        assert.equal(text.textContent, state.props.children);
        assert.equal(text.style.fontSize, t['type.side_nav_menu_title'].fontSize + 'px');
        assert.equal(text.style.color, cssValue('color', t['color.side_nav_link_label_selected']));
      });
    }
  }

});
