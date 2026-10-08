// Info: Button molecule. Every sample state renders under all three
// templates with its size, border, paddings, fill, label and elevation read
// from the kind's role cells in the built theme; hover, press, focus,
// selected and disabled drive the theme's feedback.press choice and focus
// ring through the DOM; the accessibility answer is a
// named button, disabled when disabled.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/button/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

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
        // The kind's own cells for the state: disabled, then selected, then rest
        const cell = 'button_' + (props.kind || 'primary');
        const phase = props.disabled ? '_disabled' : props.selected ? '_selected' : '';
        const parts = await renderButton(registryFor(template), props);
        const set = t['type.button_label'];
        assert.equal(parts.root.style.height, t[HEIGHTS[props.size || 'lg']] + 'px');
        assert.equal(parts.root.style.borderTopWidth, t['border.width_01'] + 'px');
        const inline = INLINE.includes(props.kind);
        assert.equal(parts.root.style.paddingLeft, ((inline ? t['control.button_ghost_padding_start'] : t['control.button_padding_start']) - t['border.width_01']) + 'px');
        // A trailing icon widens an end padding that reserves less than inset + icon + gap
        const slot = t['spacing.spacing_05'] + t['control.button_icon_size'] + t['spacing.spacing_03'];
        const end = inline ? t['control.button_ghost_padding_end'] : props.icon ? Math.max(t['control.button_padding_end'], slot) : t['control.button_padding_end'];
        assert.equal(parts.root.style.paddingRight, (end - t['border.width_01']) + 'px');
        // A taller button sets its label where the theme's anatomy.button_label says
        const height = t[HEIGHTS[props.size || 'lg']];
        const labelHeight = t['anatomy.button_label'] === 'top' ? Math.min(height, t['control.button_height']) : height;
        assert.equal(parts.root.style.paddingTop, ((labelHeight - set.lineHeight) / 2 - t['border.width_01']) + 'px');
        assert.equal(parts.root.style.borderTopLeftRadius, t['control.button_radius'] + 'px');
        assert.equal(parts.root.style.minWidth, t['control.button_min_width'] + 'px');
        assert.equal(parts.root.style.backgroundColor, cssValue('backgroundColor', t['color.' + cell + '_container' + phase]));
        assert.equal(parts.label.style.color, cssValue('color', t['color.' + cell + '_label' + phase]));
        assert.equal(parts.root.style.borderTopColor, cssValue('borderTopColor', t['color.' + cell + '_border' + (phase === '_selected' ? '' : phase)]));
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

  test('every kind draws its own border and elevation cells; disabled reads the disabled ones', async function () {
    for (const template of TEMPLATE_NAMES) {
      const t = buildNative(template).tokens;
      for (const kind of ['primary', 'tertiary', 'elevated']) {
        const rest = await renderButton(registryFor(template), { children: 'K', kind: kind });
        assert.equal(rest.root.style.borderTopColor, cssValue('borderTopColor', t['color.button_' + kind + '_border']), template + ' ' + kind);
        assert.equal(rest.root.style.boxShadow, t['shadow.button_' + kind].boxShadow, template + ' ' + kind);
        const disabled = await renderButton(registryFor(template), { children: 'K', kind: kind, disabled: true });
        assert.equal(disabled.root.style.borderTopColor, cssValue('borderTopColor', t['color.button_' + kind + '_border_disabled']), template + ' ' + kind);
        assert.equal(disabled.root.style.boxShadow, t['shadow.button_' + kind + '_disabled'].boxShadow, template + ' ' + kind);
      }
    }
  });

  test('a trailing icon is decorative, sized by the icon metric and drawn in the label color', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderButton(registryFor('carbon'), { children: 'Add', icon: 'add' });
    const svg = parts.root.querySelector('svg');
    assert.equal(svg.getAttribute('width'), String(t['control.button_icon_size']));
    assert.equal(svg.getAttribute('fill'), t['color.button_primary_label']);
    assert.equal(svg.getAttribute('aria-hidden'), 'true');
    assert.equal(svg.parentElement.style.right, t['spacing.spacing_05'] + 'px');
    const labelTop = (t['control.button_height'] - t['type.button_label'].lineHeight) / 2 - t['border.width_01'];
    assert.equal(svg.parentElement.style.top, (labelTop + (t['type.button_label'].lineHeight - t['control.button_icon_size']) / 2) + 'px');
    const ghost = await renderButton(registryFor('carbon'), { children: 'Add', icon: 'add', kind: 'ghost' });
    const inline = ghost.root.querySelector('svg').parentElement;
    assert.equal(inline.style.position, '');
    assert.equal(inline.style.marginLeft, t['spacing.spacing_03'] + 'px');
  });

  test('anatomy.button_label: a taller button keeps its label at the default height\'s place under top and centers it under center; the icon follows', async function () {
    const t = buildNative('default').tokens;
    const set = t['type.button_label'];
    const border = t['border.width_01'];
    const props = { children: 'Tall', icon: 'add', size: '2xl' };
    const top = await renderButton(registryFor('default', { 'anatomy.button_label': 'top' }), props);
    const center = await renderButton(registryFor('default', { 'anatomy.button_label': 'center' }), props);
    const topAt = (t['control.button_height'] - set.lineHeight) / 2 - border;
    const centerAt = (t['size.size_2xlarge'] - set.lineHeight) / 2 - border;
    assert.notEqual(topAt, centerAt);
    assert.equal(top.root.style.paddingTop, topAt + 'px');
    assert.equal(center.root.style.paddingTop, centerAt + 'px');
    assert.equal(center.root.querySelector('svg').parentElement.style.top, (centerAt + (set.lineHeight - t['control.button_icon_size']) / 2) + 'px');
    // At the default height both values draw the same place
    const restTop = await renderButton(registryFor('default', { 'anatomy.button_label': 'top' }), { children: 'Rest' });
    const restCenter = await renderButton(registryFor('default', { 'anatomy.button_label': 'center' }), { children: 'Rest' });
    assert.equal(restTop.root.style.paddingTop, restCenter.root.style.paddingTop);
  });

});


