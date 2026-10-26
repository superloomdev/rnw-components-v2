// Info: DefinitionTooltip node tests - the term's underline cells, the toggle
// and hover open paths, Escape close and the a11y links to the bubble.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import { buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

afterEach(cleanup);

async function renderTip (template, props) {
  const Registry = buildSystem(template, factories);
  const container = await render(React.createElement(Registry.DefinitionTooltip, Object.assign({ children: 'Term', definition: 'The definition' }, props)));
  return { container: container, trigger: container.querySelector('[aria-expanded]') };
}

describe('DefinitionTooltip: the underlined term', function () {

  test('the term reads the underline cells and toggles on press', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderTip('carbon', {});
    const term = parts.container.querySelector('span, div');
    const underlined = Array.from(parts.container.querySelectorAll('*')).find(function (el) {
      return el.style && el.style.borderBottomStyle === 'dotted' || (el.style && el.style.borderStyle === 'dotted');
    });
    assert.ok(underlined, 'the term draws the dotted underline');
    assert.equal(underlined.style.borderBottomColor, cssValue('borderBottomColor', t['color.definition_term_underline']));
    assert.equal(parts.trigger.getAttribute('aria-expanded'), 'false');
    await act(async function () {
      parts.trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(parts.trigger.getAttribute('aria-expanded'), 'true');
    const tt = buildNative('carbon').tokens;
    const bubble = Array.from(parts.container.querySelectorAll('div')).find(function (el) {
      return el.style && parseFloat(el.style.maxWidth) === tt['control.definition_tooltip_max_width'];
    });
    assert.ok(bubble, 'the bubble body caps at the definition max width');
    await cleanup();
  });

  test('the hover underline reads the hover cell and openOnHover opens on enter', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderTip('carbon', { openOnHover: true });
    const underlined = function () {
      return Array.from(parts.container.querySelectorAll('*')).find(function (el) {
        return el.style && (el.style.borderBottomStyle === 'dotted' || el.style.borderStyle === 'dotted');
      });
    };
    await act(async function () {
      parts.trigger.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }));
    });
    assert.equal(underlined().style.borderBottomColor, cssValue('borderBottomColor', t['color.definition_term_underline_hover']), 'hovered keeps the hover underline cell');
    assert.equal(parts.trigger.getAttribute('aria-expanded'), 'true');
    await cleanup();
  });

  test('Escape closes the open bubble and aria-describedby points at it', async function () {
    const parts = await renderTip('carbon', { defaultOpen: true });
    assert.equal(parts.trigger.getAttribute('aria-expanded'), 'true');
    assert.ok(parts.trigger.getAttribute('aria-describedby'));
    await act(async function () {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    assert.equal(parts.trigger.getAttribute('aria-expanded'), 'false');
    await cleanup();
  });

});
