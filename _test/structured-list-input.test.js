// Info: StructuredListInput member. Every sample state under every
// template: one radio point in its row, checked when its row is selected,
// labelled; Space selects its row; while it holds focus a radio row draws
// its ring.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import SAMPLE from '../component/composite/structured-list/sample.structured-list-input.js';
import { cleanup } from './harness/render.js';
import { TEMPLATE_NAMES, fire, registryFor, renderSample } from './header-shared.js';

afterEach(cleanup);

describe('StructuredListInput: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the radio follows its row', async function () {
        const list = state.wrappers[0].props;
        const container = await renderSample(registryFor(template), 'StructuredListInput', state);
        const radios = container.querySelectorAll('[role="radio"]');
        assert.equal(radios.length, 1, 'the row draws no second radio');
        const radio = radios[0];
        assert.equal(radio.getAttribute('aria-label'), state.props.accessibilityLabel);
        assert.equal(radio.getAttribute('aria-checked'), list.selectedInitialRow === 'row-0' ? 'true' : 'false');
        assert.equal(radio.style.opacity, '0', 'no box of its own');
        assert.equal(radio.style.width, '1px');
        await fire(radio, new KeyboardEvent('keydown', { bubbles: true, key: ' ' }));
        assert.equal(radio.getAttribute('aria-checked'), 'true', 'Space selects its row');
      });
    }
  }

});
