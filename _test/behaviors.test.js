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
  'useA11yId', 'useAccordionItemState', 'useAnchoredPosition', 'useButton', 'useCheckbox',
  'useControllableState', 'useDatePickerCalendar', 'useDisclosure', 'useEscapeKey',
  'useFocusState', 'useFocusTrap', 'useFormSubmit', 'useHeadingLevel', 'useInteractionState',
  'useLayerSpace', 'useLiveRegionHost', 'useMenuCollection', 'useMenuPosition', 'useNumberInput', 'useOverlay', 'useOverlayHost',
  'usePopoverDismiss', 'usePressKeys', 'useReducedMotion', 'useResponsiveStack',
  'useRovingTabIndex', 'useSectionLevel', 'useSelect', 'useTabsState', 'useTextField',
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
  useNumberInput: {}
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
      for (const key of Object.keys(result)) {
        if (key !== 'state') {
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

  test('the directory holds the seventeen behavior files plus the composer', function () {
    assert.equal(files.length, 18);
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
