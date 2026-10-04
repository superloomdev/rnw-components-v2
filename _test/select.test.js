// Info: Select composite. Every sample state renders under all three
// templates with its frame, label, trigger text, caret and message read
// from the built theme; press, keyboard and option press drive the list
// through the DOM; the caret follows anatomy.caret; the accessibility
// answer is a labelled combobox controlling a listbox of options.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/select/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);
const TRANSPARENT = 'rgba(0, 0, 0, 0)';
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
Render one Select and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Select props

@return {Promise<Object>} - { container, root, label, frame, trigger, value, caret, message, list() }
*********************************************************************/
async function renderSelect (Registry, props) {

  const container = await render(React.createElement(Registry.Select, props));
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


describe('Select: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': frame, label, trigger, caret and message come from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const disabled = props.disabled === true;
        const invalid = props.invalid === true && !disabled;
        const selected = ITEMS.find(function (item) {
          return item.value === props.value;
        });
        const parts = await renderSelect(registryFor(template), props);

        // Frame geometry and the mode's border
        // Disabled draws no border; invalid draws an inner error ring (underline) or an error border (outline)
        const outline = t['feedback.field'] === 'outline';
        const border = disabled ? null : invalid && outline ? 'support_error' : 'border_strong_01';
        assert.equal(parts.frame.style.outlineWidth, invalid && !outline ? t['border.width_02'] + 'px' : '');
        assert.equal(parts.frame.style.height, t[HEIGHTS[props.size || 'md']] + 'px');
        // An outline frame keeps its borders inside the inline padding
        assert.equal(parts.frame.style.paddingLeft, (t['spacing.spacing_05'] - (t['feedback.field'] === 'outline' ? t['border.width_01'] : 0)) + 'px');
        assert.equal(parts.frame.style.borderBottomWidth, t['border.width_01'] + 'px');
        assert.equal(parts.frame.style.borderBottomColor, border === null ? TRANSPARENT : cssValue('borderBottomColor', t['color.' + border]));
        assert.equal(parts.frame.style.backgroundColor, t['feedback.field'] === 'underline' ? cssValue('backgroundColor', t['color.field_01']) : TRANSPARENT);

        // Trigger text: the selection, else the placeholder, undrawn under a resting floating label
        const placeholderShows = t['anatomy.label'] === 'above' || !props.label;
        const text = selected ? selected.label : props.placeholder || '';
        const color = disabled ? 'text_disabled' : selected ? 'text_primary' : 'text_placeholder';
        assert.equal(parts.value.textContent, text);
        assert.equal(parts.value.style.opacity, selected || placeholderShows ? '1' : '0');
        assert.equal(parts.value.style.color, cssValue('color', t['color.' + color]));
        assert.equal(parts.value.style.fontSize, t['type.body_compact_01'].fontSize + 'px');

        // Caret: always mounted, displayed by the theme's choice
        const svg = parts.caret.querySelector('svg');
        assert.equal(parts.caret.style.display, t['anatomy.caret'] === 'shown' ? 'flex' : 'none');
        assert.equal(svg.getAttribute('width'), String(t['control.field_icon_size']));
        assert.equal(svg.getAttribute('fill'), t['color.' + (disabled ? 'icon_disabled' : 'icon_primary')]);

        // Label and message
        if (props.label) {
          assert.equal(parts.label.textContent, props.label);
          assert.equal(parts.trigger.getAttribute('aria-labelledby'), parts.label.id);
        } else {
          assert.equal(parts.label, null);
          assert.equal(parts.trigger.getAttribute('aria-label'), props.accessibilityLabel);
        }
        const message = invalid ? [props.invalidText, 'text_error'] : props.helperText ? [props.helperText, 'text_helper'] : null;
        if (message === null) {
          assert.equal(parts.message, null);
        } else {
          assert.equal(parts.message.textContent, message[0]);
          assert.equal(parts.message.style.color, cssValue('color', t['color.' + message[1]]));
        }

        // Accessibility answer
        assert.equal(parts.trigger.getAttribute('aria-expanded'), 'false');
        assert.equal(parts.trigger.getAttribute('aria-invalid'), invalid ? 'true' : null);
        assert.equal(parts.trigger.getAttribute('aria-disabled'), disabled ? 'true' : null);
        assert.equal(parts.list(), null);
      });
    }
  }

});


