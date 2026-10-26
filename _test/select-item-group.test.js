// Info: SelectItemGroup composite member. The header row reads its height,
// padding, type and color from the theme's list cells under all three
// templates; a disabled group disables every option it renders; inside a
// Select, group entries flatten for the behavior so arrows, selection and
// the sizer work on the flat list while the group keeps its structure;
// the accessibility answer is a group labelled by its header.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/select/sample.select-item-group.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

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
Render one Select and open its list.

@param {String} template - Template name
@param {Object} props    - Select props

@return {Promise<Object>} - { root, trigger, list, options, groups }
*********************************************************************/
async function renderOpenSelect (template, props) {

  const Registry = buildSystem(template, factories);
  const container = await render(React.createElement(Registry.Select, props));
  const root = container.firstElementChild;
  const trigger = root.querySelector('[role="combobox"]');
  await act(async function () {
    trigger.click();
  });
  return {
    container: container,
    root: root,
    trigger: trigger,
    list: root.querySelector('[role="listbox"]'),
    options: function () {
      return Array.from(root.querySelectorAll('[role="option"]'));
    },
    groups: function () {
      return Array.from(root.querySelectorAll('[role="group"]'));
    }
  };

}


const GROUPED_ITEMS = Object.freeze([
  Object.freeze({ label: 'Fruits', items: [
    Object.freeze({ value: 'apple', label: 'Apple' }),
    Object.freeze({ value: 'banana', label: 'Banana' })
  ] }),
  Object.freeze({ label: 'Vegetables', items: [
    Object.freeze({ value: 'carrot', label: 'Carrot' })
  ] }),
  Object.freeze({ value: 'bread', label: 'Bread' })
]);


describe('SelectItemGroup: every sample renders under all three templates', function () {

  for (const name of TEMPLATE_NAMES) {
    for (const sample of SAMPLE) {
      test(name + ' / ' + sample.label + ': the header reads the theme\'s list cells', async function () {
        const t = buildNative(name).tokens;
        const Registry = buildSystem(name, factories);
        const container = await render(React.createElement(Registry.SelectItemGroup, sample.props));
        const group = container.querySelector('[role="group"]');
        const header = group.firstElementChild;
        const text = group.querySelector('#' + group.getAttribute('aria-labelledby'));
        assert.equal(header.style.height, t['control.list_item_height'] + 'px');
        assert.equal(header.style.paddingLeft, t['control.list_item_padding_inline'] + 'px');
        assert.equal(header.style.paddingRight, t['control.list_item_padding_inline'] + 'px');
        assert.equal(text.textContent, sample.props.label);
        assert.equal(text.style.fontSize, t['type.select_group_label'].fontSize + 'px');
        assert.equal(text.style.fontFamily, t['font.family.sans']);
        const leaf = sample.props.disabled === true ? 'list_item_label_disabled' : 'select_group_label';
        assert.equal(text.style.color, cssValue('color', t['color.' + leaf]));
      });
    }
  }

});

describe('SelectItemGroup: accessibility', function () {

  test('the wrapper is a group labelled by its header, which is not an option and not focusable', async function () {
    const Registry = buildSystem('carbon', factories);
    const container = await render(React.createElement(Registry.SelectItemGroup, SAMPLE[0].props));
    const group = container.querySelector('[role="group"]');
    const header = group.firstElementChild;
    assert.equal(group.getAttribute('aria-labelledby') !== null, true);
    assert.equal(header.getAttribute('role'), null);
    assert.equal(header.getAttribute('tabindex'), null);
    assert.equal(group.querySelector('#' + group.getAttribute('aria-labelledby')) !== null, true);
    assert.equal(container.querySelector('[role="group"] [role="option"]') !== null, true);
  });

});

describe('SelectItemGroup: inside Select', function () {

  test('group entries render a labelled group with their options in flat order', async function () {
    const parts = await renderOpenSelect('carbon', { label: 'Meal', items: GROUPED_ITEMS });
    const groups = parts.groups();
    assert.equal(groups.length, 2);
    const options = parts.options();
    assert.deepEqual(options.map(function (o) { return o.textContent; }), ['Apple', 'Banana', 'Carrot', 'Bread']);
    // Each group holds its own options; the ungrouped row sits outside both
    assert.deepEqual(Array.from(groups[0].querySelectorAll('[role="option"]')).map(function (o) { return o.textContent; }), ['Apple', 'Banana']);
    assert.deepEqual(Array.from(groups[1].querySelectorAll('[role="option"]')).map(function (o) { return o.textContent; }), ['Carrot']);
  });

  test('the first option inside a group draws no divider, like the list\'s first option', async function () {
    const parts = await renderOpenSelect('carbon', { label: 'Meal', items: GROUPED_ITEMS });
    const options = parts.options();
    assert.equal(options[0].firstElementChild.style.borderTopColor, 'rgba(0, 0, 0, 0)');
    assert.equal(options[1].firstElementChild.style.borderTopColor !== 'rgba(0, 0, 0, 0)', true);
    assert.equal(options[2].firstElementChild.style.borderTopColor, 'rgba(0, 0, 0, 0)');
    assert.equal(options[3].firstElementChild.style.borderTopColor !== 'rgba(0, 0, 0, 0)', true);
  });

  test('a disabled group disables its options: no onChange on press and the arrows skip them', async function () {
    const calls = [];
    const items = [
      { value: 'top', label: 'Top' },
      { label: 'Blocked', disabled: true, items: [
        { value: 'x', label: 'X' },
        { value: 'y', label: 'Y' }
      ] },
      { value: 'tail', label: 'Tail' }
    ];
    const parts = await renderOpenSelect('carbon', { label: 'Meal', items: items, onChange: function (v) { calls.push(v); } });
    const options = parts.options();
    assert.equal(options[1].getAttribute('aria-disabled'), 'true');
    assert.equal(options[2].getAttribute('aria-disabled'), 'true');
    await act(async function () {
      options[1].click();
    });
    assert.deepEqual(calls, []);
    // Arrow order follows the flat list, skipping the disabled group's rows
    await press(parts.trigger, 'ArrowDown');
    assert.equal(options[0].style.outlineColor !== '', true);
    await press(parts.trigger, 'ArrowDown');
    assert.equal(options[3].style.outlineColor !== '', true);
    await press(parts.trigger, 'Escape');
  });

  test('the trigger shows a grouped option\'s label when selected', async function () {
    const Registry = buildSystem('carbon', factories);
    const container = await render(React.createElement(Registry.Select, { label: 'Meal', items: GROUPED_ITEMS, value: 'banana' }));
    const trigger = container.firstElementChild.querySelector('[role="combobox"]');
    // The value is the trigger's first text child; the hidden sizer holds every label
    assert.equal(trigger.children[0].children[0].textContent, 'Banana');
  });

  test('the sizer includes grouped option labels', async function () {
    const Registry = buildSystem('carbon', factories);
    const container = await render(React.createElement(Registry.Select, { label: 'Meal', placeholder: 'Pick', items: GROUPED_ITEMS }));
    const sizer = container.querySelector('[aria-hidden="true"]');
    assert.equal(sizer.textContent.includes('Apple'), true);
    assert.equal(sizer.textContent.includes('Carrot'), true);
    assert.equal(sizer.textContent.includes('Bread'), true);
  });

});
