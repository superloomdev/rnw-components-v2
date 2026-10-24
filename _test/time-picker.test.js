// Info: TimePicker composite. Under all three templates it is one labelled
// group: the label above, a row holding the time field at the theme's fixed
// time width and the select members at the theme's select gap, and the
// message below the row. The field is a plain textbox with a `hh:mm` hint
// and a five-character bound; the members read size, disabled and the
// label's id from the parent context.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/text-input/sample.time-picker.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);
const PERIOD = Object.freeze([
  Object.freeze({ value: 'AM', label: 'AM' }),
  Object.freeze({ value: 'PM', label: 'PM' })
]);

afterEach(cleanup);


/********************************************************************
Build a registry for a template.

@param {String} template - Template name

@return {Object} - Registry
*********************************************************************/
function registryFor (template) {

  return buildSystem(template, factories, { built: buildNative(template) });

}


/********************************************************************
Render one TimePicker with a period member and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - TimePicker props

@return {Promise<Object>} - { root, label, row, input, selects, message }
*********************************************************************/
async function renderPicker (Registry, props) {

  const element = React.createElement(Registry.TimePicker, props,
    React.createElement(Registry.TimePickerSelect, { items: PERIOD }));
  const container = await render(element);
  const input = container.querySelector('input');
  const selects = Array.from(container.querySelectorAll('[role="combobox"]'));

  return {
    input: input,
    label: container.querySelector('[id]'),
    message: selects.length === 0 ? null : selects[0].closest('div'),
    root: container.firstElementChild,
    row: input ? input.parentElement.parentElement.parentElement : null,
    selects: selects
  };

}


describe('TimePicker: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': label, row and message at the theme metrics', async function () {
        const tokens = buildNative(template).tokens;
        const Registry = registryFor(template);
        const props = Object.assign({}, state.props);
        const selectsProp = props.selects;
        delete props.selects;
        const members = (selectsProp || []).map(function (member) {
          return React.createElement(Registry.TimePickerSelect, member);
        });
        const container = await render(React.createElement.apply(React, [Registry.TimePicker, props].concat(members)));
        const input = container.querySelector('input');
        const selects = Array.from(container.querySelectorAll('[role="combobox"]'));
        assert.ok(input, 'the time field');
        assert.equal(selects.length, members.length, 'every member mounts');
        // The row: field at the fixed time width, members at the select gap
        const row = input.parentElement.parentElement.parentElement;
        assert.equal(row.style.flexDirection, 'row');
        assert.equal(Number.parseFloat(row.style.gap), tokens['control.time_picker_select_gap']);
        const fieldWrap = input.parentElement.parentElement;
        const expected = state.props.invalid === true
          ? tokens['control.time_picker_input_width_invalid']
          : tokens['control.time_picker_input_width'];
        assert.equal(Number.parseFloat(fieldWrap.style.width), expected);
        // The label names the time textbox alone; every member keeps its own
        // name - a labelledby pointing at the field's label would override it
        if (typeof state.props.label === 'string') {
          const labelId = input.getAttribute('aria-labelledby');
          assert.ok(labelId, 'the input is labelled');
          for (const select of selects) {
            assert.equal(select.getAttribute('aria-labelledby'), null, 'the member keeps its own name, not the field label');
            assert.ok(select.getAttribute('aria-label'), 'the member is named');
          }
        }
      });
    }
  }

});

