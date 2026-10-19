// Info: Tooltip molecule. Every sample state renders under all three
// templates with its bubble, label and caret read from the theme's `tooltip`
// cells (the `tooltip_compact` member cells under `compact`); the popover is
// `role="tooltip"` and describes its anchor through `aria-describedby`; a
// template with zero caret cells mounts the caret seat undrawn. A touch
// opens the popover where no pointer exists and Escape closes it.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/tooltip/sample.js';
import { Lib, TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Build a registry for a template.

@param {String} template - Template name

@return {Object} - Registry
*********************************************************************/
function registryFor (template) {

  return buildSystem(template, factories);

}


/********************************************************************
Render one Tooltip and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Tooltip props

@return {Promise<Object>} - { root, anchor, popover, bubble, label, caret }
*********************************************************************/
async function renderTooltip (Registry, props) {

  const container = await render(React.createElement(Registry.Tooltip, props));
  const root = container.firstElementChild;
  const popover = root.querySelector('[role="tooltip"]');

  return {
    root: root,
    anchor: root.querySelector('[aria-describedby]'),
    popover: popover,
    bubble: popover === null ? null : popover.firstElementChild,
    label: popover === null ? null : popover.querySelector('[dir="auto"]'),
    caret: popover === null ? null : popover.querySelector('[aria-hidden="true"]')
  };

}


describe('Tooltip: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': bubble, label and caret come from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const compact = props.compact === true;
        const parts = await renderTooltip(registryFor(template), props);

        if (props.defaultOpen !== true) {
          assert.equal(parts.popover, null);
          return;
        }

        // Bubble geometry and colors; the compact kind reads the member cells
        const paddingBlock = compact ? t['control.tooltip_compact_padding_block'] : t['control.tooltip_padding_block'];
        assert.equal(parts.bubble.style.backgroundColor, cssValue('backgroundColor', t['color.tooltip_container']));
        assert.equal(parts.bubble.style.borderTopLeftRadius, t['control.tooltip_radius'] + 'px');
        assert.equal(parts.bubble.style.maxWidth, t['control.tooltip_max_width'] + 'px');
        assert.equal(parts.bubble.style.paddingTop, paddingBlock + 'px');
        assert.equal(parts.bubble.style.paddingLeft, t['control.tooltip_padding_inline'] + 'px');

        // The label carries the kind's type style and color
        const face = compact ? t['type.tooltip_compact_label'] : t['type.tooltip_label'];
        assert.equal(parts.bubble.firstElementChild.style.color, cssValue('color', t['color.tooltip_label']));
        assert.equal(parts.bubble.firstElementChild.style.fontFamily, t['font.family.' + face.fontFamily]);
        assert.equal(parts.bubble.firstElementChild.style.fontSize, face.fontSize + 'px');
        assert.equal(parts.label.textContent, props.label);

        // The caret's clipping box reads the kind's caret cells; a zero box draws nothing
        const caretWidth = compact ? t['control.tooltip_compact_caret_width'] : t['control.tooltip_caret_width'];
        const caretHeight = compact ? t['control.tooltip_compact_caret_height'] : t['control.tooltip_caret_height'];
        assert.equal(parts.caret.style.width, caretWidth + 'px');
        assert.equal(parts.caret.style.height, caretHeight + 'px');

        // The anchor is described by the popover
        assert.equal(parts.anchor.getAttribute('aria-describedby'), parts.popover.id);
      });
    }
  }

});


describe('Tooltip: popover behavior', function () {

  test('a touch opens the popover where no pointer exists', async function () {
    const parts = await renderTooltip(registryFor('carbon'), { children: 'Anchor', label: 'Touch tip', enterDelayMs: 0 });
    assert.equal(parts.popover, null);
    await act(async function () {
      parts.root.dispatchEvent(new Event('touchend', { bubbles: true }));
    });
    const reopened = parts.root.querySelector('[role="tooltip"]');
    assert.notEqual(reopened, null);
    assert.equal(reopened.querySelector('[dir="auto"]').textContent, 'Touch tip');
  });

  test('Escape closes an open popover', async function () {
    const parts = await renderTooltip(registryFor('carbon'), { children: 'Anchor', label: 'Tip', defaultOpen: true });
    assert.notEqual(parts.popover, null);
    await act(async function () {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    });
    assert.equal(parts.root.querySelector('[role="tooltip"]'), null);
  });

  test('open is controllable through onOpenChange', async function () {
    const seen = [];
    const Registry = registryFor('carbon');
    const container = await render(React.createElement(Registry.Tooltip, {
      children: 'Anchor',
      label: 'Controlled',
      open: true,
      onOpenChange: function (next) {
        seen.push(next);
      }
    }));
    const root = container.firstElementChild;
    assert.notEqual(root.querySelector('[role="tooltip"]'), null);
    await act(async function () {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    });
    assert.deepEqual(seen, [false]);
    assert.notEqual(root.querySelector('[role="tooltip"]'), null);
  });

  test('a centered top tooltip centers its caret in a full-span row, not by margin or percent', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderTooltip(registryFor('carbon'), { children: 'Anchor', label: 'Tip', defaultOpen: true });
    assert.notEqual(parts.caret, null);
    // The clipping box keeps its cells; the wrapper spans the popover and
    // hangs off the anchor-facing edge, centering the box in the row
    assert.equal(parts.caret.style.width, t['control.tooltip_caret_width'] + 'px');
    const row = parts.caret.parentElement;
    assert.equal(row.style.position, 'absolute');
    assert.equal(row.style.left, '0px');
    assert.equal(row.style.right, '0px');
    // The zero-size jsdom anchor flips `top` to `bottom`, so the caret
    // hangs off the popover's top edge by its own height
    const hung = row.style.bottom !== '' ? 'bottom' : 'top';
    assert.equal(row.style[hung], -t['control.tooltip_caret_height'] + 'px');
    assert.equal(row.style.justifyContent, 'center');
    for (const element of [row, parts.caret, parts.caret.firstElementChild]) {
      assert.equal(/%|auto/.test(element.style.cssText), false, element.style.cssText);
    }
  });

});


