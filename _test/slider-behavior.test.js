// Info: useSlider contract.
//
// Headless checks for the bounded slider behavior: the min-anchored step
// grid, controlled/uncontrolled requests, the raw text draft, the disabled
// boundary, and the track responder gesture against fake web and native
// measurements. The probe is rerenderable and `box.current` always holds
// the last render's return; host nodes and platform answers are faked,
// never the harness.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import * as ReactNative from 'react-native-web';
import utils from 'helper-utils';
import debug from 'helper-debug';

import createSliderBehaviors from '../behaviors/slider.js';
import createStateBehaviors from '../behaviors/state.js';
import createLocalBehaviors from '../behaviors/local.js';
import createPlatform from '../component/platform.js';

const Utils = utils({});
const Debug = debug({ Utils: Utils }, { LOG_LEVEL: 'error' });
const ReactNativeForWeb = ReactNative;


/********************************************************************
Build useSlider against an injected platform name.

@param {String} os - Platform answer ('web' or a native name)

@return {Function} - useSlider
*********************************************************************/
function sliderFor (os) {

  const platform = createPlatform({ Platform: { OS: os } }, Utils);
  const state = createStateBehaviors({ React: React });
  const local = createLocalBehaviors({
    React: React,
    ReactNative: ReactNativeForWeb,
    Utils: Utils,
    Debug: Debug,
    platform: platform,
    useControllableState: state.useControllableState
  });
  return createSliderBehaviors({
    React: React,
    Utils: Utils,
    platform: platform,
    useControllableState: state.useControllableState,
    useInteractionState: local.useInteractionState
  }).useSlider;

}

const useSlider = sliderFor('web');
const useSliderNative = sliderFor('android');

const mounted = [];

afterEach(async function () {
  while (mounted.length > 0) {
    const item = mounted.pop();
    if (item.done === true) {
      continue;
    }
    await act(async function () {
      item.root.unmount();
    });
    item.container.remove();
  }
});


/********************************************************************
Render a rerenderable probe around a slider hook. `box.current` always
holds the last render's return, so handlers are read live after updates.

@param {Function} hook   - useSlider for the platform under test
@param {Object}   props  - Initial props

@return {Promise<Object>} - { current, render, unmount }
*********************************************************************/
async function renderSlider (hook, props) {

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const item = { container: container, root: root, done: false };
  mounted.push(item);

  const box = { current: undefined };
  function Probe (probeProps) {
    box.current = hook(probeProps);
    return null;
  }

  await act(async function () {
    root.render(React.createElement(Probe, props));
  });

  box.render = async function (next) {
    await act(async function () {
      root.render(React.createElement(Probe, next));
    });
  };
  box.unmount = async function () {
    if (item.done) {
      return;
    }
    item.done = true;
    await act(async function () {
      root.unmount();
    });
    container.remove();
  };
  return box;

}


/********************************************************************
A key event with a preventDefault spy.

@param {String}  key      - Event key
@param {Boolean} shiftKey - Shift modifier

@return {Object} - The fake event after dispatch
*********************************************************************/
function keyEvent (key, shiftKey) {

  const event = {
    key: key,
    shiftKey: shiftKey === true,
    preventCount: 0,
    preventDefault: function () {
      this.preventCount += 1;
    }
  };
  return event;

}


/********************************************************************
Dispatch a key on the probe's thumb handler.

@param {Object}  box      - The probe box
@param {String}  key      - Event key
@param {Boolean} shiftKey - Shift modifier

@return {Object} - The fake event after dispatch
*********************************************************************/
async function keydown (box, key, shiftKey) {

  const event = keyEvent(key, shiftKey);
  await act(async function () {
    box.current.thumbProps.onKeyDown(event);
  });
  return event;

}


/********************************************************************
A fake web host node: a fixed rect plus an owner window scroll.

@param {Number} x       - Viewport left of the host
@param {Number} width   - Host width
@param {Number} scrollX - Document scroll offset

@return {Object} - Fake node
*********************************************************************/
function webNode (x, width, scrollX) {

  return {
    rect: { left: x, top: 0, width: width, height: 40, right: x + width, bottom: 40 },
    getBoundingClientRect: function () {
      return this.rect;
    },
    ownerDocument: {
      defaultView: { scrollX: scrollX }
    }
  };

}


/********************************************************************
A fake thumb node counting focus calls.

@return {Object} - Fake node with .focusCount
*********************************************************************/
function thumbNode () {

  return {
    focusCount: 0,
    focus: function () {
      this.focusCount += 1;
    }
  };

}


