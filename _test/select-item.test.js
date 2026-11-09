// Info: SelectItem composite member. Every sample state renders under all
// three templates with its row height, padding, fill, divider and label
// type read from the theme's list cells; hover, press, selection and
// disabled paint the state fills; a press inside a Select selects the
// option once; the accessibility answer is an option reporting selected
// and disabled.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/select/sample.select-item.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Render one SelectItem and return its row and label.

@param {String} template - Template name
@param {Object} props    - SelectItem props

@return {Promise<Object>} - { container, row, block, label }
*********************************************************************/
async function renderItem (template, props) {

  const Registry = buildSystem(template, factories);
  const container = await render(React.createElement(Registry.SelectItem, props));
  const row = container.querySelector('[role="option"]');
  return {
    container: container,
    row: row,
    block: row.firstElementChild,
    label: row.querySelector('[dir="auto"]')
  };

}


describe('SelectItem: every sample renders under all three templates', function () {

  for (const name of TEMPLATE_NAMES) {
    for (const sample of SAMPLE) {
      test(name + ' / ' + sample.label + ': exact row height, padding and label type from the theme', async function () {
        const t = buildNative(name).tokens;
        const parts = await renderItem(name, sample.props);
        assert.equal(parts.row.style.minHeight, t['control.list_item_height'] + 'px');
        assert.equal(parts.block.style.marginLeft, t['control.list_item_padding_inline'] + 'px');
        assert.equal(parts.block.style.marginRight, t['control.list_item_padding_inline'] + 'px');
        assert.equal(parts.label.style.fontSize, t['type.list_item'].fontSize + 'px');
        assert.equal(parts.label.style.fontFamily, t['font.family.sans']);
        if (sample.props.disabled === true) {
          assert.equal(parts.label.style.color, cssValue('color', t['color.list_item_label_disabled']));
        } else if (sample.props.selected === true) {
          assert.equal(parts.label.style.color, cssValue('color', t['color.list_item_label_selected']));
        } else {
          assert.equal(parts.label.style.color, cssValue('color', t['color.list_item_label']));
        }
      });
    }
  }

});

describe('SelectItem: the state paints the row fill', function () {

  for (const name of TEMPLATE_NAMES) {
    test(name + ': hovered, pressed, selected and selected-pressed fills', async function () {
      const t = buildNative(name).tokens;
      // The interaction state Select's own Pressable reports, forced the way
      // the option props the behavior mints reach the row
      const parts = await renderItem(name, { label: 'Option one', value: 'one' });
      assert.equal(parts.row.style.backgroundColor, '');
      const hovered = await renderItem(name, { label: 'Option one', value: 'one', optionProps: { testOnly_hovered: true } });
      assert.equal(hovered.row.style.backgroundColor, cssValue('backgroundColor', t['color.list_item_container_hover']));
      const selected = await renderItem(name, { label: 'Option one', value: 'one', selected: true });
      assert.equal(selected.row.style.backgroundColor, cssValue('backgroundColor', t['color.list_item_container_selected']));
      const selectedPressed = await renderItem(name, { label: 'Option one', value: 'one', selected: true, optionProps: { testOnly_pressed: true } });
      assert.equal(selectedPressed.row.style.backgroundColor, cssValue('backgroundColor', t['color.list_item_container_selected_active']));
      const pressed = await renderItem(name, { label: 'Option one', value: 'one', optionProps: { testOnly_pressed: true } });
      assert.equal(pressed.row.style.backgroundColor, cssValue('backgroundColor', t['color.list_item_container_active']));
    });

    test(name + ': the disabled row draws no fill and ignores a press', async function () {
      const parts = await renderItem(name, { label: 'Option one', value: 'one', disabled: true });
      assert.equal(parts.row.style.backgroundColor, '');
      const pressed = await renderItem(name, { label: 'Option one', value: 'one', disabled: true, optionProps: { testOnly_pressed: true } });
      assert.equal(pressed.row.style.backgroundColor, '');
      assert.equal(pressed.row.getAttribute('aria-disabled'), 'true');
    });
  }

});

describe('SelectItem: standalone accessibility', function () {

  test('the row announces role option and its selected and disabled state', async function () {
    const parts = await renderItem('carbon', { label: 'Option one', value: 'one', selected: true });
    assert.equal(parts.row.getAttribute('role'), 'option');
    assert.equal(parts.row.getAttribute('aria-selected'), 'true');
    const disabled = await renderItem('carbon', { label: 'Option one', value: 'one', disabled: true });
    assert.equal(disabled.row.getAttribute('aria-disabled'), 'true');
  });


  test('the first option draws a transparent top border', async function () {
    const t = buildNative('carbon').tokens;
    const Registry = buildSystem('carbon', factories);
    const container = await render(React.createElement(Registry.Select, {
      items: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }],
      label: 'Size'
    }));
    const root = container.firstElementChild;
    const trigger = root.querySelector('[role="combobox"]');
    await act(async function () {
      trigger.click();
    });
    const options = root.querySelectorAll('[role="option"]');
    assert.equal(options.length, 2);
    // The divider is the inner option block's top border: transparent on the
    // first row, the divider color on every later row
    assert.equal(options[0].firstElementChild.style.borderTopColor, cssValue('borderTopColor', 'rgba(0, 0, 0, 0)'));
    assert.equal(options[0].firstElementChild.style.borderTopWidth, t['control.list_item_divider_width'] + 'px');
    assert.equal(options[1].firstElementChild.style.borderTopColor, cssValue('borderTopColor', t['color.list_item_divider']));
  });

});

describe('SelectItem: inside Select a press selects the option once', function () {

  test('a press on an item calls onChange once with its value', async function () {
    const calls = [];
    const Registry = buildSystem('carbon', factories);
    const container = await render(React.createElement(Registry.Select, {
      items: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }],
      label: 'Size',
      onChange: function (value) { calls.push(value); }
    }));
    const root = container.firstElementChild;
    const trigger = root.querySelector('[role="combobox"]');
    await act(async function () {
      trigger.click();
    });
    const options = root.querySelectorAll('[role="option"]');
    assert.equal(options.length, 2);
    await act(async function () {
      options[1].click();
    });
    assert.deepEqual(calls, ['b']);
  });

});
