// Info: Grid/Row/Column. The CSS-grid form gives each column its span of
// the track count less the gutter; a span of 0 draws nothing. Column's
// sample draws inside its Grid (`requires_parent`): bare, its auto track
// grows along a column container's height (iOS walk, M6 gate). The grid
// names its breakpoint from the window: the lg window draws the samples'
// lg spans; below md a column that names only lg takes one of four tracks
// and the grid has no margin (plan 0162 U4d).

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/grid/sample.grid.js';
import COLUMN_SAMPLE from '../component/molecule/grid/sample.column.js';
import { TEMPLATES, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

afterEach(cleanup);

// Run a body in a window of the given width, restoring the window after
async function inWindow (width, body) {
  const before = window.innerWidth;
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width, writable: true });
  try {
    await body();
  } finally {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: before, writable: true });
  }
}

describe('Grid: every sample state under every template', function () {
  for (const template of Object.keys(TEMPLATES)) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the columns take the lg span of 16', async function () {
        await inWindow(1280, async function () {
          const Registry = buildSystem(template, factories);
          const container = await render(React.createElement(Registry.Grid, state.props));
          const cols = Array.from(container.firstElementChild.children);
          assert.equal(cols.length, state.props.columns.length);
          if (state.label === 'default') {
            assert.equal(cols[0].style.width, '25%', 'a span of 4 of 16 takes a quarter track');
          }
        });
      });
    }
    test(template + ' / default: a span of 0 draws nothing', async function () {
      await inWindow(1280, async function () {
        const Registry = buildSystem(template, factories);
        const container = await render(React.createElement(Registry.Grid, { columns: [{ children: 'A', lg: 0 }, { children: 'B', lg: 4 }] }));
        assert.equal(container.firstElementChild.children.length, 1);
      });
    });
    test(template + ' / default below md: an lg-only column takes one of four tracks, the grid no margin', async function () {
      await inWindow(375, async function () {
        const Registry = buildSystem(template, factories);
        const container = await render(React.createElement(Registry.Grid, SAMPLE[0].props));
        const grid = container.firstElementChild;
        assert.equal(grid.children[0].style.width, '25%', 'one track of the four sm tracks');
        assert.equal(grid.style.paddingLeft, '0px', 'grid.margin_sm');
      });
    });
  }
});

describe('Column: the sample draws inside its Grid', function () {
  test('carbon / default: the wrapper is a Grid, whose row the auto track grows along', async function () {
    const Registry = buildSystem('carbon', factories);
    const state = COLUMN_SAMPLE[0];
    const wrappers = Array.isArray(state.wrappers) ? state.wrappers : [];
    assert.equal(wrappers.length, 1, 'one parent wrapper');
    assert.equal(wrappers[0].component, 'Grid');
    const element = wrappers.reduceRight(function (child, wrapper) {
      return React.createElement(Registry[wrapper.component], wrapper.props, child);
    }, React.createElement(Registry.Column, state.props));
    const container = await render(element);
    const track = container.querySelector('[data-part="column"]').parentElement;
    assert.equal(track.style.flexGrow, '1', 'the auto track grows');
    assert.equal(track.parentElement.getAttribute('data-part'), 'grid');
    assert.equal(track.parentElement.style.flexDirection, 'row', 'along the grid row');
  });
});
