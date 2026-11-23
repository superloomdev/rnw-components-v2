// Info: HeaderMenuButton member. Every sample state under every template: a
// `control.header_action_size` button with the `menu` glyph (`close` while
// active) at `control.header_action_icon_size` in
// `color.header_menu_button_icon`; the hover and press fills, the focus
// border; active, the selected fill between two `color.header_border`
// rules. Without `isCollapsible` it is drawn below `breakpoint.lg` only.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import SAMPLE from '../component/composite/header/sample.header-menu-button.js';
import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { inBar, TEMPLATE_NAMES, atWindow, fire, registryFor, renderSample, sides } from './header-shared.js';

afterEach(cleanup);

// react-native-web writes the `transparent` keyword as a zero-alpha color
const CLEAR = 'rgba(0, 0, 0, 0)';

const LG = sides('lg');

describe('HeaderMenuButton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the toggle comes from the theme', async function () {
        const t = buildNative(template).tokens;
        await atWindow(LG.below, async function () {
          const container = await renderSample(registryFor(template), 'HeaderMenuButton', state);
          const button = container.querySelector(inBar('> button'));
          assert.equal(button !== null, true, 'drawn below lg');
          const active = state.props.isActive === true;
          assert.equal(button.getAttribute('aria-label'), state.props.accessibilityLabel);
          assert.equal(button.style.width, t['control.header_action_size'] + 'px');
          assert.equal(button.style.height, t['control.header_action_size'] + 'px');
          assert.equal(button.style.borderTopWidth, t['border.width_01'] + 'px');
          const svg = button.querySelector('svg');
          assert.equal(svg.getAttribute('fill'), t['color.header_menu_button_icon']);
          assert.equal(svg.getAttribute('width'), String(t['control.header_action_icon_size']));
          assert.equal(button.style.backgroundColor, active ? cssValue('backgroundColor', t['color.header_action_container_selected']) : CLEAR);
          assert.equal(button.style.borderLeftColor, active ? cssValue('borderLeftColor', t['color.header_border']) : CLEAR);
          assert.equal(button.style.borderBottomColor, CLEAR);
          await fire(button, new Event('mouseenter', { bubbles: false }));
          assert.equal(button.style.backgroundColor, cssValue('backgroundColor', t['color.header_action_container_hover']));
          await fire(button, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
          assert.equal(button.style.backgroundColor, cssValue('backgroundColor', t['color.header_action_container_active']));
          await fire(button, new MouseEvent('mouseup', { bubbles: true, button: 0 }));
          await act(async function () {
            button.focus();
          });
          assert.equal(button.style.borderTopColor, cssValue('borderTopColor', t['color.focus']), 'the focus border');
        });
      });
    }
  }

  test('from lg only the collapsible toggle is drawn', async function () {
    await atWindow(LG.above, async function () {
      for (const state of SAMPLE) {
        const container = await renderSample(registryFor('carbon'), 'HeaderMenuButton', state);
        assert.equal(container.querySelector('button') !== null, state.props.isCollapsible === true, state.label);
        await cleanup();
      }
    });
  });

  test('active draws the close glyph, at rest the menu glyph', async function () {
    await atWindow(LG.below, async function () {
      const rest = await renderSample(registryFor('carbon'), 'HeaderMenuButton', SAMPLE[1]);
      const restPath = rest.querySelector('svg path').getAttribute('d');
      await cleanup();
      const active = await renderSample(registryFor('carbon'), 'HeaderMenuButton', SAMPLE[2]);
      const activePath = active.querySelector('svg path').getAttribute('d');
      assert.equal(restPath.length > 0, true);
      assert.equal(restPath === activePath, false, 'the glyph changes');
    });
  });

});
