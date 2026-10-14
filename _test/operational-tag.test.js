// Info: OperationalTag molecule. Every sample state renders a Tag of the
// hue (gray by default) on a pressable: the real border in the hue's
// border cell, the hover fill on hover, the theme's interactive layer on
// press, the tag family's ring on focus.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/tag/sample.operational-tag.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
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
Render one OperationalTag and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Props

@return {Promise<Object>} - { root, tag, label, layer, pressable, icon }
*********************************************************************/
async function renderOperational (Registry, props) {

  const container = await render(React.createElement(Registry.OperationalTag, props));
  const root = container.firstElementChild;

  return {
    root: root,
    tag: root.children[0],
    label: root.querySelector('[dir="auto"]'),
    layer: root.children[1],
    pressable: root.querySelector('[role="button"]'),
    icon: root.children[0].querySelector('svg')
  };

}


/********************************************************************
Dispatch one DOM event on an element inside act.

@param {HTMLElement} element - Target
@param {Event}       event   - Event
*********************************************************************/
async function fire (element, event) {

  await act(async function () {
    element.dispatchEvent(event);
  });

}


describe('OperationalTag: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the hue cells, the outline and the pressable', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const type = typeof props.type === 'string' ? props.type : null;
        const disabled = props.disabled === true;
        const parts = await renderOperational(registryFor(template), props);

        // The container fills from the hue's background, the neutral tag
        // cell without a type, the disabled cell when disabled; the outline
        // is `anatomy.tag_interactive_outline` wide in the hue's border cell,
        // the interactive outline cell or the interactive disabled cell - a
        // real border where the anatomy is `border`, the inset shadow where
        // it is `inset`
        const container = disabled ? 'tag_container_disabled' : type === null ? 'tag_container' : 'tag_background_' + type;
        assert.equal(parts.tag.style.backgroundColor, cssValue('backgroundColor', t['color.' + container]));
        const border = disabled ? 'tag_interactive_outline_disabled' : type === null ? 'tag_interactive_outline' : 'tag_border_' + type;
        const outlineWidth = t['control.tag_interactive_outline_width'];
        if (t['anatomy.tag_interactive_outline'] === 'border') {
          assert.equal(parts.tag.style.borderTopWidth, outlineWidth + 'px');
          assert.equal(parts.tag.style.borderTopColor, cssValue('borderColor', t['color.' + border]));
          assert.equal(parts.tag.style.boxShadow, '');
        } else {
          assert.equal(parts.tag.style.borderTopWidth, '');
          assert.equal(parts.tag.style.boxShadow, cssValue('boxShadow', 'inset 0 0 0 ' + outlineWidth + 'px ' + t['color.' + border]));
        }

        // The label reads the hue's color, the neutral label or the disabled
        // label; an untyped icon reads the neutral icon cells
        const textLeaf = disabled ? 'tag_label_disabled' : type === null ? 'tag_label' : 'tag_color_' + type;
        assert.equal(parts.label.style.color, cssValue('color', t['color.' + textLeaf]));
        if (typeof props.icon === 'string') {
          const iconLeaf = type === null ? (disabled ? 'tag_icon_disabled' : 'tag_icon') : textLeaf;
          assert.equal(parts.icon.getAttribute('fill'), t['color.' + iconLeaf]);
        }

        // The pressable is a transparent target over the face (no layout in
        // jsdom: it covers the face exactly), named by the label
        assert.equal(parts.pressable.style.position, 'absolute');
        assert.equal(parts.label.textContent, props.text);
        assert.equal(parts.pressable.getAttribute('aria-label'), props.text);
        assert.equal(parts.pressable.getAttribute('aria-disabled'), disabled ? 'true' : null);
      });
    }
  }

});

describe('OperationalTag: states drive the theme through the DOM', function () {

  test('a hover paints the hue\'s hover fill; a press layers the theme\'s interactive layer', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderOperational(registryFor('carbon'), { text: 'T' });
    assert.equal(parts.tag.style.backgroundColor, cssValue('backgroundColor', t['color.tag_container']));
    await fire(parts.pressable, new Event('pointerover', { bubbles: true }));
    assert.equal(parts.tag.style.backgroundColor, cssValue('backgroundColor', t['color.tag_container_hover']));
    await fire(parts.pressable, new MouseEvent('mousedown', { bubbles: true }));
    assert.equal(parts.layer.style.backgroundColor, cssValue('backgroundColor', t['color.tag_interactive_layer_active']));
  });

  test('a press reports through onPress', async function () {
    let presses = 0;
    const parts = await renderOperational(registryFor('carbon'), { onPress: function () { presses = presses + 1; }, text: 'T' });
    await fire(parts.pressable, new MouseEvent('click', { bubbles: true }));
    assert.equal(presses, 1);
  });

  test('focus draws the tag family\'s ring on the root', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderOperational(registryFor('carbon'), { text: 'T' });
    await act(async function () {
      parts.pressable.focus();
    });
    assert.equal(parts.root.style.outlineWidth, t['control.tag_focus_width'] + 'px');
    assert.equal(parts.root.style.outlineColor, cssValue('outlineColor', t['color.tag_focus_ring']));
    assert.equal(parts.root.style.outlineOffset, t['control.tag_focus_offset'] + 'px');
  });

});
