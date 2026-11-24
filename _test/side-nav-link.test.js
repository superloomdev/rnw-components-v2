// Info: SideNavLink member. Every sample state under every template: an
// item holding a link `control.side_nav_link_padding_inline` in from each
// side, at least `control.side_nav_link_height` tall
// (`control.side_nav_link_height_large` when large or in a large item), the
// optional SideNavIcon, the text; current, `aria-current="page"`,
// `color.side_nav_link_container_selected` and the
// `control.side_nav_indicator_width` bar in `color.side_nav_link_indicator`;
// under the pointer `color.side_nav_link_container_hover`, the current link
// too; focused, the `border.width_02` ring in `color.focus` inside its box.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import SAMPLE from '../component/composite/side-nav/sample.side-nav-link.js';
import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { TEMPLATE_NAMES, fire, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('SideNavLink: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the link comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const container = await renderSample(registryFor(template), 'SideNavLink', state);
        const link = container.querySelector('nav a');
        assert.equal(link !== null, true, 'the link');
        assert.equal(link.getAttribute('href'), '#dashboard');
        assert.equal(link.style.paddingLeft, t['control.side_nav_link_padding_inline'] + 'px');
        assert.equal(link.style.paddingRight, t['control.side_nav_link_padding_inline'] + 'px');
        assert.equal(link.style.minHeight, t['control.side_nav_link_height'] + 'px');
        const large = state.props.large === true || state.label === 'inLargeItem';
        assert.equal(link.style.height, large ? t['control.side_nav_link_height_large'] + 'px' : '');
        const current = state.props.isActive === true;
        assert.equal(link.getAttribute('aria-current'), current ? 'page' : null);
        assert.equal(link.style.backgroundColor, current ? cssValue('backgroundColor', t['color.side_nav_link_container_selected']) : 'rgba(0, 0, 0, 0)');
        const bar = link.querySelector('[data-part="indicator"]');
        assert.equal(bar !== null, current, 'the bar for the current page');
        if (bar !== null) {
          assert.equal(bar.style.width, t['control.side_nav_indicator_width'] + 'px');
          assert.equal(bar.style.backgroundColor, cssValue('backgroundColor', t['color.side_nav_link_indicator']));
        }
        const icon = link.querySelector('[data-part="icon"]');
        assert.equal(icon !== null, typeof state.props.icon === 'string', 'the icon with `icon`');
        await fire(link, new Event('mouseenter', { bubbles: false }));
        assert.equal(link.style.backgroundColor, cssValue('backgroundColor', t['color.side_nav_link_container_hover']), 'the hover fill, current or not');
        await fire(link, new Event('mouseleave', { bubbles: false }));
        await act(async function () {
          link.focus();
        });
        assert.equal(link.style.outlineColor, cssValue('outlineColor', t['color.focus']));
        assert.equal(link.style.outlineWidth, t['border.width_02'] + 'px');
        assert.equal(link.style.outlineOffset, (-t['border.width_02']) + 'px');
      });
    }
  }

});
