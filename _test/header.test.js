// Info: Header composite. Every sample state under every template: a
// banner landmark `control.header_height` tall on `color.header_container`
// with its `border.width_01` rule in `color.header_border`, stacked at
// `stacking.header`; the members it draws from its data. The menu bar is
// drawn from `breakpoint.lg`; a menu button without `isCollapsible` below
// it only, and the name after a collapsible button starts at
// `control.header_name_padding_start_toggle`.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/header/sample.header.js';
import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { BAR, TEMPLATE_NAMES, atWindow, registryFor, renderSample, sides } from './header-shared.js';

afterEach(cleanup);

const LG = sides('lg');

describe('Header: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the bar comes from the theme', async function () {
        const t = buildNative(template).tokens;
        await atWindow(LG.above, async function () {
          const container = await renderSample(registryFor(template), 'Header', state);
          const bar = container.querySelector(BAR);
          assert.equal(bar !== null, true, 'the banner landmark');
          assert.equal(bar.getAttribute('aria-label'), 'Acme Platform');
          assert.equal(bar.style.height, t['control.header_height'] + 'px');
          assert.equal(bar.style.backgroundColor, cssValue('backgroundColor', t['color.header_container']));
          assert.equal(bar.style.borderBottomWidth, t['border.width_01'] + 'px');
          assert.equal(bar.style.borderBottomColor, cssValue('borderBottomColor', t['color.header_border']));
          assert.equal(bar.style.zIndex, String(t['stacking.header']));
          assert.equal(bar.style.flexDirection, 'row');
          const name = bar.querySelector(':scope > a');
          assert.equal(name !== null, state.props.name !== undefined, 'the name when the data names one');
          assert.equal(bar.querySelector('nav') !== null, state.props.navigation !== undefined, 'the menu bar from lg');
          assert.equal(bar.querySelectorAll('button[aria-label="Search"]').length, state.props.actions === undefined ? 0 : 1, 'the actions');
          const toggle = bar.querySelector(':scope > button');
          const collapsible = state.props.menuButton !== undefined && state.props.menuButton.isCollapsible === true;
          assert.equal(toggle !== null, collapsible, 'from lg only a collapsible toggle shows');
          if (name !== null) {
            assert.equal(name.style.paddingLeft, t[collapsible ? 'control.header_name_padding_start_toggle' : 'control.header_name_padding_start'] + 'px', 'the name start');
          }
        });
      });
    }
  }

});


describe('Header: below lg', function () {

  test('the menu bar goes, the toggle shows and the name keeps its start', async function () {
    const t = buildNative('carbon').tokens;
    const state = SAMPLE.find(function (entry) {
      return entry.label === 'menuButton';
    });
    await atWindow(LG.below, async function () {
      const container = await renderSample(registryFor('carbon'), 'Header', state);
      const bar = container.querySelector(BAR);
      assert.equal(bar.querySelector('nav') === null, true, 'no menu bar below lg');
      const toggle = bar.querySelector(':scope > button');
      assert.equal(toggle !== null, true, 'the toggle below lg');
      assert.equal(toggle.getAttribute('aria-label'), 'Open menu');
      assert.equal(bar.querySelector(':scope > a').style.paddingLeft, t['control.header_name_padding_start'] + 'px');
    });
  });

  test('the name after a collapsible toggle starts closer to it', async function () {
    const t = buildNative('carbon').tokens;
    const state = SAMPLE.find(function (entry) {
      return entry.label === 'collapsible';
    });
    await atWindow(LG.below, async function () {
      const container = await renderSample(registryFor('carbon'), 'Header', state);
      const bar = container.querySelector(BAR);
      assert.equal(bar.querySelector(':scope > a').style.paddingLeft, t['control.header_name_padding_start_toggle'] + 'px');
    });
  });

  test('a bar with children draws them after its members', async function () {
    const { React, render } = await import('./harness/render.js');
    const Registry = registryFor('carbon');
    const container = await render(React.createElement(Registry.Header, { name: { label: 'Platform' } }, React.createElement(Registry.Text, { key: 'extra' }, 'Extra')));
    const bar = container.querySelector(BAR);
    assert.equal(bar.lastChild.textContent, 'Extra');
  });

});
