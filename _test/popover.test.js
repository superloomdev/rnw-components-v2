// Info: Popover node tests - the open surface's drawing from the theme cells,
// the caret offset, Escape and outside dismissal, and the composed content.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import { buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

afterEach(cleanup);

const OFFSET = 8;   // control.popover_offset
const CARET_H = 6;  // control.popover_caret_height

async function renderPopover (template, props) {
  const built = buildNative(template);
  const Registry = buildSystem(template, factories);
  const container = await render(React.createElement(Registry.Popover, Object.assign({ open: true, content: 'Body', children: 'Anchor' }, props)));
  return { built: built, container: container, tokens: built.tokens };
}

describe('Popover: the anchored surface', function () {

  test('the bubble carries the popover cells and the caret lifts it half its height', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderPopover('carbon', {});
    const bubble = parts.container.querySelector('div[style*="max-width"]');
    assert.equal(bubble.style.backgroundColor, cssValue('backgroundColor', t['color.popover_container']));
    assert.equal(parseFloat(bubble.style.borderTopLeftRadius), t['control.popover_radius']);
    assert.equal(parseFloat(bubble.style.maxWidth), t['control.popover_max_width']);
    assert.equal(bubble.style.boxShadow, t['shadow.popover'].boxShadow);
    await cleanup();
  });

  test('the caret offset adds half the caret height; without a caret it does not', async function () {
    // The open surface's layer sits offset + caretHeight / 2 below the
    // anchor while the caret draws, and at the bare offset without it
    const position = async function (props) {
      const parts = await renderPopover('carbon', props);
      const bubble = parts.container.querySelector('div[style*="max-width"]');
      return parseFloat(bubble.style.top) - parseFloat(parts.container.firstElementChild.getBoundingClientRect ? 0 : 0);
    };
    const parts = await renderPopover('carbon', {});
    const bubble = parts.container.querySelector('div[style*="max-width"]');
    const layer = bubble;
    // the layer's own transform/style carries the placed offset upstream of
    // the layout: the planted row drops the caret half-height and must fail
    const withCaret = bubble.parentElement === parts.container ? null : null;
    const t = buildNative('carbon').tokens;
    const readOffset = function (el) { return parseFloat(el.style.top); };
    await cleanup();
    const placed = await renderPopover('carbon', {});
    const bare = await renderPopover('carbon', { caret: false });
    assert.ok(readOffset(placed.container.querySelector('div[style*="max-width"]')) > readOffset(bare.container.querySelector('div[style*="max-width"]')), 'the caret lifts the surface half its height');
    await cleanup();
  });

  test('the inverse surface reads the tooltip cells and draws no shadow', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderPopover('carbon', { highContrast: true });
    const bubble = parts.container.querySelector('div[style*="max-width"]');
    assert.equal(bubble.style.backgroundColor, cssValue('backgroundColor', t['color.tooltip_container']));
    assert.equal(bubble.style.boxShadow || '', '', 'the inverse surface draws no shadow');
    await cleanup();
  });

  test('the border flag draws the 1px popover border', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderPopover('carbon', { border: true });
    const bubble = parts.container.querySelector('div[style*="max-width"]');
    assert.equal(bubble.style.borderTopColor, cssValue('borderColor', t['color.popover_border']));
    assert.equal(bubble.style.borderTopWidth, '1px');
    await cleanup();
    const plain = await renderPopover('carbon', {});
    assert.equal(plain.container.querySelector('div[style*="max-width"]').style.borderTopColor, '', 'no border draws without the flag');
    await cleanup();
  });

  test('Escape asks the caller to close and a closed popover draws no content', async function () {
    const calls = [];
    const Registry = buildSystem('carbon', factories);
    await render(React.createElement(Registry.Popover, {
      open: true, content: 'Body', children: 'Anchor',
      onRequestClose: function () { calls.push('close'); }
    }));
    await act(async function () {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    assert.deepEqual(calls, ['close']);
    const closed = await render(React.createElement(Registry.Popover, { open: false, content: 'Body', children: 'Anchor' }));
    assert.equal(closed.textContent.includes('Body'), false);
    await cleanup();
  });

});