/********************************************************************
A gesture event with a page coordinate and optional mouse button.

@param {Number|*} pageX  - Pointer page coordinate
@param {Number}   button - Mouse button (undefined = none supplied)

@return {Object}
*********************************************************************/
function gesture (pageX, button) {

  const nativeEvent = { pageX: pageX };
  if (button !== undefined) {
    nativeEvent.button = button;
  }
  return { nativeEvent: nativeEvent };

}


describe('behaviors: useSlider keys and defaults', function () {

  test('default state is min-anchored with no callbacks', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      onChange: function (n) { calls.push(n); }
    });
    assert.equal(box.current.state.value, 0);
    assert.equal(box.current.state.ratio, 0);
    assert.equal(box.current.state.text, '0');
    assert.equal(box.current.state.trackWidth, 0);
    assert.equal(box.current.state.invalid, false);
    assert.deepEqual(calls, []);
  });

  test('arrows, Shift, Page and Home/End move on the grid and prevent only handled keys', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      defaultValue: 50,
      onChange: function (n) { calls.push(n); }
    });
    let event = await keydown(box, 'ArrowRight');
    assert.equal(box.current.state.value, 51);
    assert.equal(event.preventCount, 1);
    await keydown(box, 'ArrowLeft');
    assert.equal(box.current.state.value, 50);
    await keydown(box, 'ArrowDown');
    assert.equal(box.current.state.value, 49);
    await keydown(box, 'ArrowUp');
    assert.equal(box.current.state.value, 50);
    await keydown(box, 'ArrowRight', true);
    assert.equal(box.current.state.value, 54);
    await keydown(box, 'PageUp');
    assert.equal(box.current.state.value, 58);
    await keydown(box, 'PageDown');
    assert.equal(box.current.state.value, 54);
    await keydown(box, 'Home');
    assert.equal(box.current.state.value, 0);
    await keydown(box, 'End');
    assert.equal(box.current.state.value, 100);
    // Enter and unhandled keys neither move nor prevent
    event = await keydown(box, 'Enter');
    assert.equal(event.preventCount, 0);
    event = await keydown(box, ' ');
    assert.equal(event.preventCount, 0);
    assert.equal(box.current.state.value, 100);
    assert.deepEqual(calls, [51, 50, 49, 50, 54, 58, 54, 0, 100]);
  });

});

