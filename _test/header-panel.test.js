// Info: HeaderPanel member. Every sample state under every template:
// expanded, a `control.header_panel_width` column from
// `control.header_height` to the bottom of the space at its end edge, on
// `color.header_panel_container` between two `border.width_01` rules in
// `color.header_border`, its text in `color.header_panel_label`, stacked at
// `stacking.header`; collapsed nothing. Escape calls `onHeaderPanelFocus`.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/header/sample.header-panel.js';
import { buildNative } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';
import { TEMPLATE_NAMES, fire, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('HeaderPanel: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the panel comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const container = await renderSample(registryFor(template), 'HeaderPanel', state);
        const panel = container.querySelector('[data-testid="header-panel"]');
        const expanded = state.props.expanded === true;
        assert.equal(panel !== null, expanded, 'drawn while expanded only');
        if (expanded) {
          assert.equal(panel.style.width, t['control.header_panel_width'] + 'px');
          assert.equal(panel.style.top, t['control.header_height'] + 'px');
          assert.equal(panel.style.bottom, '0px');
          assert.equal(panel.style.right, '0px');
          assert.equal(panel.style.position, 'absolute');
          assert.equal(panel.style.backgroundColor, cssValue('backgroundColor', t['color.header_panel_container']));
          assert.equal(panel.style.borderLeftWidth, t['border.width_01'] + 'px');
          assert.equal(panel.style.borderLeftColor, cssValue('borderLeftColor', t['color.header_border']));
          assert.equal(panel.style.borderRightColor, cssValue('borderRightColor', t['color.header_border']));
          assert.equal(panel.parentElement.style.zIndex, String(t['stacking.header']));
          const text = panel.querySelector('[dir="auto"]');
          assert.equal(text.textContent, 'Signed in as Ada');
          assert.equal(text.style.color, cssValue('color', t['color.header_panel_label']));
        }
      });
    }
  }

  test('Escape asks the panel to collapse', async function () {
    const Registry = registryFor('carbon');
    const calls = [];
    await render(React.createElement(Registry.HeaderPanel, {
      expanded: true,
      onHeaderPanelFocus: function () {
        calls.push('close');
      }
    }, 'Panel'));
    await fire(document, new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    assert.equal(calls.length, 1);
  });

});