describe('Tooltip: native', function () {

  test('the popover mounts absolute at window coordinates and carries the shift itself', async function () {
    const androidLib = Object.assign({}, Lib, {
      ReactNative: Object.assign({}, Lib.ReactNative, { Platform: { OS: 'android' } })
    });
    const Registry = buildSystem('carbon', factories, { lib: androidLib });
    const t = buildNative('carbon').tokens;
    const parts = await renderTooltip(Registry, { children: 'Anchor', label: 'Tip', open: true });

    // The positioning box mounts `absolute` at window coordinates inside the
    // host's bounds; the shift (percents of the box) lives on the box on
    // every platform, and the bubble keeps its max width inside it
    assert.notEqual(parts.popover, null);
    assert.equal(parts.popover.style.position, 'absolute');
    assert.notEqual(parts.popover.style.transform.indexOf('translateX'), -1);
    assert.equal(parts.bubble.style.maxWidth, t['control.tooltip_max_width'] + 'px');
    assert.equal(parts.bubble.style.transform, '');
  });

  // Yoga does not read `margin: auto` on an absolute box the way CSS does,
  // and a percentage `left` resolves against the parent's content box: a
  // centered caret hangs from a full-span flex wrapper instead
  test('a centered caret on android hangs from a full-span centered row', async function () {
    const androidLib = Object.assign({}, Lib, {
      ReactNative: Object.assign({}, Lib.ReactNative, { Platform: { OS: 'android' } })
    });
    const Registry = buildSystem('carbon', factories, { lib: androidLib });
    const t = buildNative('carbon').tokens;
    const { root } = await renderTooltip(Registry, { children: 'Anchor', label: 'Tip', open: true });
    // `measureInWindow` answers from a timer, which `act` does not wait for;
    // once it lands, the zero-size jsdom anchor flips `top` to `bottom`, so
    // the caret hangs off the popover's top edge by its own height
    await act(async function () {
      await new Promise(function (resolve) {
        setTimeout(resolve, 0);
      });
    });
    const caret = root.querySelector('[role="tooltip"] [aria-hidden="true"]');
    assert.notEqual(caret, null);
    const row = caret.parentElement;
    assert.equal(row.style.position, 'absolute');
    assert.equal(row.style.left, '0px');
    assert.equal(row.style.right, '0px');
    assert.equal(row.style.top, -t['control.tooltip_caret_height'] + 'px');
    assert.equal(row.style.bottom, '');
    assert.equal(row.style.justifyContent, 'center');
    for (const element of [row, caret, caret.firstElementChild]) {
      assert.equal(/%|auto/.test(element.style.cssText), false, element.style.cssText);
    }
  });

});


describe('Tooltip: private composition padding', function () {

  test('a member host can pin the bubble\'s inline padding', async function () {
    const parts = await renderTooltip(registryFor('carbon'), {
      children: 'Anchor',
      label: 'Tip',
      defaultOpen: true,
      paddingInline: 8
    });
    assert.equal(parts.bubble.style.paddingLeft, '8px');
    assert.equal(parts.bubble.style.paddingRight, '8px');
  });

  test('an explicit zero override is honored', async function () {
    const parts = await renderTooltip(registryFor('carbon'), {
      children: 'Anchor',
      label: 'Tip',
      defaultOpen: true,
      paddingInline: 0
    });
    assert.equal(parts.bubble.style.paddingLeft, '0px');
    assert.equal(parts.bubble.style.paddingRight, '0px');
  });

  test('an omitted override keeps the role cell', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderTooltip(registryFor('carbon'), {
      children: 'Anchor',
      label: 'Tip',
      defaultOpen: true
    });
    assert.equal(parts.bubble.style.paddingLeft, t['control.tooltip_padding_inline'] + 'px');
  });

});