describe('behaviors: useSlider numeric precision', function () {

  test('decimal steps stay exact through scaled-integer arithmetic', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      min: -1, max: 1, step: 0.1, value: 0.2,
      onChange: function (n) { calls.push(n); }
    });
    await keydown(box, 'ArrowRight');
    assert.equal(calls[calls.length - 1], 0.3);
    await box.render({ min: -1, max: 1, step: 0.1, value: 0.2, onChange: function (n) { calls.push(n); } });
    await keydown(box, 'ArrowLeft');
    assert.equal(calls[calls.length - 1], 0.1);
    const box2 = await renderSlider(useSlider, {
      min: 0.05, max: 0.95, step: 0.1, value: 0.05,
      onChange: function (n) { calls.push(n); }
    });
    await keydown(box2, 'ArrowRight');
    assert.equal(calls[calls.length - 1], 0.15);
    const box3 = await renderSlider(useSlider, {
      min: 0, max: 1, step: 1e-7, value: 2e-7,
      onChange: function (n) { calls.push(n); }
    });
    await keydown(box3, 'ArrowRight');
    assert.equal(calls[calls.length - 1], 3e-7);
  });

  test('off-grid endpoints stay reachable and step to the preceding grid point', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      min: 0, max: 100, step: 30, defaultValue: 0,
      onChange: function (n) { calls.push(n); }
    });
    await keydown(box, 'End');
    assert.equal(box.current.state.value, 100);
    await keydown(box, 'ArrowLeft');
    assert.equal(box.current.state.value, 90);
    await keydown(box, 'Home');
    assert.equal(box.current.state.value, 0);
    await act(async function () {
      box.current.setRatio(0.5);
    });
    assert.equal(box.current.state.value, 60);
    await act(async function () {
      box.current.setRatio(-2);
    });
    assert.equal(box.current.state.value, 0);
    await act(async function () {
      box.current.setRatio(2);
    });
    assert.equal(box.current.state.value, 100);
    // repeated clamped movement emits nothing more
    await keydown(box, 'End');
    await keydown(box, 'ArrowRight');
    assert.deepEqual(calls, [100, 90, 0, 60, 0, 100]);
  });

  test('the grid scale ignores binary request noise', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      min: 0, max: 1, step: 0.1, value: 0,
      onChange: function (n) { calls.push(n); }
    });
    await act(async function () {
      box.current.setRatio(0.30000000000000004);
    });
    assert.equal(calls[calls.length - 1], 0.3);
    await box.render({ min: 0, max: 1, step: 0.1, value: 0.3, onChange: function (n) { calls.push(n); } });
    await keydown(box, 'ArrowRight');
    assert.equal(calls[calls.length - 1], 0.4);
    // 0.29 * 100 in binary is 28.999999999999996: the step still lands on 0.3
    const box2 = await renderSlider(useSlider, {
      min: 0, max: 1, step: 0.01, value: 0.29,
      onChange: function (n) { calls.push(n); }
    });
    await keydown(box2, 'ArrowRight');
    assert.equal(calls[calls.length - 1], 0.3);
  });

  test('a sub-step request snaps by grid index, not by rounding the value', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      min: 0, max: 1, step: 0.2, value: 0,
      onChange: function (n) { calls.push(n); }
    });
    await act(async function () {
      box.current.setValue(0.09);
    });
    // snaps to the min endpoint: a numeric no-op, but the draft resets
    assert.equal(box.current.state.value, 0);
    assert.equal(box.current.state.text, '0');
    assert.deepEqual(calls, []);
    // midway requests land on the nearer grid point
    await act(async function () {
      box.current.setValue(0.3);
    });
    assert.equal(calls[calls.length - 1], 0.4);
  });

  test('an unusable scaled grid steps from the value directly', async function () {
    const calls = [];
    // step too small to divide the range: the index overflows to Infinity
    const box = await renderSlider(useSlider, {
      min: 0, max: 100, step: 1e-320, defaultValue: 50,
      onChange: function (n) { calls.push(n); }
    });
    await keydown(box, 'ArrowLeft');
    await keydown(box, 'ArrowRight');
    // a sub-ULP step is a no-op both ways; nothing emits
    assert.equal(box.current.state.value, 50);
    assert.deepEqual(calls, []);
    // endpoints so wide the quotient loses unit precision still step by one
    const box2 = await renderSlider(useSlider, {
      min: -1e308, max: 1e308, step: 1, value: 50,
      onChange: function (n) { calls.push(n); }
    });
    await keydown(box2, 'ArrowLeft');
    assert.equal(calls[calls.length - 1], 49);
  });

  test('an off-grid maximum steps down to the preceding grid point', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      min: 0, max: 0.95, step: 0.1, value: 0,
      onChange: function (n) { calls.push(n); }
    });
    await keydown(box, 'End');
    assert.equal(calls[calls.length - 1], 0.95);
    await box.render({ min: 0, max: 0.95, step: 0.1, value: 0.95, onChange: function (n) { calls.push(n); } });
    await keydown(box, 'ArrowLeft');
    assert.equal(calls[calls.length - 1], 0.9);
  });

});

describe('behaviors: useSlider control modes', function () {

  test('a controlled value reports but retains until the parent supplies it', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      value: 50, defaultValue: 80,
      onChange: function (n) { calls.push(n); }
    });
    assert.equal(box.current.state.value, 50);
    await keydown(box, 'ArrowRight');
    assert.deepEqual(calls, [51]);
    assert.equal(box.current.state.value, 50);
    await box.render({ value: 51, defaultValue: 80, onChange: function (n) { calls.push(n); } });
    assert.equal(box.current.state.value, 51);
  });

  test('uncontrolled requests in one act compose on each other', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      defaultValue: 50,
      onChange: function (n) { calls.push(n); }
    });
    await act(async function () {
      box.current.setValue(51);
      box.current.setValue(52);
    });
    assert.equal(box.current.state.value, 52);
    assert.deepEqual(calls, [51, 52]);
    await act(async function () {
      box.current.setValue(52);
      box.current.setValue(52);
    });
    assert.deepEqual(calls, [51, 52]);
    // two key requests in one act compose the same way
    calls.length = 0;
    await act(async function () {
      box.current.thumbProps.onKeyDown(keyEvent('ArrowRight'));
      box.current.thumbProps.onKeyDown(keyEvent('ArrowRight'));
    });
    assert.equal(box.current.state.value, 54);
    assert.deepEqual(calls, [53, 54]);
  });

});

describe('behaviors: useSlider prop validation', function () {

  test('non-finite, wrong-type or contradictory props throw TypeError', async function () {
    const bad = [
      { min: NaN }, { min: Infinity }, { min: 'a' }, { min: null },
      { max: NaN }, { max: -Infinity }, { max: null },
      { min: 50, max: 50 }, { min: 60, max: 50 },
      { step: 0 }, { step: -1 }, { step: NaN }, { step: 'a' }, { step: null },
      { value: NaN }, { value: Infinity }, { value: 'a' },
      { defaultValue: NaN }, { defaultValue: 'a' },
      { value: 50, defaultValue: NaN },
      { stepMultiplier: 0 }, { stepMultiplier: 2.5 }, { stepMultiplier: NaN },
      { travelInset: -1 }, { travelInset: NaN }, { travelInset: 'a' }
    ];
    for (const props of bad) {
      await assert.rejects(renderSlider(useSlider, props), TypeError, JSON.stringify(props));
    }
  });

  test('non-finite imperative requests are inert', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      defaultValue: 50,
      onChange: function (n) { calls.push(n); }
    });
    await act(async function () {
      box.current.setValue(NaN);
      box.current.setValue(Infinity);
      box.current.setRatio(NaN);
      box.current.setRatio(-Infinity);
    });
    assert.equal(box.current.state.value, 50);
    assert.deepEqual(calls, []);
  });

});

