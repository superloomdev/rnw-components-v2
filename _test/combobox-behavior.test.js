// Info: useCombobox's editable single-choice contract.
//
// The hook composes useSelect over the filtered items and owns only the
// raw draft text and its dirty flag: a committed selection shows its
// label and an unfiltered list, editing filters by the draft, and a
// cancel restores the committed label. The selection stays value-keyed;
// item values are unique strings or finite numbers with string labels,
// and the public onChange reports null where the base hook reports
// undefined.

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
Render a probe that calls useCombobox and hands its result back through
a box. `current` always holds the last render's return.

@param {Object} options - useCombobox options

@return {Promise<Object>} - { current, render, unmount }
*********************************************************************/
async function renderCombobox (options) {

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const item = { container: container, root: root, unmounted: false };
  mounted.push(item);

  const box = { current: undefined };
  function Probe (props) {
    box.current = behaviors.useCombobox(props);
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
Fire the input's keydown handler with a fake event that records whether
the behavior claimed the default.

@param {Object} box   - The probe's { current } box
@param {String} key   - Event key
@param {Object} extra - Extra event fields (IME composition)

@return {Promise<Object>} - The fake event after dispatch
*********************************************************************/
async function keydown (box, key, extra) {

  const event = Object.assign({
    key: key,
    prevented: false,
    preventDefault: function () {
      this.prevented = true;
    }
  }, extra);
  await act(async function () {
    box.current.inputProps.onKeyDown(event);
  });
  return event;

}


describe('behaviors: useCombobox draft and selection', function () {

  test('an empty mount notifies nothing; defaultValue shows its label and browses unfiltered', async function () {
    const calls = [];
    const box = await renderCombobox({
      items: ITEMS,
      onChange: function (value) { calls.push(['change', value]); },
      onInputChange: function (text) { calls.push(['input', text]); },
      onOpenChange: function (next) { calls.push(['open', next]); }
    });
    assert.equal(box.current.state.inputValue, '');
    assert.equal(box.current.state.query, '');
    assert.equal(box.current.state.populated, false);
    assert.equal(box.current.value, null);
    assert.equal(box.current.selectedItem, null);
    assert.deepEqual(calls, [], 'a mount notifies nothing');

    // A numeric-zero default shows its label and is a real selection
    const zero = await renderCombobox({
      items: [
        { value: 0, label: 'Zero' },
        { value: 1, label: 'One' }
      ],
      defaultValue: 0
    });
    assert.equal(zero.current.state.inputValue, 'Zero');
    assert.equal(zero.current.value, 0);
    assert.equal(zero.current.selectedItem.label, 'Zero');
    assert.equal(zero.current.state.selectedIndex, 0);

    // A pointer press in the input opens the full, unfiltered list
    await act(async function () {
      zero.current.inputProps.onPress();
    });
    assert.equal(zero.current.state.open, true);
    assert.equal(zero.current.state.query, '', 'a committed label opens unfiltered');
    assert.equal(zero.current.items.length, 2);
  });

  test('editing filters and highlights the first enabled match; an empty query restores all', async function () {
    const items = [
      { value: 'a', label: 'Alpha' },
      { value: 'g', label: 'Gamma' },
      { value: 'gx', label: 'Gamma XL', disabled: true },
      { value: 'z', label: 'Zeta' }
    ];
    const box = await renderCombobox({ items: items });
    await act(async function () {
      box.current.inputProps.onChangeText('GA');
    });
    assert.equal(box.current.state.inputValue, 'GA');
    assert.equal(box.current.state.query, 'GA');
    assert.equal(box.current.state.open, true, 'typing opens the list');
    assert.deepEqual(box.current.items.map(function (item) { return item.value; }), ['g', 'gx'],
      'disabled matches stay visible');
    assert.equal(box.current.state.highlightedIndex, 0, 'the first enabled result is highlighted after the filter lands');
    assert.equal(box.current.inputProps['aria-activedescendant'], box.current.getOptionProps(0).nativeID);

    // A disabled match cannot be chosen
    assert.equal(box.current.getOptionProps(1).onPress, undefined);
    assert.equal(box.current.getOptionProps(1)['aria-disabled'], true);

    // Emptying the draft restores the full list
    await act(async function () {
      box.current.inputProps.onChangeText('');
    });
    assert.equal(box.current.state.query, '');
    assert.equal(box.current.items.length, 4, 'an empty query restores all items');
  });

  test('a custom predicate receives exactly { item, inputValue } and decides membership', async function () {
    const seen = [];
    const box = await renderCombobox({
      items: ITEMS,
      shouldFilterItem: function (args) {
        seen.push({ item: args.item, inputValue: args.inputValue });
        return args.item.value === 'b';
      }
    });
    assert.ok(seen.length >= ITEMS.length);
    assert.equal(seen[0].item, ITEMS[0], 'the predicate receives the item record itself');
    assert.equal(seen[0].inputValue, '');
    assert.deepEqual(box.current.items.map(function (item) { return item.value; }), ['b'],
      'the predicate decides membership');

    seen.length = 0;
    await act(async function () {
      box.current.inputProps.onChangeText('eta');
    });
    assert.equal(seen[0].inputValue, 'eta', 'the predicate receives the raw query');
    assert.deepEqual(box.current.items.map(function (item) { return item.value; }), ['b']);
  });

  test('Space, Home, End, ArrowLeft and ArrowRight stay native text editing', async function () {
    const calls = [];
    const box = await renderCombobox({
      items: ITEMS,
      onChange: function (value) { calls.push(value); }
    });
    await act(async function () {
      box.current.inputProps.onPress();
    });
    await act(async function () {
      box.current.inputProps.onChangeText('a ');
    });
    assert.equal(box.current.state.inputValue, 'a ', 'a typed space survives in the draft');
    for (const key of [' ', 'Home', 'End', 'ArrowLeft', 'ArrowRight']) {
      const event = await keydown(box, key);
      assert.equal(event.prevented, false, key + ' never claims the default');
    }
    assert.deepEqual(calls, [], 'no editing key selects');
    assert.equal(box.current.value, null);
    assert.equal(box.current.state.inputValue, 'a ');
  });

  test('arrows skip and wrap over filtered rows; Enter commits, closes, shows the label and emits once', async function () {
    const items = [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta', disabled: true },
      { value: 'c', label: 'Gamma' }
    ];
    const inputCalls = [];
    const valueCalls = [];
    const box = await renderCombobox({
      items: items,
      onInputChange: function (text) { inputCalls.push(text); },
      onChange: function (value) { valueCalls.push(value); }
    });
    let event = await keydown(box, 'ArrowDown');
    assert.equal(event.prevented, true);
    assert.equal(box.current.state.open, true);
    assert.equal(box.current.state.highlightedIndex, 0);
    await keydown(box, 'ArrowDown');
    assert.equal(box.current.state.highlightedIndex, 2, 'the disabled row is skipped');
    await keydown(box, 'ArrowDown');
    assert.equal(box.current.state.highlightedIndex, 0, 'Down wraps');
    await keydown(box, 'ArrowUp');
    assert.equal(box.current.state.highlightedIndex, 2, 'Up wraps back');

    event = await keydown(box, 'Enter');
    assert.equal(event.prevented, true);
    assert.deepEqual(valueCalls, ['c']);
    assert.deepEqual(inputCalls, ['Gamma'], 'the committed label is requested once');
    assert.equal(box.current.state.open, false);
    assert.equal(box.current.state.inputValue, 'Gamma');
    assert.equal(box.current.value, 'c');
    assert.equal(box.current.selectedItem.label, 'Gamma');
  });

  test('a controlled selection and controlled text wait for their own echoes', async function () {
    const valueCalls = [];
    const inputCalls = [];
    const box = await renderCombobox({
      items: ITEMS,
      value: 'b',
      inputValue: '',
      onChange: function (value) { valueCalls.push(value); },
      onInputChange: function (text) { inputCalls.push(text); }
    });
    assert.equal(box.current.state.inputValue, '', 'the host text is displayed');
    assert.equal(box.current.items.length, 3, 'an empty controlled query shows all');

    // A user selection reports the request but changes nothing itself
    await act(async function () {
      box.current.getOptionProps(0).onPress();
    });
    assert.deepEqual(valueCalls, ['a'], 'the request reports the pressed value');
    assert.equal(box.current.value, 'b', 'a controlled selection waits for the echo');
    assert.deepEqual(inputCalls, ['Alpha'], 'the next text is still requested');
    assert.equal(box.current.state.inputValue, '', 'controlled text waits for its own echo');

    // An edit under controlled text requests without applying
    await act(async function () {
      box.current.inputProps.onChangeText('et');
    });
    assert.deepEqual(inputCalls.slice(-1), ['et']);
    assert.equal(box.current.state.inputValue, '');

    // Independent echoes apply independently
    await box.render({ items: ITEMS, value: 'a', inputValue: '' });
    assert.equal(box.current.value, 'a');
    assert.equal(box.current.state.inputValue, '', 'the text echo is the host\'s answer');
    await box.render({ items: ITEMS, value: 'a', inputValue: 'et' });
    assert.equal(box.current.state.inputValue, 'et');
    assert.equal(box.current.items.length, 1, 'the controlled query always filters');
  });

  test('Escape, Tab and dismiss restore the committed label; only the real text change is requested', async function () {
    const inputCalls = [];
    const valueCalls = [];
    const box = await renderCombobox({
      items: ITEMS,
      defaultValue: 'b',
      onInputChange: function (text) { inputCalls.push(text); },
      onChange: function (value) { valueCalls.push(value); }
    });
    assert.equal(box.current.state.inputValue, 'Beta');
    await act(async function () {
      box.current.inputProps.onPress();
    });
    await act(async function () {
      box.current.inputProps.onChangeText('zzz');
    });
    assert.equal(box.current.state.inputValue, 'zzz');

    let event = await keydown(box, 'Escape');
    assert.equal(event.prevented, true, 'an open dirty Escape is handled');
    assert.equal(box.current.state.open, false);
    assert.equal(box.current.state.inputValue, 'Beta', 'Escape restores the committed label');
    assert.deepEqual(valueCalls, [], 'cancel never notifies a selection');
    assert.deepEqual(inputCalls, ['zzz', 'Beta'], 'the restoration is the only followup request');

    // Tab restores and closes without claiming the default
    await act(async function () {
      box.current.inputProps.onPress();
    });
    await act(async function () {
      box.current.inputProps.onChangeText('alp');
    });
    event = await keydown(box, 'Tab');
    assert.equal(event.prevented, false, 'Tab never prevents');
    assert.equal(box.current.state.open, false);
    assert.equal(box.current.state.inputValue, 'Beta');

    // An explicit dismiss does the same
    await act(async function () {
      box.current.inputProps.onPress();
      box.current.inputProps.onChangeText('gam');
    });
    await act(async function () {
      box.current.dismiss();
    });
    assert.equal(box.current.state.open, false);
    assert.equal(box.current.state.inputValue, 'Beta');
    assert.deepEqual(valueCalls, []);
  });

  test('clearing numeric zero reports an empty selection once, closes and keeps input focus', async function () {
    const inputCalls = [];
    const valueCalls = [];
    const box = await renderCombobox({
      items: [
        { value: 0, label: 'Zero' },
        { value: 1, label: 'One' }
      ],
      defaultValue: 0,
      onInputChange: function (text) { inputCalls.push(text); },
      onChange: function (value) { valueCalls.push(value); }
    });
    let focused = 0;
    box.current.inputRef.current = { focus: function () { focused = focused + 1; } };
    await act(async function () {
      box.current.inputProps.onPress();
    });
    await act(async function () {
      box.current.clearProps.onPress();
    });
    assert.deepEqual(valueCalls, [null], 'clear reports null once');
    assert.deepEqual(inputCalls, [''], 'clear requests the empty text once');
    assert.equal(box.current.value, null);
    assert.equal(box.current.state.inputValue, '');
    assert.equal(box.current.state.open, false);
    assert.equal(focused, 1, 'the input keeps focus');

    // Clearing an already-empty combobox requests nothing
    await act(async function () {
      box.current.clearProps.onPress();
    });
    assert.deepEqual(valueCalls, [null]);
    assert.deepEqual(inputCalls, ['']);
    assert.equal(focused, 2);
  });

  test('retained handlers go inert at the disabled boundary and after unmount', async function () {
    const inputCalls = [];
    const valueCalls = [];
    const box = await renderCombobox({
      items: ITEMS,
      onInputChange: function (text) { inputCalls.push(text); },
      onChange: function (value) { valueCalls.push(value); }
    });
    const edit = box.current.inputProps.onChangeText;
    const keys = box.current.inputProps.onKeyDown;
    const toggle = box.current.toggleProps.onPress;
    const clear = box.current.clearProps.onPress;
    const option = box.current.getOptionProps(0).onPress;
    const dismiss = box.current.dismiss;

    // Disabled: every retained path is inert
    await box.render({ items: ITEMS, disabled: true });
    const event = { key: 'ArrowDown', prevented: false, preventDefault: function () { this.prevented = true; } };
    await act(async function () {
      edit('xx');
      keys(event);
      toggle();
      clear();
      option();
      dismiss();
    });
    assert.equal(event.prevented, false);
    assert.equal(box.current.state.open, false);
    assert.equal(box.current.state.inputValue, '');
    assert.deepEqual(inputCalls, []);
    assert.deepEqual(valueCalls, []);

    // Re-enabled, the latest callbacks are used
    const inputCalls2 = [];
    const valueCalls2 = [];
    await box.render({
      items: ITEMS,
      onInputChange: function (text) { inputCalls2.push(text); },
      onChange: function (value) { valueCalls2.push(value); }
    });
    await act(async function () {
      box.current.inputProps.onChangeText('ga');
    });
    assert.deepEqual(inputCalls2, ['ga'], 'the rerendered callback is the live one');
    assert.deepEqual(inputCalls, []);
    await act(async function () {
      // 'ga' filters to Gamma alone, so the pressed row is index 0
      box.current.getOptionProps(0).onPress();
    });
    assert.deepEqual(valueCalls2, ['c']);
    assert.deepEqual(valueCalls, []);

    // Unmounted: the same retained set does nothing and never throws
    await box.unmount();
    await act(async function () {
      edit('xx');
      keys({ key: 'Enter' });
      toggle();
      clear();
      option();
      dismiss();
    });
    assert.deepEqual(inputCalls2, ['ga', 'Gamma']);
    assert.deepEqual(valueCalls2, ['c']);
  });

  test('the selection and option ids follow the value across reorder, filter, removal and re-addition', async function () {
    const box = await renderCombobox({ items: ITEMS, defaultValue: 'b' });
    const id = box.current.getOptionProps(1).nativeID;
    assert.equal(box.current.value, 'b');
    assert.equal(box.current.state.inputValue, 'Beta');

    // Reorder: the selection and its id track the value
    await box.render({ items: [ITEMS[2], ITEMS[0], ITEMS[1]], defaultValue: 'b' });
    assert.equal(box.current.value, 'b');
    assert.equal(box.current.state.selectedIndex, 2);
    assert.equal(box.current.getOptionProps(2).nativeID, id, 'the option id is per-value');

    // Filtering the selection out retains the stored value
    await act(async function () {
      box.current.inputProps.onChangeText('alpha');
    });
    assert.deepEqual(box.current.items.map(function (item) { return item.value; }), ['a']);
    assert.equal(box.current.state.selectedIndex, -1, 'a filtered-out selection has no index');
    assert.equal(box.current.value, 'b', 'the stored selection is retained');
    await act(async function () {
      box.current.dismiss();
    });
    assert.equal(box.current.state.inputValue, 'Beta', 'cancel restores the committed label');

    // Removal retains the value; re-addition restores the index and id
    await box.render({ items: [ITEMS[2], ITEMS[0]], defaultValue: 'b' });
    assert.equal(box.current.state.selectedIndex, -1);
    assert.equal(box.current.value, 'b');
    assert.equal(box.current.selectedItem, null);
    await box.render({ items: ITEMS, defaultValue: 'b' });
    assert.equal(box.current.state.selectedIndex, 1);
    assert.equal(box.current.getOptionProps(1).nativeID, id);
  });

  test('external value and text echoes and later defaults notify nothing', async function () {
    const calls = [];
    const props = {
      items: ITEMS,
      value: 'a',
      inputValue: 'a',
      onChange: function (value) { calls.push(['change', value]); },
      onInputChange: function (text) { calls.push(['input', text]); }
    };
    const box = await renderCombobox(props);
    await box.render(Object.assign({}, props, { value: 'b', inputValue: 'b' }));
    assert.equal(box.current.value, 'b');
    assert.equal(box.current.state.inputValue, 'b');
    assert.deepEqual(calls, [], 'an external echo notifies nothing');

    // Later default changes re-seed nothing and notify nothing
    const uncontrolled = await renderCombobox({ items: ITEMS, defaultValue: 'a', defaultInputValue: 'draft' });
    assert.equal(uncontrolled.current.state.inputValue, 'draft');
    await uncontrolled.render({ items: ITEMS, defaultValue: 'c', defaultInputValue: 'other' });
    assert.equal(uncontrolled.current.value, 'a', 'a changed defaultValue re-seeds nothing');
    assert.equal(uncontrolled.current.state.inputValue, 'draft', 'a changed defaultInputValue re-seeds nothing');

    // A prop-driven value change silently resets an in-progress draft
    await act(async function () {
      box.current.inputProps.onChangeText('gam');
    });
    assert.equal(calls.length > 0, true);
    calls.length = 0;
    await box.render(Object.assign({}, props, { value: 'c', inputValue: 'c' }));
    assert.deepEqual(calls, [], 'the prop-driven value change stays silent');
  });

  test('no results gives no active descendant and Enter never invents an item', async function () {
    const calls = [];
    const box = await renderCombobox({
      items: ITEMS,
      onChange: function (value) { calls.push(value); }
    });
    await act(async function () {
      box.current.inputProps.onChangeText('zzz');
    });
    assert.equal(box.current.state.open, true);
    assert.equal(box.current.items.length, 0);
    assert.equal(box.current.state.highlightedIndex, -1);
    assert.equal(box.current.inputProps['aria-activedescendant'], undefined, 'no results, no active descendant');
    const event = await keydown(box, 'Enter');
    assert.equal(event.prevented, true);
    assert.deepEqual(calls, [], 'Enter on an empty result invents nothing');
    assert.equal(box.current.value, null);
    assert.equal(box.current.state.inputValue, 'zzz', 'arbitrary text stays a draft, never a value');
  });

  test('blur only tracks focus; the option press still finishes and an explicit dismiss restores', async function () {
    const valueCalls = [];
    const box = await renderCombobox({
      items: ITEMS,
      onChange: function (value) { valueCalls.push(value); }
    });
    await act(async function () {
      box.current.inputProps.onFocus();
    });
    assert.equal(box.current.state.focused, true);
    await act(async function () {
      box.current.inputProps.onChangeText('ga');
    });
    assert.equal(box.current.state.open, true);
    await act(async function () {
      box.current.inputProps.onBlur();
    });
    assert.equal(box.current.state.focused, false);
    assert.equal(box.current.state.open, true, 'blur never unmounts the menu');
    await act(async function () {
      box.current.getOptionProps(0).onPress();
    });
    assert.deepEqual(valueCalls, ['c'], 'the option press after blur still lands');
    assert.equal(box.current.state.inputValue, 'Gamma');

    await act(async function () {
      box.current.inputProps.onChangeText('alp');
    });
    await act(async function () {
      box.current.dismiss();
    });
    assert.equal(box.current.state.inputValue, 'Gamma', 'dismiss restores the committed label');
    assert.equal(box.current.state.open, false);
  });

  test('a composing IME Enter neither commits nor claims the default', async function () {
    const calls = [];
    const box = await renderCombobox({
      items: ITEMS,
      onChange: function (value) { calls.push(value); }
    });
    await act(async function () {
      box.current.inputProps.onChangeText('ga');
    });
    assert.equal(box.current.state.highlightedIndex, 0);
    let event = await keydown(box, 'Enter', { isComposing: true });
    assert.equal(event.prevented, false, 'an IME Enter claims nothing');
    assert.deepEqual(calls, []);
    assert.equal(box.current.state.open, true, 'the composition left the list alone');
    event = await keydown(box, 'Enter', { nativeEvent: { isComposing: true } });
    assert.equal(event.prevented, false, 'the nativeEvent form is also ignored');
    assert.deepEqual(calls, []);
  });

  test('items require unique string or finite-number values and string labels', async function () {
    await assert.rejects(renderCombobox({ items: [{ value: 'a', label: 'A' }, { value: 'a', label: 'B' }] }), TypeError, 'duplicate values');
    await assert.rejects(renderCombobox({ items: [{ value: true, label: 'A' }] }), TypeError, 'a boolean value');
    await assert.rejects(renderCombobox({ items: [{ value: {}, label: 'A' }] }), TypeError, 'an object value');
    await assert.rejects(renderCombobox({ items: [{ value: NaN, label: 'A' }] }), TypeError, 'a non-finite value');
    await assert.rejects(renderCombobox({ items: [{ value: Infinity, label: 'A' }] }), TypeError, 'infinite value');
    await assert.rejects(renderCombobox({ items: [{ value: null, label: 'A' }] }), TypeError, 'null is reserved');
    await assert.rejects(renderCombobox({ items: [{ label: 'A' }] }), TypeError, 'a missing value');
    await assert.rejects(renderCombobox({ items: [{ value: 'a', label: 5 }] }), TypeError, 'a non-string label');
    await assert.rejects(renderCombobox({ items: [null] }), TypeError, 'a null item');
    const box = await renderCombobox({ items: 'not an array' });
    assert.deepEqual(box.current.items, [], 'a non-array falls back to empty');
  });

  test('reselecting the committed value canonicalizes the draft without a value request', async function () {
    // Uncontrolled, chosen through the option press: type 'al', reselect
    // Alpha - the draft snaps to the label, the filter clears and the
    // list closes, but onChange stays silent because nothing changed
    const inputCalls = [];
    const valueCalls = [];
    const box = await renderCombobox({
      items: ITEMS,
      defaultValue: 'a',
      onInputChange: function (text) { inputCalls.push(text); },
      onChange: function (value) { valueCalls.push(value); }
    });
    await act(async function () {
      box.current.inputProps.onChangeText('al');
    });
    assert.equal(box.current.state.inputValue, 'al');
    await act(async function () {
      box.current.getOptionProps(0).onPress();
    });
    assert.equal(box.current.state.inputValue, 'Alpha', 'the reselect canonicalizes the draft');
    assert.equal(box.current.state.query, '', 'a committed label browses unfiltered');
    assert.equal(box.current.state.open, false);
    assert.deepEqual(valueCalls, [], 'a reselect never fakes a value change');
    assert.deepEqual(inputCalls, ['al', 'Alpha'], 'only the text requests went out');

    // The same path through Enter on the highlighted match
    const inputCalls2 = [];
    const valueCalls2 = [];
    const keyed = await renderCombobox({
      items: ITEMS,
      defaultValue: 'a',
      onInputChange: function (text) { inputCalls2.push(text); },
      onChange: function (value) { valueCalls2.push(value); }
    });
    await act(async function () {
      keyed.current.inputProps.onChangeText('al');
    });
    assert.equal(keyed.current.state.highlightedIndex, 0, 'the filtered first match is highlighted');
    const event = await keydown(keyed, 'Enter');
    assert.equal(event.prevented, true);
    assert.equal(keyed.current.state.inputValue, 'Alpha');
    assert.equal(keyed.current.state.open, false);
    assert.deepEqual(valueCalls2, []);
    assert.deepEqual(inputCalls2, ['al', 'Alpha']);

    // A controlled selection with an uncontrolled query canonicalizes
    // the same way; the value answer was already 'a'
    const inputCalls3 = [];
    const valueCalls3 = [];
    const controlled = await renderCombobox({
      items: ITEMS,
      value: 'a',
      onInputChange: function (text) { inputCalls3.push(text); },
      onChange: function (value) { valueCalls3.push(value); }
    });
    await act(async function () {
      controlled.current.inputProps.onChangeText('al');
    });
    await act(async function () {
      controlled.current.getOptionProps(0).onPress();
    });
    assert.equal(controlled.current.state.inputValue, 'Alpha');
    assert.deepEqual(valueCalls3, []);
    assert.deepEqual(inputCalls3, ['al', 'Alpha']);

    // A controlled text host gets the canonical text request but keeps
    // its own answer until the echo
    const inputCalls4 = [];
    const valueCalls4 = [];
    const host = await renderCombobox({
      items: ITEMS,
      value: 'a',
      inputValue: 'al',
      onInputChange: function (text) { inputCalls4.push(text); },
      onChange: function (value) { valueCalls4.push(value); }
    });
    await act(async function () {
      host.current.getOptionProps(0).onPress();
    });
    assert.deepEqual(inputCalls4, ['Alpha'], 'the canonical text is requested');
    assert.equal(host.current.state.inputValue, 'al', 'controlled text waits for the echo');
    assert.deepEqual(valueCalls4, []);
  });

  test('a controlled-empty selection clears real text only and requests no value', async function () {
    const inputCalls = [];
    const valueCalls = [];
    const box = await renderCombobox({
      items: ITEMS,
      value: null,
      onInputChange: function (text) { inputCalls.push(text); },
      onChange: function (value) { valueCalls.push(value); }
    });
    assert.equal(box.current.value, null);
    // Clearing an already-empty controlled selection twice emits nothing
    await act(async function () {
      box.current.clearProps.onPress();
      box.current.clearProps.onPress();
    });
    assert.deepEqual(inputCalls, []);
    assert.deepEqual(valueCalls, [], 'the controlled-empty null is not re-reported');

    // A controlled empty with a live draft requests the empty text once,
    // still without a value request
    const inputCalls2 = [];
    const valueCalls2 = [];
    const drafted = await renderCombobox({
      items: ITEMS,
      value: null,
      defaultInputValue: 'x',
      onInputChange: function (text) { inputCalls2.push(text); },
      onChange: function (value) { valueCalls2.push(value); }
    });
    assert.equal(drafted.current.state.inputValue, 'x');
    await act(async function () {
      drafted.current.clearProps.onPress();
    });
    assert.deepEqual(inputCalls2, [''], 'the draft is requested empty once');
    assert.equal(drafted.current.state.inputValue, '');
    assert.deepEqual(valueCalls2, []);
    await act(async function () {
      drafted.current.clearProps.onPress();
    });
    assert.deepEqual(inputCalls2, ['']);
    assert.deepEqual(valueCalls2, []);

    // A same-act repeated clear composes: the empty request and the null
    // request each fire exactly once
    const inputCalls3 = [];
    const valueCalls3 = [];
    const uncontrolled = await renderCombobox({
      items: ITEMS,
      defaultValue: 'b',
      onInputChange: function (text) { inputCalls3.push(text); },
      onChange: function (value) { valueCalls3.push(value); }
    });
    await act(async function () {
      uncontrolled.current.inputProps.onChangeText('alp');
    });
    await act(async function () {
      uncontrolled.current.clearProps.onPress();
      uncontrolled.current.clearProps.onPress();
    });
    assert.deepEqual(inputCalls3, ['alp', '']);
    assert.deepEqual(valueCalls3, [null], 'the clear reports null exactly once');
    assert.equal(uncontrolled.current.value, null);
  });

  test('a host-provided uncommitted query is cancelled by Escape and Tab without mutating it', async function () {
    const inputCalls = [];
    const valueCalls = [];
    const openCalls = [];
    // Committed 'b' shows its label, but the host's uncommitted 'ga'
    // stands in for the text while the list stays closed
    const box = await renderCombobox({
      items: ITEMS,
      value: 'b',
      inputValue: 'ga',
      open: false,
      onInputChange: function (text) { inputCalls.push(text); },
      onChange: function (value) { valueCalls.push(value); },
      onOpenChange: function (next) { openCalls.push(next); }
    });
    assert.equal(box.current.state.inputValue, 'ga');
    assert.equal(box.current.state.open, false);

    let event = await keydown(box, 'Escape');
    assert.equal(event.prevented, true, 'Escape claims the default while restoring');
    assert.deepEqual(inputCalls, ['Beta'], 'the committed label is requested');
    assert.equal(box.current.state.inputValue, 'ga', 'the host text is never mutated');
    assert.deepEqual(valueCalls, [], 'a cancel never notifies a selection');
    assert.deepEqual(openCalls, [], 'an already-closed answer emits nothing');

    event = await keydown(box, 'Tab');
    assert.equal(event.prevented, false, 'Tab never claims the default');
    assert.deepEqual(inputCalls, ['Beta', 'Beta'], 'Tab restores the same way');
    assert.deepEqual(valueCalls, []);
    assert.equal(box.current.value, 'b');
  });

  test('inputValue, defaultInputValue and edit payloads must be strings', async function () {
    await assert.rejects(renderCombobox({ items: ITEMS, inputValue: 5 }), TypeError, 'a numeric inputValue');
    await assert.rejects(renderCombobox({ items: ITEMS, inputValue: null }), TypeError, 'a null inputValue');
    await assert.rejects(renderCombobox({ items: ITEMS, inputValue: true }), TypeError, 'a boolean inputValue');
    await assert.rejects(renderCombobox({ items: ITEMS, defaultInputValue: 7 }), TypeError, 'a numeric defaultInputValue');
    await assert.rejects(renderCombobox({ items: ITEMS, defaultInputValue: {} }), TypeError, 'an object defaultInputValue');

    const box = await renderCombobox({ items: ITEMS });
    assert.throws(function () {
      box.current.inputProps.onChangeText(42);
    }, TypeError, 'a numeric edit throws instead of displaying');
    assert.throws(function () {
      box.current.inputProps.onChangeText(undefined);
    }, TypeError, 'a missing edit payload throws');
    await act(async function () {
      box.current.inputProps.onChangeText('ga');
    });
    assert.equal(box.current.state.inputValue, 'ga', 'normal string payloads are unchanged');
  });

  test('editing filters without changing the committed selection', async function () {
    const inputCalls = [];
    const valueCalls = [];
    const box = await renderCombobox({
      items: ITEMS,
      defaultValue: 'b',
      onInputChange: function (text) { inputCalls.push(text); },
      onChange: function (value) { valueCalls.push(value); }
    });
    assert.equal(box.current.state.inputValue, 'Beta');
    await act(async function () {
      box.current.inputProps.onChangeText('ga');
    });
    assert.equal(box.current.state.inputValue, 'ga');
    assert.equal(box.current.value, 'b', 'the committed selection does not follow the query');
    assert.equal(box.current.selectedItem.label, 'Beta');
    assert.deepEqual(box.current.items.map(function (item) { return item.value; }), ['c'],
      'the query filters to Gamma alone');
    assert.deepEqual(valueCalls, [], 'no selection request');
    assert.deepEqual(inputCalls, ['ga'], 'only the text request went out');
  });

  test('a refused controlled clear remains requestable', async function () {
    const inputCalls = [];
    const valueCalls = [];
    const items = [
      { value: 0, label: 'Zero' },
      { value: 1, label: 'One' }
    ];
    const callbacks = {
      onInputChange: function (text) { inputCalls.push(text); },
      onChange: function (value) { valueCalls.push(value); }
    };
    const box = await renderCombobox(Object.assign({ items: items, value: 0 }, callbacks));
    box.current.inputRef.current = { focus: function () {} };
    assert.equal(box.current.state.inputValue, 'Zero');

    // Two separate clear acts with no parent echo: the refused request
    // must still be repeatable, because the controlled answer never
    // moved and the local setters bail without a rerender
    const clear = box.current.clearProps.onPress;
    await act(async function () {
      clear();
    });
    await act(async function () {
      clear();
    });
    assert.deepEqual(valueCalls, [null, null], 'a refused clear stays requestable');
    assert.deepEqual(inputCalls, ['', ''], 'each clear requests the empty text while a label still shows');
    assert.equal(box.current.value, 0, 'the controlled answer is still 0');
    assert.equal(box.current.state.inputValue, 'Zero');

    // After the owner echoes the empty answer, a further clear emits no
    // value or text request
    await box.render(Object.assign({ items: items, value: null }, callbacks));
    await act(async function () {
      box.current.clearProps.onPress();
    });
    assert.deepEqual(valueCalls, [null, null], 'the controlled-empty clear emits nothing');
    assert.deepEqual(inputCalls, ['', '']);
  });

  test('two saved caret presses in one act toggle open then closed; a refused controlled open re-requests', async function () {
    const openCalls = [];
    const box = await renderCombobox({
      items: ITEMS,
      onOpenChange: function (value) { openCalls.push(value); }
    });
    box.current.inputRef.current = { focus() {} };
    const caret = box.current.toggleProps.onPress;
    await act(async function () {
      caret();
      caret();
    });
    assert.deepEqual(openCalls, [true, false],
      'each press reads the latest live open answer');
    assert.equal(box.current.state.open, false);

    const controlledCalls = [];
    const refused = await renderCombobox({
      items: ITEMS,
      open: false,
      onOpenChange: function (value) { controlledCalls.push(value); }
    });
    refused.current.inputRef.current = { focus() {} };
    await act(async function () {
      refused.current.toggleProps.onPress();
      refused.current.toggleProps.onPress();
    });
    assert.deepEqual(controlledCalls, [true, true],
      'a refused controlled open re-requests, never an optimistic false');
    assert.equal(refused.current.state.open, false);
  });

  test('a closed ArrowDown and Enter in one act commit the first enabled option', async function () {
    const valueCalls = [];
    const textCalls = [];
    const box = await renderCombobox({
      items: ITEMS,
      onChange: function (value) { valueCalls.push(value); },
      onInputChange: function (text) { textCalls.push(text); }
    });
    await act(async function () {
      box.current.inputProps.onKeyDown({ key: 'ArrowDown', preventDefault: function () {} });
      box.current.inputProps.onKeyDown({ key: 'Enter', preventDefault: function () {} });
    });
    assert.deepEqual(valueCalls, ['a'],
      'the same-act highlight commits instead of a stale empty read');
    assert.deepEqual(textCalls, ['Alpha']);
    assert.equal(box.current.state.inputValue, 'Alpha');
    assert.equal(box.current.value, 'a');
    assert.equal(box.current.state.open, false);
  });

});