describe('Button: feedback.press through the DOM', function () {

  test('highlight: hover, press and release paint the kind\'s cells; the label follows the same state', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderButton(registryFor('carbon', { 'feedback.press': 'highlight' }), { children: 'T', kind: 'tertiary' });
    assert.equal(parts.root.style.backgroundColor, fillOf(t, 'button_tertiary_container'));
    assert.equal(parts.label.style.color, cssValue('color', t['color.button_tertiary_label']));
    await fire(parts.root, new Event('pointerover', { bubbles: true }));
    assert.equal(parts.root.style.backgroundColor, fillOf(t, 'button_tertiary_container_hover'));
    assert.equal(parts.label.style.color, cssValue('color', t['color.button_tertiary_label_hover']));
    await fire(parts.root, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(parts.root.style.backgroundColor, fillOf(t, 'button_tertiary_container_active'));
    assert.equal(parts.root.style.borderTopColor, cssValue('borderTopColor', t['color.button_tertiary_border_active']));
    await fire(parts.root, new MouseEvent('mouseup', { bubbles: true, button: 0 }));
    await fire(parts.root, new Event('pointerout', { bubbles: true }));
    assert.equal(parts.layer.style.opacity, '0');
  });

  test('opacity: the button fades by the state opacities and keeps its resting cell', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderButton(registryFor('carbon', { 'feedback.press': 'opacity', 'state.hover_opacity': 0.25, 'state.pressed_opacity': 0.5 }), { children: 'P' });
    assert.equal(parts.root.style.opacity, '1');
    await fire(parts.root, new Event('pointerover', { bubbles: true }));
    assert.equal(parts.root.style.opacity, '0.75');
    await fire(parts.root, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(parts.root.style.opacity, '0.5');
    assert.equal(parts.root.style.backgroundColor, fillOf(t, 'button_primary_container'));
  });

  test('ripple: the state\'s cell is a layer over the resting cell', async function () {
    const t = buildNative('material').tokens;
    const parts = await renderButton(registryFor('material', { 'feedback.press': 'ripple' }), { children: 'P' });
    assert.equal(parts.layer.style.opacity, '0');
    await fire(parts.root, new Event('pointerover', { bubbles: true }));
    assert.equal(parts.layer.style.backgroundColor, fillOf(t, 'button_primary_container_hover'));
    assert.equal(parts.layer.style.opacity, '1');
    await fire(parts.root, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(parts.layer.style.backgroundColor, fillOf(t, 'button_primary_container_active'));
    assert.equal(parts.root.style.backgroundColor, fillOf(t, 'button_primary_container'));
  });

  test('focus draws the button ring from its cells; a keyboard-only theme draws it for keyboard focus, not for a pointer press', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderButton(registryFor('carbon'), { children: 'P' });
    assert.equal(parts.root.style.outlineWidth, '');
    await act(async function () {
      parts.root.focus();
    });
    // Carbon draws its ring inside the edge: the border in the ring color, then inset shadows
    assert.equal(parts.root.style.borderTopColor, cssValue('borderTopColor', t['color.button_focus_ring']));
    assert.match(parts.root.style.boxShadow, /inset/);
    assert.equal(parts.root.style.outlineWidth, '');
    const m = buildNative('material').tokens;
    const keyboard = await renderButton(registryFor('material'), { children: 'P' });
    await fire(keyboard.root, new Event('pointerdown', { bubbles: true }));
    await act(async function () {
      keyboard.root.focus();
    });
    assert.equal(keyboard.root.style.outlineWidth, '', 'no ring after a pointer press');
    await act(async function () {
      keyboard.root.blur();
    });
    await act(async function () {
      keyboard.root.focus();
    });
    assert.equal(keyboard.root.style.outlineWidth, m['control.button_focus_width'] + 'px');
    assert.equal(keyboard.root.style.outlineOffset, m['control.button_focus_offset'] + 'px');
    assert.equal(keyboard.root.style.backgroundColor, fillOf(m, 'button_primary_container_focus'));
  });

  test('disabled: no hover or press feedback and no activation; enabled activates once per click', async function () {
    const t = buildNative('carbon').tokens;
    const calls = [];
    const disabled = await renderButton(registryFor('carbon', { 'feedback.press': 'highlight' }), { children: 'D', disabled: true, onPress: function () { calls.push('disabled'); } });
    await fire(disabled.root, new Event('pointerover', { bubbles: true }));
    await fire(disabled.root, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(disabled.root.style.backgroundColor, fillOf(t, 'button_primary_container_disabled'));
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
