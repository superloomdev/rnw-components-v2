// Info: CopyButton molecule. A pressable icon square whose Tooltip confirms
// a copy for a moment after it is pressed.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/copy/sample.js';
import { TEMPLATES, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

function registryFor (template) {
  return buildSystem(template, factories);
}

describe('CopyButton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the icon square draws', async function () {
        const container = await render(React.createElement(registryFor(template).CopyButton, state.props));
        const button = container.querySelector('[role="button"]');
        assert.notEqual(button, null);
      });
    }
  }

});


describe('CopyButton: feedback through the DOM', function () {

  test('the press calls onClick once', async function () {
    let calls = 0;
    const container = await render(React.createElement(registryFor('default').CopyButton, {
      iconDescription: 'Copy',
      onClick: function () { calls = calls + 1; }
    }));
    const button = container.querySelector('[role="button"]');
    await act(async function () { button.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    assert.equal(calls, 1);
  });

});

