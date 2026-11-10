// Tearsheet row tests: the action height cell, the passive close button
// and the one-host stack.
import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as factories from 'rnw-components/all';
import { buildSystem } from './harness/system.js';
import { act } from 'react';
import { React, cleanup, render } from './harness/render.js';
afterEach(cleanup);

describe('Tearsheet: actions and close', function () {

  test('the action row draws the action height cell', async function () {
    const Registry = buildSystem('default', factories);
    const container = await render(React.createElement(Registry.Tearsheet, {
      open: true,
      title: 'Title',
      children: 'Main content',
      actions: [{ label: 'Cancel', kind: 'secondary' }, { label: 'Create', kind: 'primary' }]
    }));
    const button = container.querySelector('[data-part="buttonSet"] [role="button"]');
    assert.notEqual(button, null, 'the action row draws a button');
    assert.match(button.getAttribute('style'), /80px/, 'the action button is the action height cell (80)');
  });

  test('a passive tearsheet draws the close button', async function () {
    const Registry = buildSystem('default', factories);
    const container = await render(React.createElement(Registry.Tearsheet, {
      open: true,
      title: 'Title',
      children: 'Main content'
    }));
    assert.notEqual(container.querySelector('[data-part="close"] [role="button"]'), null, 'the passive tearsheet draws its close button');
  });

  test('a tearsheet with actions draws no close button', async function () {
    const Registry = buildSystem('default', factories);
    const container = await render(React.createElement(Registry.Tearsheet, {
      open: true,
      title: 'Title',
      children: 'Main content',
      actions: [{ label: 'Create', kind: 'primary' }]
    }));
    assert.equal(container.querySelector('[data-part="close"]'), null, 'no close button with actions');
  });

  test('an action press calls the action and does not close the tearsheet', async function () {
    const Registry = buildSystem('default', factories);
    let pressed = 0;
    let closes = 0;
    const container = await render(React.createElement(Registry.Tearsheet, {
      open: true,
      title: 'Title',
      children: 'Main content',
      onClose: function () { closes = closes + 1; },
      actions: [{ label: 'Create', kind: 'primary', onPress: function () { pressed = pressed + 1; } }]
    }));
    const button = container.querySelector('[data-part="buttonSet"] [role="button"]');
    assert.notEqual(button, null, 'the action row draws a button');
    await act(async function () {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(pressed, 1, 'the action press ran');
    assert.equal(closes, 0, 'the action press did not ask for a close');
    assert.notEqual(container.querySelector('[data-part="container"]'), null, 'the tearsheet stays open');
  });

});

describe('Tearsheet: the influencer', function () {

  test('the left influencer box is the cell plus the end rule', async function () {
    const Registry = buildSystem('default', factories);
    const container = await render(React.createElement(Registry.Tearsheet, {
      open: true,
      title: 'Title',
      children: 'Main content',
      influencer: 'Panel',
      actions: [{ label: 'Create', kind: 'primary' }]
    }));
    const influencer = container.querySelector('[data-part="influencer"]');
    assert.notEqual(influencer, null, 'the influencer renders');
    assert.match(influencer.getAttribute('style'), /width:\s*257px/, 'the influencer box is the 256 cell plus the 1px end rule');
  });

});

describe('Tearsheet: the one-host stack', function () {

  test('two hosted tearsheets render: the lower one scaled and taller-floored', async function () {
    const Registry = buildSystem('default', factories);
    const container = await render(React.createElement(Registry.OverlayHost, null,
      React.createElement(Registry.Tearsheet, { open: true, title: 'One', children: 'a' }),
      React.createElement(Registry.Tearsheet, { open: true, title: 'Two', children: 'b' })));
    const containers = container.querySelectorAll('[data-part="container"]');
    assert.equal(containers.length, 2, 'both hosted tearsheets render');
    const styles = Array.prototype.map.call(containers, function (node) { return node.getAttribute('style') || ''; });
    const scaled = styles.filter(function (style) { return style.indexOf('scale') !== -1; });
    assert.equal(scaled.length, 1, 'exactly the lower level scales');
  });

  test('four hosted tearsheets render at most three', async function () {
    const Registry = buildSystem('default', factories);
    const container = await render(React.createElement(Registry.OverlayHost, null,
      React.createElement(Registry.Tearsheet, { open: true, title: 'One', children: 'a' }),
      React.createElement(Registry.Tearsheet, { open: true, title: 'Two', children: 'b' }),
      React.createElement(Registry.Tearsheet, { open: true, title: 'Three', children: 'c' }),
      React.createElement(Registry.Tearsheet, { open: true, title: 'Four', children: 'd' })));
    const containers = container.querySelectorAll('[data-part="container"]');
    assert.ok(containers.length <= 3, 'a fourth hosted tearsheet renders nothing, got ' + containers.length);
  });

});