describe('behaviors: useSlider text draft', function () {

  test('malformed drafts stay visible and invalid, emit nothing, and reset on commit', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      defaultValue: 50,
      onChange: function (n) { calls.push(n); }
    });
    for (const text of ['-', '1e', 'abc', '12px', '']) {
      await act(async function () {
        box.current.setText(text);
      });
      assert.equal(box.current.state.text, text, JSON.stringify(text) + ' stays visible');
      assert.equal(box.current.state.invalid, true, JSON.stringify(text) + ' invalid');
      assert.equal(box.current.state.value, 50);
      await act(async function () {
        box.current.commitText();
      });
      assert.equal(box.current.state.text, '50');
      assert.equal(box.current.state.invalid, false);
      assert.equal(box.current.state.value, 50);
    }
    assert.deepEqual(calls, []);
  });

  test('out-of-range draft stays invalid without movement; commit clamps and emits', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      defaultValue: 50,
      onChange: function (n) { calls.push(n); }
    });
    await act(async function () {
      box.current.setText('150');
    });
    assert.equal(box.current.state.text, '150');
    assert.equal(box.current.state.invalid, true);
    assert.equal(box.current.state.value, 50);
    assert.deepEqual(calls, []);
    await act(async function () {
      box.current.commitText();
    });
    assert.equal(box.current.state.value, 100);
    assert.equal(box.current.state.text, '100');
    assert.equal(box.current.state.invalid, false);
    assert.deepEqual(calls, [100]);
  });

  test('fractional and exponent drafts parse as whole numbers when valid', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      min: -5, max: 200, step: 0.5, defaultValue: 0,
      onChange: function (n) { calls.push(n); }
    });
    await act(async function () {
      box.current.setText('-2.5');
    });
    assert.equal(box.current.state.value, -2.5);
    assert.equal(box.current.state.text, '-2.5');
    assert.equal(box.current.state.invalid, false);
    await act(async function () {
      box.current.setText('1e2');
    });
    assert.equal(box.current.state.value, 100);
    assert.deepEqual(calls, [-2.5, 100]);
  });

  test('a controlled echo preserves in-progress draft formatting; a different value replaces it', async function () {
    const calls = [];
    const props = { value: 0, onChange: function (n) { calls.push(n); } };
    const box = await renderSlider(useSlider, props);
    await act(async function () {
      box.current.setText('1.');
    });
    assert.deepEqual(calls, [1]);
    assert.equal(box.current.state.text, '1.');
    // the parent accepting 1 is an echo: the draft keeps its formatting
    await box.render({ value: 1, onChange: props.onChange });
    assert.equal(box.current.state.text, '1.');
    // a genuinely different external value replaces the draft
    await box.render({ value: 2, onChange: props.onChange });
    assert.equal(box.current.state.text, '2');
    assert.equal(box.current.state.value, 2);
  });

  test('an uncontrolled draft survives its own numeric update', async function () {
    const box = await renderSlider(useSlider, { defaultValue: 0 });
    await act(async function () {
      box.current.setText('1.');
    });
    assert.equal(box.current.state.value, 1);
    assert.equal(box.current.state.text, '1.');
    assert.equal(box.current.state.invalid, false);
  });

  test('an external invalid flag persists after the draft commits', async function () {
    const box = await renderSlider(useSlider, { defaultValue: 50, invalid: true });
    assert.equal(box.current.state.invalid, true);
    await act(async function () {
      box.current.setText('60');
      box.current.commitText();
    });
    assert.equal(box.current.state.value, 60);
    assert.equal(box.current.state.invalid, true);
  });

  test('a numeric no-op request still resets the draft', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      defaultValue: 50,
      onChange: function (n) { calls.push(n); }
    });
    await act(async function () {
      box.current.setText('-');
    });
    assert.equal(box.current.state.invalid, true);
    await act(async function () {
      box.current.setValue(50);
    });
    assert.equal(box.current.state.text, '50');
    assert.equal(box.current.state.invalid, false);
    assert.deepEqual(calls, []);
  });

  test('a commit resolving to the same number clears an off-grid draft without emitting', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      defaultValue: 0, step: 0.2,
      onChange: function (n) { calls.push(n); }
    });
    await act(async function () {
      box.current.setText('0.09');
    });
    assert.equal(box.current.state.invalid, false);
    await act(async function () {
      box.current.commitText();
    });
    assert.equal(box.current.state.text, '0');
    assert.equal(box.current.state.invalid, false);
    assert.deepEqual(calls, []);
  });

  test('a superseded draft is discarded permanently', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      value: 0,
      onChange: function (n) { calls.push(n); }
    });
    const onChange = function (n) { calls.push(n); };
    await act(async function () {
      box.current.setText('-');
    });
    assert.equal(box.current.state.invalid, true);
    await box.render({ value: 2, onChange: onChange });
    assert.equal(box.current.state.text, '2');
    // returning to the old anchor must not resurrect the stale draft
    await box.render({ value: 0, onChange: onChange });
    assert.equal(box.current.state.text, '0');
    assert.equal(box.current.state.invalid, false);
    // an accepted echo keeps its formatting, but a later external change
    // still retires the draft permanently
    await act(async function () {
      box.current.setText('1.');
    });
    await box.render({ value: 1, onChange: onChange });
    assert.equal(box.current.state.text, '1.');
    await box.render({ value: 2, onChange: onChange });
    await box.render({ value: 1, onChange: onChange });
    assert.equal(box.current.state.text, '1');
    assert.equal(box.current.state.invalid, false);
    // only the draft's own request ever emitted; the supersession is silent
    assert.deepEqual(calls, [1]);
  });

  test('changed bounds clamp the effective value and reset an incompatible draft without callbacks', async function () {
    const calls = [];
    const onChange = function (n) { calls.push(n); };
    const box = await renderSlider(useSlider, { value: 50, onChange: onChange });
    await act(async function () {
      box.current.setText('80');
    });
    assert.equal(box.current.state.text, '80');
    await box.render({ value: 50, min: 0, max: 20, onChange: onChange });
    assert.equal(box.current.state.value, 20);
    assert.equal(box.current.state.text, '20');
    assert.equal(box.current.state.invalid, false);
    // the bounds change itself emits nothing beyond the draft's own request
    assert.deepEqual(calls, [80]);
  });

});

