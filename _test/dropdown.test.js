// Info: Dropdown composite. Every sample state renders under all three
// templates with its frame, label, trigger text, indicator and message read
// from the theme's field role cells; press, keyboard and option press drive
// the list through the DOM, whose container, items, divider and selected
// mark come from the theme's list role cells; the indicator turns while
// open; the accessibility answer is a labelled combobox controlling a
// listbox of options.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/select/sample.dropdown.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);
// The default size is the control role; the other sizes follow the shared size scale
const HEIGHTS = { sm: 'size.size_small', md: 'control.field_height', lg: 'size.size_large' };
const ITEMS = SAMPLE[0].props.items;

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
Render one Dropdown and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Dropdown props

@return {Promise<Object>} - { container, root, label, frame, trigger, value, caret, message, list(), mark() }
*********************************************************************/
async function renderDropdown (Registry, props) {

  const container = await render(React.createElement(Registry.Dropdown, props));
  const root = container.firstElementChild;
  const trigger = root.querySelector('[role="combobox"]');
  const frame = trigger.parentElement;
  const children = Array.from(root.children);

  return {
    root: root,
    label: children[0] === frame ? null : children[0],
    frame: frame,
    trigger: trigger,
    value: trigger.children[0].children[0],
    sizer: trigger.children[0].children[1],
    caret: trigger.children[trigger.children.length - 1],
    message: children[children.length - 1] === frame ? null : children[children.length - 1],
    list: function () {
      return root.querySelector('[role="listbox"]');
    },
    options: function () {
      const list = root.querySelector('[role="listbox"]');
      return list === null ? [] : Array.from(list.querySelectorAll('[role="option"]'));
    },
    mark: function (option) {
      return option.children[option.children.length - 1];
    }
  };

}


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


