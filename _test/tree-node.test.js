// TreeNode row tests: the leaf's aria surface inside the tree.
import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as factories from 'rnw-components/all';
import { buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';
afterEach(cleanup);
const NODES = [{ children: [{ id: 'leaf', label: 'Leaf' }], expanded: true, id: 'p', label: 'Parent' }];
describe('TreeNode: the leaf inside the tree', function () {
  test('a leaf at depth 1 reports treeitem without expanded', async function () {
    const Registry = buildSystem('default', factories);
    const container = await render(React.createElement(Registry.TreeView, { nodes: NODES }));
    const items = container.querySelectorAll('[role="treeitem"]');
    assert.equal(items.length, 2, 'the tree shows parent and leaf');
    assert.notEqual(items[1].getAttribute('aria-expanded'), 'true', 'a leaf never reports expanded');
    const label = items[1].querySelector('[data-part="label"]');
    assert.match(label.getAttribute('style'), /margin-(inline-)?start:\s*-56px|margin-left:\s*-56px/, 'the leaf label margin is -56');
    assert.match(label.getAttribute('style'), /padding-(inline-)?start:\s*56px|padding-left:\s*56px/, 'the leaf label padding is 56');
  });
});
