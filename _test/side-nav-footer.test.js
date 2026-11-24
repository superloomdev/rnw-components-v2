// Info: SideNavFooter member. Every sample state under every template: a
// toggle `control.side_nav_link_height_large` tall labelled by its
// assistive text, the close glyph while expanded and the chevron
// otherwise, `color.side_nav_link_container_hover` under the pointer; a
// press calls `onToggle`.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import SAMPLE from '../component/composite/side-nav/sample.side-nav-footer.js';
import { buildNative } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';
import { TEMPLATE_NAMES, fire, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('SideNavFooter: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the toggle comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const Registry = registryFor(template);
        const container = await renderSample(Registry, 'SideNavFooter', state);
        const button = container.querySelector('nav button');
        assert.equal(button !== null, true, 'the toggle');
        assert.equal(button.getAttribute('aria-label'), 'Toggle opening or closing the side navigation');
        assert.equal(button.style.height, t['control.side_nav_link_height_large'] + 'px');
        assert.equal(button.style.paddingLeft, t['control.side_nav_link_padding_inline'] + 'px');
        const svg = button.querySelector('svg');
        assert.equal(svg.getAttribute('width'), String(t['control.side_nav_icon_size']));
        assert.equal(svg.getAttribute('fill'), t['color.side_nav_icon']);
        await fire(button, new Event('mouseenter', { bubbles: false }));
        assert.equal(button.style.backgroundColor, cssValue('backgroundColor', t['color.side_nav_link_container_hover']));
      });
    }
  }

  test('the glyph follows expanded and a press calls onToggle', async function () {
    const Registry = registryFor('carbon');
    let toggled = 0;
    const onToggle = function () {
      toggled = toggled + 1;
    };
    const closed = (await render(React.createElement(Registry.SideNavFooter, { onToggle: onToggle }))).querySelector('button svg').innerHTML;
    await cleanup();
    const container = await render(React.createElement(Registry.SideNavFooter, { expanded: true, onToggle: onToggle }));
    const button = container.querySelector('button');
    assert.equal(button.querySelector('svg').innerHTML === closed, false, 'another glyph while expanded');
    await act(async function () {
      button.click();
    });
    assert.equal(toggled, 1);
  });

});