describe('TimePicker: the field contract', function () {

  test('the input carries the time hint and the editable bound', async function () {
    const parts = await renderPicker(registryFor('carbon'), { label: 'Time' });
    assert.equal(parts.input.getAttribute('placeholder'), 'hh:mm');
    assert.equal(parts.input.getAttribute('maxlength'), '5');
    assert.equal(parts.input.getAttribute('role'), null, 'an ordinary textbox, not a spinbutton');
  });

  test('a disabled parent disables every member', async function () {
    const parts = await renderPicker(registryFor('carbon'), { disabled: true, label: 'Time', value: '12:00' });
    assert.equal(parts.input.disabled, true);
    for (const select of parts.selects) {
      assert.equal(select.getAttribute('aria-disabled'), 'true');
    }
  });

  test('size flows from the parent to the member', async function () {
    const Registry = registryFor('carbon');
    const container = await render(React.createElement(Registry.TimePicker, { label: 'Time', size: 'lg', value: '12:00' },
      React.createElement(Registry.TimePickerSelect, { items: PERIOD })));
    const input = container.querySelector('input');
    const select = container.querySelector('[role="combobox"]');
    const tokens = buildNative('carbon').tokens;
    // Both members draw the large height
    assert.equal(Number.parseFloat(input.parentElement.style.minHeight) || Number.parseFloat(input.parentElement.style.height), tokens['size.size_large']);
    assert.equal(Number.parseFloat(select.parentElement.style.minHeight) || Number.parseFloat(select.parentElement.style.height), tokens['size.size_large'], 'member inherits the parent size');
  });

  test('an explicit member size wins over the parent, including md', async function () {
    const Registry = registryFor('carbon');
    const tokens = buildNative('carbon').tokens;
    const container = await render(React.createElement(Registry.TimePicker, { label: 'Time', size: 'lg', value: '12:00' },
      React.createElement(Registry.TimePickerSelect, { items: PERIOD, size: 'md' }),
      React.createElement(Registry.TimePickerSelect, { items: PERIOD })));
    const frames = Array.from(container.querySelectorAll('[role="combobox"]')).map(function (select) {
      return Number.parseFloat(select.parentElement.style.minHeight) || Number.parseFloat(select.parentElement.style.height);
    });
    assert.equal(frames[0], tokens['control.field_height'], 'explicit md wins over the parent lg');
    assert.equal(frames[1], tokens['size.size_large'], 'an unmarked member inherits lg');
  });

  test('the row wraps instead of overflowing, and compact geometry is never NaN', async function () {
    const Registry = registryFor('carbon');
    const parts = await renderPicker(Registry, { label: 'Time' });
    assert.equal(parts.row.style.flexWrap, 'wrap');
    assert.equal(parts.row.style.maxWidth, '100%');
    // A compact member's measured seat never emits a NaN style
    assert.equal(/NaN/.test(parts.root.innerHTML), false, 'no NaN style reached the DOM');
  });

  test('children after selects are preserved, and a disabled row disables a registry child', async function () {
    const Registry = registryFor('carbon');
    const container = await render(React.createElement(Registry.TimePicker, {
      disabled: true,
      label: 'Time',
      selects: [{ accessibilityLabel: 'Period', items: PERIOD }],
      value: '12:00'
    },
    // A registry child the row does not know about still inherits disabled -
    // its own `disabled: false` cannot re-enable it
    React.createElement(Registry.Link, { disabled: false, href: 'https://example.com' }, 'Zone help')));
    const input = container.querySelector('input');
    const row = input.parentElement.parentElement.parentElement;
    const comboboxes = Array.from(row.querySelectorAll('[role="combobox"]'));
    const link = container.querySelector('[role="link"]');
    assert.equal(comboboxes.length, 1, 'the selects data member mounted');
    assert.ok(link, 'the child after the selects mounted');
    assert.equal(link.getAttribute('aria-disabled'), 'true', 'the group disabled it');
    // The child sits after the select member in the row
    const topLevel = Array.from(row.children);
    const selectIndex = topLevel.findIndex(function (el) {
      return el.contains(comboboxes[0]);
    });
    const linkIndex = topLevel.findIndex(function (el) {
      return el.contains(link);
    });
    assert.ok(linkIndex > selectIndex, 'children render after the select members');
  });

  test('the message sits below the whole row', async function () {
    const parts = await renderPicker(registryFor('carbon'), { helperText: 'hh:mm format', label: 'Time', value: '12:00' });
    const messageText = Array.from(parts.root.querySelectorAll('div')).find(function (el) {
      return el.textContent === 'hh:mm format';
    });
    assert.ok(messageText, 'helper rendered');
    // The row comes before the message in the root's child order
    const children = Array.from(parts.root.children);
    const rowIndex = children.indexOf(parts.row);
    const messageIndex = children.findIndex(function (el) { return el.contains(messageText); });
    assert.ok(rowIndex > -1 && messageIndex > rowIndex, 'label, row, then message');
  });

});
