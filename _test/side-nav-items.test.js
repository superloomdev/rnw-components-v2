// Info: SideNavItems member. Every sample state under every template: a
// list `control.side_nav_items_padding_top` under the navigation's top,
// growing into it, drawing its `items` (links, menus, dividers) and then
// its children.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/side-nav/sample.side-nav-items.js';
import { buildNative } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';
import { TEMPLATE_NAMES, atWindow, registryFor, renderSample, sides } from './header-shared.js';

afterEach(cleanup);

const LG = sides('lg');

describe('SideNavItems: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the list comes from the theme', async function () {
        const t = buildNative(template).tokens;
        await atWindow(LG.above, async function () {
          const container = await renderSample(registryFor(template), 'SideNavItems', state);
          const list = container.querySelector('nav [role="list"], nav ul');
          assert.equal(list !== null, true, 'the list in the navigation');
          assert.equal(list.style.paddingTop, t['control.side_nav_items_padding_top'] + 'px');
          assert.equal(list.style.flexGrow, '1');
          assert.equal(list.querySelectorAll('a').length, state.props.items.length);
        });
      });
    }
  }

  test('menus and dividers come from items, children after them', async function () {
    const Registry = registryFor('carbon');
    const container = await render(React.createElement(Registry.SideNav, { expanded: true },
      React.createElement(Registry.SideNavItems, {
        items: [{ label: 'One', href: '#one' }, { divider: true }, { title: 'Menu', items: [{ label: 'Two', href: '#two' }] }]
      }, React.createElement(Registry.SideNavLink, { href: '#three', key: 'three' }, 'Three'))));
    const list = container.querySelector('nav [role="list"]');
    assert.equal(list.querySelectorAll('[role="separator"]').length, 1);
    assert.equal(list.querySelectorAll('button[aria-expanded]').length, 1);
    const links = Array.from(list.querySelectorAll('a')).map(function (link) {
      return link.getAttribute('href');
    });
    assert.equal(links.join(','), '#one,#three', 'a closed menu draws no link; the child after the items');
  });

});
