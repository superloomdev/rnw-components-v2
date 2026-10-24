// Info: NumberInput molecule. Every sample state renders under all three
// templates through the shared field renderer; the input is a spinbutton
// whose declared bounds follow `min`/`max`; the two stepper actions step and
// clamp the value - a clamped press reports nothing - and report through
// `onChange` as numbers; ArrowUp and ArrowDown step too; the painted divider
// sits between the two action seats; `hideSteppers` removes both.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/number-input/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Build a registry for a template.

@param {String} template - Template name

@return {Object} - Registry
*********************************************************************/
function registryFor (template) {

  return buildSystem(template, factories, { built: buildNative(template) });

}


/********************************************************************
Render one NumberInput and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - NumberInput props

@return {Promise<Object>} - { root, input, decrement, increment, dividers }
*********************************************************************/
async function renderField (Registry, props) {

  const container = await render(React.createElement(Registry.NumberInput, props));
  const buttons = Array.from(container.querySelectorAll('button'));

  return {
    decrement: buttons.find(function (b) { return b.getAttribute('aria-label') === 'Decrement number'; }) || null,
    dividers: Array.from(container.querySelectorAll('[aria-hidden="true"]')).filter(function (el) {
      return Number.parseFloat(el.style.width) === 1;
    }),
    increment: buttons.find(function (b) { return b.getAttribute('aria-label') === 'Increment number'; }) || null,
    input: container.querySelector('input'),
    root: container.firstElementChild
  };

}


/********************************************************************
Type a value into an input the way a user does.

@param {HTMLInputElement} input - The input
@param {String}           text  - Next value
*********************************************************************/
async function type (input, text) {

  await act(async function () {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, text);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

}


/********************************************************************
Send a key to an element.

@param {HTMLElement} el  - The element
@param {String}      key - Key name
*********************************************************************/
async function keydown (el, key) {

  await act(async function () {
    el.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: key }));
  });

}


describe('NumberInput: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': spinbutton, steppers and bounds from the theme', async function () {
        const t = buildNative(template).tokens;
        const parts = await renderField(registryFor(template), state.props);
        assert.equal(parts.input.getAttribute('role'), 'spinbutton');
        const hidden = state.props.hideSteppers === true;
        assert.equal(parts.increment !== null, !hidden, 'steppers present unless hideSteppers');
        assert.equal(parts.decrement !== null, !hidden, 'steppers present unless hideSteppers');
        if (!hidden) {
          assert.ok(Number.parseFloat(parts.increment.style.width) >= t['control.target_min']);
          assert.ok(Number.parseFloat(parts.decrement.style.width) >= t['control.target_min']);
        }
        if (state.props.value !== undefined && state.props.value !== '') {
          assert.equal(parts.input.getAttribute('aria-valuenow'), String(state.props.value));
        }
        if (state.props.max !== undefined) {
          assert.equal(parts.input.getAttribute('aria-valuemax'), String(state.props.max));
        }
      });
    }
  }

});

