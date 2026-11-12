// Row row tests: the row pulls back by half the regular gutter in every
// grid kind (upstream `Row.json`: rows margin-left -16 in default,
// condensed and narrow).
import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as factories from 'rnw-components/all';
import { buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';
afterEach(cleanup);
describe('Row: the negative margins', function () {
  test('the row pulls back by half the gutter under a condensed and a narrow grid', async function () {
    const Registry = buildSystem('carbon', factories);
    const half = buildNative('carbon').tokens['grid.gutter'] / 2;
    for (const kind of ['condensed', 'narrow']) {
      const container = await render(React.createElement(Registry.Grid, { [kind]: true },
        React.createElement(Registry.Row, { columns: [{ children: 'Column' }] })));
      const row = container.querySelector('[data-part="row"]');
      assert.equal(row.style.marginLeft, -half + 'px', kind + ': the row margin is half the regular gutter');
      assert.equal(row.style.marginRight, -half + 'px', kind + ': both sides');
      await cleanup();
    }
  });
});
