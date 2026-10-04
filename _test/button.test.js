// Info: Button molecule. Every sample state renders under all three
// templates with its size, border, paddings, fill and label read from the
// built theme; hover, press, focus, selected and disabled drive the theme's
// feedback.press choice through the DOM; the accessibility answer is a
// named button, disabled when disabled.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/button/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

// Expected palette per kind, as the behavior is specified: rest fill,
// hover fill, active fill, label color, label color on an engaged fill
const KINDS = {
  primary: ['button_primary', 'button_primary_hover', 'button_primary_active', 'text_on_color', null],
  secondary: ['button_secondary', 'button_secondary_hover', 'button_secondary_active', 'text_on_color', null],
  tertiary: [null, 'button_tertiary_hover', 'button_tertiary_active', 'button_tertiary', 'text_inverse'],
  ghost: [null, 'background_hover', 'background_active', 'link_primary', null],
  danger: ['button_danger_primary', 'button_danger_hover', 'button_danger_active', 'text_on_color', null],
  danger_tertiary: [null, 'button_danger_hover', 'button_danger_active', 'button_danger_secondary', 'text_on_color'],
  danger_ghost: [null, 'button_danger_hover', 'button_danger_active', 'button_danger_secondary', 'text_on_color'],
  tonal: ['button_tonal', 'button_tonal_hover', 'button_tonal_active', 'text_on_button_tonal', null],
  elevated: ['button_elevated', 'button_elevated_hover', 'button_elevated_active', 'interactive', null]
};
// How the renderer serializes a transparent fill or border
const TRANSPARENT = 'rgba(0, 0, 0, 0)';
// Kinds that reserve no trailing icon slot: their end padding equals the start padding
const INLINE = ['ghost', 'danger_ghost'];
// The default size is the control role; the other sizes follow the shared size scale
const HEIGHTS = { xs: 'size.size_xsmall', sm: 'size.size_small', md: 'size.size_medium', lg: 'control.button_height', xl: 'size.size_xlarge', '2xl': 'size.size_2xlarge' };

afterEach(cleanup);


/********************************************************************
Build a registry for a template, optionally with token overrides.

@param {String} template  - Template name
@param {Object} overrides - Token name -> value

@return {Object} - Registry
*********************************************************************/
function registryFor (template, overrides) {

  const built = buildNative(template);
  const tokens = Object.assign({}, built.tokens, overrides || {});

  return buildSystem(template, factories, { built: Object.assign({}, built, { tokens: tokens }) });

}


/********************************************************************
Render one Button and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Button props

@return {Promise<Object>} - { root, layer, label }
*********************************************************************/
async function renderButton (Registry, props) {

  const container = await render(React.createElement(Registry.Button, props));
  const root = container.querySelector('[role="button"]');

  return { root: root, layer: root.children[0], label: root.children[1] };

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


/********************************************************************
The DOM's serialization of a fill leaf; null is no fill.

@param {Object} t    - Built tokens
@param {String} leaf - Color leaf or null

@return {String} - Serialized color
*********************************************************************/
function fillOf (t, leaf) {

  return leaf === null ? TRANSPARENT : cssValue('backgroundColor', t['color.' + leaf]);

}


describe('Button: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': geometry, fill and label come from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const kind = KINDS[props.kind || 'primary'];
        const filled = kind[0] !== null;
        const restFill = props.disabled ? (filled ? 'button_disabled' : null) : props.selected && t['feedback.press'] === 'highlight' ? kind[2] : kind[0];
        const content = props.disabled ? (filled ? 'text_on_color_disabled' : 'text_disabled') : kind[3];
        const parts = await renderButton(registryFor(template), props);
        const set = t['type.button_label'];
        assert.equal(parts.root.style.height, t[HEIGHTS[props.size || 'lg']] + 'px');
        assert.equal(parts.root.style.borderTopWidth, t['border.width_01'] + 'px');
        assert.equal(parts.root.style.paddingLeft, (t['control.button_padding_start'] - t['border.width_01']) + 'px');
        // A trailing icon widens an end padding that reserves less than inset + icon + gap
        const slot = t['spacing.spacing_05'] + t['control.button_icon_size'] + t['spacing.spacing_03'];
        const end = INLINE.includes(props.kind) ? t['control.button_padding_start'] : props.icon ? Math.max(t['control.button_padding_end'], slot) : t['control.button_padding_end'];
        assert.equal(parts.root.style.paddingRight, (end - t['border.width_01']) + 'px');
        const labelHeight = Math.min(t[HEIGHTS[props.size || 'lg']], t['control.button_height']);
        assert.equal(parts.root.style.paddingTop, ((labelHeight - set.lineHeight) / 2 - t['border.width_01']) + 'px');
        assert.equal(parts.root.style.borderTopLeftRadius, t['control.button_radius'] + 'px');
        assert.equal(parts.root.style.backgroundColor, fillOf(t, restFill));
        assert.equal(parts.label.style.color, cssValue('color', t['color.' + content]));
        assert.equal(parts.label.style.fontSize, set.fontSize + 'px');
        assert.equal(parts.label.style.lineHeight, set.lineHeight + 'px');
        assert.equal(parts.label.textContent, props.children);
        assert.equal(parts.root.getAttribute('aria-label'), props.children);
        assert.equal(parts.root.getAttribute('aria-disabled'), props.disabled ? 'true' : null);
      });
    }
  }

});


