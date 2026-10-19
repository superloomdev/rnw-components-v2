// Info: useMultiSelect's many-valued listbox contract.
//
// The hook composes useSelect for navigation, open and focus only; the
// selected array is owned once by useControllableState and every accepted
// base choice - reselect included - toggles through the onSelect seam.
// Rows display selected-first by the snapshot taken at the committed
// open, and the optional filterable query is the hook's own text state.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import * as ReactNative from 'react-native-web';
import utils from 'helper-utils';
import debug from 'helper-debug';

import createBehaviors from '../behaviors/index.js';
import createPlatform from '../component/platform.js';

const Utils = utils({});
const Debug = debug({ Utils: Utils }, { LOG_LEVEL: 'error' });
const platform = createPlatform(ReactNative, Utils);
const behaviors = createBehaviors({ React: React, ReactNative: ReactNative, Utils: Utils, Debug: Debug, platform: platform });

const ITEMS = [
  Object.freeze({ value: 'a', label: 'Alpha' }),
  Object.freeze({ value: 'b', label: 'Beta' }),
  Object.freeze({ value: 'c', label: 'Gamma' })
];

const mounted = [];

afterEach(async function () {
  while (mounted.length > 0) {
    const item = mounted.pop();
    if (item.unmounted !== true) {
      await act(async function () {
        item.root.unmount();
      });
    }
    item.container.remove();
  }
});


/********************************************************************
Render a probe that calls useMultiSelect and hands its result back
through a box. `current` always holds the last render's return.

@param {Object} options - useMultiSelect options

@return {Promise<Object>} - { current, render, unmount }
*********************************************************************/
async function renderMultiSelect (options) {

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const item = { container: container, root: root, unmounted: false };
  mounted.push(item);

  const box = { current: undefined };
  function Probe (props) {
    box.current = behaviors.useMultiSelect(props);
    return null;
  }

  await act(async function () {
    root.render(React.createElement(Probe, options));
  });

  box.render = async function (next) {
    await act(async function () {
      root.render(React.createElement(Probe, next));
    });
  };
  box.unmount = async function () {
    await act(async function () {
      root.unmount();
    });
    item.unmounted = true;
  };
  return box;

}


/********************************************************************
Fire a keydown handler with a fake event that records whether the
behavior claimed the default.

@param {Object} box     - The probe's { current } box
@param {String} key     - Event key
@param {String} surface - 'triggerProps' or 'inputProps'
@param {Object} extra   - Extra event fields (IME composition)

@return {Promise<Object>} - The fake event after dispatch
*********************************************************************/
async function keydown (box, key, surface, extra) {

  const event = Object.assign({
    key: key,
    prevented: false,
    preventDefault: function () {
      this.prevented = true;
    }
  }, extra);
  await act(async function () {
    box.current[surface].onKeyDown(event);
  });
  return event;

}


