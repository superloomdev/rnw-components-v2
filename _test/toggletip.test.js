// Info: Toggletip node tests - the label, the button's icon cells, the open
// bubble's composition and the close paths.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import { Lib, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

afterEach(cleanup);

async function renderToggletip (template, props) {
  const Registry = buildSystem(template, factories);
  const container = await render(React.createElement(Registry.Toggletip, Object.assign({
    label: 'Toggletip label', content: 'Helpful information'
  }, props)));
  return { container: container, button: container.querySelector('button') };
}

describe('Toggletip: the information bubble', function () {

  test('the button toggles the bubble and reports aria-expanded at its id', async function () {
    const parts = await renderToggletip('carbon', {});
    assert.equal(parts.button.getAttribute('aria-expanded'), 'false');
    assert.ok(parts.button.getAttribute('aria-controls'));
    await act(async function () {
      parts.button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(parts.button.getAttribute('aria-expanded'), 'true');
    const bubbleId = parts.button.getAttribute('aria-controls');
    assert.ok(parts.container.querySelector('[id="' + bubbleId + '"]'), 'the bubble mounts with the controlled id');
    await act(async function () {
      parts.button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(parts.button.getAttribute('aria-expanded'), 'false');
    await cleanup();
  });

  test('a pointer open focuses the trigger and draws its ring under any', async function () {
    const parts = await renderToggletip('carbon', {});
    await act(async function () {
      parts.button.dispatchEvent(new Event('pointerover', { bubbles: true }));
      parts.button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
      parts.button.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, button: 0 }));
      parts.button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(document.activeElement, parts.button, 'the trigger holds DOM focus after a pointer open');
    const face = parts.button.parentElement;
    const cs = getComputedStyle(face);
    assert.ok(cs.outlineStyle === 'solid' || cs.boxShadow !== 'none' || cs.borderColor !== 'rgba(0, 0, 0, 0)',
      'carbon (focus_trigger any) draws the ring on a pointer focus');
    await cleanup();
  });

  test('a pointer open under keyboard keeps the trigger focused but draws no ring', async function () {
    const Registry = buildSystem('carbon', factories, { layers: [{ 'feedback.focus_trigger': 'keyboard' }] });
    const container = await render(React.createElement(Registry.Toggletip, { label: 'Toggletip label', content: 'Helpful information' }));
    const button = container.querySelector('button');
    await act(async function () {
      button.dispatchEvent(new Event('pointerover', { bubbles: true }));
      button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
      button.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, button: 0 }));
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(document.activeElement, button, 'the trigger still holds DOM focus');
    const cs = getComputedStyle(button.parentElement);
    const ringDrawn = cs.outlineStyle === 'solid' || (cs.boxShadow !== '' && cs.boxShadow !== 'none');
    assert.equal(ringDrawn, false, 'keyboard: a pointer focus draws no ring');
    await cleanup();
  });

  test('the icon reads the active cell while the bubble is open', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderToggletip('carbon', { defaultOpen: true });
    const svg = parts.container.querySelector('svg');
    assert.ok(svg, 'the information icon draws');
    assert.equal(svg.getAttribute('fill'), t['color.toggletip_icon_active']);
    await cleanup();
    const closed = await renderToggletip('carbon', {});
    assert.equal(closed.container.querySelector('svg').getAttribute('fill'), t['color.toggletip_icon']);
    await cleanup();
  });

  test('the bubble rides the toggletip offset cell, not the popover offset', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderToggletip('carbon', { defaultOpen: true });
    const bubble = parts.container.querySelector('div[style*="max-width"]');
    assert.ok(bubble, 'the open bubble mounts');
    // The layer top is the toggletip offset plus half the caret height below
    // the anchor origin - the planted row drops it to the popover offset
    assert.equal(parseFloat(bubble.style.top), t['control.toggletip_offset'] + t['control.popover_caret_height'] / 2);
    await cleanup();
  });

  test('Escape closes the bubble', async function () {
    const parts = await renderToggletip('carbon', { defaultOpen: true });
    assert.equal(parts.button.getAttribute('aria-expanded'), 'true');
    await act(async function () {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    assert.equal(parts.button.getAttribute('aria-expanded'), 'false');
    await cleanup();
  });

  test('a link action renders the inverse link and a button action the inverse-ring button', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderToggletip('carbon', {
      defaultOpen: true,
      actions: [{ kind: 'link', label: 'Learn more', href: '#' }, { kind: 'button', label: 'Apply' }]
    });
    const link = parts.container.querySelector('[role="link"]');
    assert.ok(link, 'the link action renders');
    const linkText = Array.from(parts.container.querySelectorAll('*')).find(function (el) {
      return el.textContent === 'Learn more' && el.style && el.style.color !== '';
    });
    assert.ok(linkText, 'the link label draws');
    assert.equal(linkText.style.color, cssValue('color', t['color.link_label_inverse']));
    const actionButton = Array.from(parts.container.querySelectorAll('button')).find(function (b) { return b.textContent === 'Apply'; });
    assert.ok(actionButton, 'the button action renders');
    await act(async function () {
      actionButton.focus();
    });
    const ringHolder = actionButton.style.outlineColor !== '' ? actionButton : actionButton.firstElementChild;
    assert.equal(ringHolder.style.outlineColor || ringHolder.style.borderTopColor, cssValue('outlineColor', t['color.focus_ring_inverse']), 'the action button draws the inverse focus ring');
    await cleanup();
  });

});

describe('ToggletipButton: the press target floor', function () {

  test('the target meets the theme\'s press floor on both axes', async function () {
    const layouts = [];
    const MeasuringView = React.forwardRef(function (p, ref) {
      if (typeof p.onLayout === 'function') {
        layouts.push(p.onLayout);
      }
      return React.createElement(Lib.ReactNative.View, Object.assign({}, p, { ref: ref }));
    });
    for (const template of ['default', 'carbon']) {
      layouts.length = 0;
      const Registry = buildSystem(template, factories, {
        lib: Object.assign({}, Lib, { ReactNative: Object.assign({}, Lib.ReactNative, { View: MeasuringView }) })
      });
      const container = await render(React.createElement(Registry.ToggletipButton, { label: 'Show information' }));
      for (const onLayout of layouts) {
        await act(async function () {
          onLayout({ nativeEvent: { layout: { width: 16, height: 16 } } });
        });
      }
      const floor = buildNative(template).tokens['control.target_min'];
      const target = container.querySelector('button');
      assert.ok(target.style.position === 'absolute', template + ': the press layer mounts');
      assert.equal(target.style.width, Math.max(floor, 16) + 'px', template + ' target width');
      assert.equal(target.style.height, Math.max(floor, 16) + 'px', template + ' target height');
      await cleanup();
    }
  });

});
