// Info: Switch member. One text segment of a ContentSwitcher; standing
// alone it draws an unselected segment.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/content-switcher/sample.switch.js';
import { TEMPLATES, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

function registryFor (template) {
  return buildSystem(template, factories);
}


describe('Switch: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the segment draws its label', async function () {
        const container = await render(React.createElement(registryFor(template).Switch, state.props));
        const segment = container.querySelector('[role="tab"]');
        assert.notEqual(segment, null);
        assert.equal(segment.getAttribute('aria-selected'), 'false');
        assert.equal(segment.previousElementSibling.textContent, state.props.text);
      });
    }
  }

});
