// Info: HeaderMenuItem member. Every sample state under every template: a
// link across the bar's height, `control.header_menu_item_padding_inline`
// on both sides, the `control.header_menu_item_focus_width` border in
// `color.focus` under focus, the `type.header_menu_item` label in
// `color.header_menu_item_label` (`_hover`, `_active`) over
// `color.header_menu_item_container` (`_hover`, `_active`); the current
// page's `control.header_menu_item_indicator_width` bar across the border
// under it (beside it in a menu), and the menu row's own height and fills.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import SAMPLE from '../component/composite/header/sample.header-menu-item.js';
import { buildNative } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';
import { inBar, TEMPLATE_NAMES, atWindow, fire, registryFor, renderSample, sides } from './header-shared.js';

afterEach(cleanup);

const LG = sides('lg');

describe('HeaderMenuItem: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the link comes from the theme', async function () {
        const t = buildNative(template).tokens;
        await atWindow(LG.above, async function () {
          const container = await renderSample(registryFor(template), 'HeaderMenuItem', state);
          const link = container.querySelector(inBar('nav a'));
          assert.equal(link !== null, true, 'the link in the menu bar');
          assert.equal(link.getAttribute('href'), '#catalog');
          assert.equal(link.style.paddingLeft, t['control.header_menu_item_padding_inline'] + 'px');
          assert.equal(link.style.paddingRight, t['control.header_menu_item_padding_inline'] + 'px');
          assert.equal(link.style.borderBottomWidth, t['control.header_menu_item_focus_width'] + 'px');
          assert.equal(link.style.backgroundColor, cssValue('backgroundColor', t['color.header_menu_item_container']));
          const label = link.querySelector('[dir="auto"]');
          assert.equal(label.style.fontSize, t['type.header_menu_item'].fontSize + 'px');
          assert.equal(label.style.color, cssValue('color', t['color.header_menu_item_label']), 'the current link keeps the label cell');
          const current = state.props.isActive === true;
          assert.equal(link.getAttribute('aria-current'), current ? 'true' : null);
          const bar = link.querySelector(':scope > div[aria-hidden="true"]');
          assert.equal(bar !== null, current, 'the indicator for the current page');
          if (current) {
            assert.equal(bar.style.height, t['control.header_menu_item_indicator_width'] + 'px');
            assert.equal(bar.style.bottom, (-t['control.header_menu_item_focus_width']) + 'px', 'across the border');
            assert.equal(bar.style.backgroundColor, cssValue('backgroundColor', t['color.header_menu_item_indicator']));
          }
          await fire(link, new Event('mouseenter', { bubbles: false }));
          assert.equal(link.style.backgroundColor, cssValue('backgroundColor', t['color.header_menu_item_container_hover']));
          assert.equal(label.style.color, cssValue('color', t['color.header_menu_item_label_hover']));
          await fire(link, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
          assert.equal(link.style.backgroundColor, cssValue('backgroundColor', t['color.header_menu_item_container_active']));
          assert.equal(label.style.color, cssValue('color', t['color.header_menu_item_label_active']));
          await fire(link, new MouseEvent('mouseup', { bubbles: true, button: 0 }));
          await fire(link, new Event('mouseleave', { bubbles: false }));
          await act(async function () {
            link.focus();
          });
          assert.equal(link.style.borderBottomColor, cssValue('borderBottomColor', t['color.focus']), 'the focus border');
        });
      });
    }
  }

});


describe('HeaderMenuItem: in a menu and in the side navigation', function () {

  test('a menu row is the row height on the menu fills, its current bar at its start', async function () {
    const t = buildNative('carbon').tokens;
    const Registry = registryFor('carbon');
    const container = await render(React.createElement(Registry.HeaderMenuItem, { href: '#a', inMenu: true, isActive: true }, 'Storage'));
    const link = container.querySelector('a');
    assert.equal(link.style.height, t['control.header_menu_item_height'] + 'px');
    assert.equal(link.style.backgroundColor, cssValue('backgroundColor', t['color.header_submenu_item_container_selected']));
    const bar = link.querySelector(':scope > div[aria-hidden="true"]');
    assert.equal(bar.style.width, t['control.header_menu_item_indicator_width'] + 'px');
    assert.equal(bar.style.top, (-t['control.header_menu_item_focus_width']) + 'px');
    await fire(link, new Event('mouseenter', { bubbles: false }));
    assert.equal(link.style.backgroundColor, cssValue('backgroundColor', t['color.header_submenu_item_container_selected_hover']));
    await cleanup();
    const plain = (await render(React.createElement(Registry.HeaderMenuItem, { href: '#b', inMenu: true }, 'Compute'))).querySelector('a');
    assert.equal(plain.style.backgroundColor, cssValue('backgroundColor', t['color.header_menu_container']));
    await fire(plain, new Event('mouseenter', { bubbles: false }));
    assert.equal(plain.style.backgroundColor, cssValue('backgroundColor', t['color.header_submenu_item_container_hover']));
    await fire(plain, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(plain.style.backgroundColor, cssValue('backgroundColor', t['color.header_submenu_item_container_active']));
  });

  test('aria-current page names the page without the bar', async function () {
    const Registry = registryFor('carbon');
    const container = await render(React.createElement(Registry.HeaderMenuItem, { 'aria-current': 'page', href: '#a', isActive: true }, 'Docs'));
    const link = container.querySelector('a');
    assert.equal(link.getAttribute('aria-current'), 'page');
    assert.equal(link.querySelector(':scope > div[aria-hidden="true"]') === null, true);
  });

});
