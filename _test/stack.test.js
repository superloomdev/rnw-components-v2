// Info: Stack, HStack and VStack. The gap is a step of the spacing scale,
// never a free literal; the horizontal orientation is a shrink-wrapped
// row and the vertical the column; the fixed members compose the one
// Stack.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

const STACK_FACTORIES = { HStack: factories.HStack, Stack: factories.Stack, Text: factories.Text, VStack: factories.VStack };


/********************************************************************
Render a Stack and return its root element.

@param {Object} Registry - Registry
@param {Object} props    - Stack props

@return {Promise<HTMLElement>} - The stack element
*********************************************************************/
async function renderStack (Registry, props) {

  const container = await render(React.createElement(Registry.Stack, props));
  return container.firstElementChild;

}


describe('Stack: the gap is a spacing step', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const step of [1, 5, 13]) {
      test(template + ': gap ' + step + ' reads spacing.spacing_' + String(step).padStart(2, '0'), async function () {
        const t = buildNative(template).tokens;
        const Registry = buildSystem(template, STACK_FACTORIES);
        const element = await renderStack(Registry, { gap: step, children: ['a', 'b', 'c'] });
        assert.equal(element.style.flexDirection, 'column');
        assert.equal(element.style.gap, t['spacing.spacing_' + String(step).padStart(2, '0')] + 'px');
      });
    }
  }

  for (const gap of [0, 14, 2.5, -1, '8px', true]) {
    test('gap ' + JSON.stringify(gap) + ' draws no gap', async function () {
      const Registry = buildSystem('default', STACK_FACTORIES);
      const element = await renderStack(Registry, { gap: gap, children: ['a', 'b'] });
      assert.equal(element.style.gap, '');
    });
  }

  test('an absent gap draws none', async function () {
    const Registry = buildSystem('default', STACK_FACTORIES);
    const element = await renderStack(Registry, { children: ['a', 'b'] });
    assert.equal(element.style.gap, '');
  });

});


describe('Stack: orientation', function () {

  test('horizontal lays a shrink-wrapped row', async function () {
    const Registry = buildSystem('default', STACK_FACTORIES);
    const element = await renderStack(Registry, { gap: 3, orientation: 'horizontal', children: ['a', 'b'] });
    assert.equal(element.style.flexDirection, 'row');
    assert.equal(element.style.alignSelf, 'flex-start');
  });

  test('vertical is the default column', async function () {
    const Registry = buildSystem('default', STACK_FACTORIES);
    const element = await renderStack(Registry, { children: ['a', 'b'] });
    assert.equal(element.style.flexDirection, 'column');
    assert.equal(element.style.alignSelf, '');
  });

  test('HStack fixes the row, VStack fixes the column', async function () {
    const Registry = buildSystem('default', STACK_FACTORIES);
    const row = await render(React.createElement(Registry.HStack, { gap: 5, children: ['a', 'b'] }));
    assert.equal(row.firstElementChild.style.flexDirection, 'row');
    assert.equal(row.firstElementChild.style.alignSelf, 'flex-start');
    const column = await render(React.createElement(Registry.VStack, { gap: 5, children: ['a', 'b'] }));
    assert.equal(column.firstElementChild.style.flexDirection, 'column');
  });

  test('string children render through the registry Text', async function () {
    const Registry = buildSystem('default', STACK_FACTORIES);
    const element = await renderStack(Registry, { children: ['a', 'b', 'c'] });
    const texts = Array.from(element.querySelectorAll('[dir="auto"]'));
    assert.equal(texts.length, 3);
    assert.equal(texts[0].textContent, 'a');
  });

  test('numeric children, including zero, render through the registry Text', async function () {
    const Registry = buildSystem('default', STACK_FACTORIES);
    const element = await renderStack(Registry, { children: [0, 7, 'a'] });
    const texts = Array.from(element.querySelectorAll('[dir="auto"]'));
    assert.equal(texts.length, 3);
    assert.equal(texts[0].textContent, '0');
    assert.equal(texts[1].textContent, '7');
  });

});
