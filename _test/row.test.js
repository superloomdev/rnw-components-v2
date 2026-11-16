// Row row tests: the row pulls back by half the regular gutter in every
// grid kind (upstream `Row.json`: rows margin-left -16 in default,
// condensed and narrow); a condensed grid pads its columns' block ends by
// half the condensed gutter (`_flex-grid.scss:317-319`).
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
  test('a condensed grid pads each column block end by half the condensed gutter, the others not at all', async function () {
    const Registry = buildSystem('carbon', factories);
    const block = buildNative('carbon').tokens['grid.gutter_condensed'] / 2;
    for (const kind of ['condensed', 'narrow', 'default']) {
      const container = await render(React.createElement(Registry.Grid, kind === 'default' ? {} : { [kind]: true },
        React.createElement(Registry.Row, { columns: [{ children: 'Column' }] })));
      const column = container.querySelector('[data-part="column"]');
      const expected = kind === 'condensed' ? block + 'px' : '0px';
      assert.equal(column.style.paddingTop, expected, kind + ': top');
      assert.equal(column.style.paddingBottom, expected, kind + ': bottom');
      await cleanup();
    }
  });
});