describe('behaviors: useSlider disabled boundary', function () {

  test('disabled blocks keys, edits, setters, accessibility and gestures, and has no tab stop', async function () {
    const calls = [];
    const releases = [];
    const box = await renderSlider(useSlider, {
      defaultValue: 50, disabled: true,
      onChange: function (n) { calls.push(n); },
      onRelease: function (n) { releases.push(n); }
    });
    assert.equal(box.current.state.disabled, true);
    assert.equal(box.current.state.invalid, false);
    assert.equal(box.current.thumbProps.tabIndex, -1);
    assert.equal(box.current.thumbProps['aria-disabled'], true);
    const event = await keydown(box, 'ArrowRight');
    assert.equal(event.preventCount, 0);
    await act(async function () {
      box.current.setValue(60);
      box.current.setRatio(0.8);
      box.current.setText('60');
      box.current.commitText();
      box.current.thumbProps.onAccessibilityAction({ nativeEvent: { actionName: 'increment' } });
    });
    assert.equal(box.current.state.value, 50);
    assert.equal(box.current.state.text, '50');
    // a disabled track never starts a responder
    assert.equal(box.current.trackProps.onStartShouldSetResponderCapture(gesture(120)), false);
    await act(async function () {
      box.current.trackProps.onResponderGrant(gesture(120));
      box.current.trackProps.onResponderMove(gesture(200));
      box.current.trackProps.onResponderRelease(gesture(200));
    });
    assert.equal(box.current.state.value, 50);
    assert.equal(box.current.state.pressed, false);
    assert.deepEqual(calls, []);
    assert.deepEqual(releases, []);
  });

  test('accessibility actions step exactly once', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      defaultValue: 50,
      onChange: function (n) { calls.push(n); }
    });
    assert.deepEqual(box.current.thumbProps.accessibilityActions, [{ name: 'increment' }, { name: 'decrement' }]);
    assert.equal(box.current.thumbProps.accessibilityRole, 'adjustable');
    assert.equal(box.current.thumbProps['aria-valuemin'], 0);
    assert.equal(box.current.thumbProps['aria-valuemax'], 100);
    assert.equal(box.current.thumbProps['aria-valuenow'], 50);
    await act(async function () {
      box.current.thumbProps.onAccessibilityAction({ nativeEvent: { actionName: 'increment' } });
    });
    assert.equal(box.current.state.value, 51);
    await act(async function () {
      box.current.thumbProps.onAccessibilityAction({ nativeEvent: { actionName: 'decrement' } });
    });
    assert.equal(box.current.state.value, 50);
    assert.deepEqual(calls, [51, 50]);
  });

});

