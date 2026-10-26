// Info: AccordionSkeleton composite. The placeholder shape of an accordion:
// one section open, its title bar and three content bars.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/accordion/sample.accordion-skeleton.js';
import { TEMPLATES, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

function registryFor (template) {
  return buildSystem(template, factories);
}

describe('AccordionSkeleton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the placeholder items draw', async function () {
        const container = await render(React.createElement(registryFor(template).AccordionSkeleton, state.props));
        const items = container.querySelectorAll('[role="listitem"]');
        assert.equal(items.length, state.props.count || 4);
      });
    }
  }

});

