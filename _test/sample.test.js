// Info: Catalog sample mounting. Every consumer mounts a sample state
// through `createSampleElement`: the component from `state.props` plus
// the `wrappers` composition applied around it. The Heading matrix is
// the proof the wrappers run outside the browser harness too.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { catalog } from 'rnw-components/catalog';
import { buildSystem } from './harness/system.js';
import { createSampleElement } from './harness/sample.js';
import { React, cleanup, render } from './harness/render.js';

afterEach(cleanup);

const HEADING_SAMPLE = catalog.find(function (entry) {
  return entry.name === 'Heading';
}).sample;

// label -> the heading element the state must render
const EXPECTED = {
  'level 1': 'h1',
  'level 2': 'h2',
  'level 3': 'h3',
  'level 6': 'h6',
  'level 7': 'h6'
};


describe('catalog samples: wrappers compose in every consumer', function () {

  const Registry = buildSystem('default', factories);

  for (const state of HEADING_SAMPLE) {
    test('Heading / ' + state.label + ' mounts at ' + EXPECTED[state.label], async function () {
      const container = await render(createSampleElement(React, Registry, 'Heading', state));
      const heading = container.querySelector(EXPECTED[state.label]);
      assert.notEqual(heading, null, 'expected ' + EXPECTED[state.label]);
      assert.equal(heading.getAttribute('aria-level'), EXPECTED[state.label].slice(1));
    });
  }

  test('an unknown wrapper name throws a named TypeError', async function () {
    const state = Object.freeze({
      label: 'bad',
      props: Object.freeze({ children: 'x' }),
      wrappers: Object.freeze([Object.freeze({ component: 'NoSuchComponent', props: Object.freeze({}) })])
    });
    assert.throws(
      function () {
        createSampleElement(React, Registry, 'Heading', state);
      },
      /sample wrapper "NoSuchComponent" of Heading \/ bad is not in the registry/
    );
  });

});
