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
    await cleanup();
    const withButton = await render(React.createElement(Registry.Card, { children: 'Body', primaryButtonText: 'Go', title: 'Title' }));
    assert.notEqual(withButton.querySelector('[data-part="footer"]'), null, 'a button draws the footer');
  });
});
describe('Card: the click zone', function () {
  test('a clickable card is a button, a group when it holds controls, never a button in a button', async function () {
    const Registry = buildSystem('default', factories);
    const onClick = function () {};
    const bare = await render(React.createElement(Registry.Card, { children: 'Body', clickZone: 'one', onClick: onClick, title: 'Title' }));
    assert.equal(bare.firstElementChild.getAttribute('role'), 'button', 'a card without controls takes the button role');
    await cleanup();
    const holding = await render(React.createElement(Registry.Card, { children: 'Body', clickZone: 'one', onClick: onClick, primaryButtonText: 'Go', title: 'Title' }));
    assert.equal(holding.firstElementChild.getAttribute('role'), 'group', 'a card holding a button takes the group role');
    assert.equal(holding.querySelectorAll('button button, [role="button"] [role="button"]').length, 0, 'no button sits inside another');
    await cleanup();
    const plain = await render(React.createElement(Registry.Card, { children: 'Body', clickZone: 'one', title: 'Title' }));
    assert.equal(plain.firstElementChild.getAttribute('role'), null, 'without onClick the card takes no zone');
  });
});
