// Info: HeaderGlobalAction member. Every sample state under every template:
// a `control.header_action_size` button with its glyph at
// `control.header_action_icon_size` in `color.header_action_icon`
// (`_hover`, `_active`, `_selected`), the hover and press fills, the
// `border.width_01` border in `color.focus` under focus; active, the
// selected fill between two `color.header_border` rules; the compact
// tooltip names it.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import SAMPLE from '../component/composite/header/sample.header-global-action.js';
import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { inBar, TEMPLATE_NAMES, fire, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

// react-native-web writes the `transparent` keyword as a zero-alpha color
const CLEAR = 'rgba(0, 0, 0, 0)';

describe('HeaderGlobalAction: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the action comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const container = await renderSample(registryFor(template), 'HeaderGlobalAction', state);
        const button = container.querySelector(inBar('button'));
        assert.equal(button !== null, true);
        assert.equal(button.getAttribute('aria-label'), 'Search');
        const active = state.props.isActive === true;
        assert.equal(button.style.width, t['control.header_action_size'] + 'px');
        assert.equal(button.style.height, t['control.header_action_size'] + 'px');
        assert.equal(button.style.borderTopWidth, t['border.width_01'] + 'px');
        const svg = button.querySelector('svg');
        assert.equal(svg.getAttribute('width'), String(t['control.header_action_icon_size']));
        assert.equal(svg.getAttribute('fill'), t[active ? 'color.header_action_icon_selected' : 'color.header_action_icon']);
        assert.equal(button.style.backgroundColor, active ? cssValue('backgroundColor', t['color.header_action_container_selected']) : CLEAR);
        assert.equal(button.style.borderRightColor, active ? cssValue('borderRightColor', t['color.header_border']) : CLEAR);
        assert.equal(button.style.borderBottomColor, CLEAR);
        await fire(button, new Event('mouseenter', { bubbles: false }));
        assert.equal(button.style.backgroundColor, cssValue('backgroundColor', t['color.header_action_container_hover']));
        assert.equal(button.querySelector('svg').getAttribute('fill'), t['color.header_action_icon_hover']);
        await fire(button, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
        assert.equal(button.style.backgroundColor, cssValue('backgroundColor', t['color.header_action_container_active']));
        assert.equal(button.querySelector('svg').getAttribute('fill'), t['color.header_action_icon_active']);
        await fire(button, new MouseEvent('mouseup', { bubbles: true, button: 0 }));
        await fire(button, new Event('mouseleave', { bubbles: false }));
        await act(async function () {
          button.focus();
        });
        assert.equal(button.style.borderTopColor, cssValue('borderTopColor', t['color.focus']), 'the focus border');
        assert.equal(button.style.borderLeftColor, cssValue('borderLeftColor', t['color.focus']), 'the focus border on every side');
      });
    }
  }

});
