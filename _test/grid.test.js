// Info: Grid/Row/Column. The CSS-grid form gives each column its span of
// the track count less the gutter; a span of 0 draws nothing.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/grid/sample.grid.js';
import { TEMPLATES, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

afterEach(cleanup);

describe('Grid: every sample state under every template', function () {
  for (const template of Object.keys(TEMPLATES)) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the columns take the lg span of 16', async function () {
        const Registry = buildSystem(template, factories);
        const container = await render(React.createElement(Registry.Grid, state.props));
        const cols = Array.from(container.firstElementChild.children);
        assert.equal(cols.length, state.props.columns.length);
        if (state.label === 'default') {
          assert.equal(cols[0].style.width, '25%', 'a span of 4 of 16 takes a quarter track');
        }
      });
    }
    test(template + ' / default: a span of 0 draws nothing', async function () {
      const Registry = buildSystem(template, factories);
      const container = await render(React.createElement(Registry.Grid, { columns: [{ children: 'A', lg: 0 }, { children: 'B', lg: 4 }] }));
      assert.equal(container.firstElementChild.children.length, 1);
    });
  }
});
