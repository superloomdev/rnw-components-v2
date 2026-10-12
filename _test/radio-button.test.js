// Info: RadioButton molecule. Every sample state renders under all three
// templates with its ring, dot, layer and label read from the theme's
// radio and selection role cells; press and Space drive the state through
// the DOM; the accessibility answer is a labelled radio that is checked,
// disabled or invalid exactly when it says so, and it never unchecks itself.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/radio-button/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

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
Render one RadioButton and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - RadioButton props

@return {Promise<Object>} - { root, wrap, ring, layer, dot, label }
*********************************************************************/
async function renderRadioButton (Registry, props) {

  const container = await render(React.createElement(Registry.RadioButton, props));
  const root = container.querySelector('[role="radio"]');
  const wrap = root.children[0];

  return {
    root: root,
    wrap: wrap,
    ring: wrap.children[0],
    layer: wrap.children[1],
    dot: wrap.children[2],
    label: root.children[1]
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


describe('RadioButton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': ring, dot, layer and label come from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const disabled = props.disabled === true;
        const invalid = props.invalid === true && !disabled;
        const selected = props.checked === true;
        const phase = disabled ? '_disabled' : invalid ? '_invalid' : '';
        const edge = disabled ? 'selection_outline_disabled'
          : invalid ? 'selection_outline_invalid'
          : selected ? 'radio_outline_selected' + phase
          : 'selection_outline' + phase;
        const parts = await renderRadioButton(registryFor(template), props);

        // Ring geometry and colors
        assert.equal(parts.ring.style.width, t['control.radio_size'] + 'px');
        assert.equal(parts.ring.style.height, t['control.radio_size'] + 'px');
        assert.equal(parts.ring.style.borderTopWidth, t['control.radio_border'] + 'px');
        assert.equal(parts.ring.style.borderTopLeftRadius, t['shape.radius_max'] + 'px');
        assert.equal(parts.ring.style.borderTopColor, cssValue('borderTopColor', t['color.' + edge]));
        assert.equal(parts.ring.style.outlineOffset, t['control.radio_focus_offset'] + 'px');
        assert.equal(parts.ring.style.outlineWidth, '');

        // The dot: the container fill for the state, drawn only while checked
        assert.equal(parts.dot.style.width, t['control.radio_dot_size'] + 'px');
        assert.equal(parts.dot.style.height, t['control.radio_dot_size'] + 'px');
        assert.equal(parts.dot.style.display, selected ? 'flex' : 'none');
        assert.equal(parts.dot.style.backgroundColor, cssValue('backgroundColor', t['color.selection_container' + phase]));

        // The state layer disc, centered on the ring, resting invisible
        assert.equal(parts.layer.style.width, t['control.selection_layer_size'] + 'px');
        assert.equal(parts.layer.style.borderTopLeftRadius, t['shape.radius_max'] + 'px');
        assert.equal(parts.layer.style.opacity, '0');

        // Row geometry: the ring's insets and the label gap
        assert.equal(parts.wrap.style.marginLeft, t['spacing.spacing_01'] + 'px');
        assert.equal(parts.wrap.style.marginTop, t['border.width_01'] + 'px');
        assert.equal(parts.wrap.style.marginBottom, t['border.width_02'] + 'px');
        assert.equal(parts.wrap.style.marginRight, (t['spacing.spacing_04'] - t['border.width_02']) + 'px');

        // Label
        assert.equal(parts.label.textContent, props.label);
        assert.equal(parts.label.style.fontSize, t['type.body_compact_01'].fontSize + 'px');
        assert.equal(parts.label.style.color, cssValue('color', t['color.' + (disabled ? 'selection_label_disabled' : 'selection_label')]));

        // Accessibility answer
        assert.equal(parts.root.getAttribute('aria-checked'), String(selected));
        assert.equal(parts.root.getAttribute('aria-disabled'), disabled ? 'true' : null);
        assert.equal(parts.root.getAttribute('aria-invalid'), invalid ? 'true' : null);
        assert.equal(parts.root.getAttribute('aria-labelledby'), parts.label.id);
        assert.equal(parts.root.getAttribute('tabindex'), disabled ? '-1' : '0');
      });
    }
  }

});


