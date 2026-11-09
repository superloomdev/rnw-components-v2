// Info: TabList member. The tab bar: selection, keyboard movement
// (automatic or manual activation), the dismissable close and the overflow
// seats `anatomy.tab_overflow` names.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/tabs/sample.tab-list.js';
import { Lib, TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES).concat('shapes');
const ITEMS = [1, 2, 3].map(function (n) { return { label: 'Tab ' + n }; });

afterEach(cleanup);

function registryFor (template) {
  return buildSystem(template, factories);
}

async function press (element, key) {
  await act(async function () {
    element.dispatchEvent(new KeyboardEvent('keydown', { key: key, bubbles: true, cancelable: true }));
  });
}

function layout (element, width) {
  element.dispatchEvent(new Event('layout'));
}


describe('TabList: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the bar draws its tabs', async function () {
        const container = await render(React.createElement(registryFor(template).TabList, state.props));
        const bar = container.querySelector('[role="tablist"]');
        assert.notEqual(bar, null);
        const tabs = Array.from(bar.querySelectorAll('[role="tab"]'));
        assert.equal(tabs.length, state.props.items.length);
      });
    }
  }

});


describe('TabList: manual activation', function () {

  test('an arrow moves the active tab but leaves the selection', async function () {
    const container = await render(React.createElement(registryFor('default').TabList, {
      activation: 'manual',
      defaultSelectedIndex: 0,
      items: ITEMS
    }));
    const bar = container.querySelector('[role="tablist"]');
    await press(bar, 'ArrowRight');
    const tabs = bar.querySelectorAll('[role="tab"]');
    assert.equal(tabs[1].getAttribute('tabindex'), '0', 'the arrow moved the active index');
    assert.equal(tabs[0].getAttribute('aria-selected'), 'true', 'the selection held on the first tab');
    assert.equal(tabs[1].getAttribute('aria-selected'), 'false');
  });

});


describe('TabList: dismissable', function () {

  test('Delete on the active tab calls onTabCloseRequest once', async function () {
    let calls = 0;
    const container = await render(React.createElement(registryFor('default').TabList, {
      dismissable: true,
      items: ITEMS,
      onTabCloseRequest: function () {
        calls = calls + 1;
      }
    }));
    const tabs = container.querySelectorAll('[role="tab"]');
    await press(tabs[0], 'Delete');
    assert.equal(calls, 1);
  });

});


describe('TabList: overflow seats', function () {

  // Render with layout hooks captured, then drive the container and the
  // content row with explicit widths
  async function renderList (template) {
    const layouts = [];
    const Measuring = function (Base) {
      return React.forwardRef(function (p, ref) {
        if (typeof p.onLayout === 'function') {
          layouts.push(p.onLayout);
        }
        return React.createElement(Base, Object.assign({}, p, { ref: ref }));
      });
    };
    const Registry = buildSystem(template, factories, {
      lib: Object.assign({}, Lib, { ReactNative: Object.assign({}, Lib.ReactNative, {
        ScrollView: Measuring(Lib.ReactNative.ScrollView),
        View: Measuring(Lib.ReactNative.View)
      }) })
    });
    const container = await render(React.createElement(Registry.TabList, { items: ITEMS }));
    return { container: container, layouts: layouts };
  }

  const size = function (width) {
    return { nativeEvent: { layout: { height: 40, width: width, x: 0, y: 0 } } };
  };

  test('the scroll buttons draw only when the row overflows', async function () {
    for (const template of TEMPLATE_NAMES) {
      const mode = buildNative(template).tokens['anatomy.tab_overflow'];
      const parts = await renderList(template);
      // The first captured handler is the scroll row's box, the second the content
      await act(async function () {
        parts.layouts[0](size(200));
        parts.layouts[1](size(600));
      });
      const buttons = Array.from(parts.container.querySelectorAll('div')).filter(function (el) {
        return el.style && el.style.width === '40px' && el.getAttribute('aria-hidden') === 'true';
      });
      assert.equal(buttons.length, 2, template + ': both scroll seats mount');
      const drawn = buttons.filter(function (b) { return b.style.display !== 'none'; });
      // At scroll start only the next button shows; the previous waits for scrollLeft > 0
      assert.equal(drawn.length, mode === 'buttons' ? 1 : 0, template + ' (' + mode + '): buttons show only under `buttons`, only when the row overflows, and the previous only once scrolled');
      // A row that fits keeps them hidden under every anatomy
      await act(async function () {
        parts.layouts[1](size(100));
      });
      const drawnNarrow = buttons.filter(function (b) { return b.style.display !== 'none'; });
      assert.equal(drawnNarrow.length, 0, template + ': a fitting row never draws the buttons');
      await cleanup();
    }
  });

});
