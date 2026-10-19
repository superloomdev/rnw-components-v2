// Info: useSelect's value-keyed selection contract.
//
// The selection and highlight are stored by value, not ordinal, so a
// reorder, removal or re-addition of items keeps the selection on its
// option, a retained option callback can never commit whatever row now
// sits at its captured index, and per-value option ids feed both the DOM
// key and the trigger's aria-activedescendant. Opaque values stay opaque:
// the number 0 and the string '0' are distinct, object identity is kept,
// and a function value is stored, never invoked. `defaultValue` and
// `closeOnSelect` are internal hook options only; the public Select and
// Dropdown props do not expose them.

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
  Object.freeze({ value: 'a', label: 'A' }),
  Object.freeze({ value: 'b', label: 'B' }),
  Object.freeze({ value: 'c', label: 'C' })
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
Render a probe that calls useSelect and hands its result back through a
box. `current` always holds the last render's return, since a hook's
closures and state are rebuilt every render.

@param {Object} options - useSelect options

@return {Promise<Object>} - { current, render, unmount }
*********************************************************************/
async function renderSelect (options) {

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const item = { container: container, root: root, unmounted: false };
  mounted.push(item);

  const box = { current: undefined };
  function Probe (props) {
    box.current = behaviors.useSelect(props);
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
Fire the trigger's keydown handler with a fake event that records whether
the behavior claimed the default.

@param {Object} box - The probe's { current } box
@param {String} key - Event key

@return {Promise<Object>} - The fake event after dispatch
*********************************************************************/
async function keydown (box, key) {

  const event = {
    key: key,
    prevented: false,
    preventDefault: function () {
      this.prevented = true;
    }
  };
  await act(async function () {
    box.current.triggerProps.onKeyDown(event);
  });
  return event;

}


describe('behaviors: useSelect value-keyed selection', function () {

  test('selection follows its value when items reorder', async function () {
    const calls = [];
    const onChange = function (value) {
      calls.push(value);
    };
    const box = await renderSelect({ items: ITEMS, onChange: onChange });
    await act(async function () {
      box.current.getOptionProps(1).onPress();
    });
    assert.equal(box.current.value, 'b');
    assert.equal(box.current.state.selectedIndex, 1);
    assert.deepEqual(calls, ['b']);

    // Reorder: the selection tracks its value to the new index
    await box.render({ items: [ITEMS[2], ITEMS[0], ITEMS[1]], onChange: onChange });
    assert.equal(box.current.value, 'b');
    assert.equal(box.current.state.selectedIndex, 2);
    assert.deepEqual(calls, ['b'], 'no callback on reorder');

    // Removal derives -1 and reports nothing; the value itself is retained
    await box.render({ items: [ITEMS[2], ITEMS[0]], onChange: onChange });
    assert.equal(box.current.state.selectedIndex, -1);
    assert.equal(box.current.value, 'b');
    assert.deepEqual(calls, ['b'], 'no callback on removal');

    // Re-adding the option restores the same selection without a callback
    await box.render({ items: [ITEMS[2], ITEMS[0], ITEMS[1]], onChange: onChange });
    assert.equal(box.current.state.selectedIndex, 2);
    assert.equal(box.current.value, 'b');
    assert.deepEqual(calls, ['b'], 'no callback on re-addition');
  });

  test('controlled selection reports the request and waits for the parent echo', async function () {
    const calls = [];
    const box = await renderSelect({
      items: ITEMS,
      value: 'b',
      onChange: function (value) {
        calls.push(value);
      }
    });
    await act(async function () {
      box.current.getOptionProps(0).onPress();
    });
    assert.deepEqual(calls, ['a']);
    assert.equal(box.current.value, 'b', 'a controlled selection does not move itself');
    assert.equal(box.current.state.selectedIndex, 1);
    await box.render({ items: ITEMS, value: 'a' });
    assert.equal(box.current.value, 'a');
    assert.equal(box.current.state.selectedIndex, 0);
  });

  test('defaultValue seeds the uncontrolled selection once with no mount callback', async function () {
    const calls = [];
    const box = await renderSelect({
      items: ITEMS,
      defaultValue: 'b',
      onChange: function (value) {
        calls.push(value);
      }
    });
    assert.equal(box.current.value, 'b');
    assert.equal(box.current.state.selectedIndex, 1);
    assert.deepEqual(calls, [], 'no notification for the seeded selection');
    // A later defaultValue prop change re-seeds nothing
    await box.render({ items: ITEMS, defaultValue: 'c' });
    assert.equal(box.current.value, 'b');
    assert.deepEqual(calls, []);
  });

  test('number 0 and string 0 stay distinct; objects and functions stay opaque and uninvoked', async function () {
    const objectValue = { marker: 'obj' };
    let invoked = 0;
    const functionValue = function () {
      invoked = invoked + 1;
      return 'invoked';
    };
    const items = [
      { value: 0, label: 'zero' },
      { value: '0', label: 'zero string' },
      { value: objectValue, label: 'object' },
      { value: functionValue, label: 'function' }
    ];
    const calls = [];
    const box = await renderSelect({
      items: items,
      onChange: function (value) {
        calls.push(value);
      }
    });
    await act(async function () {
      box.current.getOptionProps(0).onPress();
    });
    assert.equal(box.current.value, 0);
    assert.equal(box.current.state.selectedIndex, 0);
    await act(async function () {
      box.current.getOptionProps(1).onPress();
    });
    assert.equal(box.current.value, '0');
    assert.equal(box.current.state.selectedIndex, 1, 'the string 0 is not the number 0');
    await act(async function () {
      box.current.getOptionProps(2).onPress();
    });
    assert.equal(box.current.value, objectValue, 'object identity is preserved');
    assert.equal(box.current.state.selectedIndex, 2);
    await act(async function () {
      box.current.getOptionProps(3).onPress();
    });
    assert.equal(box.current.value, functionValue);
    assert.equal(invoked, 0, 'a function option value is never invoked');
    assert.deepEqual(calls, [0, '0', objectValue, functionValue]);

    // A function used to seed the uncontrolled selection is stored, not
    // run as a lazy initializer
    const seeded = await renderSelect({ items: items, defaultValue: functionValue });
    assert.equal(seeded.current.value, functionValue);
    assert.equal(seeded.current.state.selectedIndex, 3);
    assert.equal(invoked, 0, 'a function defaultValue is never invoked');
  });

  test('items require defined unique values; a non-array falls back to empty', async function () {
    await assert.rejects(renderSelect({ items: [{ value: 'a' }, { value: 'a' }] }), TypeError);
    await assert.rejects(renderSelect({ items: [{ label: 'no value' }] }), TypeError);
    await assert.rejects(renderSelect({ items: [null] }), TypeError);
    await assert.rejects(renderSelect({ items: [{ value: undefined }] }), TypeError);
    const box = await renderSelect({ items: 'not an array' });
    assert.deepEqual(box.current.items, []);
    assert.equal(box.current.state.selectedIndex, -1);
  });

  test('retained option callbacks respect the current disabled boundary', async function () {
    const calls = [];
    const onChange = function (value) {
      calls.push(value);
    };
    const box = await renderSelect({ items: ITEMS, onChange: onChange });

    // Capture b's row, then reorder so index 1 now holds c: the retained
    // callback still selects its captured value, not the new occupant
    const retained = box.current.getOptionProps(1);
    await box.render({ items: [ITEMS[0], ITEMS[2], ITEMS[1]], onChange: onChange });
    await act(async function () {
      retained.onPress();
    });
    assert.deepEqual(calls, ['b'], 'the retained callback targets its own value');

    // The same callback does nothing once its option is removed, disabled
    // or the whole control is disabled
    const retainedB = box.current.getOptionProps(2);
    await box.render({ items: [ITEMS[0], ITEMS[2]], onChange: onChange });
    await act(async function () {
      retainedB.onPress();
    });
    assert.deepEqual(calls, ['b'], 'a removed option does not select');
    await box.render({ items: [ITEMS[0], ITEMS[2], { value: 'b', label: 'B', disabled: true }], onChange: onChange });
    await act(async function () {
      retainedB.onPress();
    });
    assert.deepEqual(calls, ['b'], 'a now-disabled option does not select');
    await box.render({ items: ITEMS, disabled: true, onChange: onChange });
    await act(async function () {
      retainedB.onPress();
    });
    assert.deepEqual(calls, ['b'], 'a disabled control does not select');
    assert.equal(box.current.getOptionProps(0).disabled, true, 'options inherit the control boundary');
    assert.equal(box.current.getOptionProps(0)['aria-disabled'], true);
    assert.equal(box.current.getOptionProps(0).onPress, undefined);

    // An invalid index yields inert props, never a callback
    const inert = box.current.getOptionProps(9);
    assert.equal(inert.disabled, true);
    assert.equal(inert['aria-disabled'], true);
    assert.equal(inert['aria-selected'], false);
    assert.equal(inert.onPress, undefined);

    // Unmount kills every retained handler
    await box.render({ items: ITEMS, onChange: onChange });
    const retainedC = box.current.getOptionProps(0);
    await box.unmount();
    await act(async function () {
      retainedC.onPress();
    });
    assert.deepEqual(calls, ['b'], 'an unmounted select does nothing');
  });

  test('handled selection keys prevent browser defaults but Tab does not', async function () {
    const items = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
      { value: 'c', label: 'C' }
    ];
    const calls = [];
    const box = await renderSelect({
      items: items,
      onChange: function (value) {
        calls.push(value);
      }
    });

    // ArrowDown closed opens at the first enabled value
    let event = await keydown(box, 'ArrowDown');
    assert.equal(event.prevented, true);
    assert.equal(box.current.state.open, true);
    assert.equal(box.current.state.highlightedIndex, 0);

    // Down wraps and skips the disabled member; Up wraps back
    await keydown(box, 'ArrowDown');
    assert.equal(box.current.state.highlightedIndex, 2, 'the disabled member is skipped');
    await keydown(box, 'ArrowDown');
    assert.equal(box.current.state.highlightedIndex, 0, 'Down wraps to the first enabled');
    await keydown(box, 'ArrowUp');
    assert.equal(box.current.state.highlightedIndex, 2, 'Up wraps to the last enabled');
    // Home and End jump to the enabled ends
    await keydown(box, 'Home');
    assert.equal(box.current.state.highlightedIndex, 0);
    await keydown(box, 'End');
    assert.equal(box.current.state.highlightedIndex, 2);

    // Enter commits the highlighted option and closes
    event = await keydown(box, 'Enter');
    assert.equal(event.prevented, true);
    assert.deepEqual(calls, ['c']);
    assert.equal(box.current.state.open, false);
    assert.equal(box.current.value, 'c');

    // A selection opens at its own value for both arrows
    event = await keydown(box, 'ArrowUp');
    assert.equal(box.current.state.highlightedIndex, 2, 'ArrowUp closed opens at the selection');
    event = await keydown(box, 'Escape');
    assert.equal(event.prevented, true, 'an open Escape is handled');
    assert.equal(box.current.state.open, false);
    assert.equal(box.current.value, 'c', 'Escape never clears the selection');

    // Space closed opens like ArrowDown; Tab closes without a claim
    event = await keydown(box, ' ');
    assert.equal(event.prevented, true);
    assert.equal(box.current.state.open, true);
    event = await keydown(box, 'Tab');
    assert.equal(event.prevented, false, 'Tab never prevents the default');
    assert.equal(box.current.state.open, false, 'Tab still closes');

    // Unhandled keys and a closed Home/End claim nothing
    await keydown(box, 'ArrowDown');
    event = await keydown(box, 'x');
    assert.equal(event.prevented, false);
    event = await keydown(box, 'PageDown');
    assert.equal(event.prevented, false);
    await keydown(box, 'Escape');
    event = await keydown(box, 'Home');
    assert.equal(event.prevented, false, 'a closed Home is not handled');
    event = await keydown(box, 'Escape');
    assert.equal(event.prevented, false, 'a closed Escape is not handled');

    // A disabled control handles nothing
    await box.render({ items: items, disabled: true });
    for (const key of ['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Home', 'End', 'Escape']) {
      event = await keydown(box, key);
      assert.equal(event.prevented, false, 'disabled: ' + key + ' is not handled');
    }
    assert.equal(box.current.state.open, false);
  });

  test('closed arrow opens pick the selection first, then an enabled end; empty lists never invent one', async function () {
    // ArrowUp closed opens at the selected enabled value, else the last
    const selected = await renderSelect({ items: ITEMS, defaultValue: 'b' });
    await keydown(selected, 'ArrowUp');
    assert.equal(selected.current.state.highlightedIndex, 1, 'the selection beats the last enabled');
    await keydown(selected, 'Escape');
    await keydown(selected, 'ArrowDown');
    assert.equal(selected.current.state.highlightedIndex, 1, 'the selection beats the first enabled');

    // With no selection the ends are first and last enabled
    const plain = await renderSelect({ items: ITEMS });
    await keydown(plain, 'ArrowUp');
    assert.equal(plain.current.state.highlightedIndex, 2, 'ArrowUp closed falls to the last enabled');
    await keydown(plain, 'Escape');

    // An all-disabled list opens with no highlight and no active descendant
    const allDisabled = await renderSelect({
      items: [{ value: 'a', disabled: true }, { value: 'b', disabled: true }]
    });
    await keydown(allDisabled, 'ArrowDown');
    assert.equal(allDisabled.current.state.open, true);
    assert.equal(allDisabled.current.state.highlightedIndex, -1);
    assert.equal(allDisabled.current.triggerProps['aria-activedescendant'], undefined);
    const event = await keydown(allDisabled, 'Enter');
    assert.equal(event.prevented, true);
    assert.equal(allDisabled.current.state.selectedIndex, -1, 'no value is invented');

    // An empty list does the same
    const empty = await renderSelect({ items: [] });
    await keydown(empty, 'ArrowDown');
    assert.equal(empty.current.state.open, true);
    assert.equal(empty.current.state.highlightedIndex, -1);
  });

  test('pointer open, controlled open and the disabled boundary', async function () {
    // Pointer open with no selection highlights nothing
    const box = await renderSelect({ items: ITEMS });
    await act(async function () {
      box.current.triggerProps.onPress();
    });
    assert.equal(box.current.state.open, true);
    assert.equal(box.current.state.highlightedIndex, -1, 'pointer open highlights nothing without a selection');
    await act(async function () {
      box.current.triggerProps.onPress();
    });
    assert.equal(box.current.state.open, false, 'a second press toggles closed');

    // Pointer open with a selection lands the highlight on it
    const selected = await renderSelect({ items: ITEMS, defaultValue: 'c' });
    await act(async function () {
      selected.current.triggerProps.onPress();
    });
    assert.equal(selected.current.state.highlightedIndex, 2, 'pointer open highlights the selected value');

    // A controlled open reports the request and waits for the echo
    const openCalls = [];
    const onOpenChange = function (next) {
      openCalls.push(next);
    };
    const controlled = await renderSelect({ items: ITEMS, open: false, onOpenChange: onOpenChange });
    await act(async function () {
      controlled.current.triggerProps.onPress();
    });
    assert.deepEqual(openCalls, [true]);
    assert.equal(controlled.current.state.open, false, 'a controlled open does not move itself');
    await controlled.render({ items: ITEMS, open: true, onOpenChange: onOpenChange });
    assert.equal(controlled.current.state.open, true);

    // Disabling while open clears the internal open and highlight without
    // a callback, and re-enabling does not reopen
    const openCalls2 = [];
    const suppressed = await renderSelect({
      items: ITEMS,
      onOpenChange: function (next) {
        openCalls2.push(next);
      }
    });
    await act(async function () {
      suppressed.current.triggerProps.onPress();
    });
    assert.equal(suppressed.current.state.open, true);
    assert.deepEqual(openCalls2, [true]);
    await keydown(suppressed, 'ArrowDown');
    assert.notEqual(suppressed.current.state.highlightedIndex, -1);
    await suppressed.render({ items: ITEMS, disabled: true });
    assert.equal(suppressed.current.state.open, false, 'disable clears the internal open');
    assert.equal(suppressed.current.state.highlightedIndex, -1, 'disable clears the highlight');
    assert.equal(suppressed.current.triggerProps.onPress, undefined, 'a disabled trigger cannot be pressed');
    assert.deepEqual(openCalls2, [true], 'the internal clear reports nothing');
    await suppressed.render({ items: ITEMS, disabled: false });
    assert.equal(suppressed.current.state.open, false, 're-enabling does not reopen');
  });

  test('closeOnSelect false keeps the list open and reselecting reports nothing', async function () {
    const calls = [];
    const box = await renderSelect({
      items: ITEMS,
      closeOnSelect: false,
      onChange: function (value) {
        calls.push(value);
      }
    });
    await act(async function () {
      box.current.triggerProps.onPress();
    });
    await act(async function () {
      box.current.getOptionProps(1).onPress();
    });
    assert.equal(box.current.value, 'b');
    assert.equal(box.current.state.open, true, 'closeOnSelect false keeps the list open');
    await act(async function () {
      box.current.getOptionProps(1).onPress();
    });
    assert.deepEqual(calls, ['b'], 'reselecting the current option emits no change');
    assert.equal(box.current.state.open, true);

    // The default closes even when the same option is reselected
    const calls2 = [];
    const box2 = await renderSelect({
      items: ITEMS,
      defaultValue: 'b',
      onChange: function (value) {
        calls2.push(value);
      }
    });
    await act(async function () {
      box2.current.triggerProps.onPress();
    });
    await act(async function () {
      box2.current.getOptionProps(1).onPress();
    });
    assert.deepEqual(calls2, []);
    assert.equal(box2.current.state.open, false, 'reselecting the current option still closes');
  });

  test('option ids are stable per value; the active descendant points at the enabled highlight while open', async function () {
    const box = await renderSelect({ items: ITEMS });
    const idB = box.current.getOptionProps(1).nativeID;
    assert.equal(box.current.getOptionProps(1).key, idB, 'the key is the same stable id');
    await box.render({ items: [ITEMS[2], ITEMS[0], ITEMS[1]] });
    assert.equal(box.current.getOptionProps(2).nativeID, idB, 'the id follows its value across a reorder');
    await box.render({ items: [ITEMS[0], ITEMS[2]] });
    await box.render({ items: ITEMS });
    assert.equal(box.current.getOptionProps(1).nativeID, idB, 'a re-added option keeps its id');
    // The number 0 and the string 0 can never collide
    const numeric = await renderSelect({ items: [{ value: 0 }, { value: '0' }] });
    assert.notEqual(numeric.current.getOptionProps(0).nativeID, numeric.current.getOptionProps(1).nativeID);

    // The active descendant exists only while open and follows the
    // highlighted enabled option
    assert.equal(box.current.triggerProps['aria-activedescendant'], undefined, 'none while closed');
    await act(async function () {
      box.current.triggerProps.onPress();
    });
    assert.equal(box.current.triggerProps['aria-activedescendant'], undefined, 'none without a highlight');
    const idA = box.current.getOptionProps(0).nativeID;
    await keydown(box, 'ArrowDown');
    assert.equal(box.current.state.highlightedIndex, 0);
    assert.equal(box.current.triggerProps['aria-activedescendant'], idA);
    await keydown(box, 'Escape');
    assert.equal(box.current.triggerProps['aria-activedescendant'], undefined, 'none once closed');
  });

  test('highlightValue and the end jumps accept only live enabled values', async function () {
    const items = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
      { value: 'c', label: 'C' }
    ];
    const box = await renderSelect({ items: items });
    await act(async function () {
      box.current.highlightValue('b');
    });
    assert.equal(box.current.state.highlightedIndex, -1, 'a disabled value cannot be highlighted');
    await act(async function () {
      box.current.highlightValue('gone');
    });
    assert.equal(box.current.state.highlightedIndex, -1, 'a value outside the list cannot be highlighted');
    await act(async function () {
      box.current.highlightValue('c');
    });
    assert.equal(box.current.state.highlightedIndex, 2);
    await act(async function () {
      box.current.highlightFirst();
    });
    assert.equal(box.current.state.highlightedIndex, 0, 'first enabled');
    await act(async function () {
      box.current.highlightLast();
    });
    assert.equal(box.current.state.highlightedIndex, 2, 'last enabled');
    const allDisabled = await renderSelect({ items: [{ value: 'x', disabled: true }] });
    await act(async function () {
      allDisabled.current.highlightFirst();
    });
    assert.equal(allDisabled.current.state.highlightedIndex, -1, 'no highlight when nothing is enabled');
  });

  test('clearSelection reports undefined once, only when something is selected', async function () {
    const calls = [];
    const box = await renderSelect({
      items: ITEMS,
      onChange: function (value) {
        calls.push(value);
      }
    });
    await act(async function () {
      box.current.clearSelection();
    });
    assert.deepEqual(calls, [], 'a no-op when nothing is selected');
    await act(async function () {
      box.current.getOptionProps(0).onPress();
    });
    await act(async function () {
      box.current.clearSelection();
    });
    assert.deepEqual(calls, ['a', undefined]);
    assert.equal(box.current.value, undefined);
    assert.equal(box.current.state.selectedIndex, -1);
    await act(async function () {
      box.current.clearSelection();
    });
    assert.deepEqual(calls, ['a', undefined], 'a second clear reports nothing');

    // A controlled clear requests the change without mutating itself
    const calls2 = [];
    const controlled = await renderSelect({
      items: ITEMS,
      value: 'b',
      onChange: function (value) {
        calls2.push(value);
      }
    });
    await act(async function () {
      controlled.current.clearSelection();
    });
    assert.deepEqual(calls2, [undefined]);
    assert.equal(controlled.current.value, 'b', 'a controlled clear waits for the parent');

    // A selection filtered out of the list still clears with one report
    const calls3 = [];
    const onChange3 = function (value) {
      calls3.push(value);
    };
    const filtered = await renderSelect({ items: ITEMS, defaultValue: 'b', onChange: onChange3 });
    await filtered.render({ items: [ITEMS[0], ITEMS[2]], onChange: onChange3 });
    assert.equal(filtered.current.state.selectedIndex, -1);
    await act(async function () {
      filtered.current.clearSelection();
    });
    assert.deepEqual(calls3, [undefined], 'a filtered-out selection still clears once');
    assert.equal(filtered.current.value, undefined);
  });

  test('the disabled boundary makes every saved action and handler inert', async function () {
    const calls = [];
    const openCalls = [];
    const box = await renderSelect({
      items: ITEMS,
      defaultValue: 'a',
      onChange: function (value) {
        calls.push(value);
      },
      onOpenChange: function (next) {
        openCalls.push(next);
      }
    });
    // Retain every returned action and trigger handler while enabled
    const saved = box.current;
    const savedTrigger = box.current.triggerProps;
    const savedOption = box.current.getOptionProps(1);
    await box.render({
      items: ITEMS,
      defaultValue: 'a',
      disabled: true,
      onChange: function (value) {
        calls.push(value);
      },
      onOpenChange: function (next) {
        openCalls.push(next);
      }
    });
    const event = { key: 'ArrowDown', prevented: false, preventDefault: function () { this.prevented = true; } };
    await act(async function () {
      saved.setOpen(true);
      saved.selectValue('b');
      saved.clearSelection();
      saved.highlightValue('b');
      saved.highlightFirst();
      saved.highlightLast();
      savedTrigger.onPress();
      savedTrigger.onKeyDown(event);
      savedTrigger.onFocus();
      savedTrigger.onPointerEnter();
      savedOption.onPress();
    });
    assert.deepEqual(calls, [], 'no selection callback while disabled');
    assert.deepEqual(openCalls, [], 'no open request while disabled');
    assert.equal(box.current.value, 'a', 'the selection does not move');
    assert.equal(box.current.state.open, false, 'effective open stays false');
    assert.equal(box.current.triggerProps['aria-expanded'], false);
    assert.equal(box.current.state.highlightedIndex, -1);
    assert.equal(box.current.state.focused, false);
    assert.equal(box.current.state.hovered, false);
    assert.equal(event.prevented, false, 'no default is claimed while disabled');

    // A controlled open:true is suppressed too
    const suppressed = await renderSelect({ items: ITEMS, open: true, disabled: true });
    assert.equal(suppressed.current.state.open, false, 'controlled open:true is not open while disabled');
    assert.equal(suppressed.current.triggerProps['aria-expanded'], false);
  });

  test('the unmounted boundary makes every saved action and handler inert', async function () {
    const calls = [];
    const openCalls = [];
    const box = await renderSelect({
      items: ITEMS,
      defaultValue: 'a',
      onChange: function (value) {
        calls.push(value);
      },
      onOpenChange: function (next) {
        openCalls.push(next);
      }
    });
    const saved = box.current;
    const savedOption = box.current.getOptionProps(1);
    await box.unmount();
    const event = { key: 'ArrowDown', prevented: false, preventDefault: function () { this.prevented = true; } };
    await act(async function () {
      saved.setOpen(true);
      saved.selectValue('b');
      saved.clearSelection();
      saved.highlightValue('b');
      saved.highlightFirst();
      saved.highlightLast();
      saved.triggerProps.onPress();
      saved.triggerProps.onKeyDown(event);
      saved.triggerProps.onFocus();
      saved.triggerProps.onPointerEnter();
      savedOption.onPress();
    });
    assert.deepEqual(calls, []);
    assert.deepEqual(openCalls, []);
    assert.equal(event.prevented, false);
  });

  test('actions in one act compose on the latest answer, not the render they came from', async function () {
    const calls = [];
    const box = await renderSelect({
      items: ITEMS,
      onChange: function (value) {
        calls.push(value);
      }
    });
    const saved = box.current;
    await act(async function () {
      saved.selectValue('b');
      saved.clearSelection();
      saved.clearSelection();
    });
    assert.deepEqual(calls, ['b', undefined], 'each action sees the previous one');
    assert.equal(box.current.value, undefined);
    assert.equal(box.current.state.selectedIndex, -1);

    // Two saved trigger presses in one act toggle open then closed
    const openCalls = [];
    const box2 = await renderSelect({
      items: ITEMS,
      onOpenChange: function (next) {
        openCalls.push(next);
      }
    });
    const savedPress = box2.current.triggerProps.onPress;
    await act(async function () {
      savedPress();
      savedPress();
    });
    assert.deepEqual(openCalls, [true, false]);
    assert.equal(box2.current.state.open, false);

    // Two ArrowDowns from closed open then move, not open twice on a
    const box3 = await renderSelect({ items: ITEMS });
    const savedKey = box3.current.triggerProps.onKeyDown;
    await act(async function () {
      savedKey({ key: 'ArrowDown', preventDefault: function () {} });
      savedKey({ key: 'ArrowDown', preventDefault: function () {} });
    });
    assert.equal(box3.current.state.open, true);
    assert.equal(box3.current.state.highlightedIndex, 1, 'the second ArrowDown moves to b');
  });

  test('a controlled open:true resumes on re-enable; an uncontrolled menu stays closed', async function () {
    const controlled = await renderSelect({ items: ITEMS, open: true, disabled: true });
    assert.equal(controlled.current.state.open, false);
    await controlled.render({ items: ITEMS, open: true, disabled: false });
    assert.equal(controlled.current.state.open, true, 're-enabling resumes the explicit controlled answer');

    const uncontrolled = await renderSelect({ items: ITEMS });
    await act(async function () {
      uncontrolled.current.triggerProps.onPress();
    });
    assert.equal(uncontrolled.current.state.open, true);
    await uncontrolled.render({ items: ITEMS, disabled: true });
    assert.equal(uncontrolled.current.state.open, false);
    await uncontrolled.render({ items: ITEMS, disabled: false });
    assert.equal(uncontrolled.current.state.open, false, 'the silent clear is not undone by re-enabling');
  });

  test('an open request matching the current answer emits nothing', async function () {
    const openCalls = [];
    const box = await renderSelect({
      items: ITEMS,
      onOpenChange: function (next) {
        openCalls.push(next);
      }
    });
    await act(async function () {
      box.current.setOpen(false);
    });
    assert.deepEqual(openCalls, [], 'closing a closed list reports nothing');
    await act(async function () {
      box.current.setOpen(true);
    });
    assert.deepEqual(openCalls, [true]);
    await act(async function () {
      box.current.setOpen(true);
    });
    assert.deepEqual(openCalls, [true], 'an extra open request emits nothing');
    await act(async function () {
      box.current.setOpen(false);
    });
    assert.deepEqual(openCalls, [true, false]);
    assert.equal(box.current.state.open, false);
  });

  test('the internal onSelect reports every accepted choice before onChange, even a reselect', async function () {
    const calls = [];
    const box = await renderSelect({
      items: ITEMS,
      defaultValue: 'a',
      onSelect: function (value) { calls.push(['select', value]); },
      onChange: function (value) { calls.push(['change', value]); }
    });

    // A reselect is an accepted choice: onSelect fires, onChange does not
    await act(async function () {
      box.current.selectValue('a');
    });
    assert.deepEqual(calls, [['select', 'a']], 'a reselect reports the choice without a change');

    // A real change reports the choice first, then the change
    await act(async function () {
      box.current.selectValue('b');
    });
    assert.deepEqual(calls, [['select', 'a'], ['select', 'b'], ['change', 'b']]);

    // An absent or item-disabled value is not an accepted choice
    await act(async function () {
      box.current.selectValue('zzz');
    });
    assert.deepEqual(calls, [['select', 'a'], ['select', 'b'], ['change', 'b']]);
    const disabled = await renderSelect({
      items: [
        { value: 'x', label: 'X' },
        { value: 'y', label: 'Y', disabled: true }
      ],
      onSelect: function (value) { calls.push(['select', value]); },
      onChange: function (value) { calls.push(['change', value]); }
    });
    await act(async function () {
      disabled.current.selectValue('y');
    });
    assert.deepEqual(calls, [['select', 'a'], ['select', 'b'], ['change', 'b']]);

    // Control-disabled and unmounted boundaries fire neither
    await disabled.render({
      items: [
        { value: 'x', label: 'X' },
        { value: 'y', label: 'Y', disabled: true }
      ],
      disabled: true,
      onSelect: function (value) { calls.push(['select', value]); },
      onChange: function (value) { calls.push(['change', value]); }
    });
    await act(async function () {
      disabled.current.selectValue('x');
    });
    const retained = disabled.current.selectValue;
    await disabled.unmount();
    await act(async function () {
      retained('x');
    });
    assert.deepEqual(calls, [['select', 'a'], ['select', 'b'], ['change', 'b']],
      'disabled, removed and unmounted choices fire neither seam');
  });

  test('getOpen reads the live answer inside an act and commitHighlighted accepts only a live enabled row', async function () {
    const calls = [];
    const box = await renderSelect({
      items: ITEMS,
      onSelect: function (value) { calls.push(value); }
    });
    assert.equal(box.current.getOpen(), false, 'closed reads false');
    await act(async function () {
      box.current.setOpen(true);
      box.current.highlightFirst();
    });
    assert.equal(box.current.getOpen(), true, 'the live read sees the eager same-act open');
    let committed = false;
    await act(async function () {
      committed = box.current.commitHighlighted();
    });
    assert.equal(committed, true, 'a live enabled highlight commits');
    assert.deepEqual(calls, ['a']);
    await act(async function () {
      box.current.setOpen(false);
    });
    assert.equal(box.current.getOpen(), false);
    assert.equal(box.current.commitHighlighted(), false, 'no highlight commits nothing');

    // Disabled and unmounted boundaries report closed and accept nothing
    const calls2 = [];
    const disabled = await renderSelect({
      items: ITEMS,
      disabled: true,
      onSelect: function (value) { calls2.push(value); }
    });
    assert.equal(disabled.current.getOpen(), false, 'a disabled control reads closed');
    assert.equal(disabled.current.commitHighlighted(), false);
    assert.deepEqual(calls2, []);
    const retainedOpen = box.current.getOpen;
    const retainedCommit = box.current.commitHighlighted;
    await box.unmount();
    assert.equal(retainedOpen(), false, 'unmounted reads closed');
    assert.equal(retainedCommit(), false);
    assert.deepEqual(calls, ['a']);
  });

});
