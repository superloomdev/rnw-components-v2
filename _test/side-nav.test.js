// Info: SideNav composite. Every sample state under every template, on
// both sides of `breakpoint.lg`: the drawn width (`control.side_nav_width`,
// `control.side_nav_rail_width`, or 0) on `color.side_nav_container`, the
// overlay in `color.side_nav_overlay` only when open below lg and not
// fixed; the entries from `items`; a link takes focus only while open or a
// rail; a rail opens under the pointer; Escape closes.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import SAMPLE from '../component/composite/side-nav/sample.side-nav.js';
import { buildNative } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';
import { TEMPLATE_NAMES, atWindow, fire, registryFor, renderSample, sides } from './header-shared.js';

afterEach(cleanup);

const LG = sides('lg');

// The drawn width per state and side, in the cascade's order
function expected (t, props, wide) {
  if (props.expanded === true || props.isFixedNav === true) {
    return t['control.side_nav_width'];
  }
  if (props.isPersistent === false) {
    return 0;
  }
  if (props.isRail === true) {
    return t['control.side_nav_rail_width'];
  }
  return wide ? t['control.side_nav_width'] : 0;
}

describe('SideNav: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      for (const side of ['below', 'above']) {
        test(template + ' / ' + state.label + ' / ' + side + ' lg: the drawn width and the overlay', async function () {
          const t = buildNative(template).tokens;
          await atWindow(LG[side], async function () {
            const container = await renderSample(registryFor(template), 'SideNav', state);
            const nav = container.querySelector('nav');
            assert.equal(nav !== null, true, 'the navigation landmark');
            const width = expected(t, state.props, side === 'above');
            assert.equal(nav.style.width, width + 'px');
            assert.equal(nav.style.backgroundColor, cssValue('backgroundColor', t['color.side_nav_container']));
            const movedOut = state.props.isFixedNav === true && state.props.expanded !== true;
            assert.equal(nav.style.marginLeft, movedOut ? (-t['control.side_nav_width']) + 'px' : '0px', 'a closed fixed navigation moved out by its width');
            const text = nav.querySelector('a [dir="auto"]');
            assert.equal(text.style.opacity, width < t['control.side_nav_width'] ? '0' : '1', 'no link text past a narrower edge');
            const overlay = nav.querySelector('[data-part="overlay"]');
            const hasOverlay = state.props.expanded === true && state.props.isFixedNav !== true && side === 'below';
            assert.equal(overlay !== null, hasOverlay, 'the overlay open below lg, not fixed');
            if (overlay !== null) {
              assert.equal(overlay.style.backgroundColor, cssValue('backgroundColor', t['color.side_nav_overlay']));
              assert.equal(overlay.getAttribute('aria-hidden'), 'true');
            }
            assert.equal(nav.querySelectorAll('a').length, 3, 'the three links of the entries');
            assert.equal(nav.querySelectorAll('[role="separator"]').length, 1, 'the divider');
            const open = state.props.expanded === true || state.props.isRail === true;
            assert.equal(nav.querySelector('a').getAttribute('tabindex'), open ? '0' : '-1', 'focus only while open or a rail');
          });
        });
      }
    }
  }

  test('a rail opens under the pointer and closes when it leaves', async function () {
    const t = buildNative('carbon').tokens;
    await atWindow(LG.above, async function () {
      const container = await renderSample(registryFor('carbon'), 'SideNav', SAMPLE[2]);
      const nav = container.querySelector('nav');
      assert.equal(nav.style.width, t['control.side_nav_rail_width'] + 'px');
      await fire(nav, new MouseEvent('pointerover', { bubbles: true }));
      assert.equal(nav.style.width, t['control.side_nav_width'] + 'px');
      await fire(nav, new MouseEvent('pointerout', { bubbles: true, relatedTarget: document.body }));
      assert.equal(nav.style.width, t['control.side_nav_rail_width'] + 'px');
    });
  });

  test('Escape closes an open navigation and reports it', async function () {
    const t = buildNative('carbon').tokens;
    const calls = [];
    await atWindow(LG.below, async function () {
      const Registry = registryFor('carbon');
      const container = await render(React.createElement(Registry.SideNav, {
        defaultExpanded: true,
        items: SAMPLE[0].props.items,
        onToggle: function (value) {
          calls.push(value);
        }
      }));
      const nav = container.querySelector('nav');
      assert.equal(nav.style.width, t['control.side_nav_width'] + 'px');
      await fire(document, new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
      assert.equal(nav.style.width, '0px');
      assert.equal(calls.join(','), 'false');
    });
  });

  test('pressing the overlay calls onOverlayClick', async function () {
    let pressed = 0;
    await atWindow(LG.below, async function () {
      const Registry = registryFor('carbon');
      const container = await render(React.createElement(Registry.SideNav, {
        expanded: true,
        onOverlayClick: function () {
          pressed = pressed + 1;
        }
      }));
      const overlay = container.querySelector('[data-part="overlay"]');
      await act(async function () {
        overlay.click();
      });
      assert.equal(pressed, 1);
    });
  });

});
