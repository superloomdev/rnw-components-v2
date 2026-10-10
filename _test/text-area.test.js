// Info: TextArea molecule. Every sample state renders under all three
// templates with its frame, label row, input, counter and message read from
// the theme's field and text_area role cells; typing, focus and hover drive
// the state through the DOM; the counter sits where anatomy.field_counter
// says while the element tree stays the same; the accessibility answer is a
// labelled textbox, invalid or disabled exactly when it says so.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/text-input/sample.text-area.js';
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
Render one TextArea and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - TextArea props

@return {Promise<Object>} - { root, labelRow, label, frame, input, icon, footerRow, message }
*********************************************************************/
async function renderField (Registry, props) {

  const container = await render(React.createElement(Registry.TextArea, props));
  const root = container.firstElementChild;
  const input = root.querySelector('textarea');
  const frame = input.parentElement;
  const labelRow = root.children[0];
  const footerRow = root.children[2] || null;

  return {
    root: root,
    labelRow: labelRow,
    label: typeof props.label === 'string' ? labelRow.children[0] : null,
    counterLabel: labelRow.children[labelRow.children.length - 1] || null,
    frame: frame,
    input: input,
    icon: frame.children[1] || null,
    footerRow: footerRow,
    message: footerRow === null ? null : footerRow.children[0] || null,
    counterMessage: footerRow === null ? null : footerRow.children[footerRow.children.length - 1]
  };

}


/********************************************************************
Type a value into a textarea the way a user does.

@param {HTMLElement} input - The textarea
@param {String}      text  - Next value
*********************************************************************/
async function type (input, text) {

  await act(async function () {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(input, text);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

}


describe('TextArea: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': frame, label row, input, counter and message come from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const disabled = props.disabled === true;
        const invalid = props.invalid === true && !disabled;
        const parts = await renderField(registryFor(template), props);
        const paddingBlock = (t['control.field_height'] - t['type.field_value'].lineHeight) / 2;
        // An edge drawn on every side costs no room in the content box
        const edgeBlock = t['feedback.field'] === 'outline' ? t['control.field_outline_width'] : 0;

        // The frame: the theme's field frame, grown to `rows` lines with one
        // field height as its minimum
        assert.equal(parts.frame.style.minHeight, t['control.field_height'] + 'px');
        assert.equal(parts.frame.style.height, '');
        assert.equal(parts.frame.style.paddingTop, (paddingBlock - edgeBlock) + 'px');
        assert.equal(parts.frame.style.paddingBottom, (paddingBlock - edgeBlock) + 'px');
        assert.equal(parts.input.tagName, 'TEXTAREA');
        assert.equal(parts.input.getAttribute('rows'), '4');
        assert.equal(parts.input.style.fontSize, t['type.text_area_value'].fontSize + 'px');
        assert.equal(parts.input.style.lineHeight, t['type.text_area_value'].lineHeight + 'px');
        assert.equal(parts.input.style.color, cssValue('color', t['color.' + (disabled ? 'field_value_disabled' : 'field_value')]));

        // The label row: the label, and the counter only when maxCount is given
        assert.equal(parts.labelRow.style.justifyContent, 'space-between');
        assert.equal(parts.label === null || parts.label.textContent === props.label, true);
        const counts = typeof props.maxCount === 'number';
        const atLabel = t['anatomy.field_counter'] === 'label';
        // Both seats always mount; the theme's placement draws and only a
        // counting field carries text
        assert.equal(parts.counterLabel.style.display, counts && atLabel ? 'flex' : 'none');
        assert.equal(parts.counterLabel.textContent, counts ? (props.value || '').length + '/' + props.maxCount : '');
        if (counts) {
          assert.equal(parts.counterMessage.style.display, atLabel ? 'none' : 'flex');
          assert.equal(parts.input.getAttribute('maxlength'), String(props.maxCount));
        }

        // The message row below, only when it holds something
        const message = invalid && typeof props.invalidText === 'string' ? props.invalidText
          : typeof props.helperText === 'string' ? props.helperText : null;
        assert.equal(parts.footerRow === null, message === null && !counts);
        if (message !== null) {
          assert.equal(parts.message.textContent, message);
          assert.equal(parts.message.style.color, cssValue('color', t['color.' + (disabled ? 'field_helper_disabled' : invalid ? 'field_message_invalid' : 'field_helper')]));
        }

        // The error icon at the frame's top end while invalid
        assert.equal(parts.icon === null, !invalid);
        if (invalid) {
          assert.equal(parts.icon.style.position, 'absolute');
          assert.equal(parts.icon.style.top, t['spacing.spacing_04'] + 'px');
        }

        // Accessibility answer
        assert.equal(parts.input.getAttribute('aria-invalid'), invalid ? 'true' : null);
        assert.equal(parts.input.getAttribute('aria-disabled'), disabled ? 'true' : null);
        assert.equal(parts.input.getAttribute('aria-labelledby'), typeof props.label === 'string' ? parts.label.id : null);
        assert.equal(parts.input.getAttribute('aria-label'), props.accessibilityLabel || null);
      });
    }
  }

});


describe('TextArea: state through the DOM', function () {

  test('typing drives an uncontrolled field, reports the next text and moves the counter', async function () {
    const calls = [];
    const parts = await renderField(registryFor('carbon'), { label: 'L', maxCount: 10, onChangeText: function (next) { calls.push(next); } });
    await type(parts.input, 'abc');
    assert.equal(parts.input.value, 'abc');
    assert.equal(parts.counterLabel.textContent, '3/10');
    assert.deepEqual(calls, ['abc']);
  });

  test('a controlled field reports the change and keeps the caller\'s value', async function () {
    const calls = [];
    const parts = await renderField(registryFor('carbon'), { label: 'L', value: 'kept', onChangeText: function (next) { calls.push(next); } });
    await type(parts.input, 'changed');
    assert.equal(parts.input.value, 'kept');
    assert.deepEqual(calls, ['changed']);
  });

  test('disabled field ignores typing and reads its member cells', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderField(registryFor('carbon'), { label: 'L', value: 'x', disabled: true });
    assert.equal(parts.input.getAttribute('aria-disabled'), 'true');
    assert.equal(parts.frame.style.borderBottomColor, cssValue('borderBottomColor', t['color.text_area_outline_disabled']));
    await type(parts.input, 'nope');
    assert.equal(parts.input.value, 'x');
  });

  test('hover reads the member container hover cell', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderField(registryFor('carbon'), { label: 'L' });
    await act(async function () {
      parts.root.dispatchEvent(new Event('mouseenter', { bubbles: false }));
    });
    assert.equal(parts.frame.style.backgroundColor, cssValue('backgroundColor', t['color.text_area_container_hover']));
  });

  test('focus draws the field ring from its cells', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderField(registryFor('carbon'), { label: 'L' });
    assert.equal(parts.frame.style.outlineWidth, '');
    await act(async function () {
      parts.input.focus();
    });
    assert.equal(parts.frame.style.outlineWidth, t['control.field_focus_width'] + 'px');
    assert.equal(parts.frame.style.outlineOffset, t['control.field_focus_offset'] + 'px');
  });

});
