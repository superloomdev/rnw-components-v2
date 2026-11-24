// Info: SideNavItem member. Every sample state under every template: a
// list item that clips what it holds, a string in `type.body_compact_01`
// and `color.side_nav_link_label`; `large` makes a link inside it the large
// height.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/side-nav/sample.side-nav-item.js';
import { buildNative } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';
import { TEMPLATE_NAMES, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('SideNavItem: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the item and its text come from the theme', async function () {
        const t = buildNative(template).tokens;
        const container = await renderSample(registryFor(template), 'SideNavItem', state);
        const item = container.querySelector('nav [role="listitem"]');
        assert.equal(item !== null, true, 'the item');
        assert.equal(item.style.overflow === 'hidden' || item.style.overflowX === 'hidden', true, 'the item clips');
        const text = item.querySelector('[dir="auto"]');
        assert.equal(text.textContent, state.props.children);
        assert.equal(text.style.fontSize, t['type.body_compact_01'].fontSize + 'px');
        assert.equal(text.style.color, cssValue('color', t['color.side_nav_link_label']));
      });
    }
  }

  test('a link inside a large item is the large height', async function () {
    const t = buildNative('carbon').tokens;
    const Registry = registryFor('carbon');
    const container = await render(React.createElement(Registry.SideNav, { expanded: true },
      React.createElement(Registry.SideNavItems, null,
        React.createElement(Registry.SideNavItem, { large: true }, React.createElement(Registry.SideNavLink, { href: '#a' }, 'A')))));
    assert.equal(container.querySelector('nav a').style.height, t['control.side_nav_link_height_large'] + 'px');
  });

});
