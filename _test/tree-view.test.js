// TreeView row tests: the tree's aria surface, selection and the arrow-key
// walk over the visible enabled nodes.
import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';
import * as factories from 'rnw-components/all';
import { buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';
afterEach(cleanup);
async function keydown (element, key) {
  const event = new KeyboardEvent('keydown', { key: key, bubbles: true, cancelable: true });
  await act(async function () {
    element.dispatchEvent(event);
  });
  return event.defaultPrevented;
}
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
  test('arrow keys move the focus order and aria-selected', async function () {
    const Registry = buildSystem('default', factories);
    const container = await render(React.createElement(Registry.TreeView, { nodes: NODES }));
    const items = container.querySelectorAll('[role="treeitem"]');
    await act(async function () {
      items[0].focus();
    });
    assert.equal(await keydown(items[0], 'ArrowDown'), true);
    assert.equal(document.activeElement === items[1], true, 'ArrowDown moves focus to the second node');
    assert.equal(items[1].getAttribute('tabindex'), '0', 'the focused node is the tab stop');
    assert.equal(items[0].getAttribute('tabindex'), '-1', 'the node left behind is not');
    assert.equal(await keydown(items[1], 'ArrowDown'), true);
    assert.equal(document.activeElement === items[2], true, 'ArrowDown walks into the expanded child');
    assert.equal(await keydown(items[2], 'ArrowDown'), true);
    assert.equal(document.activeElement === items[0], true, 'the disabled node is skipped and the walk wraps');
    assert.equal(await keydown(items[0], 'ArrowUp'), true);
    assert.equal(document.activeElement === items[2], true, 'ArrowUp wraps back past the disabled node');
    // Enter is the node's press: react-native-web starts it on keydown and
    // fires onPress on keyup
    await keydown(items[2], 'Enter');
    await act(async function () {
      items[2].dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true, cancelable: true }));
    });
    assert.equal(items[2].getAttribute('aria-selected'), 'true', 'Enter selects the focused leaf');
    assert.equal(items[0].getAttribute('aria-selected'), 'false', 'single selection leaves the others unselected');
  });
});