describe('behaviors: useSlider web gesture', function () {

  test('layout only measures; grant selects and begins a drag; release reports once', async function () {
    const calls = [];
    const releases = [];
    const box = await renderSlider(useSlider, {
      defaultValue: 0,
      onChange: function (n) { calls.push(n); },
      onRelease: function (n) { releases.push(n); }
    });
    const node = webNode(100, 200, 50);
    const thumb = thumbNode();
    box.current.trackProps.ref.current = node;
    box.current.thumbProps.ref.current = thumb;
    await act(async function () {
      box.current.trackProps.onLayout({ nativeEvent: { layout: { x: 0, y: 0, width: 200, height: 40 } } });
    });
    assert.equal(box.current.state.trackWidth, 200);
    assert.deepEqual(calls, []);
    // primary press starts the responder; a right click does not
    assert.equal(box.current.trackProps.onStartShouldSetResponderCapture(gesture(200, 2)), false);
    assert.equal(box.current.trackProps.onStartShouldSetResponderCapture(gesture(200, 0)), true);
    assert.equal(box.current.trackProps.onMoveShouldSetResponderCapture(), false);
    assert.equal(box.current.trackProps.onResponderTerminationRequest(), true);
    await act(async function () {
      box.current.trackProps.onResponderGrant(gesture(200));
    });
    // host pageX is rect.left + scrollX = 150; pageX 200 -> ratio 0.25
    assert.equal(box.current.state.value, 25);
    assert.equal(thumb.focusCount, 1);
    assert.equal(box.current.state.pressed, true);
    // a descendant coordinate is never the page position
    await act(async function () {
      box.current.trackProps.onResponderMove({ nativeEvent: { pageX: 250, locationX: 999 } });
    });
    assert.equal(box.current.state.value, 50);
    await act(async function () {
      box.current.trackProps.onResponderMove(gesture(400));
    });
    assert.equal(box.current.state.value, 100);
    await act(async function () {
      box.current.trackProps.onResponderMove(gesture(0));
    });
    assert.equal(box.current.state.value, 0);
    await act(async function () {
      box.current.trackProps.onResponderMove(gesture(400));
      box.current.trackProps.onResponderRelease(gesture(400));
    });
    assert.deepEqual(releases, [100]);
    assert.equal(box.current.state.pressed, false);
    await act(async function () {
      box.current.trackProps.onResponderRelease(gesture(400));
    });
    assert.deepEqual(releases, [100]);
  });

  test('the travel inset narrows the usable span and unusable geometry emits nothing', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      defaultValue: 0, travelInset: 20,
      onChange: function (n) { calls.push(n); }
    });
    const node = webNode(100, 200, 50);
    box.current.trackProps.ref.current = node;
    box.current.thumbProps.ref.current = thumbNode();
    const trackRef = box.current.trackProps.ref;
    const thumbRef = box.current.thumbProps.ref;
    await act(async function () {
      box.current.trackProps.onResponderGrant(gesture(170));
    });
    // usable width 200 - 40; pageX 170 -> host 150 + inset 20 -> ratio 0
    assert.equal(box.current.state.value, 0);
    await act(async function () {
      box.current.trackProps.onResponderMove(gesture(330));
    });
    assert.equal(box.current.state.value, 100);
    await act(async function () {
      box.current.trackProps.onResponderMove(gesture(250));
    });
    assert.equal(box.current.state.value, 50);
    // stable refs survive a rerender
    await box.render({ defaultValue: 0, travelInset: 20, onChange: function (n) { calls.push(n); } });
    assert.equal(box.current.trackProps.ref, trackRef);
    assert.equal(box.current.thumbProps.ref, thumbRef);
    // unusable geometry: zero width, non-finite x, too-narrow span, missing pageX
    const bad = await renderSlider(useSlider, { defaultValue: 0, onChange: function (n) { calls.push(n); } });
    bad.current.trackProps.ref.current = webNode(100, 0, 0);
    await act(async function () {
      bad.current.trackProps.onResponderGrant(gesture(50));
    });
    const badNarrow = await renderSlider(useSlider, { defaultValue: 0, travelInset: 100, onChange: function (n) { calls.push(n); } });
    badNarrow.current.trackProps.ref.current = webNode(100, 200, 50);
    badNarrow.current.thumbProps.ref.current = thumbNode();
    await act(async function () {
      badNarrow.current.trackProps.onResponderGrant(gesture(250));
    });
    const badEvent = await renderSlider(useSlider, { defaultValue: 0, onChange: function (n) { calls.push(n); } });
    badEvent.current.trackProps.ref.current = webNode(100, 200, 50);
    badEvent.current.thumbProps.ref.current = thumbNode();
    await act(async function () {
      badEvent.current.trackProps.onResponderGrant({ nativeEvent: {} });
      badEvent.current.trackProps.onResponderMove(gesture(NaN));
    });
    const badX = await renderSlider(useSlider, { defaultValue: 0, onChange: function (n) { calls.push(n); } });
    badX.current.trackProps.ref.current = webNode(NaN, 200, 50);
    badX.current.thumbProps.ref.current = thumbNode();
    await act(async function () {
      badX.current.trackProps.onResponderGrant(gesture(250));
    });
    assert.equal(bad.current.state.value, 0);
    assert.equal(badNarrow.current.state.value, 0);
    assert.equal(badEvent.current.state.value, 0);
    assert.equal(badX.current.state.value, 0);
    assert.deepEqual(calls, [100, 50]);
  });

  test('a grant at the unchanged value resets an invalid draft without a callback', async function () {
    const calls = [];
    const box = await renderSlider(useSlider, {
      defaultValue: 50,
      onChange: function (n) { calls.push(n); }
    });
    box.current.trackProps.ref.current = webNode(100, 200, 50);
    box.current.thumbProps.ref.current = thumbNode();
    await act(async function () {
      box.current.setText('-');
    });
    assert.equal(box.current.state.invalid, true);
    // pageX 250 -> host 150 + half of 200 = value 50, the current value:
    // no callback, but the draft still serializes to the current number
    await act(async function () {
      box.current.trackProps.onResponderGrant(gesture(250));
    });
    assert.equal(box.current.state.value, 50);
    assert.equal(box.current.state.text, '50');
    assert.equal(box.current.state.invalid, false);
    assert.deepEqual(calls, []);
    // a repeated position inside the same drag stays a dedup, not a reset
    await act(async function () {
      box.current.trackProps.onResponderMove(gesture(250));
      box.current.trackProps.onResponderMove(gesture(250));
    });
    assert.equal(box.current.state.text, '50');
    assert.deepEqual(calls, []);
  });

});

