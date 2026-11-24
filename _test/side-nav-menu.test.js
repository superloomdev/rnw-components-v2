// Info: SideNavMenu member. Every sample state under every template: a
// button `control.side_nav_link_height` tall (`_large` when large),
// `control.side_nav_link_padding_inline` in, the title in
// `type.side_nav_menu_title`, the chevron turned over while open, the
// links from `items` while open at the menu's start
// (`control.side_nav_menu_link_padding_start`, `_icon` after an icon);
// closed holding the current link it is active: the selected fill, the
// bar, the selected label and icon. A press toggles it, Escape closes it.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import SAMPLE from '../component/composite/side-nav/sample.side-nav-menu.js';
import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { TEMPLATE_NAMES, fire, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('SideNavMenu: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the menu comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const container = await renderSample(registryFor(template), 'SideNavMenu', state);
        const button = container.querySelector('nav button[aria-expanded]');
        assert.equal(button !== null, true, 'the menu button');
        const open = state.props.defaultExpanded === true;
        assert.equal(button.getAttribute('aria-expanded'), String(open));
        assert.equal(button.style.height, t[state.props.large === true ? 'control.side_nav_link_height_large' : 'control.side_nav_link_height'] + 'px');
        assert.equal(button.style.paddingLeft, t['control.side_nav_link_padding_inline'] + 'px');
        const title = button.querySelector(':scope > [dir="auto"]');
        assert.equal(title.textContent, 'Resources');
        assert.equal(title.style.fontSize, t['type.side_nav_menu_title'].fontSize + 'px');
        const active = !open && state.props.items.some(function (item) {
          return item.isActive === true;
        });
        assert.equal(button.style.backgroundColor, active ? cssValue('backgroundColor', t['color.side_nav_link_container_selected']) : 'rgba(0, 0, 0, 0)');
        assert.equal(title.style.color, cssValue('color', t[active ? 'color.side_nav_link_label_selected' : 'color.side_nav_link_label']));
        assert.equal(button.querySelector('[data-part="indicator"]') !== null, active, 'the bar while active and closed');
        const links = container.querySelectorAll('nav [role="list"] [role="list"] a');
        assert.equal(links.length, open ? state.props.items.length : 0, 'the links while open');
        if (open) {
          const start = typeof state.props.icon === 'string' ? 'control.side_nav_menu_link_padding_start_icon' : 'control.side_nav_menu_link_padding_start';
          assert.equal(links[0].style.paddingLeft, t[start] + 'px');
          assert.equal(links[0].style.height, t['control.side_nav_link_height'] + 'px');
        }
        await fire(button, new Event('mouseenter', { bubbles: false }));
        assert.equal(button.style.backgroundColor, cssValue('backgroundColor', t[active ? 'color.side_nav_menu_container_selected_hover' : 'color.side_nav_link_container_hover']));
      });
    }
  }

  test('a press toggles the menu and Escape inside it closes it', async function () {
    const container = await renderSample(registryFor('carbon'), 'SideNavMenu', SAMPLE[0]);
    const button = container.querySelector('nav button[aria-expanded]');
    await act(async function () {
      button.click();
    });
    assert.equal(button.getAttribute('aria-expanded'), 'true');
    assert.equal(container.querySelectorAll('nav [role="list"] [role="list"] a').length, 2);
    await fire(button, new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    assert.equal(button.getAttribute('aria-expanded'), 'false');
  });

});