describe('RadioButton: state through the DOM', function () {

  test('press and Space check an uncontrolled radio and report true; a checked radio stays checked', async function () {
    const calls = [];
    const parts = await renderRadioButton(registryFor('carbon'), { label: 'L', onChange: function (next) { calls.push(next); } });
    await act(async function () {
      parts.root.click();
    });
    assert.equal(parts.root.getAttribute('aria-checked'), 'true');
    await act(async function () {
      parts.root.click();
    });
    assert.equal(parts.root.getAttribute('aria-checked'), 'true');
    assert.deepEqual(calls, [true]);
    const spare = await renderRadioButton(registryFor('carbon'), { label: 'S', onChange: function (next) { calls.push(next); } });
    await fire(spare.root, new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    assert.equal(spare.root.getAttribute('aria-checked'), 'true');
    assert.deepEqual(calls, [true, true]);
  });

  test('a controlled radio reports the press and keeps the caller\'s state', async function () {
    const calls = [];
    const parts = await renderRadioButton(registryFor('carbon'), { label: 'L', checked: false, onChange: function (next) { calls.push(next); } });
    await act(async function () {
      parts.root.click();
    });
    assert.equal(parts.root.getAttribute('aria-checked'), 'false');
    assert.deepEqual(calls, [true]);
  });

  test('disabled radio ignores press and Space', async function () {
    const calls = [];
    const parts = await renderRadioButton(registryFor('carbon'), { label: 'D', disabled: true, onChange: function (next) { calls.push(next); } });
    await act(async function () {
      parts.root.click();
    });
    await fire(parts.root, new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    assert.equal(parts.root.getAttribute('aria-checked'), 'false');
    assert.deepEqual(calls, []);
  });

  test('the state layer: the disc centered on the ring shows the theme\'s layer for the selection and the state', async function () {
    const t = buildNative('material').tokens;
    const parts = await renderRadioButton(registryFor('material'), { label: 'L' });
    const offset = (t['control.radio_size'] - t['control.selection_layer_size']) / 2;
    assert.equal(parts.layer.style.left, offset + 'px');
    assert.equal(parts.layer.style.top, offset + 'px');
    await fire(parts.root, new Event('mouseenter', { bubbles: false }));
    assert.equal(parts.layer.style.opacity, '1');
    assert.equal(parts.layer.style.backgroundColor, cssValue('backgroundColor', t['color.selection_layer_hover']));
    await fire(parts.root, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(parts.layer.style.backgroundColor, cssValue('backgroundColor', t['color.selection_layer_active']));
    const checked = await renderRadioButton(registryFor('material'), { label: 'L', checked: true });
    await fire(checked.root, new Event('mouseenter', { bubbles: false }));
    assert.equal(checked.layer.style.backgroundColor, cssValue('backgroundColor', t['color.selection_layer_selected_hover']));
  });

  test('hover and press read the ring cells for the state', async function () {
    const t = buildNative('material').tokens;
    const parts = await renderRadioButton(registryFor('material'), { label: 'L' });
    await fire(parts.root, new Event('mouseenter', { bubbles: false }));
    assert.equal(parts.ring.style.borderTopColor, cssValue('borderTopColor', t['color.selection_outline_hover']));
    await fire(parts.root, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(parts.ring.style.borderTopColor, cssValue('borderTopColor', t['color.selection_outline_active']));
    const checked = await renderRadioButton(registryFor('material'), { label: 'L', checked: true });
    await fire(checked.root, new Event('mouseenter', { bubbles: false }));
    assert.equal(checked.ring.style.borderTopColor, cssValue('borderTopColor', t['color.radio_outline_selected_hover']));
  });

  test('focus draws the ring on the ring itself at the radio offset; the row suppresses the browser\'s own ring', async function () {
    for (const template of ['carbon', 'material']) {
      const t = buildNative(template).tokens;
      const parts = await renderRadioButton(registryFor(template), { label: 'L' });
      assert.equal(parts.ring.style.outlineWidth, '');
      await act(async function () {
        parts.root.focus();
      });
      assert.equal(parts.ring.style.outlineWidth, t['control.selection_focus_width'] + 'px', template);
      assert.equal(parts.ring.style.outlineOffset, t['control.radio_focus_offset'] + 'px', template);
      assert.equal(parts.ring.style.outlineColor, cssValue('outlineColor', t['color.selection_focus_ring']), template);
      assert.equal(parts.root.style.outlineStyle, 'none');
    }
  });

  test('a pointer-driven focus shows the ring only where the theme shows it on any focus', async function () {
    const carbon = await renderRadioButton(registryFor('carbon'), { label: 'L' });
    await fire(carbon.root, new Event('pointerdown', { bubbles: true }));
    await act(async function () {
      carbon.root.focus();
    });
    assert.equal(carbon.ring.style.outlineWidth, '2px');
    const material = await renderRadioButton(registryFor('material'), { label: 'L' });
    await fire(material.root, new Event('pointerdown', { bubbles: true }));
    await act(async function () {
      material.root.focus();
    });
    assert.equal(material.ring.style.outlineWidth, '');
  });

  test('focusable: false keeps the radio out of the tab order for a roving group', async function () {
    const parts = await renderRadioButton(registryFor('carbon'), { label: 'L', focusable: false });
    assert.equal(parts.root.getAttribute('tabindex'), '-1');
  });

});
