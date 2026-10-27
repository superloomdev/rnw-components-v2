// Info: Re-measure caps (D43). A fit that never converges must stop after
// 8 measures in one cycle, warn once through Debug, and measure again on
// the next open - instead of churning until the update-loop tripwire or
// the guard kills the process. The stubs hand the hooks a rect that moves
// on every read, so each measure writes a new position and commits again;
// with the cap planted off, the 2000-commit tripwire ends the run and the
// test fails by assertion, never by hanging.
//
// Run: node --import ./harness/register.js --test behaviors-measure-cap.test.js

import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import React, { act } from 'react';
import * as ReactNative from 'react-native-web';
import utils from 'helper-utils';
import debug from 'helper-debug';

import createBehaviors from '../behaviors/index.js';
import createPlatform from '../component/platform.js';
import { cleanup, render } from './harness/render.js';

const Utils = utils({});
const realDebug = debug({ Utils: Utils }, { LOG_LEVEL: 'error' });
const platform = createPlatform(ReactNative, Utils);

// Debug is spied, not stubbed: the hook may call any sibling method, so the
// spy inherits the real instance and overrides warn alone
const warnings = [];
const spyDebug = Object.create(realDebug);
spyDebug.warn = function (message) {
  warnings.push(message);
};

const behaviors = createBehaviors({
  React: React, ReactNative: ReactNative, Utils: Utils, Debug: spyDebug, platform: platform
});

const ANCHOR_SOURCE = { platform: 'web', viewport: { width: 1280, height: 720 } };

afterEach(async function () {
  warnings.length = 0;
  await cleanup();
});


/********************************************************************
An element stub whose getBoundingClientRect moves on every read; `reads`
counts how often the hook measured it.

@param {Function} rectForRead - Maps the read ordinal to a rect

@return {Object} - Stub element
*********************************************************************/
function rectStub (rectForRead) {

  const stub = { reads: 0 };
  stub.getBoundingClientRect = function () {
    stub.reads += 1;
    return rectForRead(stub.reads);
  };
  return stub;

}


// A bottom-end, unfitted menu sits its right edge on the range's end, so
// left = x - width changes with the menu's width on every read
function menuStub () {

  return rectStub(function (reads) {
    return { left: 0, top: 0, right: 40 + reads, bottom: 30, width: 40 + reads, height: 30 };
  });

}


// A bottom anchor places the surface at top = bottom + offset, so a top
// that moves on every read moves the answer on every measure
function anchorStub () {

  return rectStub(function (reads) {
    const top = 10 + reads;
    return { left: 10, top: top, right: 50, bottom: top + 40, width: 40, height: 40 };
  });

}


test('useMenuPosition: a never-settling fit stops after 8 measures and warns once', async function () {

  const menu = menuStub();
  function Probe () {
    const positioned = behaviors.useMenuPosition({
      menuRef: { current: menu },
      menuAlignment: 'bottom-end',
      x: 100,
      y: 50,
      fit: false,
      active: false
    });
    React.useLayoutEffect(function () {
      positioned.measure();
    });
    return null;
  }

  await render(React.createElement(Probe));
  assert(menu.reads <= 9, 'expected the cap to hold reads at most 9, got ' + menu.reads);
  const hits = warnings.filter(function (message) {
    return message.indexOf('useMenuPosition:') === 0;
  });
  assert.strictEqual(hits.length, 1, 'expected exactly one useMenuPosition warning, got ' + hits.length);
  assert(hits[0].indexOf('useMenuPosition: 8 re-measures in one open') === 0, 'unexpected warning: ' + hits[0]);

});

test('useAnchoredPosition: a never-settling anchor stops after 8 measures and warns once', async function () {

  const anchor = anchorStub();
  const anchorRef = { current: anchor };
  function Probe () {
    const anchored = behaviors.useAnchoredPosition({
      anchor: anchorRef,
      placement: 'bottom',
      source: ANCHOR_SOURCE,
      track: false
    });
    React.useLayoutEffect(function () {
      anchored.measure();
    });
    return null;
  }

  await render(React.createElement(Probe));
  assert(anchor.reads <= 9, 'expected the cap to hold reads at most 9, got ' + anchor.reads);
  const hits = warnings.filter(function (message) {
    return message.indexOf('useAnchoredPosition:') === 0;
  });
  assert.strictEqual(hits.length, 1, 'expected exactly one useAnchoredPosition warning, got ' + hits.length);
  assert(hits[0].indexOf('useAnchoredPosition: 8 re-measures in one open') === 0, 'unexpected warning: ' + hits[0]);

});

test('a new open cycle measures again after the cap', async function () {

  const anchor = anchorStub();
  const menu = menuStub();
  const anchorRef = { current: anchor };
  const menuRef = { current: menu };
  const toggle = { current: null };
  function Probe () {
    const [active, setActive] = React.useState(false);
    toggle.current = setActive;
    const anchored = behaviors.useAnchoredPosition({
      anchor: anchorRef,
      placement: 'bottom',
      source: ANCHOR_SOURCE,
      track: active
    });
    const positioned = behaviors.useMenuPosition({
      menuRef: menuRef,
      menuAlignment: 'bottom-end',
      x: 100,
      y: 50,
      fit: false,
      active: active
    });
    React.useLayoutEffect(function () {
      anchored.measure();
      positioned.measure();
    });
    React.useEffect(function () {
      if (active) {
        anchored.measure();
        positioned.measure();
      }
    }, [active]);
    return null;
  }

  await render(React.createElement(Probe));
  const anchoredAtCap = anchor.reads;
  const menuAtCap = menu.reads;
  assert(anchoredAtCap <= 9, 'anchored reads past the cap before the cycle reset: ' + anchoredAtCap);
  assert(menuAtCap <= 9, 'menu reads past the cap before the cycle reset: ' + menuAtCap);

  await act(async function () {
    toggle.current(true);
  });
  assert(anchor.reads > anchoredAtCap, 'anchored reads did not grow on the new track cycle');
  assert(menu.reads > menuAtCap, 'menu reads did not grow on the new active cycle');

});