describe('NumberInput: stepping and clamping', function () {

  test('the steppers step the field and report numbers through onChange', async function () {
    const calls = [];
    const parts = await renderField(registryFor('carbon'), {
      onChange: function (next) { calls.push(next); },
      value: 2
    });
    await act(async function () {
      parts.increment.click();
    });
    assert.deepEqual(calls, [3]);
    await act(async function () {
      parts.decrement.click();
    });
    assert.deepEqual(calls, [3, 1]);
  });

  test('a stepper at the bound reports nothing; the value never passes it', async function () {
    const calls = [];
    const parts = await renderField(registryFor('carbon'), {
      max: 10,
      min: 0,
      onChange: function (next) { calls.push(next); },
      value: 0
    });
    await act(async function () {
      parts.decrement.click();
    });
    assert.deepEqual(calls, [], 'clamped press is a no-op');
  });

  test('step multiplies the delta; ArrowUp and ArrowDown step the input', async function () {
    const calls = [];
    const parts = await renderField(registryFor('carbon'), {
      onChange: function (next) { calls.push(next); },
      step: 5,
      value: 10
    });
    await act(async function () {
      parts.increment.click();
    });
    assert.deepEqual(calls, [15]);
    await keydown(parts.input, 'ArrowUp');
    assert.deepEqual(calls, [15, 15]);
    await keydown(parts.input, 'ArrowDown');
    assert.deepEqual(calls, [15, 15, 5]);
  });

  test('typing keeps the raw text and reports the finite value', async function () {
    const calls = [];
    const text = [];
    const parts = await renderField(registryFor('carbon'), {
      onChange: function (next) { calls.push(next); },
      onChangeText: function (next) { text.push(next); }
    });
    await type(parts.input, '4');
    assert.deepEqual(text, ['4']);
    assert.deepEqual(calls, [4]);
    await type(parts.input, 'abc');
    assert.deepEqual(text, ['4', 'abc']);
    assert.deepEqual(calls, [4], 'a non-finite edit reports no number');
  });

  test('a partial numeric token parses as a whole or not at all', async function () {
    const calls = [];
    const text = [];
    const parts = await renderField(registryFor('carbon'), {
      allowEmpty: true,
      onChange: function (next) { calls.push(next); },
      onChangeText: function (next) { text.push(next); }
    });
    // Prefix parses are not numbers: the whole token must parse
    for (const draft of ['12x', '1e', '0x10', '-']) {
      await type(parts.input, draft);
      assert.equal(parts.input.value, draft, 'raw editing text is preserved');
      assert.deepEqual(calls, [], 'no numeric callback for ' + JSON.stringify(draft));
      assert.equal(parts.input.getAttribute('aria-valuenow'), null, 'no aria-valuenow while unparseable');
    }
    // Whole-token parses report the number
    const expected = { '1.20': 1.2, '1.': 1, '-.5': -0.5, '1e-3': 0.001 };
    for (const draft of ['1.20', '1.', '-.5', '1e-3']) {
      await type(parts.input, draft);
      assert.deepEqual(calls[calls.length - 1], expected[draft], 'reports the parsed ' + draft);
    }
    assert.deepEqual(text.slice(4), ['1.20', '1.', '-.5', '1e-3'], 'the raw text still reports verbatim');
  });

  test('unparseable and forbidden-empty text is invalid; disabled clears it', async function () {
    const parts = await renderField(registryFor('carbon'), { label: 'Q' });
    await type(parts.input, '12x');
    assert.equal(parts.input.getAttribute('aria-invalid'), 'true', 'unparseable text is invalid');
    // An owner that holds the empty string without allowEmpty shows invalid;
    // uncontrolled, an empty request is rewritten to the step start instead
    const empty = await renderField(registryFor('carbon'), { label: 'Q', value: '' });
    assert.equal(empty.input.getAttribute('aria-invalid'), 'true', 'forbidden empty is invalid');
    const allowed = await renderField(registryFor('carbon'), { allowEmpty: true, label: 'Q' });
    await type(allowed.input, '');
    assert.equal(allowed.input.getAttribute('aria-invalid'), null, 'permitted empty is not invalid');
    const disabled = await renderField(registryFor('carbon'), { disabled: true, invalid: true, label: 'Q' });
    assert.equal(disabled.input.getAttribute('aria-invalid'), null, 'a disabled field is not invalid');
  });

  test('decimal stepping keeps precision; scientific and large integers step exactly', async function () {
    const calls = [];
    const parts = await renderField(registryFor('carbon'), {
      onChange: function (next) { calls.push(next); },
      step: 0.1,
      value: 0.1
    });
    await act(async function () {
      parts.increment.click();
    });
    assert.deepEqual(calls, [0.2], '0.1 + 0.1 is 0.2, not 0.30000000000000004');
    const negative = await renderField(registryFor('carbon'), {
      onChange: function (next) { calls.push(next); },
      step: 0.25,
      value: -1.5
    });
    await act(async function () {
      negative.decrement.click();
    });
    assert.deepEqual(calls[calls.length - 1], -1.75, 'a negative decimal steps down exactly');
    const scientific = await renderField(registryFor('carbon'), {
      onChange: function (next) { calls.push(next); },
      step: 1,
      value: 1e-3
    });
    await act(async function () {
      scientific.increment.click();
    });
    assert.deepEqual(calls[calls.length - 1], 1.001, 'scientific text steps from its value');
    const large = await renderField(registryFor('carbon'), {
      onChange: function (next) { calls.push(next); },
      value: 9007199254740990
    });
    await act(async function () {
      large.increment.click();
    });
    assert.deepEqual(calls[calls.length - 1], 9007199254740991, 'the largest safe integer steps by one');
  });

  test('uncontrolled defaultValue seeds the text; empty without allowEmpty resets to the step start', async function () {
    const parts = await renderField(registryFor('carbon'), { defaultValue: 7 });
    assert.equal(parts.input.value, '7');
    await type(parts.input, '');
    assert.equal(parts.input.value, '0', 'forbidden empty rewrites to the step start');
    const allowed = await renderField(registryFor('carbon'), { allowEmpty: true, defaultValue: 7 });
    await type(allowed.input, '');
    assert.equal(allowed.input.value, '', 'allowed empty stays empty');
  });

  test('invalid configuration throws: non-finite bounds, reversed bounds, a bad step', async function () {
    const Registry = registryFor('carbon');
    for (const props of [
      { min: NaN },
      { max: Infinity },
      { max: 1, min: 5 },
      { step: 0 },
      { step: -1 },
      { step: 'a' }
    ]) {
      await assert.rejects(renderField(Registry, props), TypeError, JSON.stringify(props));
    }
  });

  test('the painted divider centers between the two action seats', async function () {
    const parts = await renderField(registryFor('carbon'), { label: 'Q', value: 2 });
    const painted = parts.dividers.filter(function (d) { return d.style.backgroundColor !== 'rgba(0, 0, 0, 0)'; });
    assert.equal(painted.length, 1);
    // 40-point seats, a one-point rule centered on the boundary
    assert.equal(Number.parseFloat(painted[0].style.left), 39.5);
    assert.equal(Number.parseFloat(painted[0].style.height), 16);
  });

  test('the field never narrows below the theme minimum width', async function () {
    const parts = await renderField(registryFor('carbon'), { label: 'Q', value: 2 });
    assert.equal(Number.parseFloat(parts.root.style.minWidth), 150);
  });

  test('disabled marks both actions disabled and untabbable', async function () {
    const parts = await renderField(registryFor('carbon'), { label: 'Q', value: 2, disabled: true });
    for (const action of [parts.decrement, parts.increment]) {
      assert.equal(action.getAttribute('aria-disabled'), 'true');
      assert.equal(action.getAttribute('tabindex'), '-1');
    }
  });

});
