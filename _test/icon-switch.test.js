// Info: IconSwitch member. The icon-only segment of a ContentSwitcher,
// named by `label` through the tooltip.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/content-switcher/sample.icon-switch.js';
import { TEMPLATES, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

function registryFor (template) {
  return buildSystem(template, factories);
}


describe('IconSwitch: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the segment draws its icon and name', async function () {
        const container = await render(React.createElement(registryFor(template).IconSwitch, state.props));
        const segment = container.querySelector('[role="tab"]');
        assert.notEqual(segment, null);
        assert.equal(segment.getAttribute('aria-label'), state.props.label);
      });
    }
  }

  test('the anchor keeps its content size unless flexed', async function () {
    const plain = await render(React.createElement(registryFor('carbon').IconSwitch, { icon: 'add', label: 'One' }));
    assert.equal(plain.firstElementChild.style.flexBasis, '', 'an unflexed segment keeps its content basis');
    await cleanup();
    const flexed = await render(React.createElement(registryFor('carbon').IconSwitch, { icon: 'add', label: 'One', flex: true }));
    assert.equal(flexed.firstElementChild.style.flexBasis, '0px', 'a flexed segment shares the row evenly');
    await cleanup();
  });

});
