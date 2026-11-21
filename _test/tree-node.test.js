// TreeNode row tests: the leaf's aria surface inside the tree; a leaf's
// icon keeps the gap on both sides, a parent's only after it
// (`_treeview.scss:216-227`).
import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as factories from 'rnw-components/all';
import { buildNative, buildSystem } from './harness/system.js';
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
describe('TreeNode: the icon', function () {
  test('a leaf icon keeps the gap on both sides, a parent icon only at its end', async function () {
    const Registry = buildSystem('carbon', factories);
    const gap = buildNative('carbon').tokens['control.tree_icon_gap'];
    const nodes = [{ icon: 'document', id: 'leaf', label: 'Leaf' }, { children: [{ id: 'c', label: 'Child' }], expanded: false, icon: 'document', id: 'p', label: 'Parent' }];
    const container = await render(React.createElement(Registry.TreeView, { nodes: nodes }));
    const icons = container.querySelectorAll('[data-part="icon"]');
    assert.equal(icons.length, 2, 'both nodes draw their icon');
    assert.equal(icons[0].style.marginLeft, gap + 'px', 'the leaf icon start gap');
    assert.equal(icons[0].style.marginRight, gap + 'px', 'the leaf icon end gap');
    assert.equal(icons[1].style.marginLeft, '0px', 'the parent icon follows its toggle');
    assert.equal(icons[1].style.marginRight, gap + 'px', 'the parent icon end gap');
  });
});
