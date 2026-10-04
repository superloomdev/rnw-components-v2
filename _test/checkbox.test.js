// Info: Checkbox molecule. Every sample state renders under all three
// templates with its box, mark, label and message read from the built
// theme; press, Space and focus drive the state through the DOM; the
// accessibility answer is a labelled checkbox that is checked, mixed,
// disabled or invalid exactly when it says so.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/checkbox/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);
const TRANSPARENT = 'rgba(0, 0, 0, 0)';

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
Render one Checkbox and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Checkbox props

@return {Promise<Object>} - { root, layer, box, label, message, messageIcon }
*********************************************************************/
async function renderCheckbox (Registry, props) {

  const container = await render(React.createElement(Registry.Checkbox, props));
  const root = container.querySelector('[role="checkbox"]');
  const boxWrap = root.children[0];

  return {
    root: root,
    layer: boxWrap.children[0],
    box: boxWrap.children[1],
    label: root.children[1],
    message: container.firstElementChild.children[1] ? container.firstElementChild.children[1].lastElementChild : null,
    messageIcon: container.firstElementChild.children[1] ? container.firstElementChild.children[1].querySelector('svg') : null
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


describe('Checkbox: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': box, mark, label and message come from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const disabled = props.disabled === true;
        const invalid = props.invalid === true && !disabled;
        const marked = props.checked === true || props.indeterminate === true;
        const fill = disabled ? 'icon_disabled' : 'control_checked';
        const edge = invalid ? 'support_error' : marked ? fill : disabled ? 'icon_disabled' : 'icon_primary';
        const parts = await renderCheckbox(registryFor(template), props);

        // Box geometry and colors
        assert.equal(parts.box.style.width, t['control.checkbox_size'] + 'px');
        assert.equal(parts.box.style.height, t['control.checkbox_size'] + 'px');
        assert.equal(parts.box.style.borderTopWidth, (marked && !invalid ? 0 : t['control.checkbox_border']) + 'px');
        assert.equal(parts.box.style.borderTopLeftRadius, t['shape.radius_02'] + 'px');
        assert.equal(parts.box.style.borderTopColor, cssValue('borderTopColor', t['color.' + edge]));
        assert.equal(parts.box.style.backgroundColor, marked ? cssValue('backgroundColor', t['color.' + fill]) : TRANSPARENT);

        // Mark: the theme's own glyph at the mark size, or none
        const svg = parts.box.querySelector('svg');
        if (marked) {
          const size = t['control.checkbox_size'] - 2 * t['control.checkbox_border'];
          const literal = t['icon.' + (props.indeterminate ? 'subtract' : 'checkmark')];
          const glyph = literal.sizes && literal.sizes[String(size)] ? literal.sizes[String(size)] : literal;
          assert.equal(svg.getAttribute('width'), String(size));
          assert.equal(svg.getAttribute('fill'), t['color.icon_inverse']);
          assert.equal(svg.querySelector('path').getAttribute('d'), glyph.paths[0].d);
        } else {
          assert.equal(svg, null);
        }

        // Label and message
        assert.equal(parts.label.textContent, props.label);
        assert.equal(parts.label.style.fontSize, t['type.body_compact_01'].fontSize + 'px');
        assert.equal(parts.label.style.color, cssValue('color', t['color.' + (disabled ? 'text_disabled' : 'text_primary')]));
        assert.equal(parts.label.style.marginLeft, (t['spacing.spacing_04'] + t['spacing.spacing_01']) + 'px');
        assert.equal(parts.root.style.minHeight, (t['spacing.spacing_05'] + t['spacing.spacing_02']) + 'px');
        const message = invalid ? [props.invalidText, 'text_error'] : props.helperText ? [props.helperText, 'text_helper'] : null;
        if (message === null) {
          assert.equal(parts.message, null);
        } else {
          assert.equal(parts.message.textContent, message[0]);
          assert.equal(parts.message.style.color, cssValue('color', t['color.' + message[1]]));
          assert.equal(parts.message.style.fontSize, t['type.helper_text_01'].fontSize + 'px');
          if (invalid) {
            assert.equal(parts.messageIcon.getAttribute('fill'), t['color.support_error']);
            assert.equal(parts.messageIcon.parentElement.style.marginLeft, (t['spacing.spacing_01'] + t['border.width_01']) + 'px');
            assert.equal(parts.message.style.marginLeft, t['spacing.spacing_03'] + 'px');
          } else {
            assert.equal(parts.messageIcon, null);
          }
        }

        // Accessibility answer
        assert.equal(parts.root.getAttribute('aria-checked'), props.indeterminate ? 'mixed' : String(props.checked === true));
        assert.equal(parts.root.getAttribute('aria-disabled'), disabled ? 'true' : null);
        assert.equal(parts.root.getAttribute('aria-invalid'), invalid ? 'true' : null);
        assert.equal(parts.root.getAttribute('aria-labelledby'), parts.label.id);
      });
    }
  }

});


describe('Checkbox: state through the DOM', function () {

  test('press and Space toggle an uncontrolled checkbox and report the next value; disabled does not', async function () {
    const calls = [];
    const parts = await renderCheckbox(registryFor('carbon'), { label: 'L', onChange: function (next) { calls.push(next); } });
    await act(async function () {
      parts.root.click();
    });
    assert.equal(parts.root.getAttribute('aria-checked'), 'true');
    await fire(parts.root, new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    assert.equal(parts.root.getAttribute('aria-checked'), 'false');
    assert.deepEqual(calls, [true, false]);
    const disabled = await renderCheckbox(registryFor('carbon'), { label: 'D', disabled: true, onChange: function (next) { calls.push(next); } });
    await act(async function () {
      disabled.root.click();
    });
    await fire(disabled.root, new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    assert.equal(disabled.root.getAttribute('aria-checked'), 'false');
    assert.deepEqual(calls, [true, false]);
  });

  test('ripple: the disc centered on the box rises to the hover and pressed opacities', async function () {
    const t = buildNative('material').tokens;
    const parts = await renderCheckbox(registryFor('material', { 'feedback.press': 'ripple' }), { label: 'L' });
    const offset = (t['control.checkbox_size'] - t['size.size_medium']) / 2;
    assert.equal(parts.layer.style.width, t['size.size_medium'] + 'px');
    assert.equal(parts.layer.style.left, offset + 'px');
    assert.equal(parts.layer.style.top, offset + 'px');
    assert.equal(parts.layer.style.backgroundColor, cssValue('backgroundColor', t['color.icon_primary']));
    assert.equal(parts.layer.style.opacity, '0');
    await fire(parts.root, new Event('pointerover', { bubbles: true }));
    assert.equal(parts.layer.style.opacity, String(t['state.hover_opacity']));
    await fire(parts.root, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(parts.layer.style.opacity, String(t['state.pressed_opacity']));
  });

  test('highlight: the disc is not drawn and nothing fills on press', async function () {
    const parts = await renderCheckbox(registryFor('carbon', { 'feedback.press': 'highlight' }), { label: 'L' });
    await fire(parts.root, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    assert.equal(parts.layer.style.display, 'none');
    assert.equal(parts.root.style.backgroundColor, TRANSPARENT);
  });

  test('focus draws the theme\'s focus presentation on the box, and the row suppresses the browser\'s own ring', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderCheckbox(registryFor('carbon'), { label: 'L' });
    await act(async function () {
      parts.root.focus();
    });
    assert.equal(parts.box.style.outlineWidth, t['focus.width'] + 'px');
    assert.equal(parts.root.style.outlineWidth, '');
    assert.equal(parts.root.style.outlineStyle, 'none');
  });

});
