// Info: FilterableMultiSelect composite, the query-bearing owner of the
// family's multiple-choice field. The editable input's text filters the
// open list through the hook and never discards selected values; the count
// member still clears the whole selection. Structure shared with the
// press-only owner is covered by the sweep in `multi-select.test.js`; these
// cases cover the query channel itself.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { cleanup } from './harness/render.js';
import { Lib, buildSystem } from './harness/system.js';
import { ITEMS, React, act, press, registryFor, renderField, type } from './multi-select-shared.js';

afterEach(cleanup);


describe('FilterableMultiSelect: the query through the DOM', function () {

  test('a click opens the editable listbox', async function () {
    const parts = await renderField(registryFor('carbon'), 'FilterableMultiSelect', {
      label: 'Choice', items: ITEMS
    });
    await act(async function () {
      parts.trigger.click();
    });
    assert.equal(parts.trigger.getAttribute('aria-expanded'), 'true');
    assert.equal(parts.options().length, ITEMS.length);
  });

  test('typing filters the list and keeps the selected values', async function () {
    const calls = [];
    const edits = [];
    const parts = await renderField(registryFor('carbon'), 'FilterableMultiSelect', {
      label: 'Choice', items: ITEMS, defaultValue: ['beta'],
      onChange: function (next) { calls.push(next); },
      onInputChange: function (next) { edits.push(next); }
    });
    await act(async function () {
      parts.trigger.click();
    });
    await type(parts.trigger, 'ga');
    const options = parts.options();
    assert.equal(options.length, 1);
    assert.equal(options[0].getAttribute('aria-label'), 'Gamma');
    assert.equal(parts.count.querySelector('[dir="auto"]').textContent, '1', 'the hidden selection stays');
    assert.deepEqual(calls, []);
    assert.deepEqual(edits, ['ga']);
    assert.equal(parts.trigger.value, 'ga');
    // Escape closes and drops the query; reopening shows every row
    await press(parts.trigger, 'Escape');
    await act(async function () {
      parts.trigger.click();
    });
    assert.equal(parts.options().length, ITEMS.length);
  });

  test('a controlled query echoes its requests', async function () {
    const edits = [];
    const parts = await renderField(registryFor('carbon'), 'FilterableMultiSelect', {
      label: 'Choice', items: ITEMS, inputValue: 'a', open: true,
      onInputChange: function (next) { edits.push(next); }
    });
    await type(parts.trigger, 'al');
    assert.deepEqual(edits, ['al']);
    assert.equal(parts.trigger.value, 'a', 'the host answer still rules the input');
  });

  test('a native press-in opens and the root binds no DOM dismissal', async function () {
    const ReactNative = Lib.ReactNative;
    const inputProps = [];
    const viewProps = [];
    const WrappedInput = React.forwardRef(function (props, ref) {
      inputProps.push(props);
      return React.createElement(ReactNative.TextInput, Object.assign({}, props, { ref: ref }));
    });
    const WrappedView = React.forwardRef(function (props, ref) {
      viewProps.push(props);
      return React.createElement(ReactNative.View, Object.assign({}, props, { ref: ref }));
    });
    const lib = Object.assign({}, Lib, {
      ReactNative: Object.assign({}, ReactNative, { TextInput: WrappedInput, View: WrappedView })
    });
    const Registry = buildSystem('carbon', factories, { lib: lib });
    const parts = await renderField(Registry, 'FilterableMultiSelect', {
      label: 'Choice', items: ITEMS, value: ['beta']
    });
    assert.equal(typeof inputProps[0].onPressIn, 'function', 'the input carries the press-in');
    assert.equal(typeof inputProps[0].onKeyPress, 'function', 'the input carries the key seam');
    assert.equal(viewProps.some(function (props) {
      return typeof props.onBlur === 'function' || typeof props.onMouseDown === 'function';
    }), false, 'no view binds the DOM dismissal handlers');
    // A native press-in, no DOM click, opens the list
    await act(async function () {
      inputProps[0].onPressIn();
    });
    assert.equal(parts.trigger.getAttribute('aria-expanded'), 'true');
    assert.equal(parts.options().length, ITEMS.length);
    // One keydown reaches the handler exactly once through onKeyPress: the
    // active descendant moves a single row, never two
    const highlighted = function () {
      const id = parts.trigger.getAttribute('aria-activedescendant');
      return parts.options().findIndex(function (option) {
        return option.id === id;
      });
    };
    await press(parts.trigger, 'ArrowDown');
    const first = highlighted();
    assert.equal(first >= 0, true, 'a row is highlighted');
    await press(parts.trigger, 'ArrowDown');
    assert.equal(highlighted(), first + 1, 'one keydown moves the highlight exactly one row');
  });

  test('a disabled field is not editable and its member answers nothing', async function () {
    const calls = [];
    const parts = await renderField(registryFor('carbon'), 'FilterableMultiSelect', {
      label: 'Choice', items: ITEMS, value: ['alpha'], disabled: true,
      onChange: function (next) { calls.push(next); }
    });
    assert.equal(parts.trigger.disabled, true);
    const close = parts.count.querySelector('[role="button"]');
    assert.equal(close.getAttribute('aria-disabled'), 'true');
    await act(async function () {
      parts.trigger.click();
      close.click();
    });
    assert.equal(parts.list(), null);
    assert.deepEqual(calls, []);
  });

});
