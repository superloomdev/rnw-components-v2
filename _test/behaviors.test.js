// Info: Behavior layer contract.
//
// 1. Presence: the composer exports exactly the expected names, so a purity
//    scan over a shrunken surface cannot pass vacuously.
// 2. Shape: every hook that owns state returns `{ ...propGetters, state }`
//    (a query hook may return `state` alone) and its rendered `state` has
//    exactly the keys it publishes as `stateKeys`; everything beside `state`
//    is a getter, handler or props object. Hooks that own no state are
//    declared here by name with their return kind; an undeclared hook fails.
// 3. Purity: no appearance, no vendor name, no framework import, no platform
//    read in `behaviors/`.
// 4. Platform: `component/platform.js` is the one read, and `split` picks
//    the right half or returns null.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import * as ReactNative from 'react-native-web';
import utils from 'helper-utils';
import debug from 'helper-debug';

import createBehaviors from '../behaviors/index.js';
import createPlatform from '../component/platform.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const BEHAVIORS_DIR = join(HERE, '..', 'behaviors');

const Utils = utils({});
const Debug = debug({ Utils: Utils }, { LOG_LEVEL: 'error' });
const platform = createPlatform(ReactNative, Utils);
const behaviors = createBehaviors({ React: React, ReactNative: ReactNative, Utils: Utils, Debug: Debug, platform: platform });

// Every name the composer must expose. Adding a behavior means adding it here.
const EXPECTED_NAMES = [
  'DisabledContext', 'HeadingLevelContext', 'HeadingLevelProvider', 'LayerContext', 'OverlayContext',
  'createCompoundContext', 'getCompoundContext',
  'getA11yLive', 'getA11yPosition', 'getA11yRelation', 'getA11yState', 'getA11yValue',
  'getAnchoredPosition', 'getMenuPosition', 'getProgressValue', 'getSafeAreaInsets', 'getSearchHandlers',
  'isLabelMatch', 'isRtl',
  'useA11yId', 'useAccordionItemState', 'useAnchoredPosition', 'useButton', 'useCheckbox', 'useCombobox',
  'useControllableState', 'useDatePickerCalendar', 'useDisclosure', 'useEscapeKey',
  'useFocusState', 'useFocusTrap', 'useFormSubmit', 'useHeadingLevel', 'useInteractionState',
  'useLayerSpace', 'useLiveRegionHost', 'useMenuCollection', 'useMenuPosition', 'useMultiSelect', 'useNumberInput', 'useOverlay', 'useOverlayHost',
  'usePopoverDismiss', 'usePressKeys', 'useRadioGroup', 'useReducedMotion', 'useResponsiveStack',
  'useRovingTabIndex', 'useSectionLevel', 'useSelect', 'useSlider', 'useTabsState', 'useTextField',
  'useTimePickerDraft', 'useTimedFlag', 'useViewportLayer', 'useViewportSize'
];

// Hooks that own no state and therefore return no `state`. Each is named with
// the kind of value it returns so the exception is declared, never inferred.
const STATELESS_HOOKS = {
  useA11yId: 'string',
  useAnchoredPosition: 'object',
  useControllableState: 'array',
  useEscapeKey: 'undefined',
  useFocusTrap: 'object',
  useHeadingLevel: 'number',
  useLayerSpace: 'object',
  useMenuPosition: 'object',
  useOverlay: 'object',
  useOverlayHost: 'object',
  usePopoverDismiss: 'object',
  usePressKeys: 'object',
  useRovingTabIndex: 'object',
  useSectionLevel: 'number',
  useViewportLayer: 'object',
  useViewportSize: 'object'
};

// Minimal props per state-owning hook so the probe renders without throwing.
const STATEFUL_PROPS = {
  useTextField: { label: 'Name' },
  useButton: { children: 'Go' },
  useCheckbox: { label: 'Agree' },
  useSelect: { items: [{ value: 'a', label: 'A' }] },
  useCombobox: { items: [{ value: 'a', label: 'A' }], defaultValue: 'a' },
  useMultiSelect: { items: [{ value: 'a', label: 'A' }], defaultValue: ['a'] },
  useDisclosure: {},
  useFocusState: {},
  useInteractionState: {},
  useTimedFlag: { duration: 10 },
  useReducedMotion: undefined,
  useLiveRegionHost: undefined,
  useMenuCollection: {},
  useFormSubmit: {},
  useResponsiveStack: {},
  useAccordionItemState: {},
  useTabsState: {},
  useDatePickerCalendar: {},
  useTimePickerDraft: {},
  useNumberInput: {},
  useRadioGroup: { items: [{ value: 'a', label: 'A' }] },
  useSlider: {}
};

