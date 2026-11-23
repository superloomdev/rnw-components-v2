// Info: HeaderGlobalBar member. Every sample state under every template: a
// row that takes the room the header leaves (grow and shrink from a zero
// basis, as upstream's `flex: 1 1 0%`) and seats its actions at its end,
// the last one's tooltip aligned to the end.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/header/sample.header-global-bar.js';
import { cleanup } from './harness/render.js';
import { BAR, TEMPLATE_NAMES, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('HeaderGlobalBar: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the bar seats its actions at its end', async function () {
        const container = await renderSample(registryFor(template), 'HeaderGlobalBar', state);
        const bar = container.querySelector(BAR).firstChild;
        assert.equal(bar.style.flexGrow, '1');
        assert.equal(bar.style.flexShrink, '1');
        assert.equal(bar.style.flexBasis, '0px');
        assert.equal(bar.style.justifyContent, 'flex-end');
        assert.equal(bar.style.alignSelf, 'stretch');
        const buttons = Array.from(bar.querySelectorAll('button'));
        assert.deepEqual(buttons.map(function (button) {
          return button.getAttribute('aria-label');
        }), state.props.actions.map(function (action) {
          return action.label;
        }));
      });
    }
  }

});
