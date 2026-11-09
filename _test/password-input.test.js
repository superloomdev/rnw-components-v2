// Info: PasswordInput molecule. Every sample state renders under all three
// templates through the shared field renderer; the value stays a `password`
// input until the reveal action - named for what it does next - turns it into
// readable text; the action keeps a full-size press target; controlled and
// uncontrolled visibility both report through `onVisibilityChange`.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/text-input/sample.password-input.js';
import REFERENCE from '../component/molecule/text-input/reference.password-input.js';
import { TEMPLATES, buildNative, buildSystem, LESSONS_LAYER } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

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
Render one PasswordInput and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - PasswordInput props

@return {Promise<Object>} - { root, input, action, frame }
*********************************************************************/
async function renderField (Registry, props) {

  const container = await render(React.createElement(Registry.PasswordInput, props));

  return {
    action: container.querySelector('button'),
    frame: container.querySelector('input').parentElement,
    input: container.querySelector('input'),
    root: container.firstElementChild
  };

}


describe('PasswordInput: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the shared field shape with the reveal action', async function () {
        const parts = await renderField(registryFor(template), state.props);
        assert.ok(parts.input);
        assert.equal(parts.input.disabled, state.props.disabled === true);
        assert.equal(parts.action.getAttribute('aria-label'), state.props.visible === true ? 'Hide password' : 'Show password');
      });
    }
  }

});

describe('PasswordInput: the reveal contract', function () {

  test('the value is masked until the reveal action turns it readable, and pressing again masks it', async function () {
    const parts = await renderField(registryFor('carbon'), { label: 'Password', defaultValue: 'secret' });
    assert.equal(parts.input.type, 'password');
    assert.equal(parts.action.getAttribute('aria-label'), 'Show password');
    await act(async function () {
      parts.action.click();
    });
    assert.equal(parts.input.type, 'text');
    assert.equal(parts.action.getAttribute('aria-label'), 'Hide password');
    await act(async function () {
      parts.action.click();
    });
    assert.equal(parts.input.type, 'password');
  });

  test('the action reports every change through onVisibilityChange and owns a minimum press target', async function () {
    const calls = [];
    const parts = await renderField(registryFor('carbon'), {
      label: 'Password',
      onVisibilityChange: function (next) { calls.push(next); },
      value: 'secret'
    });
    const target = buildNative('carbon').tokens['control.target_min'];
    assert.ok(Number.parseFloat(parts.action.style.height) >= target);
    assert.ok(Number.parseFloat(parts.action.style.width) >= target);
    await act(async function () {
      parts.action.click();
    });
    assert.deepEqual(calls, [true]);
  });

  test('controlled visible stays where the owner puts it', async function () {
    const parts = await renderField(registryFor('default'), { label: 'Password', value: 'secret', visible: true });
    assert.equal(parts.input.type, 'text');
    assert.equal(parts.action.getAttribute('aria-label'), 'Hide password');
    await act(async function () {
      parts.action.click();
    });
    // The owner did not move `visible`, so the field stays revealed
    assert.equal(parts.input.type, 'text');
  });

  test('custom names reach the action', async function () {
    const parts = await renderField(registryFor('carbon', undefined, [LESSONS_LAYER]), {
      hidePasswordLabel: 'Mask it',
      label: 'Password',
      showPasswordLabel: 'Reveal it',
      value: 'secret'
    });
    assert.equal(parts.action.getAttribute('aria-label'), 'Reveal it');
  });

  test('disabled locks the input and announces the action disabled', async function () {
    const parts = await renderField(registryFor('carbon'), { label: 'Password', value: 'secret', disabled: true });
    assert.equal(parts.input.disabled, true);
    assert.equal(parts.action.getAttribute('aria-disabled'), 'true');
    assert.equal(parts.action.getAttribute('tabindex'), '-1');
  });

  test('the tooltip anchor measures a real box: the action seat is an in-flow child at the slot height', async function () {
    const parts = await renderField(registryFor('carbon'), { label: 'Password', value: 'secret' });
    // faceBox (absolute) -> seat -> tooltip anchor -> tooltip root -> slot
    const seat = parts.action.parentElement.parentElement;
    assert.equal(seat.style.position, '', 'the seat inside the tooltip anchor is in flow');
    const slot = seat.parentElement.parentElement.parentElement;
    assert.equal(slot.style.position, 'absolute', 'the slot wrapper carries the overlay position');
    assert.ok(Number.parseFloat(slot.style.height) > 0, 'the slot declares a height');
    assert.equal(seat.style.height, slot.style.height, 'the in-flow seat declares the slot height');
  });

  test('the reveal action names itself through the compact tooltip, not the full bubble', async function () {
    const t = buildNative('carbon').tokens;
    assert.notEqual(t['control.tooltip_compact_padding_block'], t['control.tooltip_padding_block'], 'fixture: the compact cell must differ from the full cell');
    const parts = await renderField(registryFor('carbon'), { label: 'Password', value: 'secret' });
    await act(async function () {
      parts.action.focus();
    });
    // The open delay is the theme-independent 100 ms
    await act(async function () {
      await new Promise(function (resolve) {
        setTimeout(resolve, 150);
      });
    });
    const popover = parts.root.querySelector('[role="tooltip"]');
    assert.notEqual(popover, null, 'the focused reveal action opens its naming tooltip');
    const bubble = popover.firstElementChild;
    assert.equal(bubble.style.paddingTop, t['control.tooltip_compact_padding_block'] + 'px');
    assert.equal(bubble.style.paddingBottom, t['control.tooltip_compact_padding_block'] + 'px');
  });


  test('it composes inside a painted Layer and inside a disabled group', async function () {
    const Registry = registryFor('carbon');
    const built = buildNative('carbon');
    // A level-2 Layer repaints the field with the level-3 surface cell
    const layered = await render(React.createElement(Registry.Layer, { level: 2 },
      React.createElement(Registry.PasswordInput, { label: 'Password', value: 'secret' })));
    const frame = layered.querySelector('input').parentElement;
    const leveled = built.levels && built.levels[3] && built.levels[3]['color.field_container'];
    const expected = leveled === undefined ? built.tokens['color.field_container'] : leveled;
    assert.equal(frame.style.backgroundColor, cssValue('backgroundColor', expected), 'the leveled cell paints the frame');

    // An enclosing disabled group wins over the member's own disabled flag
    const grouped = await render(React.createElement(Registry.FormGroup, { legendText: 'Credentials', disabled: true },
      React.createElement(Registry.PasswordInput, { label: 'Password', value: 'secret' })));
    const input = grouped.querySelector('input');
    const action = grouped.querySelector('button');
    assert.equal(input.disabled, true, 'a disabled group disables the field');
    assert.equal(action.getAttribute('aria-disabled'), 'true', 'and the reveal action');
  });

});