describe('behaviors: useMultiSelect', function () {

  test('an empty mount notifies nothing; numeric and string zero are distinct seeded defaults', async function () {
    const calls = [];
    const box = await renderMultiSelect({
      items: ITEMS,
      onChange: function (values) { calls.push(values); },
      onOpenChange: function (next) { calls.push(next); }
    });
    assert.deepEqual(box.current.selectedValues, []);
    assert.equal(box.current.state.selectedCount, 0);
    assert.equal(box.current.state.populated, false);
    assert.equal(box.current.state.open, false);
    assert.deepEqual(calls, [], 'a mount notifies nothing');

    // Numeric 0 and string '0' are different seeded values
    const zero = await renderMultiSelect({
      items: [
        { value: 0, label: 'Zero' },
        { value: '0', label: 'String Zero' }
      ],
      defaultValue: [0]
    });
    assert.deepEqual(zero.current.selectedValues, [0]);
    const stringZero = await renderMultiSelect({
      items: [
        { value: 0, label: 'Zero' },
        { value: '0', label: 'String Zero' }
      ],
      defaultValue: ['0']
    });
    assert.deepEqual(stringZero.current.selectedValues, ['0']);

    // A later default seeds nothing
    await zero.render({
      items: [
        { value: 0, label: 'Zero' },
        { value: '0', label: 'String Zero' }
      ],
      defaultValue: [1, '0']
    });
    assert.deepEqual(zero.current.selectedValues, [0], 'a changed defaultValue re-seeds nothing');
  });

  test('toggles are insertion ordered with fresh arrays; a controlled selection waits for the echo', async function () {
    const calls = [];
    const box = await renderMultiSelect({
      items: ITEMS,
      onChange: function (values) { calls.push(values.slice()); }
    });
    await act(async function () {
      box.current.triggerProps.onPress();
    });
    assert.equal(box.current.state.open, true);
    const first = box.current.selectedValues;
    await act(async function () {
      box.current.getOptionProps(0).onPress();
    });
    assert.deepEqual(box.current.selectedValues, ['a']);
    assert.notEqual(box.current.selectedValues, first, 'every callback array is fresh');
    await act(async function () {
      box.current.getOptionProps(2).onPress();
    });
    assert.deepEqual(box.current.selectedValues, ['a', 'c'], 'new members append in press order');
    await act(async function () {
      box.current.getOptionProps(0).onPress();
    });
    assert.deepEqual(box.current.selectedValues, ['c'], 'removal preserves the order of the rest');
    assert.deepEqual(calls, [['a'], ['a', 'c'], ['c']]);

    // Controlled: requests report the next array, the answer never moves
    const controlledCalls = [];
    const controlled = await renderMultiSelect({
      items: ITEMS,
      value: ['b'],
      onChange: function (values) { controlledCalls.push(values.slice()); }
    });
    await act(async function () {
      controlled.current.triggerProps.onPress();
      // Selected-first order puts 'b' at index 0; index 1 is 'a'
      controlled.current.getOptionProps(1).onPress();
    });
    assert.deepEqual(controlledCalls, [['b', 'a']], 'the request reports the would-be array');
    assert.deepEqual(controlled.current.selectedValues, ['b'], 'a controlled selection waits for the echo');
    await controlled.render({ items: ITEMS, value: ['b', 'a'] });
    assert.deepEqual(controlled.current.selectedValues, ['b', 'a']);
  });

  test('toggling a checked first item removes it without closing', async function () {
    const calls = [];
    const box = await renderMultiSelect({
      items: ITEMS,
      defaultValue: ['a'],
      onChange: function (values) { calls.push(values.slice()); }
    });
    await act(async function () {
      box.current.triggerProps.onPress();
    });
    assert.equal(box.current.state.open, true);
    // Selected-first order puts 'a' at index 0; pressing it again is a
    // reselect for the navigation-only base selection but a real toggle
    // here - it unchecks and the list stays open
    assert.equal(box.current.getOptionProps(0)['aria-selected'], true);
    await act(async function () {
      box.current.getOptionProps(0).onPress();
    });
    assert.deepEqual(box.current.selectedValues, []);
    assert.deepEqual(calls, [[]]);
    assert.equal(box.current.state.open, true, 'a toggle never closes the list');
    assert.equal(box.current.getOptionProps(0)['aria-selected'], false);
  });

  test('selection order changes only after the open session ends; reorder, removal and re-addition keep values and ids', async function () {
    const box = await renderMultiSelect({ items: ITEMS, defaultValue: ['b'] });
    // Selected 'b' leads even closed; its id is captured at index 0
    const betaId = box.current.getOptionProps(0).nativeID;
    await act(async function () {
      box.current.triggerProps.onPress();
    });
    assert.deepEqual(box.current.items.map(function (item) { return item.value; }), ['b', 'a', 'c'],
      'the selected row leads on open');

    // Toggling 'c' on during the session does not jump its row
    await act(async function () {
      box.current.getOptionProps(2).onPress();
    });
    assert.deepEqual(box.current.selectedValues, ['b', 'c']);
    assert.deepEqual(box.current.items.map(function (item) { return item.value; }), ['b', 'a', 'c'],
      'an open session never reorders on toggle');

    // A committed close then reopen takes a fresh snapshot
    const escape = await keydown(box, 'Escape', 'triggerProps');
    assert.equal(escape.prevented, true);
    assert.equal(box.current.state.open, false);
    await act(async function () {
      box.current.triggerProps.onPress();
    });
    assert.deepEqual(box.current.items.map(function (item) { return item.value; }), ['b', 'c', 'a'],
      'reopening puts every selected row first');

    // A host reorder re-partitions in catalog order and keeps the ids
    await box.render({ items: [ITEMS[2], ITEMS[0], ITEMS[1]], defaultValue: ['b'] });
    assert.deepEqual(box.current.items.map(function (item) { return item.value; }), ['c', 'b', 'a']);
    assert.deepEqual(box.current.selectedValues, ['b', 'c']);
    assert.equal(box.current.getOptionProps(1).nativeID, betaId, 'the option id is per-value');

    // Removal retains the unknown value; re-addition restores the row
    await box.render({ items: [ITEMS[2], ITEMS[0]], defaultValue: ['b'] });
    assert.deepEqual(box.current.selectedValues, ['b', 'c'], 'a removed catalog entry keeps its selection');
    assert.equal(box.current.state.selectedCount, 2);
    await box.render({ items: ITEMS, defaultValue: ['b'] });
    assert.deepEqual(box.current.items.map(function (item) { return item.value; }), ['b', 'c', 'a']);
    assert.equal(box.current.getOptionProps(0).nativeID, betaId, 'the restored row keeps its per-value id');
  });

  test('disabled and removed targets and every saved handler go inert at the boundary', async function () {
    const calls = [];
    const items = [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta', disabled: true },
      { value: 'c', label: 'Gamma' }
    ];
    const box = await renderMultiSelect({
      items: items,
      onChange: function (values) { calls.push(values.slice()); }
    });
    assert.equal(box.current.getOptionProps(1).onPress, undefined, 'a disabled row has no press');
    assert.equal(box.current.getOptionProps(1)['aria-disabled'], true);
    await act(async function () {
      box.current.toggleValue('b');
    });
    assert.deepEqual(box.current.selectedValues, [], 'a disabled item cannot be toggled');

    // A handler retained for a now-removed row cannot select anything
    const retained = box.current.getOptionProps(0).onPress;
    const savedToggle = box.current.toggleValue;
    const savedClear = box.current.clearSelection;
    const savedKeys = box.current.triggerProps.onKeyDown;
    await box.render({ items: [items[1], items[2]] });
    await act(async function () {
      retained();
      savedToggle('a');
    });
    assert.deepEqual(box.current.selectedValues, []);
    assert.deepEqual(calls, [], 'stale rows mutate nothing');

    // Disabled control: every own path is inert, no claimed default
    const keys = box.current.triggerProps.onKeyDown;
    const event = { key: 'ArrowDown', prevented: false, preventDefault: function () { this.prevented = true; } };
    await box.render({ items: [items[1], items[2]], disabled: true });
    await act(async function () {
      savedToggle('c');
      savedClear();
      keys(event);
      box.current.triggerProps.onPress();
      box.current.clearProps.onPress();
      box.current.toggleProps.onPress();
      box.current.setOpen(true);
    });
    assert.equal(event.prevented, false);
    assert.equal(box.current.state.open, false);
    assert.deepEqual(calls, []);

    // Re-enabled, the latest callbacks are used; unmounted, inert
    const calls2 = [];
    await box.render({
      items: [items[1], items[2]],
      onChange: function (values) { calls2.push(values.slice()); }
    });
    await act(async function () {
      box.current.toggleValue('c');
    });
    assert.deepEqual(calls2, [['c']]);
    assert.deepEqual(calls, []);
    const lastToggle = box.current.toggleValue;
    await box.unmount();
    await act(async function () {
      lastToggle('c');
      savedKeys({ key: 'Enter', preventDefault: function () { event.prevented = true; } });
    });
    assert.deepEqual(calls2, [['c']]);
    assert.equal(event.prevented, false);
  });

  test('arrows skip and wrap, ends jump, Enter and Space toggle without closing; Tab never claims', async function () {
    const calls = [];
    const items = [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta', disabled: true },
      { value: 'c', label: 'Gamma' }
    ];
    const box = await renderMultiSelect({
      items: items,
      onChange: function (values) { calls.push(values.slice()); }
    });
    let event = await keydown(box, 'ArrowDown', 'triggerProps');
    assert.equal(event.prevented, true);
    assert.equal(box.current.state.open, true);
    assert.equal(box.current.state.highlightedIndex, 0);
    await keydown(box, 'ArrowDown', 'triggerProps');
    assert.equal(box.current.state.highlightedIndex, 2, 'the disabled row is skipped');
    await keydown(box, 'ArrowDown', 'triggerProps');
    assert.equal(box.current.state.highlightedIndex, 0, 'Down wraps');
    event = await keydown(box, 'End', 'triggerProps');
    assert.equal(event.prevented, true);
    assert.equal(box.current.state.highlightedIndex, 2);
    event = await keydown(box, 'Home', 'triggerProps');
    assert.equal(box.current.state.highlightedIndex, 0);

    // Enter and Space toggle the highlighted row; the list stays open
    event = await keydown(box, 'Enter', 'triggerProps');
    assert.equal(event.prevented, true);
    assert.deepEqual(box.current.selectedValues, ['a']);
    assert.equal(box.current.state.open, true);
    await keydown(box, 'ArrowDown', 'triggerProps');
    event = await keydown(box, ' ', 'triggerProps');
    assert.equal(event.prevented, true);
    assert.deepEqual(box.current.selectedValues, ['a', 'c']);
    assert.equal(box.current.state.open, true, 'activation never closes');

    // Tab closes without claiming; Escape closes without clearing
    event = await keydown(box, 'Tab', 'triggerProps');
    assert.equal(event.prevented, false, 'Tab never prevents');
    assert.equal(box.current.state.open, false);
    assert.deepEqual(box.current.selectedValues, ['a', 'c']);
    await act(async function () {
      box.current.triggerProps.onPress();
    });
    await keydown(box, 'Escape', 'triggerProps');
    assert.equal(box.current.state.open, false);
    assert.deepEqual(box.current.selectedValues, ['a', 'c'], 'Escape only closes');
    assert.deepEqual(calls, [['a'], ['a', 'c']]);
  });

  test('a closed Delete clears all values; empty is a no-op; numeric zero clears; controlled waits for the echo', async function () {
    const calls = [];
    const box = await renderMultiSelect({
      items: [
        { value: 0, label: 'Zero' },
        { value: 'b', label: 'Beta' }
      ],
      defaultValue: [0, 'b'],
      onChange: function (values) { calls.push(values.slice()); }
    });
    let event = await keydown(box, 'Delete', 'triggerProps');
    assert.equal(event.prevented, true);
    assert.deepEqual(box.current.selectedValues, []);
    assert.deepEqual(calls, [[]], 'the closed clear reports the empty array once');

    event = await keydown(box, 'Delete', 'triggerProps');
    assert.deepEqual(calls, [[]], 'an already-empty clear is a no-op');
    event = await keydown(box, 'Backspace', 'triggerProps');
    assert.deepEqual(calls, [[]]);

    // A closed Delete while open does not clear
    await act(async function () {
      box.current.toggleValue('b');
      box.current.triggerProps.onPress();
    });
    event = await keydown(box, 'Backspace', 'triggerProps');
    assert.deepEqual(box.current.selectedValues, ['b'], 'an open Backspace never clears');
    assert.equal(event.prevented, false);

    // Controlled: the request reports [] but the answer stays until echo
    const controlledCalls = [];
    const controlled = await renderMultiSelect({
      items: ITEMS,
      value: ['a'],
      onChange: function (values) { controlledCalls.push(values.slice()); }
    });
    await keydown(controlled, 'Delete', 'triggerProps');
    assert.deepEqual(controlledCalls, [[]]);
    assert.deepEqual(controlled.current.selectedValues, ['a'], 'controlled stays controlled until echo');
  });

  test('filtering hides rows, never selections; the predicate receives exactly { item, inputValue }', async function () {
    const seen = [];
    const calls = [];
    const box = await renderMultiSelect({
      items: ITEMS,
      filterable: true,
      defaultValue: ['a', 'b'],
      shouldFilterItem: function (args) {
        seen.push({ item: args.item, inputValue: args.inputValue });
        return args.item.value === 'c';
      },
      onChange: function (values) { calls.push(values.slice()); }
    });
    assert.equal(seen.length >= ITEMS.length, true);
    assert.equal(seen[0].item, ITEMS[0], 'the predicate receives the item record itself');
    assert.equal(seen[0].inputValue, '');
    assert.deepEqual(box.current.items.map(function (item) { return item.value; }), ['c'],
      'the predicate decides membership');
    assert.deepEqual(box.current.selectedValues, ['a', 'b'], 'filtered-out selections are retained');
    assert.equal(box.current.state.selectedCount, 2, 'the count includes hidden results');

    seen.length = 0;
    await act(async function () {
      box.current.inputProps.onChangeText('ta');
    });
    assert.equal(seen[0].inputValue, 'ta', 'the predicate receives the raw query');
    assert.deepEqual(box.current.selectedValues, ['a', 'b']);
    assert.equal(box.current.state.open, true, 'typing opens the list');
    assert.deepEqual(calls, [], 'typing never reports a selection');
  });

  test('filterable editing keys stay native; empty closed Backspace may clear, typed Backspace never does', async function () {
    const calls = [];
    const box = await renderMultiSelect({
      items: ITEMS,
      filterable: true,
      defaultValue: ['a'],
      onChange: function (values) { calls.push(values.slice()); }
    });
    await act(async function () {
      box.current.inputProps.onChangeText('a ');
    });
    assert.equal(box.current.state.inputValue, 'a ', 'a typed space survives');
    for (const key of [' ', 'Home', 'End', 'ArrowLeft', 'ArrowRight']) {
      const event = await keydown(box, key, 'inputProps');
      assert.equal(event.prevented, false, key + ' never claims the default');
    }
    assert.deepEqual(box.current.selectedValues, ['a']);
    assert.deepEqual(calls, [], 'no editing key chooses');

    // A nonempty query Backspace edits text, never clears values
    const backspace = await keydown(box, 'Backspace', 'inputProps');
    assert.equal(backspace.prevented, false);
    assert.deepEqual(box.current.selectedValues, ['a'], 'typed Backspace never clears');

    // Close and empty the query, then Backspace may clear
    const escape = await keydown(box, 'Escape', 'inputProps');
    assert.equal(escape.prevented, true, 'Escape claims while open or queried');
    assert.equal(box.current.state.open, false);
    assert.equal(box.current.state.query, '', 'Escape clears the query');
    assert.deepEqual(box.current.selectedValues, ['a'], 'Escape preserves the values');
    const cleared = await keydown(box, 'Backspace', 'inputProps');
    assert.equal(cleared.prevented, true);
    assert.deepEqual(box.current.selectedValues, []);
    assert.deepEqual(calls, [[]]);
  });

  test('latest callbacks after rerender; same-act toggles compose and an empty clear never duplicates', async function () {
    const calls = [];
    const box = await renderMultiSelect({
      items: ITEMS,
      defaultValue: ['a', 'b'],
      onChange: function (values) { calls.push(values.slice()); }
    });
    // Two toggles in one act compose on the latest answer
    await act(async function () {
      box.current.toggleValue('a');
      box.current.toggleValue('b');
    });
    assert.deepEqual(box.current.selectedValues, []);
    assert.deepEqual(calls, [['b'], []], 'each request carries the composed array');
    assert.equal(box.current.state.announcement, 'All items cleared');

    // Two clears while empty emit nothing
    await act(async function () {
      box.current.clearSelection();
      box.current.clearSelection();
    });
    assert.deepEqual(calls, [['b'], []], 'an empty clear is a no-op');

    // A rerendered callback is the live one
    const calls2 = [];
    await box.render({
      items: ITEMS,
      onChange: function (values) { calls2.push(values.slice()); }
    });
    await act(async function () {
      box.current.toggleValue('c');
    });
    assert.deepEqual(calls2, [['c']]);
    assert.deepEqual(calls, [['b'], []], 'the stale callback was not called');
  });

  test('no results gives no active descendant and no invented value; IME Enter is ignored', async function () {
    const calls = [];
    const box = await renderMultiSelect({
      items: ITEMS,
      filterable: true,
      onChange: function (values) { calls.push(values.slice()); }
    });
    await act(async function () {
      box.current.inputProps.onChangeText('zzz');
    });
    assert.equal(box.current.state.open, true, 'no results keeps the list open');
    assert.equal(box.current.items.length, 0);
    assert.equal(box.current.state.highlightedIndex, -1);
    assert.equal(box.current.inputProps['aria-activedescendant'], undefined);
    const event = await keydown(box, 'Enter', 'inputProps');
    assert.equal(event.prevented, true);
    assert.deepEqual(calls, [], 'Enter on an empty result invents nothing');
    assert.deepEqual(box.current.selectedValues, []);

    const ime = await keydown(box, 'Enter', 'inputProps', { isComposing: true });
    assert.equal(ime.prevented, false, 'an IME Enter claims nothing');
    assert.deepEqual(calls, []);
    const imeNative = await keydown(box, 'Enter', 'inputProps', { nativeEvent: { isComposing: true } });
    assert.equal(imeNative.prevented, false);
  });

  test('announcements track only committed count changes; a refused request announces nothing', async function () {
    const box = await renderMultiSelect({
      items: ITEMS,
      selectionCountLabel: function (count) { return count + ' chosen'; }
    });
    assert.equal(box.current.state.announcement, '', 'the initial announcement is empty');
    await act(async function () {
      box.current.toggleValue('a');
    });
    assert.equal(box.current.state.announcement, '1 chosen', 'a real count change announces');
    await act(async function () {
      box.current.toggleValue('b');
      box.current.toggleValue('c');
    });
    assert.equal(box.current.state.announcement, '3 chosen');
    await act(async function () {
      box.current.clearSelection();
    });
    assert.equal(box.current.state.announcement, 'All items cleared');

    // A controlled refused request never fabricates a count
    const controlled = await renderMultiSelect({
      items: ITEMS,
      value: ['a'],
      onChange: function () {}
    });
    assert.equal(controlled.current.state.announcement, '');
    await act(async function () {
      controlled.current.toggleValue('a');
    });
    assert.deepEqual(controlled.current.selectedValues, ['a']);
    assert.equal(controlled.current.state.announcement, '', 'no count moved, nothing announced');

    // A formatter that answers a non-string is a contract violation
    const bad = await renderMultiSelect({
      items: ITEMS,
      selectionCountLabel: function () { return 42; }
    });
    await assert.rejects(async function () {
      await act(async function () {
        bad.current.toggleValue('a');
      });
    }, TypeError);
  });

  test('options expose the selected set, the list is multiselectable, ids are stable and the highlight skips disabled', async function () {
    const box = await renderMultiSelect({
      items: [
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta', disabled: true },
        { value: 'c', label: 'Gamma' }
      ],
      defaultValue: ['c']
    });
    assert.equal(box.current.listProps['aria-multiselectable'], true);
    // Selected-first order puts 'c' at index 0; 'b' stays disabled at 2
    assert.equal(box.current.items.map(function (item) { return item.value; })[0], 'c');
    assert.equal(box.current.getOptionProps(0)['aria-checked'], true, 'the selected row is checked');
    assert.equal(box.current.getOptionProps(1)['aria-checked'], false);
    assert.equal(box.current.getOptionProps(2)['aria-disabled'], true);
    assert.equal(box.current.getOptionProps(2).onPress, undefined);

    // Out of range stays inert
    const missing = box.current.getOptionProps(9);
    assert.equal(missing.disabled, true);
    assert.equal(missing['aria-selected'], false);

    // Highlight follows the value across a reorder, skipping disabled
    await act(async function () {
      box.current.triggerProps.onPress();
    });
    assert.equal(box.current.state.highlightedIndex, 0, 'the first enabled displayed row is highlighted');
    assert.equal(box.current.getOptionProps(0)['aria-checked'], true);
    const gammaId = box.current.getOptionProps(0).nativeID;
    await box.render({
      items: [
        { value: 'c', label: 'Gamma' },
        { value: 'b', label: 'Beta', disabled: true },
        { value: 'a', label: 'Alpha' }
      ],
      defaultValue: ['c']
    });
    assert.equal(box.current.getOptionProps(0).nativeID, gammaId);
    assert.equal(box.current.state.highlightedIndex, 0);
  });

  test('external echoes notify nothing; malformed options and selected arrays throw TypeError', async function () {
    const calls = [];
    const box = await renderMultiSelect({
      items: ITEMS,
      value: ['a'],
      onChange: function (values) { calls.push(values); },
      onInputChange: function (text) { calls.push(text); },
      onOpenChange: function (next) { calls.push(next); }
    });
    await box.render({ items: ITEMS, value: ['b', 'c'] });
    assert.deepEqual(box.current.selectedValues, ['b', 'c']);
    assert.deepEqual(calls, [], 'an external value echo notifies nothing');
    await box.render({ items: [ITEMS[2], ITEMS[1], ITEMS[0]], value: ['b', 'c'] });
    assert.deepEqual(calls, [], 'a reorder notifies nothing');
    await box.render({ items: [ITEMS[0]], value: ['b', 'c'] });
    assert.deepEqual(box.current.selectedValues, ['b', 'c'], 'a catalog removal retains the values');
    assert.deepEqual(calls, []);

    // Contract violations
    await assert.rejects(renderMultiSelect({ items: ITEMS, value: 'a' }), TypeError, 'a non-array value');
    await assert.rejects(renderMultiSelect({ items: ITEMS, value: ['a', 'a'] }), TypeError, 'a duplicate selected value');
    await assert.rejects(renderMultiSelect({ items: ITEMS, value: [null] }), TypeError, 'a null selected value');
    await assert.rejects(renderMultiSelect({ items: ITEMS, value: [NaN] }), TypeError, 'a non-finite selected value');
    await assert.rejects(renderMultiSelect({ items: ITEMS, defaultValue: 'b' }), TypeError, 'a non-array defaultValue');
    await assert.rejects(renderMultiSelect({ items: [{ value: 'a', label: 'A' }, { value: 'a', label: 'B' }] }), TypeError, 'duplicate item values');
    await assert.rejects(renderMultiSelect({ items: [{ value: {}, label: 'A' }] }), TypeError, 'an object item value');
    await assert.rejects(renderMultiSelect({ items: [{ value: 'a', label: 5 }] }), TypeError, 'a non-string label');
    await assert.rejects(renderMultiSelect({ items: ITEMS, filterable: true, inputValue: 5 }), TypeError, 'a non-string inputValue');
    await assert.rejects(renderMultiSelect({ items: ITEMS, filterable: true, defaultInputValue: {} }), TypeError, 'a non-string defaultInputValue');
  });

  test('two saved trigger presses in one act toggle open then closed; a refused controlled open re-requests', async function () {
    const openCalls = [];
    const box = await renderMultiSelect({
      items: ITEMS,
      onOpenChange: function (value) { openCalls.push(value); }
    });
    box.current.inputRef.current = { focus() {} };
    const press = box.current.triggerProps.onPress;
    await act(async function () {
      press();
      press();
    });
    assert.deepEqual(openCalls, [true, false],
      'each press reads the latest live open answer');
    assert.equal(box.current.state.open, false);

    const controlledCalls = [];
    const refused = await renderMultiSelect({
      items: ITEMS,
      open: false,
      onOpenChange: function (value) { controlledCalls.push(value); }
    });
    refused.current.inputRef.current = { focus() {} };
    await act(async function () {
      refused.current.triggerProps.onPress();
      refused.current.triggerProps.onPress();
    });
    assert.deepEqual(controlledCalls, [true, true],
      'a refused controlled open re-requests, never an optimistic false');
    assert.equal(refused.current.state.open, false);
  });

  test('a trigger press then Delete in one act sees the now-open menu and clears nothing', async function () {
    const calls = [];
    const box = await renderMultiSelect({
      items: ITEMS,
      defaultValue: ['a'],
      onChange: function (values) { calls.push(values.slice()); }
    });
    const event = {
      key: 'Delete',
      prevented: false,
      preventDefault: function () { this.prevented = true; }
    };
    await act(async function () {
      box.current.triggerProps.onPress();
      box.current.triggerProps.onKeyDown(event);
    });
    assert.equal(box.current.state.open, true);
    assert.equal(event.prevented, false, 'Delete on an open menu is a native key');
    assert.deepEqual(box.current.selectedValues, ['a'], 'the open menu protected the selection');
    assert.deepEqual(calls, []);
  });

  test('the active row scrolls only when outside its measured viewport', async function () {
    const scrolls = [];
    const box = await renderMultiSelect({ items: ITEMS });
    box.current.scrollProps.ref.current = {
      scrollTo: function (args) { scrolls.push(args); }
    };
    await act(async function () {
      box.current.scrollProps.onLayout({ nativeEvent: { layout: { height: 100 } } });
      box.current.scrollProps.onScroll({ nativeEvent: { contentOffset: { y: 0 } } });
      box.current.getOptionProps(0).onLayout({ nativeEvent: { layout: { y: 0, height: 40 } } });
      box.current.getOptionProps(1).onLayout({ nativeEvent: { layout: { y: 40, height: 40 } } });
      box.current.getOptionProps(2).onLayout({ nativeEvent: { layout: { y: 80, height: 40 } } });
    });
    // A keyboard open highlights the first row (inside the viewport): no
    // request; a plain pointer open invents no highlight to reconcile
    await act(async function () {
      box.current.triggerProps.onKeyDown({ key: 'ArrowDown', preventDefault: function () {} });
    });
    assert.equal(box.current.state.open, true);
    assert.equal(box.current.state.highlightedIndex, 0);
    assert.deepEqual(scrolls, [], 'a visible row requests nothing');
    // End highlights the row at 80..120, below the fold: y becomes 20
    await act(async function () {
      box.current.triggerProps.onKeyDown({ key: 'End', preventDefault: function () {} });
    });
    assert.equal(box.current.state.highlightedIndex, 2);
    assert.deepEqual(scrolls, [{ y: 20, animated: false }],
      'the row below the viewport scrolls to its bottom edge');
    // The row at 40..80 is inside [20, 120]: no request
    await act(async function () {
      box.current.triggerProps.onKeyDown({ key: 'ArrowUp', preventDefault: function () {} });
    });
    assert.equal(box.current.state.highlightedIndex, 1);
    assert.deepEqual(scrolls, [{ y: 20, animated: false }],
      'a row inside the viewport requests nothing');
    // Row 0 at 0..40 is above offset 20: y becomes 0
    await act(async function () {
      box.current.triggerProps.onKeyDown({ key: 'Home', preventDefault: function () {} });
    });
    assert.equal(box.current.state.highlightedIndex, 0);
    assert.deepEqual(scrolls, [{ y: 20, animated: false }, { y: 0, animated: false }],
      'the row above the viewport scrolls to its top');

    // A row whose layout lands after the highlight reconciles then
    const scrolls2 = [];
    const late = await renderMultiSelect({ items: ITEMS });
    late.current.scrollProps.ref.current = {
      scrollTo: function (args) { scrolls2.push(args); }
    };
    await act(async function () {
      late.current.scrollProps.onLayout({ nativeEvent: { layout: { height: 100 } } });
      late.current.triggerProps.onKeyDown({ key: 'ArrowDown', preventDefault: function () {} });
    });
    assert.deepEqual(scrolls2, [], 'no row measured yet');
    await act(async function () {
      late.current.getOptionProps(0).onLayout({ nativeEvent: { layout: { y: 80, height: 40 } } });
    });
    assert.deepEqual(scrolls2, [{ y: 20, animated: false }],
      'the late layout reconciles the active row');

    // Invalid measurements and removed values update nothing
    await act(async function () {
      late.current.getOptionProps(0).onLayout({ nativeEvent: { layout: { y: -5, height: 40 } } });
      late.current.getOptionProps(0).onLayout({ nativeEvent: { layout: { y: 30, height: NaN } } });
      late.current.scrollProps.onLayout({ nativeEvent: { layout: { height: 'x' } } });
      late.current.scrollProps.onScroll({ nativeEvent: { contentOffset: { y: -1 } } });
    });
    assert.deepEqual(scrolls2, [{ y: 20, animated: false }], 'invalid reports are ignored');

    const removedRow = box.current.getOptionProps(2);
    await box.render({ items: [ITEMS[0], ITEMS[1]] });
    await act(async function () {
      removedRow.onLayout({ nativeEvent: { layout: { y: 0, height: 40 } } });
    });
    assert.deepEqual(scrolls, [{ y: 20, animated: false }, { y: 0, animated: false }],
      'a removed value updates nothing');

    // Disabled and unmounted never request scrolling
    await late.render({ items: ITEMS, disabled: true });
    const disabledCount = scrolls2.length;
    await act(async function () {
      late.current.getOptionProps(0).onLayout({ nativeEvent: { layout: { y: 200, height: 40 } } });
      late.current.scrollProps.onScroll({ nativeEvent: { contentOffset: { y: 0 } } });
    });
    assert.equal(scrolls2.length, disabledCount, 'disabled requests nothing');
    const retainedRow = late.current.getOptionProps(0);
    await late.unmount();
    await act(async function () {
      if (typeof retainedRow.onLayout === 'function') {
        retainedRow.onLayout({ nativeEvent: { layout: { y: 300, height: 40 } } });
      }
    });
    assert.equal(scrolls2.length, disabledCount, 'unmounted requests nothing');

    // A viewport arriving after the rows and the highlight reconciles
    // immediately, and a resize smaller than the row aligns its top
    const scrolls3 = [];
    const vbox = await renderMultiSelect({ items: ITEMS });
    vbox.current.scrollProps.ref.current = {
      scrollTo: function (args) { scrolls3.push(args); }
    };
    await act(async function () {
      vbox.current.getOptionProps(0).onLayout({ nativeEvent: { layout: { y: 0, height: 40 } } });
      vbox.current.getOptionProps(2).onLayout({ nativeEvent: { layout: { y: 80, height: 40 } } });
      vbox.current.triggerProps.onPress();
      vbox.current.triggerProps.onKeyDown({ key: 'End', preventDefault: function () {} });
    });
    assert.equal(vbox.current.state.highlightedIndex, 2);
    assert.deepEqual(scrolls3, [], 'no viewport measured yet');
    await act(async function () {
      vbox.current.scrollProps.onLayout({ nativeEvent: { layout: { height: 100 } } });
    });
    assert.deepEqual(scrolls3, [{ y: 20, animated: false }],
      'the late viewport reconciles the active row');
    await act(async function () {
      vbox.current.scrollProps.onLayout({ nativeEvent: { layout: { height: 20 } } });
    });
    assert.deepEqual(scrolls3, [{ y: 20, animated: false }, { y: 80, animated: false }],
      'a viewport smaller than the row keeps the row start visible');

    // A row taller than the viewport aligns its top once; a repeated
    // layout does not oscillate between top and bottom targets
    const scrolls4 = [];
    const tall = await renderMultiSelect({ items: ITEMS });
    tall.current.scrollProps.ref.current = {
      scrollTo: function (args) { scrolls4.push(args); }
    };
    await act(async function () {
      tall.current.scrollProps.onLayout({ nativeEvent: { layout: { height: 100 } } });
      tall.current.scrollProps.onScroll({ nativeEvent: { contentOffset: { y: 0 } } });
      tall.current.getOptionProps(0).onLayout({ nativeEvent: { layout: { y: 40, height: 200 } } });
      tall.current.triggerProps.onKeyDown({ key: 'ArrowDown', preventDefault: function () {} });
    });
    assert.deepEqual(scrolls4, [{ y: 40, animated: false }], 'the tall row aligns its top');
    await act(async function () {
      tall.current.getOptionProps(0).onLayout({ nativeEvent: { layout: { y: 40, height: 200 } } });
    });
    assert.deepEqual(scrolls4, [{ y: 40, animated: false }],
      'a repeated layout emits no oscillation');

    // A synchronous scroll report of the actual clamped offset is kept:
    // the platform reports 15 for a request of 20, and the next reconcile
    // sees row 16..56 already inside [15, 115] where a stale 20 would not
    const scrolls5 = [];
    const clamp = await renderMultiSelect({ items: ITEMS });
    clamp.current.scrollProps.ref.current = {
      scrollTo: function (args) {
        scrolls5.push(args);
        clamp.current.scrollProps.onScroll({ nativeEvent: { contentOffset: { y: args.y - 5 } } });
      }
    };
    await act(async function () {
      clamp.current.scrollProps.onLayout({ nativeEvent: { layout: { height: 100 } } });
      clamp.current.getOptionProps(0).onLayout({ nativeEvent: { layout: { y: 0, height: 40 } } });
      clamp.current.getOptionProps(1).onLayout({ nativeEvent: { layout: { y: 16, height: 40 } } });
      clamp.current.getOptionProps(2).onLayout({ nativeEvent: { layout: { y: 80, height: 40 } } });
      clamp.current.triggerProps.onPress();
      clamp.current.triggerProps.onKeyDown({ key: 'End', preventDefault: function () {} });
    });
    assert.deepEqual(scrolls5, [{ y: 20, animated: false }]);
    await act(async function () {
      clamp.current.triggerProps.onKeyDown({ key: 'ArrowUp', preventDefault: function () {} });
    });
    assert.equal(clamp.current.state.highlightedIndex, 1);
    assert.deepEqual(scrolls5, [{ y: 20, animated: false }],
      'the reported offset, not the requested one, decides the next reconcile');
    await act(async function () {
      clamp.current.triggerProps.onKeyDown({ key: 'Home', preventDefault: function () {} });
    });
    assert.deepEqual(scrolls5, [{ y: 20, animated: false }, { y: 0, animated: false }]);

    // A closed control never scrolls, even when geometry arrives
    const scrolls6 = [];
    const closed = await renderMultiSelect({ items: ITEMS });
    closed.current.scrollProps.ref.current = {
      scrollTo: function (args) { scrolls6.push(args); }
    };
    await act(async function () {
      closed.current.getOptionProps(0).onLayout({ nativeEvent: { layout: { y: 80, height: 40 } } });
      closed.current.scrollProps.onLayout({ nativeEvent: { layout: { height: 100 } } });
    });
    assert.deepEqual(scrolls6, [], 'a closed control requests nothing');

    // A row whose measured bottom overflows to infinity is ignored
    const scrolls7 = [];
    const overflow = await renderMultiSelect({ items: ITEMS });
    overflow.current.scrollProps.ref.current = {
      scrollTo: function (args) { scrolls7.push(args); }
    };
    await act(async function () {
      overflow.current.scrollProps.onLayout({ nativeEvent: { layout: { height: 100 } } });
      overflow.current.getOptionProps(0).onLayout({
        nativeEvent: { layout: { y: Number.MAX_VALUE, height: Number.MAX_VALUE } }
      });
      overflow.current.triggerProps.onPress();
    });
    assert.deepEqual(scrolls7, [], 'an infinite row bottom requests nothing');
  });

  test('a fresh pointer opening with an empty query invents no highlight; typing still reconciles first', async function () {
    // The source's editable pointer-open with no selection keeps an empty
    // active descendant and the normal field ring; only a query edit
    // reconciles the highlight to the first enabled displayed row
    const box = await renderMultiSelect({
      items: ITEMS,
      filterable: true
    });
    await act(async function () {
      box.current.inputProps.onPress();
    });
    assert.equal(box.current.state.open, true);
    assert.equal(box.current.state.highlightedIndex, -1, 'a plain pointer opening invents no highlight');
    assert.equal(box.current.inputProps['aria-activedescendant'], undefined);

    await act(async function () {
      box.current.inputProps.onChangeText('ga');
    });
    assert.equal(box.current.items[0].value, 'c', 'Gamma filters first under "ga"');
    assert.equal(box.current.state.highlightedIndex, 0, 'the edit highlights the first enabled result');

    // Emptying a changed query is still a query edit: the reconcile
    // behavior is retained
    await act(async function () {
      box.current.inputProps.onChangeText('');
    });
    assert.equal(box.current.state.highlightedIndex, 0, 'an emptied query still reconciles to first');

    // The press-only owner's pointer open invents no highlight either:
    // the source keeps an empty active descendant and the ordinary field
    // ring on an unselected pointer-open
    const plain = await renderMultiSelect({ items: ITEMS });
    await act(async function () {
      plain.current.triggerProps.onPress();
    });
    assert.equal(plain.current.state.open, true);
    assert.equal(plain.current.state.highlightedIndex, -1, 'the press-only pointer open invents no highlight');
    assert.equal(plain.current.triggerProps['aria-activedescendant'], undefined);
    // Keyboard traversal keeps its own highlight answers
    await act(async function () {
      plain.current.setOpen(false);
    });
    const down = await keydown(plain, 'ArrowDown', 'triggerProps');
    assert.equal(down.prevented, true);
    assert.equal(plain.current.state.open, true);
    assert.equal(plain.current.state.highlightedIndex, 0, 'a keyboard open still highlights first');

    // A selected value still supplies the base fallback on a pointer open
    const chosen = await renderMultiSelect({ items: ITEMS, defaultValue: ['b'] });
    await act(async function () {
      chosen.current.triggerProps.onPress();
    });
    assert.equal(chosen.current.state.open, true);
    assert.equal(chosen.current.items[0].value, 'b', 'the selected row leads the partition');
    assert.equal(chosen.current.state.highlightedIndex, 0, 'the selected-value fallback still highlights');
  });

  test('an accepted option press returns focus to the input; the imperative toggle and an inert press do not', async function () {
    let focused = 0;
    const box = await renderMultiSelect({
      items: ITEMS,
      filterable: true
    });
    box.current.inputRef.current = {
      focus: function () { focused += 1; }
    };
    await act(async function () {
      box.current.inputProps.onPress();
    });
    assert.equal(focused, 0, 'a pointer open focuses nothing by itself');
    await act(async function () {
      box.current.getOptionProps(0).onPress();
    });
    assert.equal(focused, 1, 'one accepted option press returns focus exactly once');
    assert.deepEqual(box.current.selectedValues, ['a']);

    await act(async function () {
      box.current.toggleValue('b');
    });
    assert.equal(focused, 1, 'the imperative toggle never steals focus');
    assert.deepEqual(box.current.selectedValues, ['a', 'b']);

    // A disabled catalog row is not an accepted choice: the base never
    // calls onSelect for it, so no toggle and no focus
    const disabled = await renderMultiSelect({
      items: [
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta', disabled: true }
      ],
      filterable: true,
      open: true
    });
    disabled.current.inputRef.current = {
      focus: function () { focused += 1; }
    };
    const row = disabled.current.getOptionProps(1);
    assert.equal(row.onPress, undefined, 'a disabled row carries no press');
    assert.equal(focused, 1, 'an inert press focuses nothing');

    // A disabled control's saved press is fully inert
    const off = await renderMultiSelect({
      items: ITEMS,
      disabled: true,
      filterable: true
    });
    off.current.inputRef.current = {
      focus: function () { focused += 1; }
    };
    await act(async function () {
      off.current.inputProps.onPress();
    });
    assert.equal(off.current.state.open, false);
    assert.equal(focused, 1, 'a disabled control focuses nothing');
  });

  test('the decorative caret is hidden from AT and tab focus; the primary and count clear stay exposed', async function () {
    const box = await renderMultiSelect({ items: ITEMS, label: 'Pick', filterable: true });
    const toggle = box.current.toggleProps;
    assert.equal(toggle.accessible, false, 'caret hidden from assistive tech');
    assert.equal(toggle.focusable, false, 'caret not focusable');
    assert.equal(toggle['aria-hidden'], true, 'caret aria-hidden');
    assert.equal(toggle.tabIndex, -1, 'caret stays out of tab order');
    assert.equal(typeof toggle.onPress, 'function', 'caret keeps its press');

    // The filterable input is the named, expanded combobox
    const input = box.current.inputProps;
    assert.equal(input.accessibilityRole, 'combobox');
    assert.notEqual(input['aria-labelledby'], undefined, 'primary stays named');
    assert.equal(input.accessible, undefined, 'primary is not hidden');
    assert.equal(input['aria-hidden'], undefined, 'primary is not aria-hidden');
    assert.equal(input.focusable, undefined, 'primary stays focusable');
    assert.equal(input['aria-expanded'], false);

    // The nonfilterable primary trigger keeps its own exposure too
    const plain = await renderMultiSelect({ items: ITEMS, label: 'Pick' });
    assert.equal(plain.current.triggerProps['aria-hidden'], undefined, 'trigger is not aria-hidden');
    assert.equal(plain.current.triggerProps.accessible, undefined, 'trigger is not hidden');

    // The count-chip clear is a real accessible control, never hidden
    const clear = box.current.clearProps;
    assert.equal(clear.accessible, undefined, 'clear is not hidden');
    assert.equal(clear['aria-hidden'], undefined, 'clear is not aria-hidden');
    assert.notEqual(clear.accessibilityLabel, undefined, 'clear stays named');

    // The retained caret action still opens and closes the list
    await act(async function () { box.current.toggleProps.onPress(); });
    assert.equal(box.current.state.open, true);
    assert.equal(box.current.inputProps['aria-expanded'], true);
    await act(async function () { box.current.toggleProps.onPress(); });
    assert.equal(box.current.state.open, false);
    assert.equal(box.current.inputProps['aria-expanded'], false);

    // Disabled: the caret stays hidden and its press is inert
    await box.render({ items: ITEMS, label: 'Pick', filterable: true, disabled: true });
    assert.equal(box.current.toggleProps['aria-hidden'], true);
    assert.equal(box.current.toggleProps.disabled, true);
    await act(async function () { box.current.toggleProps.onPress(); });
    assert.equal(box.current.state.open, false);
  });

});