describe('Button: kinds', function () {

  test('an outlined kind draws its border color, a disabled filled kind its fill; others draw a transparent border of the same width', async function () {
    const t = buildNative('carbon').tokens;
    const tertiary = await renderButton(registryFor('carbon'), { children: 'T', kind: 'tertiary' });
    assert.equal(tertiary.root.style.borderTopColor, cssValue('borderTopColor', t['color.button_tertiary']));
    const disabled = await renderButton(registryFor('carbon'), { children: 'T', kind: 'tertiary', disabled: true });
    assert.equal(disabled.root.style.borderTopColor, cssValue('borderTopColor', t['color.border_disabled']));
    const primary = await renderButton(registryFor('carbon'), { children: 'P' });
    assert.equal(primary.root.style.borderTopColor, TRANSPARENT);
    const filledDisabled = await renderButton(registryFor('carbon'), { children: 'P', disabled: true });
    assert.equal(filledDisabled.root.style.borderTopColor, cssValue('borderTopColor', t['color.button_disabled']));
  });

  test('elevated lifts with the first shadow level; disabled drops it', async function () {
    const t = buildNative('carbon').tokens;
    const elevated = await renderButton(registryFor('carbon'), { children: 'E', kind: 'elevated' });
    assert.equal(elevated.root.style.boxShadow, t['shadow.level_01'].boxShadow);
    const disabled = await renderButton(registryFor('carbon'), { children: 'E', kind: 'elevated', disabled: true });
    assert.equal(disabled.root.style.boxShadow, '');
  });

  test('a trailing icon is decorative, sized by the icon metric and drawn in the label color', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderButton(registryFor('carbon'), { children: 'Add', icon: 'add' });
    const svg = parts.root.querySelector('svg');
    assert.equal(svg.getAttribute('width'), String(t['control.button_icon_size']));
    assert.equal(svg.getAttribute('fill'), t['color.text_on_color']);
    assert.equal(svg.getAttribute('aria-hidden'), 'true');
    assert.equal(svg.parentElement.style.right, t['spacing.spacing_05'] + 'px');
    const labelTop = (t['control.button_height'] - t['type.button_label'].lineHeight) / 2 - t['border.width_01'];
    assert.equal(svg.parentElement.style.top, (labelTop + (t['type.button_label'].lineHeight - t['control.button_icon_size']) / 2) + 'px');
    const ghost = await renderButton(registryFor('carbon'), { children: 'Add', icon: 'add', kind: 'ghost' });
    const inline = ghost.root.querySelector('svg').parentElement;
    assert.equal(inline.style.position, '');
    assert.equal(inline.style.marginLeft, t['spacing.spacing_03'] + 'px');
  });

});