describe('Dropdown: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': frame, label, trigger, caret, list and message come from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const disabled = props.disabled === true;
        const invalid = props.invalid === true && !disabled;
        const open = props.open === true;
        const items = props.items;
        const selected = items.find(function (item) {
          return item.value === props.value;
        });
        const parts = await renderDropdown(registryFor(template), props);

        // Frame geometry and the mode's border, from the field cells for the
        // state; an open outline field draws its focus presentation, while an
        // open underline field draws no ring without a real focus. While the
        // open list carries the highlight the ring rests on the option instead
        const outline = t['feedback.field'] === 'outline';
        const selectedIndex = items.findIndex(function (entry) {
          return entry.value === props.value;
        });
        const highlightInList = open && selectedIndex >= 0;
        const focused = open && !disabled && outline;
        const phase = disabled ? '_disabled' : invalid ? '_invalid' : '';
        const width = t['control.field_outline_width' + (focused ? '_focus' : '')];
        const ring = t['control.field_invalid_ring_width'];
        const focusWidth = t['control.field_focus_width'];
        assert.equal(parts.frame.style.outlineWidth, focused && focusWidth > 0 && !highlightInList ? focusWidth + 'px' : invalid && ring > 0 ? ring + 'px' : '');
        assert.equal(parts.frame.style.height, t[HEIGHTS[props.size || 'md']] + 'px');
        assert.equal(parts.frame.style.paddingLeft, (t['control.field_padding_inline'] - (outline ? width : 0)) + 'px');
        assert.equal(parts.frame.style.paddingRight, (t['spacing.spacing_04'] - (outline ? width : 0)) + 'px');
        assert.equal(parts.frame.style.borderBottomWidth, width + 'px');
        const edge = disabled ? 'select_outline_disabled'
          : open && !outline ? 'border_subtle_00'
          : 'field_outline' + phase + (focused ? '_focus' : '');
        assert.equal(parts.frame.style.borderBottomColor, cssValue('borderBottomColor', t['color.' + edge]));
        assert.equal(parts.frame.style.position, 'relative');

        // Trigger text: the selection, else the placeholder in the field's
        // own ink, which a floating label never draws
        const placeholderShows = t['anatomy.label'] === 'above' || !props.label;
        const text = selected ? selected.label : props.placeholder || '';
        const color = 'field_value' + (disabled ? '_disabled' : '');
        assert.equal(parts.value.textContent, text);
        assert.equal(parts.value.style.opacity, selected || placeholderShows ? '1' : '0');
        assert.equal(parts.value.style.color, cssValue('color', t['color.' + color]));

        // Indicator: the theme's own dropdown glyph, turned while open
        const svg = parts.caret.querySelector('svg');
        const literal = t['icon.dropdown_indicator'];
        const glyph = literal.sizes && literal.sizes[String(t['control.field_icon_size'])] ? literal.sizes[String(t['control.field_icon_size'])] : literal;
        assert.equal(svg.querySelector('path').getAttribute('d'), glyph.paths[0].d);
        assert.equal(parts.caret.style.transform, open ? 'rotate(180deg)' : '');

        // The list mounts while the sample says open, drawn on the list cells
        const list = parts.list();
        assert.equal(list === null, !open);
        if (open) {
          assert.equal(parts.trigger.getAttribute('aria-expanded'), 'true');
          assert.equal(list.style.backgroundColor, cssValue('backgroundColor', t['color.list_container']));
          assert.equal(list.style.borderTopLeftRadius, t['control.list_radius'] + 'px');
          assert.equal(list.style.paddingTop, t['control.list_padding_block'] + 'px');
          assert.equal(list.style.zIndex, String(t['stacking.dropdown']));
          assert.equal(list.style.top, t[HEIGHTS[props.size || 'md']] + 'px');
          assert.equal(list.style.maxHeight, (t[HEIGHTS[props.size || 'md']] * 5.5 + t['control.list_padding_block'] * 2) + 'px');
          const options = parts.options();
          assert.equal(options.length, items.length);
          items.forEach(function (item, index) {
            const option = options[index];
            const optionBlock = option.children[0];
            const mark = parts.mark(option);
            const itemSelected = item.value === props.value;
            assert.equal(option.style.height, t[HEIGHTS[props.size || 'md']] + 'px');
            assert.equal(option.getAttribute('aria-selected'), String(itemSelected));
            assert.equal(option.getAttribute('aria-disabled'), item.disabled === true ? 'true' : null);
            // The divider is the inner option block's top border, inside the
            // inline padding; it is suppressed on the first row, on the
            // selected or highlighted row and right after them - a suppressed
            // divider keeps its width and turns transparent
            const divider = index !== 0 && index !== selectedIndex && index - 1 !== selectedIndex;
            assert.equal(optionBlock.style.borderTopWidth, t['control.list_item_divider_width'] + 'px');
            assert.equal(optionBlock.style.borderTopColor, divider ? cssValue('borderTopColor', t['color.list_item_divider']) : cssValue('borderTopColor', 'rgba(0, 0, 0, 0)'));
            assert.equal(optionBlock.style.marginLeft || optionBlock.style.marginInlineStart, t['control.list_item_padding_inline'] + 'px');
            assert.equal(optionBlock.style.paddingRight || optionBlock.style.paddingInlineEnd, (t['anatomy.list_selected_mark'] === 'shown' ? t['spacing.spacing_06'] : 0) + 'px');
            assert.equal(optionBlock.children[0].style.fontSize, t['type.list_item'].fontSize + 'px');
            assert.equal(optionBlock.children[0].style.color, cssValue('color', t['color.list_item_label' + (item.disabled === true ? '_disabled' : itemSelected ? '_selected' : '')]));
            // The mark's seat mounts on every item; the theme's anatomy decides it draws
            assert.equal(mark.style.display, t['anatomy.list_selected_mark'] === 'shown' && itemSelected ? 'flex' : 'none');
            if (mark.style.display === 'flex') {
              assert.equal(mark.style.position, 'absolute');
              assert.equal(mark.style.right || mark.style.insetInlineEnd, t['control.list_item_padding_inline'] + 'px');
              assert.equal(mark.querySelector('svg').getAttribute('width'), String(t['control.field_icon_size']));
            }
          });
        } else {
          assert.equal(parts.trigger.getAttribute('aria-expanded'), 'false');
        }

        // Label and message
        if (props.label) {
          assert.equal(parts.label.textContent, props.label);
          assert.equal(parts.trigger.getAttribute('aria-labelledby'), parts.label.id);
        } else {
          assert.equal(parts.label, null);
          assert.equal(parts.trigger.getAttribute('aria-label'), props.accessibilityLabel);
        }
        const message = invalid ? [props.invalidText, 'field_message_invalid'] : props.helperText ? [props.helperText, 'field_helper' + (disabled ? '_disabled' : '')] : null;
        if (message === null) {
          assert.equal(parts.message, null);
        } else {
          assert.equal(parts.message.textContent, message[0]);
          assert.equal(parts.message.style.color, cssValue('color', t['color.' + message[1]]));
        }

        // Accessibility answer
        assert.equal(parts.trigger.getAttribute('aria-invalid'), invalid ? 'true' : null);
        assert.equal(parts.trigger.getAttribute('aria-disabled'), disabled ? 'true' : null);
      });
    }
  }

});


