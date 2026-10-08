// Info: TextInput molecule. Every sample state renders under all three
// templates with its frame, label, input and message read from the theme's
// field role cells; typing, focus and hover drive the state through the DOM; both
// field modes and both label placements draw as their names say; the
// accessibility answer is a labelled textbox, invalid or disabled exactly
// when it says so.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/text-input/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);
// The default size is the control role; the other sizes follow the shared size scale
const HEIGHTS = { sm: 'size.size_small', md: 'control.field_height', lg: 'size.size_large' };

afterEach(cleanup);


/********************************************************************
Build a registry for a template, optionally with token overrides.

@param {String} template  - Template name
@param {Object} overrides - Token name -> value
@param {Object} config    - Library config

@return {Object} - Registry
*********************************************************************/
function registryFor (template, overrides, config) {

  const built = buildNative(template);
  const tokens = Object.assign({}, built.tokens, overrides || {});

  return buildSystem(template, factories, { built: Object.assign({}, built, { tokens: tokens }), config: config });

}


/********************************************************************
Render one TextInput and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - TextInput props

@return {Promise<Object>} - { root, label, frame, input, message }
*********************************************************************/
async function renderField (Registry, props) {

  const container = await render(React.createElement(Registry.TextInput, props));
  const root = container.firstElementChild;
  const input = root.querySelector('input');
  const frame = input.parentElement;
  const children = Array.from(root.children);

  return {
    root: root,
    label: children[0] === frame ? null : children[0],
    frame: frame,
    input: input,
    message: children[children.length - 1] === frame ? null : children[children.length - 1]
  };

}


/********************************************************************
Type a value into an input the way a user does.

@param {HTMLInputElement} input - The input
@param {String}           text  - Next value
*********************************************************************/
async function type (input, text) {

  await act(async function () {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, text);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

}


describe('TextInput: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': frame, label, input and message come from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const disabled = props.disabled === true;
        const invalid = props.invalid === true && !disabled;
        const parts = await renderField(registryFor(template), props);

        // Frame geometry and the mode's border, from the field cells for the state
        const outline = t['feedback.field'] === 'outline';
        const phase = disabled ? '_disabled' : invalid ? '_invalid' : '';
        const width = t['control.field_outline_width'];
        const ring = t['control.field_invalid_ring_width'];
        assert.equal(parts.frame.style.outlineWidth, invalid && ring > 0 ? ring + 'px' : '');
        assert.equal(parts.frame.style.height, t[HEIGHTS[props.size || 'md']] + 'px');
        // An outline frame keeps its borders inside the inline padding
        assert.equal(parts.frame.style.paddingLeft, (t['control.field_padding_inline'] - (outline ? width : 0)) + 'px');
        assert.equal(parts.frame.style.paddingRight, ((invalid ? t['control.field_icon_inset'] : t['control.field_padding_inline']) - (outline ? width : 0)) + 'px');
        assert.equal(parts.frame.style.borderTopLeftRadius, t['control.field_radius'] + 'px');
        assert.equal(parts.frame.style.borderBottomWidth, width + 'px');
        assert.equal(parts.frame.style.borderBottomColor, cssValue('borderBottomColor', t['color.field_outline' + phase]));
        assert.equal(parts.frame.style.backgroundColor, cssValue('backgroundColor', t['color.field_container' + (disabled ? '_disabled' : '')]));
        assert.equal(parts.frame.style.borderTopWidth, outline ? width + 'px' : '');

        // Input text and value
        assert.equal(parts.input.style.fontSize, t['type.field_value'].fontSize + 'px');
        assert.equal(parts.input.style.color, cssValue('color', t['color.field_value' + (disabled ? '_disabled' : '')]));
        assert.equal(parts.input.value, props.value || '');

        // Placeholder: shown unless a floating label is resting over the field
        const resting = t['anatomy.label'] === 'floating' && Boolean(props.label) && typeof props.value !== 'string';
        assert.equal(parts.input.getAttribute('placeholder'), props.placeholder && !resting ? props.placeholder : null);

        // Label: placement by the theme's enum
        if (props.label) {
          const raised = t['anatomy.label'] === 'floating' && typeof props.value === 'string';
          const set = raised ? t['type.field_label_raised'] : t['type.field_label'];
          assert.equal(parts.label.textContent, props.label);
          assert.equal(parts.label.style.fontSize, set.fontSize + 'px');
          assert.equal(parts.label.style.color, cssValue('color', t['color.field_label' + phase]));
          assert.equal(parts.label.style.position, t['anatomy.label'] === 'floating' ? 'absolute' : '');
          assert.equal(parts.input.getAttribute('aria-labelledby'), parts.label.id);
        } else {
          assert.equal(parts.label, null);
          assert.equal(parts.input.getAttribute('aria-label'), props.accessibilityLabel);
        }

        // Error icon and message
        const svg = parts.frame.querySelector('svg');
        if (invalid) {
          assert.equal(svg.getAttribute('fill'), t['color.field_invalid_icon']);
          assert.equal(svg.querySelector('path').getAttribute('d'), (t['icon.invalid'].sizes && t['icon.invalid'].sizes[String(t['control.field_icon_size'])] || t['icon.invalid']).paths[0].d);
          assert.equal(svg.getAttribute('width'), String(t['control.field_icon_size']));
        } else {
          assert.equal(svg, null);
        }
        const message = invalid ? [props.invalidText, 'field_message_invalid'] : props.helperText ? [props.helperText, 'field_helper' + (disabled ? '_disabled' : '')] : null;
        if (message === null) {
          assert.equal(parts.message, null);
        } else {
          assert.equal(parts.message.textContent, message[0]);
          assert.equal(parts.message.style.color, cssValue('color', t['color.' + message[1]]));
          assert.equal(parts.message.style.fontSize, t['type.field_helper'].fontSize + 'px');
          assert.equal(parts.message.style.marginTop, t['control.field_message_gap'] + 'px');
          assert.equal(parts.message.style.marginLeft, t['control.field_message_inset'] + 'px');
        }

        // Accessibility answer
        assert.equal(parts.input.getAttribute('aria-invalid'), invalid ? 'true' : null);
        assert.equal(parts.input.getAttribute('aria-disabled'), disabled ? 'true' : null);
        assert.equal(parts.input.readOnly, disabled);
      });
    }
  }

});