describe('Button: feedback.press through the DOM', function () {

  test('highlight: hover, press and release change the fill; an outlined kind switches its label on the engaged fill', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderButton(registryFor('carbon', { 'feedback.press': 'highlight' }), { children: 'T', kind: 'tertiary' });
    assert.equal(parts.root.style.backgroundColor, fillOf(t, null));
    assert.equal(parts.label.style.color, cssValue('color', t['color.button_tertiary']));
    await fire(parts.root, new Event('pointerover', { bubbles: true }));
    assert.equal(parts.root.style.backgroundColor, fillOf(t, 'button_tertiary_hover'));
    assert.equal(parts.label.style.color, cssValue('color', t['color.text_inverse']));
    await fire(parts.root, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(parts.root.style.backgroundColor, fillOf(t, 'button_tertiary_active'));
    await fire(parts.root, new MouseEvent('mouseup', { bubbles: true, button: 0 }));
    await fire(parts.root, new Event('pointerout', { bubbles: true }));
    assert.equal(parts.root.style.backgroundColor, fillOf(t, null));
    assert.equal(parts.layer.style.display, 'none');
  });

  test('opacity: the button fades by the state opacities and keeps its fill', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderButton(registryFor('carbon', { 'feedback.press': 'opacity', 'state.hover_opacity': 0.25, 'state.pressed_opacity': 0.5 }), { children: 'P' });
    assert.equal(parts.root.style.opacity, '1');
    await fire(parts.root, new Event('pointerover', { bubbles: true }));
    assert.equal(parts.root.style.opacity, '0.75');
    await fire(parts.root, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(parts.root.style.opacity, '0.5');
    assert.equal(parts.root.style.backgroundColor, fillOf(t, 'button_primary'));
    assert.equal(parts.layer.style.display, 'none');
  });

  test('ripple: the state layer in the label color rises to the hover and pressed opacities over a fixed fill', async function () {
    const t = buildNative('material').tokens;
    const parts = await renderButton(registryFor('material', { 'feedback.press': 'ripple' }), { children: 'P' });
    assert.equal(parts.layer.style.backgroundColor, cssValue('backgroundColor', t['color.text_on_color']));
    assert.equal(parts.layer.style.opacity, '0');
    await fire(parts.root, new Event('pointerover', { bubbles: true }));
    assert.equal(parts.layer.style.opacity, String(t['state.hover_opacity']));
    await fire(parts.root, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(parts.layer.style.opacity, String(t['state.pressed_opacity']));
    assert.equal(parts.root.style.backgroundColor, fillOf(t, 'button_primary'));
  });

  test('focus draws the theme\'s focus presentation', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderButton(registryFor('carbon'), { children: 'P' });
    assert.equal(parts.root.style.outlineWidth, '');
    await act(async function () {
      parts.root.focus();
    });
    assert.equal(parts.root.style.outlineWidth, t['focus.width'] + 'px');
    assert.equal(parts.root.style.outlineColor, cssValue('outlineColor', t['color.focus']));
  });

  test('disabled: no hover or press feedback and no activation; enabled activates once per click', async function () {
    const t = buildNative('carbon').tokens;
    const calls = [];
    const disabled = await renderButton(registryFor('carbon', { 'feedback.press': 'highlight' }), { children: 'D', disabled: true, onPress: function () { calls.push('disabled'); } });
    await fire(disabled.root, new Event('pointerover', { bubbles: true }));
    await fire(disabled.root, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(disabled.root.style.backgroundColor, fillOf(t, 'button_disabled'));
    await act(async function () {
      disabled.root.click();
    });
    const enabled = await renderButton(registryFor('carbon'), { children: 'E', onPress: function () { calls.push('enabled'); } });
    await act(async function () {
      enabled.root.click();
    });
    assert.deepEqual(calls, ['enabled']);
  });

});


describe('Button: accessibility', function () {

  test('the accessible name is the label, or accessibilityLabel when given', async function () {
    const named = await renderButton(registryFor('default'), { children: 'Save' });
    assert.equal(named.root.getAttribute('role'), 'button');
    assert.equal(named.root.getAttribute('aria-label'), 'Save');
    const labelled = await renderButton(registryFor('default'), { children: 'Save', accessibilityLabel: 'Save the draft' });
    assert.equal(labelled.root.getAttribute('aria-label'), 'Save the draft');
  });

});
