// Info: ContentSwitcher member. A row of segments where exactly one is
// selected; arrows, Home and End rove the focus and select, skipping
// disabled segments.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/tabs/sample.content-switcher.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);
const ITEMS = [{ text: 'One' }, { text: 'Two' }, { text: 'Three' }];

afterEach(cleanup);

function registryFor (template) {
  return buildSystem(template, factories);
}

async function press (element, key) {
  await act(async function () {
    element.dispatchEvent(new KeyboardEvent('keydown', { key: key, bubbles: true, cancelable: true }));
  });
}


describe('ContentSwitcher: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the switcher draws its segments', async function () {
        const container = await render(React.createElement(registryFor(template).ContentSwitcher, state.props));
        const bar = container.querySelector('[role="tablist"]');
        assert.notEqual(bar, null);
        const segments = bar.querySelectorAll('[role="tab"]');
        assert.equal(segments.length, state.props.items.length);
      });
    }
  }

});


describe('ContentSwitcher: keyboard', function () {

  test('arrows, Home and End select, skipping disabled segments', async function () {
    const items = [{ text: 'One' }, { text: 'Two', disabled: true }, { text: 'Three' }];
    const container = await render(React.createElement(registryFor('default').ContentSwitcher, { items: items }));
    const bar = container.querySelector('[role="tablist"]');
    let tabs = bar.querySelectorAll('[role="tab"]');
    assert.equal(tabs[0].getAttribute('aria-selected'), 'true');
    await press(bar, 'ArrowRight');
    tabs = bar.querySelectorAll('[role="tab"]');
    assert.equal(tabs[2].getAttribute('aria-selected'), 'true', 'the disabled middle segment is skipped');
    await press(bar, 'Home');
    tabs = bar.querySelectorAll('[role="tab"]');
    assert.equal(tabs[0].getAttribute('aria-selected'), 'true');
    await press(bar, 'End');
    tabs = bar.querySelectorAll('[role="tab"]');
    assert.equal(tabs[2].getAttribute('aria-selected'), 'true');
  });

});


describe('ContentSwitcher: separators and the selected mark', function () {

  test('short separator hides beside the selected segment', async function () {
    for (const template of TEMPLATE_NAMES) {
      const t = buildNative(template).tokens;
      if (t['anatomy.content_switcher_separator'] !== 'short') {
        continue;
      }
      const four = [{ text: 'One' }, { text: 'Two' }, { text: 'Three' }, { text: 'Four' }];
      const container = await render(React.createElement(registryFor(template).ContentSwitcher, { items: four, defaultSelectedIndex: 1 }));
      const segments = container.querySelectorAll('[role="tab"]');
      // The segment after the selected one and the selected one itself draw no separator
      const sep = function (s) { return s.previousElementSibling.children[0]; };
      assert.equal(sep(segments[1]).style.backgroundColor, 'rgba(0, 0, 0, 0)', 'selected segment: no separator');
      assert.equal(sep(segments[2]).style.backgroundColor, 'rgba(0, 0, 0, 0)', 'after selected: no separator');
      assert.notEqual(sep(segments[3]).style.backgroundColor, 'rgba(0, 0, 0, 0)', 'an unrelated segment keeps its separator');
    }
  });

  test('full separator draws on every segment', async function () {
    for (const template of TEMPLATE_NAMES) {
      const t = buildNative(template).tokens;
      if (t['anatomy.content_switcher_separator'] !== 'full') {
        continue;
      }
      const container = await render(React.createElement(registryFor(template).ContentSwitcher, { items: ITEMS, defaultSelectedIndex: 1 }));
      const segments = container.querySelectorAll('[role="tab"]');
      for (const s of segments) {
        assert.notEqual(s.previousElementSibling.children[0].style.backgroundColor, 'rgba(0, 0, 0, 0)');
      }
    }
  });

  test('the selected mark shows only under shown', async function () {
    for (const template of TEMPLATE_NAMES) {
      const t = buildNative(template).tokens;
      const shown = t['anatomy.content_switcher_selected_mark'] === 'shown';
      const container = await render(React.createElement(registryFor(template).ContentSwitcher, { items: ITEMS, defaultSelectedIndex: 0 }));
      const selected = container.querySelector('[role="tab"][aria-selected="true"]');
      const mark = selected.previousElementSibling.querySelector('svg');
      // the mark seat exists in both; `hidden` keeps it display:none
      assert.equal(mark !== null && mark.style.display !== 'none', shown, template + ': mark shown only when the enum says so');
    }
  });

});

