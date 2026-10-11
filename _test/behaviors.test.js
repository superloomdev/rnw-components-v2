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
  'HeadingLevelContext', 'HeadingLevelProvider', 'OverlayContext',
  'createCompoundContext',
  'getA11yLive', 'getA11yPosition', 'getA11yRelation', 'getA11yState', 'getA11yValue',
  'getAnchoredPosition', 'getMenuPosition', 'getProgressValue', 'getSafeAreaInsets',
  'isLabelMatch', 'isRtl',
  'useA11yId', 'useAccordionItemState', 'useAnchoredPosition', 'useButton', 'useCheckbox',
  'useControllableState', 'useDatePickerCalendar', 'useDisclosure', 'useEscapeKey',
  'useFocusState', 'useFocusTrap', 'useFormSubmit', 'useHeadingLevel', 'useInteractionState',
  'useLiveRegionHost', 'useMenuCollection', 'useMenuPosition', 'useOverlay', 'useOverlayHost',
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
  useTimePickerDraft: {}
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

  test('the directory holds the fifteen behavior files plus the composer', function () {
    assert.equal(files.length, 16);
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