describe('Dropdown: the list through the DOM', function () {

  test('a press opens the listbox below the frame; an option press selects, reports and closes', async function () {
    const t = buildNative('carbon').tokens;
    const calls = [];
    const parts = await renderDropdown(registryFor('carbon'), { label: 'Size', items: ITEMS, onChange: function (value) { calls.push(value); } });
    await act(async function () {
      parts.trigger.click();
    });
    const list = parts.list();
    assert.equal(parts.trigger.getAttribute('aria-expanded'), 'true');
    assert.equal(parts.trigger.getAttribute('aria-controls'), list.id);
    assert.equal(list.style.top, t['control.field_height'] + 'px');
    assert.equal(parts.caret.style.transform, 'rotate(180deg)');
    // A pointer open with no selection highlights nothing
    assert.equal(parts.options()[0].style.backgroundColor, '');
    await act(async function () {
      parts.options()[1].click();
    });
    assert.deepEqual(calls, ['medium']);
    assert.equal(parts.list(), null);
    assert.equal(parts.value.textContent, 'Medium');
  });

  test('arrow keys open and move the highlight, Enter commits, Escape closes', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderDropdown(registryFor('carbon'), { label: 'Size', items: ITEMS });
    await press(parts.trigger, 'ArrowDown');
    await press(parts.trigger, 'ArrowDown');
    const options = parts.options();
    // The keyboard's highlight draws the field's focus ring, not the hover fill
    assert.equal(options[1].style.backgroundColor, '');
    assert.equal(options[1].style.outlineColor, cssValue('outlineColor', t['color.field_focus_ring']));
    assert.equal(options[1].style.outlineWidth, t['control.field_focus_width'] + 'px');
    assert.equal(options[0].style.backgroundColor, '');
    await press(parts.trigger, 'Enter');
    assert.equal(parts.value.textContent, 'Medium');
    await press(parts.trigger, 'ArrowDown');
    assert.equal(parts.options()[1].getAttribute('aria-selected'), 'true');
    // The selection stays highlighted and draws the selected fill
    assert.equal(parts.options()[1].style.backgroundColor, cssValue('backgroundColor', t['color.list_item_container_selected']));
    await press(parts.trigger, 'Escape');
    assert.equal(parts.list(), null);
  });

  test('a disabled option is announced, skipped by the arrows and cannot be pressed', async function () {
    const calls = [];
    const items = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
      { value: 'c', label: 'C' }
    ];
    const parts = await renderDropdown(registryFor('carbon'), { label: 'Size', items: items, onChange: function (value) { calls.push(value); } });
    await act(async function () {
      parts.trigger.click();
    });
    const options = parts.options();
    assert.equal(options[1].getAttribute('aria-disabled'), 'true');
    // Pointer open leaves the highlight unset; the first arrow lands on the
    // first option, the second skips the disabled one; the highlight draws
    // the field's focus ring
    await press(parts.trigger, 'ArrowDown');
    assert.equal(options[0].style.outlineStyle, 'solid');
    assert.equal(options[1].style.outlineStyle || 'none', 'none');
    await press(parts.trigger, 'ArrowDown');
    assert.equal(options[2].style.outlineStyle, 'solid');
    assert.equal(options[1].style.outlineStyle || 'none', 'none');
    await act(async function () {
      options[1].click();
    });
    assert.deepEqual(calls, []);
    assert.equal(parts.list() === null, false);
  });

  test('a controlled open keeps the list mounted and reports its next state', async function () {
    const calls = [];
    const parts = await renderDropdown(registryFor('carbon'), { label: 'Size', items: ITEMS, open: true, onOpenChange: function (next) { calls.push(next); } });
    assert.equal(parts.list() === null, false);
    await act(async function () {
      parts.trigger.click();
    });
    assert.equal(parts.list() === null, false);
    assert.deepEqual(calls, [false]);
  });

  test('disabled: neither a press nor a key opens the list', async function () {
    const parts = await renderDropdown(registryFor('carbon'), { label: 'Size', items: ITEMS, disabled: true });
    await act(async function () {
      parts.trigger.click();
    });
    await press(parts.trigger, 'ArrowDown');
    assert.equal(parts.list(), null);
  });

});
