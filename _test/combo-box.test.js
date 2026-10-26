// Info: ComboBox composite. Every sample state renders under all three
// templates with the frame, members and list read from the theme's field,
// list and combo cells; typing filters and opens the list, arrows, Enter
// and Escape drive the hook; the clear action empties the selection and
// reports null; the accessibility answer is a labelled combobox input with
// the highlighted option as active descendant.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/select/sample.combo-box.js';
import { Lib, TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);
const ITEMS = SAMPLE[0].props.items;

afterEach(cleanup);


/********************************************************************
Dispatch one keydown on an element inside act.

@param {HTMLElement} element - Target
@param {String}      key     - Key name
*********************************************************************/
async function press (element, key) {

  await act(async function () {
    element.dispatchEvent(new KeyboardEvent('keydown', { key: key, bubbles: true, cancelable: true }));
  });

}


/********************************************************************
Type one string into an input inside act.

@param {HTMLElement} input - The input element
@param {String}      text  - The next value
*********************************************************************/
async function type (input, text) {

  await act(async function () {
    // The prototype setter moves React's value tracker, so the input event
    // below reads as a real edit instead of a no-op echo
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, text);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

}


/********************************************************************
Render one ComboBox and return its parts.

@param {String} template - Template name
@param {Object} props    - ComboBox props

@return {Promise<Object>} - { container, root, frame, input, list(), options(), members() }
*********************************************************************/
async function renderCombo (template, props, inputComponent) {

  const Registry = inputComponent === undefined ? buildSystem(template, factories)
    : buildSystem(template, factories, { lib: Object.assign({}, Lib, { ReactNative: Object.assign({}, Lib.ReactNative, { TextInput: inputComponent }) }) });
  const container = await render(React.createElement(Registry.ComboBox, props));
  const root = container.firstElementChild;
  const input = root.querySelector('input[role="combobox"]');
  const frame = input.parentElement;

  return {
    container: container,
    root: root,
    frame: frame,
    input: input,
    list: function () {
      return root.querySelector('[role="listbox"]');
    },
    options: function () {
      const list = root.querySelector('[role="listbox"]');
      return list === null ? [] : Array.from(list.querySelectorAll('[role="option"]'));
    },
    members: function () {
      return Array.from(frame.children).slice(1);
    }
  };

}


describe('ComboBox: every sample renders under all three templates', function () {

  for (const name of TEMPLATE_NAMES) {
    for (const sample of SAMPLE) {
      test(name + ' / ' + sample.label + ': exact member insets and paddings from the theme', async function () {
        const t = buildNative(name).tokens;
        const parts = await renderCombo(name, sample.props);
        const populated = sample.props.value !== undefined;
        const invalid = sample.props.invalid === true && sample.props.disabled !== true;
        const iconInset = t['spacing.spacing_04'];
        const iconZone = t['size.size_xsmall'];
        const iconGapEnd = t['spacing.spacing_02'];
        const height = t[sample.props.size === 'sm' ? 'size.size_small' : sample.props.size === 'lg' ? 'size.size_large' : 'control.field_height'];

        // The input's end padding reserves the members' room: the combo
        // cells while populated, the caret zone otherwise
        const expectedPadding = populated
          ? (invalid ? t['control.combo_box_input_padding_end_invalid'] : t['control.combo_box_input_padding_end'])
          : iconInset + iconZone;
        assert.equal(parts.input.style.paddingRight, expectedPadding + 'px');
        assert.equal(parts.input.style.paddingLeft, t['control.field_padding_inline'] + 'px');

        // The caret keeps the family's square zone at the frame's end
        const members = parts.members();
        const caret = members[members.length - 1];
        assert.equal(caret.style.right, iconInset + 'px');
        assert.equal(caret.style.width, iconZone + 'px');
        assert.equal(caret.style.top, (height - iconZone) / 2 + 'px');

        // The clear button shows only while populated, a square at its inset
        const clearIndex = populated ? (invalid ? 1 : 0) : -1;
        if (clearIndex >= 0) {
          const clear = members[clearIndex];
          assert.equal(clear.style.right, t['control.combo_box_clear_inset_end'] + 'px');
          assert.equal(clear.style.width, t['control.combo_box_clear_size'] + 'px');
          assert.equal(clear.style.top, (height - t['control.combo_box_clear_size']) / 2 + 'px');
        }

        // The invalid icon sits at its populated inset, ahead of the caret otherwise
        if (invalid) {
          const icon = members[0];
          const expectedEnd = populated ? t['control.combo_box_invalid_icon_inset_end'] : iconInset + iconZone + iconGapEnd;
          assert.equal(icon.style.right, expectedEnd + 'px');
          assert.equal(icon.style.width, t['control.field_icon_size'] + 'px');
        }
      });
    }
  }

});

describe('ComboBox: the clear action', function () {

  test('the clear empties the selection and the input and calls onChange(null)', async function () {
    const calls = [];
    const parts = await renderCombo('carbon', { label: 'Fruit', items: ITEMS, defaultValue: 'banana', onChange: function (v) { calls.push(v); } });
    // The clear carries its accessible name; the caret's seat is a button too
    const clear = parts.frame.querySelector('[aria-label="Clear selection"]');
    assert.notEqual(clear, null);
    await act(async function () {
      clear.click();
    });
    assert.deepEqual(calls, [null]);
    assert.equal(parts.input.value, '');
    // The clear seat leaves the tree once nothing is populated
    assert.equal(parts.frame.querySelector('[aria-label="Clear selection"]'), null);
  });

});

describe('ComboBox: disabled and controlled', function () {

  test('disabled blocks input and opening', async function () {
    const calls = [];
    const parts = await renderCombo('carbon', { label: 'Fruit', items: ITEMS, disabled: true, onInputChange: function (v) { calls.push(v); } });
    assert.equal(parts.input.disabled, true);
    await type(parts.input, 'a');
    assert.equal(parts.list(), null);
    assert.deepEqual(calls, []);
    const caretPress = parts.frame.querySelector('[role="button"]');
    assert.equal(caretPress !== null, true);
  });

  test('a controlled value and inputValue stay until rerender', async function () {
    const parts = await renderCombo('carbon', { label: 'Fruit', items: ITEMS, value: 'banana', inputValue: 'ap', onChange: function () {}, onInputChange: function () {} });
    assert.equal(parts.input.value, 'ap');
    await press(parts.input, 'ArrowDown');
    await press(parts.input, 'Enter');
    assert.equal(parts.input.value, 'ap');
  });

});


describe('ComboBox: typing filters and opens the list', function () {

  test('a query opens the list and keeps the options whose labels include it, case-insensitive', async function () {
    const parts = await renderCombo('carbon', { label: 'Fruit', items: ITEMS });
    assert.equal(parts.list(), null);
    await type(parts.input, 'AN');
    assert.notEqual(parts.list(), null);
    // Disabled options stay listed and match the filter like any other
    assert.deepEqual(parts.options().map(function (o) { return o.textContent; }), ['Banana', 'Durian']);
    await type(parts.input, 'ap');
    assert.deepEqual(parts.options().map(function (o) { return o.textContent; }), ['Apple']);
    await press(parts.input, 'Escape');
    assert.equal(parts.list(), null);
  });

  test('arrows highlight, Enter selects and reports, Escape closes', async function () {
    const calls = [];
    const parts = await renderCombo('carbon', { label: 'Fruit', items: ITEMS, onChange: function (v) { calls.push(v); } });
    await type(parts.input, 'a');
    const options = parts.options();
    // Opening auto-highlights the first enabled option; the descendant follows
    assert.equal(parts.input.getAttribute('aria-activedescendant'), options[0].id);
    await press(parts.input, 'ArrowDown');
    assert.equal(parts.input.getAttribute('aria-activedescendant'), options[1].id);
    await press(parts.input, 'Enter');
    assert.deepEqual(calls, ['banana']);
    assert.equal(parts.list(), null);
    assert.equal(parts.input.value, 'Banana');
    await type(parts.input, '');
    await press(parts.input, 'Escape');
  });

  test('the open list draws no selected fill on the chosen option', async function () {
    const parts = await renderCombo('carbon', { label: 'Fruit', items: ITEMS, value: 'banana' });
    await press(parts.input, 'ArrowDown');
    const chosen = parts.options()[1];
    assert.equal(chosen.getAttribute('aria-selected'), 'true');
    const label = Array.from(chosen.querySelectorAll('div')).find(function (el) {
      return el.children.length === 0 && el.textContent === 'Banana';
    });
    const rest = buildNative('carbon').tokens['color.list_item_label'];
    assert.equal(label.style.color, cssValue('color', rest));
    await press(parts.input, 'Escape');
  });

  test('a press puts the invalid icon at its unpopulated seat', async function () {
    const inputProps = [];
    const WrappedInput = React.forwardRef(function (props, ref) {
      inputProps.push(props);
      return React.createElement(Lib.ReactNative.TextInput, Object.assign({}, props, { ref: ref }));
    });
    const parts = await renderCombo('carbon', { label: 'Fruit', items: ITEMS, value: 'banana', invalid: true, invalidText: 'Required' }, WrappedInput);
    const iconSeat = function () {
      const icons = Array.from(parts.root.querySelectorAll('div')).filter(function (d) { return d.querySelector('svg'); });
      return icons.map(function (d) { return parseFloat(d.style.right || NaN); });
    };
    const before = iconSeat();
    await act(async function () {
      inputProps[0].onMouseDown();
    });
    assert.notDeepEqual(iconSeat(), before);
    await act(async function () {
      inputProps[0].onMouseUp();
    });
    assert.deepEqual(iconSeat(), before);
    // The native press handlers track the same flag
    await act(async function () {
      inputProps[0].onPressIn();
    });
    assert.notDeepEqual(iconSeat(), before);
    await act(async function () {
      inputProps[0].onPressOut();
    });
    assert.deepEqual(iconSeat(), before);
  });

  test('a focused invalid field carries the focus ring', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderCombo('carbon', { label: 'Fruit', items: ITEMS, invalid: true, invalidText: 'Required' });
    await act(async function () {
      parts.input.dispatchEvent(new Event('focusin', { bubbles: true }));
    });
    assert.equal(parts.input.style.outlineColor, cssValue('outlineColor', t['color.field_focus_ring']));
    assert.notEqual(parts.input.style.outlineColor, cssValue('outlineColor', t['color.field_ring_invalid']));
  });

});