const BEHAVIOR_FORBIDDEN = [
  { name: 'hex color', pattern: /#[0-9a-fA-F]{3,8}([^0-9a-zA-Z]|$)/ },
  { name: 'token read', pattern: /\bctx\s*\.\s*(token|color|metric|typeStyle|icon|enum)\b|\.tokens\b/ },
  { name: 'vendor name', pattern: /carbon|material|ibm/i },
  { name: 'style prop', pattern: /\bstyle\s*:/ },
  { name: 'StyleSheet', pattern: /\bStyleSheet\b/ },
  { name: 'framework import', pattern: /from\s+['"](react|react-native|react-native-web|react-native-svg)['"]/ },
  { name: 'platform read', pattern: /\bPlatform\s*\./ },
  { name: 'press timing literal outside the one constant', pattern: /delayPress(In|Out)?\s*:\s*[1-9]/ }
];

const mounted = [];

afterEach(async function () {
  while (mounted.length > 0) {
    const item = mounted.pop();
    await act(async function () {
      item.root.unmount();
    });
    item.container.remove();
  }
});


/********************************************************************
Render a probe that calls one hook and hands its result back.

@param {Function} hook  - The hook under test
@param {*}        props - Its single argument

@return {Promise<*>} - What the hook returned on the last render
*********************************************************************/
async function renderHook (hook, props) {

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  mounted.push({ container: container, root: root });

  let result;
  function Probe () {
    result = hook(props);
    return null;
  }

  await act(async function () {
    root.render(React.createElement(Probe));
  });

  return result;

}


/********************************************************************
Strip comments so a purity pattern matches code only. String literals
stay: a color or a vendor name inside a string is exactly what the scan
exists to catch.

@param {String} source - File contents

@return {String} - Code with comments blanked
*********************************************************************/
function codeOnly (source) {

  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');

}


describe('behaviors: presence', function () {

  test('the composer exports exactly the expected names', function () {
    assert.deepEqual(Object.keys(behaviors).sort(), [...EXPECTED_NAMES].sort());
    assert.ok(Object.isFrozen(behaviors), 'the behavior map is frozen');
  });

  test('every hook is either stateful (publishes stateKeys) or declared stateless', function () {
    const hooks = EXPECTED_NAMES.filter(function (name) {
      return name.indexOf('use') === 0;
    });
    const undeclared = hooks.filter(function (name) {
      return !Array.isArray(behaviors[name].stateKeys) && !(name in STATELESS_HOOKS);
    });
    assert.deepEqual(undeclared, [], 'hooks neither publishing stateKeys nor declared stateless');
    const both = hooks.filter(function (name) {
      return Array.isArray(behaviors[name].stateKeys) && name in STATELESS_HOOKS;
    });
    assert.deepEqual(both, [], 'hooks declared stateless that also publish stateKeys');
    assert.deepEqual(Object.keys(STATEFUL_PROPS).sort(), hooks.filter(function (name) {
      return Array.isArray(behaviors[name].stateKeys);
    }).sort(), 'every stateful hook has probe props');
  });

  test('the composer refuses a missing dependency', function () {
    assert.throws(function () {
      createBehaviors({ React: React, ReactNative: ReactNative, Utils: Utils, Debug: Debug });
    }, /requires deps\.platform/);
    assert.throws(function () {
      createBehaviors({ React: React, ReactNative: ReactNative, Utils: Utils, platform: platform });
    }, /requires deps\.Debug/);
  });

});


describe('behaviors: every stateful hook returns { ...propGetters, state } matching stateKeys', function () {

  for (const name of Object.keys(STATEFUL_PROPS)) {
    test(name, async function () {
      const result = await renderHook(behaviors[name], STATEFUL_PROPS[name]);
      assert.equal(typeof result, 'object');
      assert.ok(result !== null && 'state' in result, name + ' returns a state object');
      assert.deepEqual(Object.keys(result.state).sort(), [...behaviors[name].stateKeys].sort(),
        name + ': rendered state keys must equal the published stateKeys');
      if (name === 'useSelect' || name === 'useCombobox') {
        assert.ok(Array.isArray(result.items), name + '.items must be the current option array');
      }
      if (name === 'useMultiSelect') {
        assert.ok(Array.isArray(result.items), 'useMultiSelect.items must be the displayed option array');
        assert.ok(Array.isArray(result.selectedValues), 'useMultiSelect.selectedValues must be an array');
      }
      for (const key of Object.keys(result)) {
        // These two choice hooks explicitly declare extra data results.
        const choiceData = (name === 'useSelect' || name === 'useCombobox') &&
          (key === 'value' || key === 'items');
        if (key !== 'state' && !choiceData) {
          assert.ok(['function', 'object'].includes(typeof result[key]),
            name + '.' + key + ' must be a prop getter, handler or props object, not a bare value');
        }
      }
    });
  }

});


describe('behaviors: useButton', function () {

  test('onFocus and onBlur are called after the behavior updates its state', async function () {
    const calls = [];
    const result = await renderHook(behaviors.useButton, {
      children: 'Go',
      onFocus: function (event) {
        calls.push('focus:' + (event && event.marker === true));
      },
      onBlur: function (event) {
        calls.push('blur:' + (event && event.marker === true));
      }
    });
    await act(async function () {
      result.rootProps.onFocus({ marker: true });
    });
    assert.deepEqual(calls, ['focus:true']);
    await act(async function () {
      result.rootProps.onBlur({ marker: true });
    });
    assert.deepEqual(calls, ['focus:true', 'blur:true']);
  });

});


describe('behaviors: getSearchHandlers', function () {

  const wire = function (overrides) {
    const calls = [];
    const inputRef = { current: { focus: function () {
      calls.push('focus');
    } } };
    const handlers = behaviors.getSearchHandlers(Object.assign({
      populated: true,
      disabled: false,
      inputRef: inputRef,
      onChangeText: function (text) {
        calls.push('text:' + text);
      },
      onClear: function () {
        calls.push('clear');
      },
      onCollapseRequest: function () {
        calls.push('collapse');
      },
      onSubmit: function (text) {
        calls.push('submit:' + text);
      },
      value: 'abc'
    }, overrides || {}));
    return { calls: calls, handlers: handlers };
  };

  test('returns the clear, key-press and submit handlers', function () {
    const { handlers } = wire();
    assert.deepEqual(Object.keys(handlers).sort(), ['clear', 'onKeyPress', 'onSubmitEditing']);
  });

  test('clear empties the text, notifies and returns focus to the input', function () {
    const { calls, handlers } = wire();
    handlers.clear();
    assert.deepEqual(calls, ['text:', 'clear', 'focus']);
  });

  test('a disabled field answers nothing', function () {
    const { calls, handlers } = wire({ disabled: true });
    handlers.clear();
    handlers.onKeyPress({ key: 'Escape', preventDefault: function () {
      calls.push('prevent');
    } });
    handlers.onSubmitEditing();
    assert.deepEqual(calls, []);
  });

  test('Escape on a populated field prevents default and clears', function () {
    const { calls, handlers } = wire();
    handlers.onKeyPress({ key: 'Escape', preventDefault: function () {
      calls.push('prevent');
    } });
    assert.deepEqual(calls, ['prevent', 'text:', 'clear', 'focus']);
  });

  test('Escape on an empty field requests collapse; a non-Escape key is ignored', function () {
    const { calls, handlers } = wire({ populated: false });
    handlers.onKeyPress({ key: 'a' });
    handlers.onKeyPress({ key: 'Escape', preventDefault: function () {
      calls.push('prevent');
    } });
    assert.deepEqual(calls, ['prevent', 'collapse']);
  });

  test('submission reports the current text', function () {
    const { calls, handlers } = wire({ value: 'report me' });
    handlers.onSubmitEditing();
    assert.deepEqual(calls, ['submit:report me']);
  });

});


describe('behaviors: getCompoundContext', function () {

  test('the same name reuses one context inside one system; names and systems isolate', function () {
    const one = behaviors.getCompoundContext('ProbeCompound');
    const again = behaviors.getCompoundContext('ProbeCompound');
    const other = behaviors.getCompoundContext('OtherCompound');
    assert.equal(one, again);
    assert.notEqual(one, other);
    assert.ok(one.Provider !== null && one.Provider !== undefined);
    assert.equal(typeof one.useContext, 'function');
    const fresh = createBehaviors({ React: React, ReactNative: ReactNative, Utils: Utils, Debug: Debug, platform: platform });
    assert.notEqual(fresh.getCompoundContext('ProbeCompound'), one);
    // The fresh-triple factory stays untouched: it never returns a cached pair
    assert.notEqual(behaviors.createCompoundContext('ProbeCompound'), one);
  });

  test('__proto__ and toString are ordinary names, not inherited members', function () {
    const proto = behaviors.getCompoundContext('__proto__');
    const string_ = behaviors.getCompoundContext('toString');
    assert.equal(typeof proto.useContext, 'function');
    assert.notEqual(proto, string_);
    assert.notEqual(proto, Object.prototype);
    assert.equal(behaviors.getCompoundContext('__proto__'), proto);
  });

  test('a member read outside the provider throws a named error', async function () {
    const Compound = behaviors.getCompoundContext('OrphanProbe');
    await assert.rejects(renderHook(function () {
      Compound.useContext();
      return null;
    }), /OrphanProbe/);
  });

});


describe('behaviors: useNumberInput', function () {

  /********************************************************************
  Render the hook and keep a box of its latest result, so an assertion
  reads the state a later `act` produced, not the first render's.

  @param {Object} props - Hook props

  @return {Promise<{ current: Object }>}
  *********************************************************************/
  async function renderNumberInput (props) {

    const box = { current: null };
    await renderHook(function (hookProps) {
      box.current = behaviors.useNumberInput(hookProps);
      return box.current;
    }, props);
    return box;

  }

  test('editing text is preserved verbatim; the number callback reports only finite parses or an allowed empty', async function () {
    const reports = [];
    const box = await renderNumberInput({
      allowEmpty: true,
      onChangeText: function (text) {
        reports.push('text:' + text);
      },
      onChange: function (value) {
        reports.push('num:' + value);
      }
    });
    await act(async function () {
      box.current.setText('1.20');
    });
    assert.equal(box.current.state.value, '1.20');
    assert.equal(box.current.state.number, 1.2);
    await act(async function () {
      box.current.setText('-');
    });
    assert.equal(box.current.state.value, '-');
    assert.equal(box.current.state.number, undefined);
    await act(async function () {
      box.current.setText('');
    });
    assert.equal(box.current.state.value, '');
    assert.deepEqual(reports, ['text:1.20', 'num:1.2', 'text:-', 'text:', 'num:']);
  });

  test('an empty edit is not allowed by default and becomes the step start', async function () {
    const reports = [];
    const box = await renderNumberInput({
      onChangeText: function (text) {
        reports.push(text);
      }
    });
    assert.equal(box.current.state.value, '0');
    await act(async function () {
      box.current.setText('');
    });
    assert.equal(box.current.state.value, '0');
    assert.deepEqual(reports, ['0']);
  });

  test('a value outside the bounds marks the field invalid', async function () {
    const outside = await renderNumberInput({ value: '15', min: 0, max: 10 });
    assert.equal(outside.current.state.invalid, true);
    const inside = await renderNumberInput({ value: '5', min: 0, max: 10 });
    assert.equal(inside.current.state.invalid, false);
  });

  test('the steppers clamp to the bounds and emit nothing on a clamped no-op', async function () {
    const reports = [];
    const box = await renderNumberInput({
      defaultValue: '9',
      max: 10,
      onChangeText: function (text) {
        reports.push(text);
      }
    });
    await act(async function () {
      box.current.actions.increment.rootProps.onPress();
    });
    assert.equal(box.current.state.value, '10');
    await act(async function () {
      box.current.actions.increment.rootProps.onPress();
    });
    assert.equal(box.current.state.value, '10');
    assert.deepEqual(reports, ['10']);
  });

  test('the arrows step through onKeyPress', async function () {
    const reports = [];
    const box = await renderNumberInput({
      defaultValue: '5',
      onChangeText: function (text) {
        reports.push(text);
      }
    });
    await act(async function () {
      box.current.onKeyPress({ key: 'ArrowUp', preventDefault: function () {} });
    });
    assert.equal(box.current.state.value, '6');
    await act(async function () {
      box.current.onKeyPress({ key: 'ArrowDown', preventDefault: function () {} });
    });
    assert.equal(box.current.state.value, '5');
    assert.deepEqual(reports, ['6', '5']);
  });

  test('a non-finite bound or step throws', async function () {
    await assert.rejects(renderNumberInput({ min: 'x' }), /min must be a finite number/);
    await assert.rejects(renderNumberInput({ step: 0 }), /step must be a finite number greater than 0/);
  });

});


describe('behaviors: useRadioGroup', function () {

  const ITEMS = [{ value: 'a' }, { value: 'b' }, { value: 'c' }];


  /********************************************************************
  Render a probe that calls useRadioGroup with rerenderable options and
  hands its result back. `current` always holds the last render's return,
  since a hook's closures and state are rebuilt every render.

  @param {Object} options - Initial useRadioGroup options

  @return {Promise<Object>} - { current, render }
  *********************************************************************/
  async function renderGroup (options) {

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container: container, root: root });

    const box = { current: undefined };
    function Probe (props) {
      box.current = behaviors.useRadioGroup(props);
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
    return box;

  }


  /********************************************************************
  Fire the group's root keydown handler with a fake event.

  @param {Object} group - The probe's { current } box
  @param {String} key   - Event key

  @return {Object} - The fake event after dispatch
  *********************************************************************/
  async function keydown (group, key) {

    const event = {
      key: key,
      prevented: false,
      preventDefault: function () {
        this.prevented = true;
      }
    };
    await act(async function () {
      group.current.containerProps.onKeyDown(event);
    });
    return event;

  }


  test('uncontrolled selection through item onChange; the checked member is a no-op', async function () {
    const calls = [];
    const group = await renderGroup({ items: ITEMS, defaultValue: 'a', onChange: function (next) { calls.push(next); } });
    assert.equal(group.current.state.value, 'a');
    assert.equal(group.current.state.selectedIndex, 0);
    await act(async function () {
      group.current.getItemProps(1).onChange(true);
    });
    assert.deepEqual(calls, ['b']);
    assert.equal(group.current.state.value, 'b');
    assert.equal(group.current.state.selectedIndex, 1);
    await act(async function () {
      group.current.getItemProps(1).onChange(true);
    });
    assert.deepEqual(calls, ['b'], 'selecting the checked member is a no-op');
  });

  test('controlled reports the next value without mutating the selection', async function () {
    const calls = [];
    const group = await renderGroup({ items: ITEMS, value: 'a', onChange: function (next) { calls.push(next); } });
    await act(async function () {
      group.current.getItemProps(2).onChange(true);
    });
    assert.deepEqual(calls, ['c']);
    assert.equal(group.current.state.value, 'a', 'the controlled selection does not move itself');
    assert.equal(group.current.state.selectedIndex, 0);
  });

  test('one enabled member is focusable: the selected, else the first enabled', async function () {
    const selected = await renderGroup({ items: ITEMS, defaultValue: 'b' });
    assert.deepEqual([0, 1, 2].map(function (index) {
      return selected.current.getItemProps(index).focusable;
    }), [false, true, false]);
    const unselected = await renderGroup({ items: ITEMS });
    assert.deepEqual([0, 1, 2].map(function (index) {
      return unselected.current.getItemProps(index).focusable;
    }), [true, false, false]);
    // A disabled selected member hands the tab stop to the first enabled
    const items = [{ value: 'a' }, { value: 'b', disabled: true }, { value: 'c' }];
    const fallback = await renderGroup({ items: items, defaultValue: 'b' });
    assert.deepEqual([0, 1, 2].map(function (index) {
      return fallback.current.getItemProps(index).focusable;
    }), [true, false, false]);
  });

  test('item props carry the group answers and the member records focus without selecting', async function () {
    const group = await renderGroup({ items: ITEMS, defaultValue: 'a' });
    const props = group.current.getItemProps(2);
    assert.equal(props.checked, false);
    assert.equal(props.disabled, false);
    assert.equal(typeof props.onChange, 'function');
    assert.equal(typeof props.onGroupFocus, 'function');
    assert.ok(props.rootRef !== null && typeof props.rootRef === 'object');
    await act(async function () {
      props.onGroupFocus();
    });
    assert.equal(group.current.state.activeIndex, 2);
    assert.equal(group.current.state.value, 'a', 'focus alone never selects');
    // getItemProps keeps one stable ref object per member value
    assert.equal(group.current.getItemProps(2).rootRef, props.rootRef);
  });

  test('arrows move selection and focus together, skipping disabled members and wrapping; Home and End jump', async function () {
    const calls = [];
    const focused = [];
    const items = [{ value: 'a' }, { value: 'b', disabled: true }, { value: 'c' }, { value: 'd' }];
    const group = await renderGroup({ items: items, defaultValue: 'a', onChange: function (next) { calls.push(next); } });
    // Seat a fake focusable element in each member's ref; a real focus
    // event records the member through onGroupFocus, so the fake does too
    for (let index = 0; index < items.length; index = index + 1) {
      const memberIndex = index;
      group.current.getItemProps(memberIndex).rootRef.current = { focus: function () {
        focused.push(items[memberIndex].value);
        group.current.getItemProps(memberIndex).onGroupFocus();
      } };
    }
    // Focus a member first so movement starts from it
    await act(async function () {
      group.current.getItemProps(0).onGroupFocus();
    });
    // ArrowDown skips disabled b and lands on c, selecting and focusing it
    let event = await keydown(group, 'ArrowDown');
    assert.equal(event.prevented, true);
    assert.equal(group.current.state.value, 'c');
    assert.deepEqual(focused, ['c']);
    // ArrowRight from c goes to d, then wraps past the end to a
    event = await keydown(group, 'ArrowRight');
    assert.equal(group.current.state.value, 'd');
    event = await keydown(group, 'ArrowRight');
    assert.equal(group.current.state.value, 'a', 'right wraps past the end');
    // ArrowUp from a wraps to d
    event = await keydown(group, 'ArrowUp');
    assert.equal(group.current.state.value, 'd');
    // ArrowLeft from d goes to c
    event = await keydown(group, 'ArrowLeft');
    assert.equal(group.current.state.value, 'c');
    // Home and End choose the first and last enabled members
    event = await keydown(group, 'Home');
    assert.equal(group.current.state.value, 'a');
    event = await keydown(group, 'End');
    assert.equal(group.current.state.value, 'd');
    assert.deepEqual(calls, ['c', 'd', 'a', 'd', 'c', 'a', 'd']);
    assert.deepEqual(focused, ['c', 'd', 'a', 'd', 'c', 'a', 'd'], 'focus followed every move');
    // An unhandled key is left alone
    event = await keydown(group, 'x');
    assert.equal(event.prevented, false);
  });

  test('a disabled group navigates nothing and selects nothing', async function () {
    const calls = [];
    const group = await renderGroup({ items: ITEMS, disabled: true, defaultValue: 'a', onChange: function (next) { calls.push(next); } });
    assert.equal(group.current.state.disabled, true);
    for (let index = 0; index < ITEMS.length; index = index + 1) {
      assert.equal(group.current.getItemProps(index).focusable, false);
      assert.equal(group.current.getItemProps(index).disabled, true);
    }
    const event = await keydown(group, 'ArrowRight');
    assert.equal(event.prevented, false);
    await act(async function () {
      group.current.getItemProps(1).onChange(true);
    });
    assert.deepEqual(calls, []);
    assert.equal(group.current.state.value, 'a');
  });

  test('an empty group has no selection, no tab stop and no-op navigation', async function () {
    const group = await renderGroup({ items: [] });
    assert.equal(group.current.state.selectedIndex, -1);
    const event = await keydown(group, 'ArrowDown');
    assert.equal(event.prevented, false);
    const home = await keydown(group, 'Home');
    assert.equal(home.prevented, false);
  });

  test('an all-disabled set has no tab stop and no movement', async function () {
    const items = ITEMS.map(function (item) {
      return Object.assign({}, item, { disabled: true });
    });
    const group = await renderGroup({ items: items });
    for (let index = 0; index < items.length; index = index + 1) {
      assert.equal(group.current.getItemProps(index).focusable, false);
    }
    const event = await keydown(group, 'ArrowDown');
    assert.equal(event.prevented, false);
  });

  test('the mutation boundary guards disabled, removed and unchecked callbacks', async function () {
    const calls = [];
    const items = [{ value: 'a' }, { value: 'b', disabled: true }, { value: 'c' }];
    const group = await renderGroup({ items: items, defaultValue: 'a', onChange: function (next) { calls.push(next); } });
    // A disabled member's onChange is dead at the hook, not only in the
    // rendered child
    const disabledMember = group.current.getItemProps(1);
    await act(async function () {
      disabledMember.onChange(true);
    });
    assert.deepEqual(calls, []);
    assert.equal(group.current.state.value, 'a');
    // onChange(false) never selects - unchecking is not a selection
    await act(async function () {
      group.current.getItemProps(2).onChange(false);
    });
    assert.deepEqual(calls, []);
    assert.equal(group.current.state.value, 'a');
    // A callback retained from a removed member is dead
    const removedCallback = group.current.getItemProps(2).onChange;
    await group.render({ items: items.slice(0, 2), defaultValue: 'a', onChange: function (next) { calls.push(next); } });
    await act(async function () {
      removedCallback(true);
    });
    assert.deepEqual(calls, []);
    assert.equal(group.current.state.value, 'a');
    // A disabled member cannot take the recorded focus
    await act(async function () {
      group.current.getItemProps(1).onGroupFocus();
    });
    assert.equal(group.current.state.activeIndex, -1, 'the disabled member never becomes active');
    // An enabled member still focuses and selects normally
    await act(async function () {
      group.current.getItemProps(0).onGroupFocus();
      group.current.getItemProps(0).onChange(true);
    });
    assert.equal(group.current.state.activeIndex, 0);
    assert.equal(group.current.state.value, 'a', 'selecting the checked member stays a no-op');
    assert.deepEqual(calls, []);
    await act(async function () {
      group.current.getItemProps(0).onChange(true);
      // c is removed in this render; re-render with it back
    });
    await group.render({ items: items, defaultValue: 'a', onChange: function (next) { calls.push(next); } });
    await act(async function () {
      group.current.getItemProps(2).onChange(true);
    });
    assert.deepEqual(calls, ['c'], 'a live enabled member still reports');
  });

  test('a disabled group never activates a member focus', async function () {
    const group = await renderGroup({ items: ITEMS, disabled: true });
    await act(async function () {
      group.current.getItemProps(0).onGroupFocus();
    });
    assert.equal(group.current.state.activeIndex, -1);
  });

  test('reordering and removing items recomputes selection and focusability by value', async function () {
    const group = await renderGroup({ items: ITEMS, defaultValue: 'b' });
    assert.equal(group.current.state.selectedIndex, 1);
    // Reorder: b's index and tab stop move with its value, not its ordinal
    await group.render({ items: [ITEMS[2], ITEMS[0], ITEMS[1]], defaultValue: 'b' });
    assert.equal(group.current.state.selectedIndex, 2);
    assert.equal(group.current.getItemProps(2).focusable, true);
    assert.equal(group.current.getItemProps(0).focusable, false);
    // Remove the selected member: nothing checks and the tab stop falls back
    await group.render({ items: [ITEMS[0], ITEMS[2]], defaultValue: 'b' });
    assert.equal(group.current.state.selectedIndex, -1);
    assert.equal(group.current.getItemProps(0).focusable, true);
  });

  test('bad or duplicate values throw a useful TypeError', async function () {
    await assert.rejects(renderHook(behaviors.useRadioGroup, { items: [{ value: 'a' }, { value: 'a' }] }), /duplicate/);
    await assert.rejects(renderHook(behaviors.useRadioGroup, { items: [{}] }), /value/);
    await assert.rejects(renderHook(behaviors.useRadioGroup, { items: [{ value: NaN }] }), /value/);
    await assert.rejects(renderHook(behaviors.useRadioGroup, { items: [{ value: Infinity }] }), /value/);
  });

});


describe('behaviors: stateless hooks return the declared kind', function () {

  const ARGS = {
    useA11yId: ['probe'],
    useAnchoredPosition: [{}],
    useControllableState: [{ defaultValue: 1 }],
    useEscapeKey: [function () {}, true, { addEventListener: function () {}, removeEventListener: function () {} }],
    useFocusTrap: [{ isOpen: false }],
    useHeadingLevel: [],
    useMenuPosition: [{}],
    useOverlay: [{ isOpen: false }],
    useOverlayHost: [],
    usePopoverDismiss: [{}],
    usePressKeys: [{}],
    useRovingTabIndex: [{ count: 2 }],
    useSectionLevel: [],
    useViewportLayer: [],
    useViewportSize: []
  };

  for (const name of Object.keys(STATELESS_HOOKS)) {
    test(name + ' -> ' + STATELESS_HOOKS[name], async function () {
      const result = await renderHook(function () {
        return behaviors[name].apply(null, ARGS[name]);
      });
      const kind = Array.isArray(result) ? 'array' : typeof result;
      assert.equal(kind, STATELESS_HOOKS[name]);
      if (kind === 'object') {
        assert.ok(!('state' in result), name + ' is declared stateless and must not return state');
      }
    });
  }

});


describe('behaviors: purity', function () {

  const files = readdirSync(BEHAVIORS_DIR).filter(function (file) {
    return file.endsWith('.js');
  });

  test('the directory holds twenty-one behavior family files plus the composer', function () {
    assert.equal(files.length, 22);
  });

  test('no appearance, vendor name, framework import or platform read in behaviors/', function () {
    const violations = [];
    for (const file of files) {
      const lines = codeOnly(readFileSync(join(BEHAVIORS_DIR, file), 'utf8')).split('\n');
      lines.forEach(function (line, index) {
        for (const rule of BEHAVIOR_FORBIDDEN) {
          if (rule.pattern.test(line)) {
            violations.push(file + ':' + (index + 1) + ' ' + rule.name + ': ' + line.trim());
          }
        }
      });
    }
    assert.deepEqual(violations, []);
  });

});


describe('behaviors: the platform answer owns the layer style', function () {

  const native = createBehaviors({
    React: React, ReactNative: ReactNative, Utils: Utils, Debug: Debug,
    platform: createPlatform({ Platform: { OS: 'android' } }, Utils)
  });

  for (const name of ['useAnchoredPosition', 'useMenuPosition']) {
    test(name + ': layerStyle is fixed on the web, absolute on a native platform', async function () {
      const web = await renderHook(behaviors[name], {});
      assert.equal(web.layerStyle.position, 'fixed');
      assert.equal(typeof web.layerStyle.left, 'number');
      assert.equal(typeof web.layerStyle.top, 'number');
      const android = await renderHook(native[name], {});
      assert.equal(android.layerStyle.position, 'absolute');
      assert.equal(typeof android.layerStyle.left, 'number');
      assert.equal(typeof android.layerStyle.top, 'number');
    });
  }

  test('useAnchoredPosition: on a native platform the layer shifts by the host origin', async function () {
    const anchor = {
      measureInWindow: function (callback) {
        callback(100, 60, 20, 10);
      }
    };
    let result;
    function Inner () {
      result = native.useAnchoredPosition({ anchor: anchor, placement: 'bottom-start', flip: false });
      return null;
    }
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container: container, root: root });
    await act(async function () {
      root.render(React.createElement(native.OverlayContext.Provider,
        { value: { hosted: true, origin: { x: 10, y: 50 } } },
        React.createElement(Inner)));
    });
    await act(async function () {
      result.measure();
    });
    // Window position minus the host origin: left 100 - 10,
    // top (60 + 10 + 8 offset) - 50
    assert.equal(result.layerStyle.position, 'absolute');
    assert.equal(result.layerStyle.left, 90);
    assert.equal(result.layerStyle.top, 28);
  });

  test('useAnchoredPosition: without a host the native layer keeps window coordinates', async function () {
    const anchor = {
      measureInWindow: function (callback) {
        callback(100, 60, 20, 10);
      }
    };
    let result;
    function Probe () {
      result = native.useAnchoredPosition({ anchor: anchor, placement: 'bottom-start', flip: false });
      return null;
    }
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container: container, root: root });
    await act(async function () {
      root.render(React.createElement(Probe));
    });
    await act(async function () {
      result.measure();
    });
    assert.equal(result.layerStyle.left, 100);
    assert.equal(result.layerStyle.top, 78);
  });

  test('useViewportLayer: fixed and viewport-sized on the web', async function () {
    const layer = await renderHook(behaviors.useViewportLayer);
    assert.equal(layer.position, 'fixed');
    assert.equal(layer.left, 0);
    assert.equal(layer.top, 0);
    assert.equal(layer.width, window.innerWidth);
    assert.equal(layer.height, window.innerHeight);
  });

  test('useViewportLayer: inside a host the web layer covers the host, not the viewport', async function () {
    let layer;
    function Probe () {
      layer = behaviors.useViewportLayer();
      return null;
    }
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container: container, root: root });
    await act(async function () {
      root.render(React.createElement(behaviors.OverlayContext.Provider,
        { value: { hosted: true, origin: { x: 0, y: 0 } } },
        React.createElement(Probe)));
    });
    assert.deepEqual(layer, {
      bottom: 0, left: 0, position: 'absolute', right: 0, top: 0
    });
  });

  test('useMenuPosition: inside a host the web layer mounts absolute at the same point', async function () {
    let positioned;
    function Probe () {
      positioned = behaviors.useMenuPosition({ x: 20, y: 30 });
      return null;
    }
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container: container, root: root });
    await act(async function () {
      root.render(React.createElement(behaviors.OverlayContext.Provider,
        { value: { hosted: true, origin: { x: 0, y: 0 } } },
        React.createElement(Probe)));
    });
    assert.equal(positioned.layerStyle.position, 'absolute');
    assert.equal(positioned.layerStyle.left, 20);
    assert.equal(positioned.layerStyle.top, 30);
  });

  test('useViewportLayer: absolute inset 0 inside the host on a native platform', async function () {
    assert.deepEqual(await renderHook(native.useViewportLayer), {
      bottom: 0, left: 0, position: 'absolute', right: 0, top: 0
    });
  });

  // A native platform has no `window`: the space the layer positions
  // against is `Dimensions.get('window')`, or the host's own box when the
  // layer is mounted inside a host
  const withDimensions = Object.assign({}, ReactNative, {
    Dimensions: {
      addEventListener: function () {
        return { remove: function () {} };
      },
      get: function () {
        return { width: 400, height: 800 };
      }
    }
  });
  const nativeDims = createBehaviors({
    React: React, ReactNative: withDimensions, Utils: Utils, Debug: Debug,
    platform: createPlatform({ Platform: { OS: 'android' } }, Utils)
  });

  test('useAnchoredPosition: an unhosted native layer measures against the Dimensions window', async function () {
    const anchor = {
      measureInWindow: function (callback) {
        callback(100, 200, 20, 10);
      }
    };
    let result;
    function Probe () {
      result = nativeDims.useAnchoredPosition({ anchor: anchor, placement: 'bottom' });
      return null;
    }
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container: container, root: root });
    await act(async function () {
      root.render(React.createElement(Probe));
    });
    await act(async function () {
      result.measure();
    });
    // Room below the anchor in the 400x800 window keeps the placement and
    // the layer sits below the anchor's bottom edge
    assert.equal(result.actualPlacement, 'bottom');
    assert.equal(result.layerStyle.position, 'absolute');
    assert.equal(result.layerStyle.top, 218);
    assert.equal(result.layerStyle.left, 110);
  });

  test('useAnchoredPosition: a hosted native layer measures in the host space', async function () {
    const anchor = {
      measureInWindow: function (callback) {
        callback(100, 640, 20, 10);
      }
    };
    let result;
    function Probe () {
      result = nativeDims.useAnchoredPosition({ anchor: anchor, placement: 'bottom' });
      return null;
    }
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container: container, root: root });
    await act(async function () {
      root.render(React.createElement(nativeDims.OverlayContext.Provider,
        { value: { hosted: true, origin: { x: 10, y: 50 }, size: { width: 300, height: 600 } } },
        React.createElement(Probe)));
    });
    await act(async function () {
      result.measure();
    });
    // The host-space anchor bottom is 600: `bottom` plus the offset
    // overflows the 300x600 host, so the placement flips to `top`
    assert.equal(result.actualPlacement, 'top');
    assert.equal(result.layerStyle.top, 582);
    assert.equal(result.layerStyle.left, 100);
  });

  test('useMenuPosition: a hosted native menu clamps into the host', async function () {
    const menu = {
      measureInWindow: function (callback) {
        callback(0, 0, 160, 50);
      }
    };
    let positioned;
    function Probe () {
      positioned = nativeDims.useMenuPosition({ x: 240, y: 30, menuRef: { current: menu } });
      return null;
    }
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container: container, root: root });
    await act(async function () {
      root.render(React.createElement(nativeDims.OverlayContext.Provider,
        { value: { hosted: true, origin: { x: 10, y: 50 }, size: { width: 300, height: 600 } } },
        React.createElement(Probe)));
    });
    await act(async function () {
      positioned.measure();
    });
    // 240 + 160 overflows the 300-wide host, so the menu's right edge
    // pins at the anchor's: left 80
    assert.equal(positioned.layerStyle.position, 'absolute');
    assert.equal(positioned.layerStyle.left, 80);
    assert.equal(positioned.layerStyle.top, 30);
  });

  test('useLayerSpace: the host size when hosted, the Dimensions window when not', async function () {
    let unhosted;
    function Plain () {
      unhosted = nativeDims.useLayerSpace();
      return null;
    }
    let hosted;
    function InsideHost () {
      hosted = nativeDims.useLayerSpace();
      return null;
    }
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container: container, root: root });
    await act(async function () {
      root.render(React.createElement(React.Fragment, null,
        React.createElement(Plain),
        React.createElement(nativeDims.OverlayContext.Provider,
          { value: { hosted: true, origin: { x: 10, y: 50 }, size: { width: 300, height: 600 } } },
          React.createElement(InsideHost))));
    });
    assert.deepEqual(hosted, { width: 300, height: 600 });
    assert.deepEqual(unhosted, { width: 400, height: 800 });
  });

  test('useOverlay warns once per component name when open and unhosted on a native platform', async function () {
    const warnings = [];
    const recorded = Object.assign({}, Debug, {
      warn: function (message) {
        warnings.push(message);
      }
    });
    const unhosted = createBehaviors({
      React: React, ReactNative: ReactNative, Utils: Utils, Debug: recorded,
      platform: createPlatform({ Platform: { OS: 'android' } }, Utils)
    });
    await renderHook(unhosted.useOverlay, { isOpen: true, name: 'Probe' });
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /Probe.*OverlayHost/);
    // A second mount of the same name does not repeat the warning
    await renderHook(unhosted.useOverlay, { isOpen: true, name: 'Probe' });
    assert.equal(warnings.length, 1);
  });

  test('useOverlay does not warn when closed, hosted, or on the web', async function () {
    const warnings = [];
    const recorded = Object.assign({}, Debug, {
      warn: function (message) {
        warnings.push(message);
      }
    });
    const unhosted = createBehaviors({
      React: React, ReactNative: ReactNative, Utils: Utils, Debug: recorded,
      platform: createPlatform({ Platform: { OS: 'android' } }, Utils)
    });
    // Closed on a native platform
    await renderHook(unhosted.useOverlay, { isOpen: false, name: 'Shut' });
    // Hosted on a native platform
    let hosted;
    function Inner () {
      hosted = unhosted.useOverlay({ isOpen: true, name: 'Hosted' });
      return null;
    }
    function Outer () {
      const host = unhosted.useOverlayHost();
      return React.createElement(unhosted.OverlayContext.Provider, { value: host.contextValue },
        React.createElement(Inner));
    }
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container: container, root: root });
    await act(async function () {
      root.render(React.createElement(Outer));
    });
    assert.equal(hosted.hosted, true);
    // Open and unhosted on the web
    const web = createBehaviors({ React: React, ReactNative: ReactNative, Utils: Utils, Debug: recorded, platform: platform });
    await renderHook(web.useOverlay, { isOpen: true, name: 'Web' });
    assert.deepEqual(warnings, []);
  });

});


describe('component/platform.js', function () {

  test('reads the injected platform once and exposes os, isNative, split', function () {
    assert.equal(platform.os, 'web');
    assert.equal(platform.isNative, false);
    assert.ok(Object.isFrozen(platform));
  });

  test('split picks the web half on web and null when the half is missing', function () {
    assert.equal(platform.split({ web: 'W', native: 'N' }), 'W');
    assert.equal(platform.split({ native: 'N' }), null);
  });

  test('split picks the native half on ios and android', function () {
    for (const os of ['ios', 'android']) {
      const native = createPlatform({ Platform: { OS: os } }, Utils);
      assert.equal(native.os, os);
      assert.equal(native.isNative, true);
      assert.equal(native.split({ web: 'W', native: 'N' }), 'N');
      assert.equal(native.split({ web: 'W' }), null);
    }
  });

  test('rejects a module without Platform.OS', function () {
    assert.throws(function () {
      createPlatform({}, Utils);
    }, TypeError);
  });

});
