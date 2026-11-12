// EmptyState row tests: the action gap between subtitle and the button.
import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as factories from 'rnw-components/all';
import { buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';
afterEach(cleanup);
describe('EmptyState: the action seat', function () {
  test('the action renders an sm tertiary button in its seat', async function () {
    const Registry = buildSystem('default', factories);
    const container = await render(React.createElement(Registry.EmptyState, {
      action: { onClick: function () {}, text: 'Create new' },
      title: 'EmptyState title'
    }));
    const seat = container.querySelector('[data-part="action"]');
    assert.notEqual(seat, null, 'the action seat renders');
    assert.notEqual(seat.querySelector('button'), null, 'a button sits in the seat');
    // Upstream `.c4p--empty-state__action-button` margin-block-end 16, before the link
    const actionGap = buildNative('default').tokens['control.empty_state_action_gap'];
    assert.equal(seat.style.marginBottom, actionGap + 'px', 'the action seat carries the action gap below it');
  });
});
