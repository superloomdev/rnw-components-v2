// Card row tests: the footer rule and the clickZone.
import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as factories from 'rnw-components/all';
import { buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';
afterEach(cleanup);
describe('Card: the footer rule', function () {
  test('the footer renders only with bottom actions or a button', async function () {
    const Registry = buildSystem('default', factories);
    const plain = await render(React.createElement(Registry.Card, { children: 'Body', title: 'Title' }));
    assert.equal(plain.querySelector('[data-part="footer"]'), null, 'no footer without actions or a button');
    cleanup();
    const withButton = await render(React.createElement(Registry.Card, { children: 'Body', primaryButtonText: 'Go', title: 'Title' }));
    assert.notEqual(withButton.querySelector('[data-part="footer"]'), null, 'a button draws the footer');
  });
});
