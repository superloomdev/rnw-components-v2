// EmptyState row tests: the action gap between subtitle and the button.
import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as factories from 'rnw-components/all';
import { buildSystem } from './harness/system.js';
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
    assert.match(seat.getAttribute('style'), /margin-top:\s*[1-9]/, 'the action seat carries the action gap');
  });
});
