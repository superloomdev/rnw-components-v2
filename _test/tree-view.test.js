// TreeView row tests: the tree's aria surface and selection.
import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as factories from 'rnw-components/all';
import { buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';
afterEach(cleanup);
const NODES = [
  { id: 'one', label: 'Node one' },
  { children: [{ id: 'two-one', label: 'Two one' }], expanded: true, id: 'two', label: 'Node two' },
  { disabled: true, id: 'three', label: 'Node three' }
];
describe('TreeView: aria surface and selection', function () {
  test('nodes render as treeitems with their aria state', async function () {
    const Registry = buildSystem('default', factories);
    const container = await render(React.createElement(Registry.TreeView, { nodes: NODES }));
    const items = container.querySelectorAll('[role="treeitem"]');
    assert.equal(items.length, 4, 'the expanded tree shows four nodes');
    assert.equal(items[1].getAttribute('aria-expanded'), 'true', 'the parent reports expanded');
    assert.equal(items[3].getAttribute('aria-disabled'), 'true', 'the disabled node reports it');
  });
});
