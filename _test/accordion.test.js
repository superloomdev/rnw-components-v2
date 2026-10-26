// Info: Accordion composite. A list of headed sections that open and close
// independently, each with a chevron and a divider rule.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/accordion/sample.accordion.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

function registryFor (template) {
  return buildSystem(template, factories);
}

const ITEMS = [
  { title: 'One', children: 'One body.' },
  { title: 'Two', children: 'Two body.' },
  { title: 'Three', children: 'Three body.' }
];

describe('Accordion: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the sections draw a list of headed items', async function () {
        const container = await render(React.createElement(registryFor(template).Accordion, state.props));
        const list = container.querySelector('[role="list"]');
        assert.notEqual(list, null);
        const items = list.querySelectorAll('[role="listitem"]');
        assert.equal(items.length, state.props.items.length);
        const headings = list.querySelectorAll('[role="button"]');
        assert.equal(headings.length, state.props.items.length);
      });
    }
  }

});


describe('Accordion: the divider rule blends under hover', function () {

  test('the next item\'s top rule blends under a hovered heading', async function () {
    function rgb (hex) {
      const n = parseInt(hex.slice(1), 16);
      return 'rgb(' + ((n >> 16) & 255) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255) + ')';
    }
    const hoverColor = rgb(buildNative('default').tokens['color.accordion_divider_hover']);
    const restColor = rgb(buildNative('default').tokens['color.accordion_divider']);
    const container = await render(React.createElement(registryFor('default').Accordion, { items: ITEMS }));
    const items = container.querySelectorAll('[role="listitem"]');
    const headings = container.querySelectorAll('[role="listitem"] [role="button"]');
    assert.equal(items[1].style.borderTopColor, restColor);
    await act(async function () { headings[0].dispatchEvent(new MouseEvent('pointerover', { bubbles: true })); });
    assert.equal(items[1].style.borderTopColor, hoverColor, 'the next item reads the hover divider while item one is hovered');
    await act(async function () { headings[0].dispatchEvent(new MouseEvent('pointerout', { bubbles: true })); });
    assert.equal(items[1].style.borderTopColor, restColor);
  });

});


describe('Accordion: disclosure through the DOM', function () {

  test('pressing a heading opens and closes its item and reports { index, open }', async function () {
    const seen = [];
    const container = await render(React.createElement(registryFor('default').Accordion, {
      items: ITEMS,
      onChange: function (report) { seen.push(report); }
    }));
    const headings = container.querySelectorAll('[role="listitem"] [role="button"]');
    assert.equal(headings[1].getAttribute('aria-expanded'), 'false');
    await act(async function () { headings[1].dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    assert.equal(headings[1].getAttribute('aria-expanded'), 'true');
    assert.equal(seen.length, 1);
    assert.deepEqual(seen[0], { index: 1, open: true });
    await act(async function () { headings[1].dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    assert.equal(headings[1].getAttribute('aria-expanded'), 'false');
  });

  test('a disabled item does not open', async function () {
    const container = await render(React.createElement(registryFor('default').Accordion, {
      items: [{ title: 'One', disabled: true, children: 'body' }, { title: 'Two', children: 'body' }]
    }));
    const headings = container.querySelectorAll('[role="listitem"] [role="button"]');
    await act(async function () { headings[0].dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    assert.equal(headings[0].getAttribute('aria-expanded'), 'false');
  });

});

