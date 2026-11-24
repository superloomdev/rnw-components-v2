// Info: SideNavIcon member. Every sample state under every template: a box
// with `control.side_nav_icon_gap` after it centering a
// `control.side_nav_icon_size` glyph; selected in an active menu.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/side-nav/sample.side-nav-icon.js';
import { buildNative } from './harness/system.js';
import { cleanup } from './harness/render.js';
import { TEMPLATE_NAMES, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('SideNavIcon: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the box and the glyph come from the theme', async function () {
        const t = buildNative(template).tokens;
        const container = await renderSample(registryFor(template), 'SideNavIcon', state);
        const box = container.querySelector('nav [data-part="icon"]');
        assert.equal(box !== null, true, 'the icon box');
        assert.equal(box.getAttribute('aria-hidden'), 'true');
        assert.equal(box.style.marginRight, t['control.side_nav_icon_gap'] + 'px');
        assert.equal(box.style.justifyContent, 'center');
        const svg = box.querySelector('svg');
        assert.equal(svg.getAttribute('width'), String(t['control.side_nav_icon_size']));
      });
    }
  }

});
