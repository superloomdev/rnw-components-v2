// Info: IconButton molecule. Every sample state renders under all three
// templates with its square, border, fill and icon read from the kind's
// role cells in the built theme (the standard and outlined kinds' icon
// reads the member cells); `selected` makes the button `aria-pressed` and
// draws the selected cells; the compact tooltip names it.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/button/sample.icon-button.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

// The kinds whose icon color is a member cell, not the kind's label cell
const ICON_KINDS = ['ghost', 'tertiary'];
// The default size is the member cell; the smaller squares follow the shared size scale
const SIDES = { sm: 'size.size_small', md: 'size.size_medium' };

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
Render one IconButton and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - IconButton props

@return {Promise<Object>} - { root, layer, icon, popover }
*********************************************************************/
async function renderIconButton (Registry, props) {

  const container = await render(React.createElement(Registry.IconButton, props));
  const root = container.querySelector('[role="button"]');
  const face = container.querySelector('[data-testid="icon-button-face"]');

  return {
    root: root,
    face: face,
    layer: face.children[0],
    icon: face.querySelector('svg'),
    popover: function () {
      return container.firstElementChild.querySelector('[role="tooltip"]');
    }
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


describe('IconButton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': square, fill and icon come from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const kind = props.kind || 'primary';
        const disabled = props.disabled === true;
        const phase = disabled ? '_disabled' : props.selected === true ? '_selected' : '';
        const parts = await renderIconButton(registryFor(template), props);

        // The square's side, fill, border and radius live on the face
        const side = SIDES[props.size] ? t[SIDES[props.size]] : t['control.icon_button_size'];
        assert.equal(parts.face.style.width, side + 'px');
        assert.equal(parts.face.style.height, side + 'px');
        assert.equal(parts.face.style.backgroundColor, cssValue('backgroundColor', t['color.button_' + kind + '_container' + phase]));
        assert.equal(parts.face.style.borderTopColor, cssValue('borderTopColor', t['color.button_' + kind + '_border' + (phase === '_selected' ? '' : phase)]));
        assert.equal(parts.face.style.borderTopWidth, t['border.width_01'] + 'px');
        assert.equal(parts.face.style.borderTopLeftRadius, t['control.button_radius'] + 'px');

        // The one icon, sized and colored by the theme
        const iconLeaf = ICON_KINDS.indexOf(kind) >= 0 ? 'icon_button_' + kind + '_icon' + phase : 'button_' + kind + '_label' + phase;
        assert.equal(parts.icon.getAttribute('width'), String(t['control.icon_button_icon_size']));
        assert.equal(parts.icon.getAttribute('height'), String(t['control.icon_button_icon_size']));
        assert.equal(parts.icon.getAttribute('fill'), t['color.' + iconLeaf]);

        // The target over the face is never smaller than the platform's
        // forty-four point minimum
        const target = Math.max(44, side);
        assert.equal(parts.root.style.width, target + 'px');
        assert.equal(parts.root.style.height, target + 'px');

        // The accessible name; a toggle reports its state
        assert.equal(parts.root.getAttribute('aria-label'), props.label);
        assert.equal(parts.root.getAttribute('aria-pressed'), props.selected === undefined ? null : String(props.selected === true));
        assert.equal(parts.root.getAttribute('aria-disabled'), disabled ? 'true' : null);
      });
    }
  }

});


describe('IconButton: states drive the theme through the DOM', function () {

  test('a hover paints the kind\'s hover cells', async function () {
    const t = buildNative('default').tokens;
    const parts = await renderIconButton(registryFor('default'), { icon: 'add', label: 'Add', kind: 'ghost' });
    assert.equal(parts.face.style.backgroundColor, cssValue('backgroundColor', t['color.button_ghost_container']));
    await fire(parts.root, new Event('pointerover', { bubbles: true }));
    assert.equal(parts.face.style.backgroundColor, cssValue('backgroundColor', t['color.button_ghost_container_hover']));
    assert.equal(parts.icon.getAttribute('fill'), t['color.icon_button_ghost_icon_hover']);
  });

  test('a press reports through onPress', async function () {
    let presses = 0;
    const parts = await renderIconButton(registryFor('carbon'), { icon: 'add', label: 'Add', onPress: function () { presses = presses + 1; } });
    await fire(parts.root, new MouseEvent('click', { bubbles: true }));
    assert.equal(presses, 1);
  });

  test('the compact tooltip opens on hover and names the button', async function () {
    const parts = await renderIconButton(registryFor('carbon'), { icon: 'add', label: 'Add thing', enterDelayMs: undefined });
    assert.equal(parts.popover(), null);
    await fire(parts.root, new Event('pointerover', { bubbles: true }));
    await act(async function () {
      await new Promise(function (resolve) {
        setTimeout(resolve, 150);
      });
    });
    const popover = parts.popover();
    assert.notEqual(popover, null);
    assert.equal(popover.querySelector('[dir="auto"]').textContent, 'Add thing');
  });

});
