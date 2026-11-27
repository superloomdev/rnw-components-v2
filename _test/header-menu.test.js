// Info: HeaderMenu member. Every sample state under every template: the
// title in the menu bar link's seat with its `chevron_down` arrow at
// `size.icon_01` in `color.header_menu_arrow`; a press opens the
// `control.header_menu_width` list under it on `color.header_menu_container`
// with `shadow.header_menu`, the title on the same fill and the arrow
// turned over; Escape and a second press close it. A closed menu holding a
// current link draws its title current. Hover and press paint the title,
// its label and its arrow, open or closed.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import SAMPLE from '../component/composite/header/sample.header-menu.js';
import { buildNative } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';
import { createSampleElement } from './harness/sample.js';
import { inBar, TEMPLATE_NAMES, atWindow, fire, registryFor, renderSample, sides } from './header-shared.js';

afterEach(cleanup);

const LG = sides('lg');

async function press (element) {
  await act(async function () {
    element.click();
  });
}

describe('HeaderMenu: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the menu comes from the theme', async function () {
        const t = buildNative(template).tokens;
        await atWindow(LG.above, async function () {
          const container = await renderSample(registryFor(template), 'HeaderMenu', state);
          const title = container.querySelector(inBar('nav [aria-haspopup="menu"]'));
          assert.equal(title !== null, true, 'the title');
          assert.equal(title.getAttribute('aria-expanded'), 'false');
          assert.equal(title.style.paddingLeft, t['control.header_menu_item_padding_inline'] + 'px');
          assert.equal(title.style.backgroundColor, cssValue('backgroundColor', t['color.header_menu_item_container']));
          const arrow = title.querySelector('svg');
          assert.equal(arrow.getAttribute('fill'), t['color.header_menu_arrow']);
          assert.equal(arrow.parentElement.style.marginLeft, t['control.header_menu_arrow_gap'] + 'px');
          const holdsCurrent = state.props.items.some(function (item) {
            return item.isActive === true;
          });
          assert.equal(title.querySelector(':scope > div[aria-hidden="true"]') !== null, holdsCurrent, 'a closed menu holding the current link draws its title current');

          // Open: the list under the title, the title on the menu fill
          await press(title);
          assert.equal(title.getAttribute('aria-expanded'), 'true');
          assert.equal(title.style.backgroundColor, cssValue('backgroundColor', t['color.header_menu_container']));
          assert.equal(arrow.parentElement.style.transform.indexOf('180deg') !== -1, true, 'the arrow turned over');
          assert.equal(title.querySelector(':scope > div[aria-hidden="true"]') === null, true, 'an open menu draws the row current instead');
          const list = title.nextSibling;
          assert.equal(list !== null, true, 'the list');
          assert.equal(list.style.width, t['control.header_menu_width'] + 'px');
          assert.equal(list.style.top, '100%');
          assert.equal(list.style.position, 'absolute');
          assert.equal(list.style.backgroundColor, cssValue('backgroundColor', t['color.header_menu_container']));
          assert.equal(list.style.boxShadow.length > 0, true, 'the menu shadow');
          const rows = list.querySelectorAll('a');
          assert.equal(rows.length, state.props.items.length);
          assert.equal(rows[0].style.height, t['control.header_menu_item_height'] + 'px');
          assert.equal(list.querySelectorAll('[aria-current]').length, holdsCurrent ? 1 : 0);

          // Escape closes it
          await fire(document, new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
          assert.equal(title.getAttribute('aria-expanded'), 'false');
          assert.equal(title.nextSibling === null, true, 'no list while closed');
        });
      });
    }
  }

  test('hover and press paint the title, its label and its arrow, open or closed', async function () {
    const t = buildNative('carbon').tokens;
    await atWindow(LG.above, async function () {
      const container = await renderSample(registryFor('carbon'), 'HeaderMenu', SAMPLE[0]);
      const title = container.querySelector('nav [aria-haspopup="menu"]');
      const label = title.querySelector('[dir="auto"]');
      const paint = function (fill, ink, arrow, why) {
        assert.equal(title.style.backgroundColor, cssValue('backgroundColor', t[fill]), why + ' fill');
        assert.equal(label.style.color, cssValue('color', t[ink]), why + ' label');
        assert.equal(title.querySelector('svg').getAttribute('fill'), t[arrow], why + ' arrow');
      };
      await fire(title, new Event('mouseenter', { bubbles: false }));
      paint('color.header_menu_item_container_hover', 'color.header_menu_item_label_hover', 'color.header_menu_arrow_hover', 'closed hover');
      await fire(title, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
      paint('color.header_menu_item_container_active', 'color.header_menu_item_label_active', 'color.header_menu_arrow_active', 'closed press');
      await fire(title, new MouseEvent('mouseup', { bubbles: true, button: 0 }));
      await fire(title, new Event('mouseleave', { bubbles: false }));
      if (title.getAttribute('aria-expanded') !== 'true') {
        await press(title);
      }
      assert.equal(title.getAttribute('aria-expanded'), 'true');
      paint('color.header_menu_container', 'color.header_menu_item_label', 'color.header_menu_arrow', 'open rest');
      await fire(title, new Event('mouseenter', { bubbles: false }));
      paint('color.header_menu_item_container_hover', 'color.header_menu_item_label_hover', 'color.header_menu_arrow_hover', 'open hover');
      await fire(title, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
      paint('color.header_menu_item_container_active', 'color.header_menu_item_label_active', 'color.header_menu_arrow_active', 'open press');
    });
  });

  test('a second press closes the menu; Space toggles it', async function () {
    await atWindow(LG.above, async function () {
      const container = await renderSample(registryFor('carbon'), 'HeaderMenu', SAMPLE[0]);
      const title = container.querySelector('nav [aria-haspopup="menu"]');
      await press(title);
      await press(title);
      assert.equal(title.getAttribute('aria-expanded'), 'false');
      await fire(title, new KeyboardEvent('keydown', { bubbles: true, key: ' ' }));
      assert.equal(title.getAttribute('aria-expanded'), 'true');
    });
  });

});


describe('HeaderMenu: the open list renders through a mounted overlay host', function () {

  test('hosted, the list mounts outside the bar, where a native press reaches it, and focus moving into it keeps it open', async function () {
    await atWindow(LG.above, async function () {
      const Registry = registryFor('carbon');
      const container = await render(React.createElement(Registry.OverlayHost, { testID: 'header-host' }, createSampleElement(React, Registry, 'HeaderMenu', SAMPLE[0])));
      const title = container.querySelector('nav [aria-haspopup="menu"]');
      const menu = title.closest('[role="listitem"]');
      await press(title);
      assert.equal(title.getAttribute('aria-expanded'), 'true');
      const list = container.querySelector('[role="list"][aria-label]');
      assert.equal(list !== null, true, 'the open list mounts');
      assert.equal(menu.contains(list), false, 'the hosted list mounts in the host, not inside the menu');
      assert.equal(container.querySelector('nav').contains(list), false, 'the hosted list is outside the bar\'s bounds');
      const item = list.querySelector('a, [role="link"]');
      const leaving = function (next) {
        const event = new Event('focusout', { bubbles: true });
        Object.defineProperty(event, 'relatedTarget', { value: next });
        return event;
      };
      await fire(title, leaving(item));
      assert.equal(title.getAttribute('aria-expanded'), 'true', 'focus moving into the hosted list keeps the menu open');
      await fire(title, leaving(null));
      assert.equal(title.getAttribute('aria-expanded'), 'false', 'focus leaving the menu closes it');
    });
  });

});