describe('behaviors: useSlider native gesture', function () {

  test('asynchronous measurement applies the latest pointer and release reports once', async function () {
    const calls = [];
    const releases = [];
    const box = await renderSlider(useSliderNative, {
      defaultValue: 0,
      onChange: function (n) { calls.push(n); },
      onRelease: function (n) { releases.push(n); }
    });
    const pending = [];
    box.current.trackProps.ref.current = {
      measureInWindow: function (cb) {
        pending.push(cb);
      }
    };
    box.current.thumbProps.ref.current = thumbNode();
    await act(async function () {
      box.current.trackProps.onResponderGrant(gesture(150));
    });
    // no measurement yet: nothing emitted
    assert.equal(box.current.state.value, 0);
    assert.deepEqual(calls, []);
    await act(async function () {
      box.current.trackProps.onResponderMove(gesture(250));
    });
    assert.equal(box.current.state.value, 0);
    await act(async function () {
      pending[pending.length - 1](100, 0, 200, 40);
    });
    // latest pageX 250 against x100/w200 -> 75
    assert.equal(box.current.state.value, 75);
    assert.equal(box.current.state.trackWidth, 200);
    await act(async function () {
      box.current.trackProps.onResponderMove(gesture(300));
    });
    assert.equal(box.current.state.value, 100);
    await act(async function () {
      box.current.trackProps.onResponderRelease(gesture(300));
    });
    assert.deepEqual(releases, [100]);
  });

  test('termination, disable, early release and unmount each invalidate a pending measure', async function () {
    const calls = [];
    const releases = [];

    // termination cancels
    const box = await renderSlider(useSliderNative, {
      defaultValue: 0,
      onChange: function (n) { calls.push(n); },
      onRelease: function (n) { releases.push(n); }
    });
    const pending = [];
    box.current.trackProps.ref.current = {
      measureInWindow: function (cb) { pending.push(cb); }
    };
    box.current.thumbProps.ref.current = thumbNode();
    await act(async function () {
      box.current.trackProps.onResponderGrant(gesture(150));
      box.current.trackProps.onResponderTerminate(gesture(150));
    });
    await act(async function () {
      pending[pending.length - 1](100, 0, 200, 40);
    });
    assert.equal(box.current.state.value, 0);
    assert.equal(box.current.state.pressed, false);
    assert.deepEqual(calls, []);
    assert.deepEqual(releases, []);

    // release before the measure resolves cancels without onRelease
    const box2 = await renderSlider(useSliderNative, {
      defaultValue: 0,
      onChange: function (n) { calls.push(n); },
      onRelease: function (n) { releases.push(n); }
    });
    box2.current.trackProps.ref.current = {
      measureInWindow: function (cb) { pending.push(cb); }
    };
    box2.current.thumbProps.ref.current = thumbNode();
    await act(async function () {
      box2.current.trackProps.onResponderGrant(gesture(150));
      box2.current.trackProps.onResponderRelease(gesture(150));
    });
    await act(async function () {
      pending[pending.length - 1](100, 0, 200, 40);
    });
    assert.equal(box2.current.state.value, 0);
    assert.deepEqual(calls, []);
    assert.deepEqual(releases, []);

    // disabling cancels an established drag without release
    const box3 = await renderSlider(useSliderNative, {
      defaultValue: 0,
      onChange: function (n) { calls.push(n); },
      onRelease: function (n) { releases.push(n); }
    });
    box3.current.trackProps.ref.current = {
      measureInWindow: function (cb) { pending.push(cb); }
    };
    box3.current.thumbProps.ref.current = thumbNode();
    await act(async function () {
      box3.current.trackProps.onResponderGrant(gesture(150));
      pending[pending.length - 1](100, 0, 200, 40);
    });
    assert.equal(box3.current.state.value, 25);
    await box3.render({
      defaultValue: 0, disabled: true,
      onChange: function (n) { calls.push(n); },
      onRelease: function (n) { releases.push(n); }
    });
    assert.equal(box3.current.state.disabled, true);
    await act(async function () {
      box3.current.trackProps.onResponderMove(gesture(300));
      box3.current.trackProps.onResponderRelease(gesture(300));
    });
    assert.equal(box3.current.state.value, 25);
    assert.deepEqual(releases, []);

    // unmount while a measurement is still pending invalidates it
    const box4 = await renderSlider(useSliderNative, {
      defaultValue: 0,
      onChange: function (n) { calls.push(n); },
      onRelease: function (n) { releases.push(n); }
    });
    box4.current.trackProps.ref.current = {
      measureInWindow: function (cb) { pending.push(cb); }
    };
    box4.current.thumbProps.ref.current = thumbNode();
    await act(async function () {
      box4.current.trackProps.onResponderGrant(gesture(150));
      box4.current.trackProps.onResponderMove(gesture(300));
    });
    const saved = pending[pending.length - 1];
    await box4.unmount();
    await act(async function () {
      saved(100, 0, 200, 40);
    });
    assert.equal(box4.current.state.value, 0);
    // box3's settled 25 remains the only emission; nothing late arrives
    assert.deepEqual(calls, [25]);
    assert.deepEqual(releases, []);
  });

  test('a controlled drag across real renders releases with its last requested number', async function () {
    const calls = [];
    const releases = [];
    const props = {
      value: 0,
      onChange: function (n) { calls.push(n); },
      onRelease: function (n) { releases.push(n); }
    };
    const box = await renderSlider(useSlider, props);
    box.current.trackProps.ref.current = webNode(100, 200, 50);
    const thumb = thumbNode();
    box.current.thumbProps.ref.current = thumb;
    // a non-primary grant is inert at the responder boundary itself
    await act(async function () {
      box.current.trackProps.onResponderGrant(gesture(200, 2));
    });
    assert.equal(thumb.focusCount, 0);
    assert.equal(box.current.state.pressed, false);
    assert.deepEqual(calls, []);
    await act(async function () {
      box.current.trackProps.onResponderGrant(gesture(200));
    });
    assert.deepEqual(calls, [25]);
    assert.equal(thumb.focusCount, 1);
    // move in a second act: the render between acts must not lose the drag
    await act(async function () {
      box.current.trackProps.onResponderMove(gesture(300));
    });
    assert.deepEqual(calls, [25, 75]);
    // the parent stays at 0; a repeated position after a render is not a
    // duplicate callback
    await box.render(props);
    await act(async function () {
      box.current.trackProps.onResponderMove(gesture(300));
    });
    assert.deepEqual(calls, [25, 75]);
    await act(async function () {
      box.current.trackProps.onResponderRelease(gesture(300));
    });
    assert.deepEqual(releases, [75]);
    assert.equal(box.current.state.value, 0);
    // a retained release after disabling emits nothing
    await act(async function () {
      box.current.trackProps.onResponderGrant(gesture(200));
    });
    assert.deepEqual(calls, [25, 75, 25]);
    await box.render({ value: 0, disabled: true, onChange: props.onChange, onRelease: props.onRelease });
    await act(async function () {
      box.current.trackProps.onResponderRelease(gesture(200));
    });
    assert.deepEqual(calls, [25, 75, 25]);
    assert.deepEqual(releases, [75]);
  });

});