describe('Select: the list through the DOM', function () {

  test('a press opens the listbox below the frame; an option press selects, reports and closes', async function () {
    const t = buildNative('carbon').tokens;
    const calls = [];
    const parts = await renderSelect(registryFor('carbon'), { label: 'Size', items: ITEMS, onChange: function (value) { calls.push(value); } });
    await act(async function () {
      parts.trigger.click();
    });
    const list = parts.list();
    assert.equal(parts.trigger.getAttribute('aria-expanded'), 'true');
    assert.equal(parts.trigger.getAttribute('aria-controls'), list.id);
    assert.equal(list.style.top, t['control.field_height'] + 'px');
    assert.equal(list.style.zIndex, String(t['stacking.dropdown']));
    assert.equal(list.style.backgroundColor, cssValue('backgroundColor', t['color.layer_01']));
    const options = list.querySelectorAll('[role="option"]');
    assert.equal(options.length, ITEMS.length);
    assert.equal(options[0].style.height, t['control.option_height'] + 'px');
    await act(async function () {
      options[1].click();
    });
    assert.deepEqual(calls, ['medium']);
    assert.equal(parts.list(), null);
    assert.equal(parts.value.textContent, 'Medium');
  });

  test('arrow keys open and move the highlight, Enter commits, Escape closes', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderSelect(registryFor('carbon'), { label: 'Size', items: ITEMS });
    await press(parts.trigger, 'ArrowDown');
    await press(parts.trigger, 'ArrowDown');
    const options = parts.list().querySelectorAll('[role="option"]');
    assert.equal(options[1].style.backgroundColor, cssValue('backgroundColor', t['color.layer_hover_01']));
    assert.equal(options[0].style.backgroundColor, cssValue('backgroundColor', t['color.layer_01']));
    await press(parts.trigger, 'Enter');
    assert.equal(parts.value.textContent, 'Medium');
    await press(parts.trigger, 'ArrowDown');
    assert.equal(parts.list().querySelectorAll('[role="option"]')[1].getAttribute('aria-selected'), 'true');
    assert.equal(parts.list().querySelectorAll('[role="option"]')[1].style.backgroundColor, cssValue('backgroundColor', t['color.layer_selected_01']));
    await press(parts.trigger, 'Escape');
    assert.equal(parts.list(), null);
  });

  test('disabled: neither a press nor a key opens the list', async function () {
    const parts = await renderSelect(registryFor('carbon'), { label: 'Size', items: ITEMS, disabled: true });
    await act(async function () {
      parts.trigger.click();
    });
    await press(parts.trigger, 'ArrowDown');
    assert.equal(parts.list(), null);
  });

  test('the trigger is sized by a hidden sizer holding the placeholder and every option', async function () {
    const parts = await renderSelect(registryFor('carbon'), SAMPLE[0].props);
    assert.equal(parts.sizer.getAttribute('aria-hidden'), 'true');
    assert.equal(parts.sizer.style.height, '0px');
    assert.deepEqual(Array.from(parts.sizer.children).map(function (child) {
      return child.textContent;
    }), [SAMPLE[0].props.placeholder].concat(ITEMS.map(function (item) {
      return item.label;
    })));
  });

  test('focus draws the theme\'s focus presentation on the frame, and the trigger suppresses the browser\'s own ring', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderSelect(registryFor('carbon'), SAMPLE[0].props);
    await act(async function () {
      parts.trigger.focus();
    });
    assert.equal(parts.frame.style.outlineWidth, t['focus.width'] + 'px');
    assert.equal(parts.trigger.style.outlineStyle, 'none');
  });

  test('the trigger grows from its content (the sizer), never from a zero basis that collapses it in a content-sized container', async function () {
    const parts = await renderSelect(registryFor('carbon'), SAMPLE[0].props);
    assert.equal(parts.trigger.style.flexBasis, 'auto');
    assert.equal(parts.trigger.style.flexGrow, '1');
  });

  test('anatomy.caret: shown displays the caret, hidden keeps it mounted and undisplayed', async function () {
    const shown = await renderSelect(registryFor('default', { 'anatomy.caret': 'shown' }), SAMPLE[0].props);
    assert.equal(shown.caret.style.display, 'flex');
    const hidden = await renderSelect(registryFor('default', { 'anatomy.caret': 'hidden' }), SAMPLE[0].props);
    assert.equal(hidden.caret.style.display, 'none');
    assert.notEqual(hidden.caret.querySelector('svg'), null);
  });

  test('floating: the label rests in the frame and rises while the list is open', async function () {
    const t = buildNative('material').tokens;
    const parts = await renderSelect(registryFor('material', { 'anatomy.label': 'floating' }), { label: 'Size', items: ITEMS, placeholder: 'Choose' });
    const reserve = t['type.field_label_raised'].lineHeight / 2;
    assert.equal(parts.root.style.paddingTop, reserve + 'px');
    assert.equal(parts.label.style.top, (reserve + (t['control.field_height'] - t['type.body_compact_01'].lineHeight) / 2) + 'px');
    assert.equal(parts.value.style.opacity, '0');
    await act(async function () {
      parts.trigger.click();
    });
    assert.equal(parts.label.style.top, '0px');
    assert.equal(parts.value.style.opacity, '1');
    assert.equal(parts.value.textContent, 'Choose');
  });

});