describe('TextInput: state through the DOM', function () {

  test('typing updates an uncontrolled field and reports each value', async function () {
    const calls = [];
    const parts = await renderField(registryFor('carbon'), { label: 'L', onChangeText: function (next) { calls.push(next); } });
    await type(parts.input, 'abc');
    assert.equal(parts.input.value, 'abc');
    assert.deepEqual(calls, ['abc']);
  });

  test('hover reads the text input\'s own container cell and the hover outline; focus draws the field ring and the focus outline', async function () {
    for (const template of ['carbon', 'material']) {
      const t = buildNative(template).tokens;
      const parts = await renderField(registryFor(template), { label: 'L' });
      await act(async function () {
        parts.root.dispatchEvent(new Event('pointerover', { bubbles: true }));
      });
      assert.equal(parts.frame.style.backgroundColor, cssValue('backgroundColor', t['color.text_input_container_hover']), template);
      assert.equal(parts.frame.style.borderBottomColor, cssValue('borderBottomColor', t['color.field_outline_hover']), template);
      assert.equal(parts.label.style.color, cssValue('color', t['color.field_label_hover']), template);
      await act(async function () {
        parts.input.focus();
      });
      assert.equal(parts.frame.style.outlineWidth, t['control.field_focus_width'] > 0 ? t['control.field_focus_width'] + 'px' : '', template);
      assert.equal(parts.frame.style.borderBottomColor, cssValue('borderBottomColor', t['color.field_outline_focus']), template);
      assert.equal(parts.frame.style.borderBottomWidth, t['control.field_outline_width_focus'] + 'px', template);
      assert.equal(parts.label.style.color, cssValue('color', t['color.field_label_focus']), template);
    }
  });

  test('floating: the label rests in the frame, rises over the surface on focus, and stays raised once populated', async function () {
    const t = buildNative('material').tokens;
    const Registry = registryFor('material', { 'anatomy.label': 'floating', 'feedback.field': 'outline' });
    const parts = await renderField(Registry, { label: 'Name', placeholder: 'Jane', surface: 'layer_01' });
    const height = t['control.field_height'];
    const body = t['type.field_label'];
    const small = t['type.field_label_raised'];
    assert.equal(parts.root.style.paddingTop, (small.lineHeight / 2) + 'px');
    assert.equal(parts.label.style.top, (small.lineHeight / 2 + (height - body.lineHeight) / 2) + 'px');
    assert.equal(parts.label.style.backgroundColor, '');
    assert.equal(parts.input.getAttribute('placeholder'), null);
    await act(async function () {
      parts.input.focus();
    });
    assert.equal(parts.label.style.top, '0px');
    assert.equal(parts.label.style.fontSize, small.fontSize + 'px');
    assert.equal(parts.label.style.backgroundColor, cssValue('backgroundColor', t['color.layer_01']));
    assert.equal(parts.input.getAttribute('placeholder'), 'Jane');
    await type(parts.input, 'x');
    await act(async function () {
      parts.input.blur();
    });
    assert.equal(parts.label.style.top, '0px');
  });

  test('the occluding surface falls back to the FIELD_SURFACE config, then to background', async function () {
    const t = buildNative('material').tokens;
    const overrides = { 'anatomy.label': 'floating' };
    const configured = await renderField(registryFor('material', overrides, { FIELD_SURFACE: 'layer_02' }), { label: 'L', value: 'v' });
    assert.equal(configured.label.style.backgroundColor, cssValue('backgroundColor', t['color.layer_02']));
    const plain = await renderField(registryFor('material', overrides), { label: 'L', value: 'v' });
    assert.equal(plain.label.style.backgroundColor, cssValue('backgroundColor', t['color.background']));
  });

  test('the input grows from its own width, never from a zero basis that collapses it in a content-sized container', async function () {
    const parts = await renderField(registryFor('carbon'), { label: 'L', placeholder: 'P' });
    assert.equal(parts.input.style.flexBasis, 'auto');
    assert.equal(parts.input.style.flexGrow, '1');
    assert.equal(parts.input.style.flexShrink, '1');
  });

  test('the label is the first child of the field root under both placements', async function () {
    for (const placement of ['above', 'floating']) {
      const parts = await renderField(registryFor('default', { 'anatomy.label': placement }), { label: 'L' });
      assert.equal(parts.root.firstElementChild, parts.label, placement);
      assert.equal(parts.root.children[1], parts.frame, placement);
    }
  });

});
