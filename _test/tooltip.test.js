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

});


describe('Tooltip: native', function () {

  test('the popover is block-relative, takes the room the bubble may take, and shifts the bubble', async function () {
    const androidLib = Object.assign({}, Lib, {
      ReactNative: Object.assign({}, Lib.ReactNative, { Platform: { OS: 'android' } })
    });
    const Registry = buildSystem('carbon', factories, { lib: androidLib });
    const t = buildNative('carbon').tokens;
    const parts = await renderTooltip(Registry, { children: 'Anchor', label: 'Tip', open: true });

    // The positioning box is absolute in the containing block at the room the
    // bubble may take; the shift is percents of the bubble, so it lives there
    assert.notEqual(parts.popover, null);
    assert.equal(parts.popover.style.position, 'absolute');
    assert.equal(parts.popover.style.alignItems, 'flex-start');
    assert.equal(parts.popover.style.width, t['control.tooltip_max_width'] + 'px');
    assert.equal(parts.popover.style.transform, '');
    assert.notEqual(parts.bubble.style.transform.indexOf('translateX'), -1);
  });

});