describe('ContentSwitcher: the segment role', function () {

  test('the icons and default samples draw three tab segments, the first selected', async function () {
    for (const label of ['icons', 'default']) {
      const state = SAMPLE.find(function (entry) { return entry.label === label; });
      const container = await render(React.createElement(registryFor('default').ContentSwitcher, state.props));
      const tabs = container.querySelectorAll('[role="tab"]');
      assert.equal(tabs.length, 3, label + ': three segments carry role=tab');
      if (label === 'icons') {
        assert.equal(tabs[0].getAttribute('aria-selected'), 'true', 'icons: the first segment is selected');
      } else {
        assert.equal(tabs[1].getAttribute('aria-selected'), 'true', 'default: the middle segment is selected');
      }
      await cleanup();
    }
  });

});

describe('ContentSwitcher: the lg segment padding', function () {

  test('a text segment reads 16 and an icon segment 14 at lg', async function () {
    const ITEMS_TEXT = [{ text: 'One' }, { text: 'Two' }, { text: 'Three' }];
    const ITEMS_ICON = [{ icon: 'info', label: 'Information' }, { icon: 'settings', label: 'Settings' }, { icon: 'notification', label: 'Notifications' }];
    const text = await render(React.createElement(registryFor('default').ContentSwitcher, { items: ITEMS_TEXT, size: 'lg' }));
    assert.equal(getComputedStyle(text.querySelector('[role="tab"]').previousElementSibling).paddingLeft, '16px');
    await cleanup();
    const icon = await render(React.createElement(registryFor('default').ContentSwitcher, { items: ITEMS_ICON, size: 'lg' }));
    assert.equal(getComputedStyle(icon.querySelector('[role="tab"]').parentElement.firstElementChild).paddingLeft, '14px');
    await cleanup();
  });

});

describe('ContentSwitcher: the low-contrast pressed cell', function () {

  test('a pressed low-contrast segment paints the hover cell on its face', async function () {
    for (const template of TEMPLATE_NAMES) {
      const t = buildNative(template).tokens;
      const container = await render(React.createElement(registryFor(template).ContentSwitcher, { items: ITEMS, lowContrast: true, defaultSelectedIndex: 0 }));
      const segment = container.querySelectorAll('[role="tab"]')[1];
      const want = cssValue('backgroundColor', t['color.content_switcher_low_contrast_container_hover']);
      const face = segment.previousElementSibling;
      assert.notEqual(face.style.backgroundColor, want, template + ': the face does not paint the hover fill at rest');
      await act(async function () {
        segment.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      });
      assert.equal(face.style.backgroundColor, want, template + ': the pressed face paints the hover cell');
      await act(async function () {
        segment.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
      });
      await cleanup();
    }
  });

  test('a selected low-contrast segment draws its 1 px edge at the radius', async function () {
    for (const template of TEMPLATE_NAMES) {
      const t = buildNative(template).tokens;
      const container = await render(React.createElement(registryFor(template).ContentSwitcher, { items: ITEMS, lowContrast: true, defaultSelectedIndex: 0 }));
      const face = container.querySelectorAll('[role="tab"]')[0].previousElementSibling;
      const slab = Array.from(face.querySelectorAll('div')).find(function (el) {
        return el.style.position === 'absolute' && el.style.transformOrigin === 'bottom';
      });
      assert.ok(slab, template + ': the selected slab mounts');
      assert.ok(slab.style.boxShadow.indexOf('inset 0 0 0 1px') !== -1, template + ': the slab paints its 1 px edge, got ' + slab.style.boxShadow);
      assert.ok(slab.style.boxShadow.indexOf(t['color.content_switcher_outline']) !== -1, template + ': the edge reads content_switcher_outline');
      assert.equal(slab.style.borderTopLeftRadius, cssValue('borderTopLeftRadius', t['control.content_switcher_radius']), template + ': at the segment radius');
      await cleanup();
    }
  });

});
