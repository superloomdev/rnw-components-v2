// Info: MultiSelect and FilterableMultiSelect composites. Every sample state
// renders under all three templates with its frame, label, count member,
// control, caret, message and - while open - the option list, each drawn from
// the theme's field and list role cells. Press, keyboard and option press
// toggle values through the DOM without closing the list; the count member's
// clear empties the selection; the decorative checkbox answers no input of
// its own; the accessibility answer is a labelled combobox controlling a
// multiselectable listbox of checkbox options scrolled by a real ScrollView.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { buildNative } from './harness/system.js';
import { cleanup, cssValue } from './harness/render.js';
import { ITEMS, OWNERS, HEIGHTS, SAMPLE, TEMPLATE_NAMES, act, press, registryFor, renderField, type } from './multi-select-shared.js';

afterEach(cleanup);


describe('MultiSelect + FilterableMultiSelect: every sample state under every template', function () {

  for (const owner of OWNERS) {
    for (const template of TEMPLATE_NAMES) {
      for (const state of SAMPLE) {
        test(owner.name + ' / ' + template + ' / ' + state.label, async function () {
          const t = buildNative(template).tokens;
          const props = state.props;
          const disabled = props.disabled === true;
          const invalid = props.invalid === true && !disabled;
          const open = props.open === true;
          const items = props.items;
          const height = t[HEIGHTS[props.size || 'md']];
          const values = props.value === undefined ? props.defaultValue || [] : props.value;
          const parts = await renderField(registryFor(template), owner.name, props);

          // Frame geometry from the field cells for the state
          assert.equal(parts.frame.style.height, height + 'px');
          assert.equal(parts.frame.style.position, 'relative');
          const phase = disabled ? '_disabled' : invalid ? '_invalid' : '';
          // An open underline frame drops to the subtle border; an outline
          // frame paints its open edge in the focus outline, as Dropdown does
          const edge = disabled ? 'select_outline_disabled'
            : open ? (t['feedback.field'] === 'underline' ? 'border_subtle_01' : 'field_outline_focus')
            : 'field_outline' + phase;
          assert.equal(parts.frame.style.borderBottomColor, cssValue('borderBottomColor', t['color.' + edge]));

          // Label and naming: the visible label names the control; an
          // absent one leaves no dangling labelledby
          if (props.label) {
            assert.equal(parts.label.textContent, props.label);
            assert.equal(parts.trigger.getAttribute('aria-labelledby'), parts.label.id);
            assert.equal(parts.trigger.getAttribute('aria-label'), null);
          } else {
            assert.equal(parts.label, null);
            assert.equal(parts.trigger.getAttribute('aria-labelledby'), null);
            assert.equal(parts.trigger.getAttribute('aria-label'), props.accessibilityLabel);
          }

          // The count member carries the selected count on the inverse
          // palette, its close named by the clear label and drawing no tooltip
          if (values.length > 0) {
            const countText = parts.count.querySelector('[dir="auto"]');
            assert.equal(countText.textContent, String(values.length));
            assert.equal(parts.count.style.backgroundColor, cssValue('backgroundColor', t[disabled ? 'color.layer_01' : 'color.background_inverse']));
            assert.equal(countText.style.color, cssValue('color', t[disabled ? 'color.text_disabled' : 'color.text_inverse']));
            const close = parts.count.querySelector('[role="button"]');
            assert.equal(close === null, false, 'the count member keeps its close control');
            assert.equal(close.getAttribute('aria-label'), 'Clear selection');
            assert.equal(parts.count.querySelector('[aria-describedby]'), null, 'the member draws no tooltip');
          } else {
            assert.equal(parts.count, null);
          }

          // The control: a combobox; the value text on the press-only owner,
          // the editable input on the filterable one
          assert.equal(parts.trigger.getAttribute('role'), 'combobox');
          if (owner.name === 'MultiSelect') {
            assert.equal(parts.value.textContent, props.placeholder || '');
          } else {
            assert.equal(parts.trigger.tagName, 'INPUT');
            assert.equal(parts.trigger.getAttribute('aria-autocomplete'), 'list');
          }

          // Caret: the dropdown indicator, turned while open; the invalid
          // icon shows while invalid, disabled is never invalid
          assert.equal(parts.caret.querySelector('svg') === null, false);
          assert.equal(parts.caret.style.transform, open ? 'rotate(180deg)' : '');
          assert.equal(parts.invalidIcon === null, !invalid);

          // Message: the error while invalid, else the helper; the control
          // is described by it
          const message = invalid && props.invalidText ? props.invalidText
            : props.helperText ? props.helperText : null;
          if (message === null) {
            assert.equal(parts.message, null);
            assert.equal(parts.trigger.getAttribute('aria-describedby'), null);
          } else {
            assert.equal(parts.message.textContent, message);
            assert.equal(parts.trigger.getAttribute('aria-describedby'), parts.message.id);
          }

          // The list: a multiselectable listbox of checkbox options on a real
          // ScrollView, mounted only while open
          const list = parts.list();
          assert.equal(list === null, !open);
          assert.equal(parts.trigger.getAttribute('aria-expanded'), String(open));
          if (open) {
            assert.equal(list.getAttribute('role'), 'listbox');
            assert.equal(list.getAttribute('aria-multiselectable'), 'true');
            assert.equal(list.style.maxHeight, (height * 5.5 + t['control.list_padding_block'] * 2) + 'px');
            const scroll = parts.scroll();
            assert.equal(scroll === null, false, 'options ride a real scroll face');
            assert.equal(list.contains(scroll), true);
            const options = parts.options();
            assert.equal(options.length, items.length);
            const selectedSet = new Set(values);
            // The partition orders selected rows first, keeping host order
            // inside each partition
            const expected = items.filter(function (item) {
              return selectedSet.has(item.value);
            }).concat(items.filter(function (item) {
              return !selectedSet.has(item.value);
            }));
            options.forEach(function (option, index) {
              const item = expected[index];
              const chosen = selectedSet.has(item.value);
              assert.equal(option.getAttribute('aria-label'), item.label);
              assert.equal(option.getAttribute('aria-checked'), String(chosen));
              assert.equal(option.getAttribute('aria-selected'), String(chosen));
              assert.equal(option.getAttribute('aria-disabled'), item.disabled === true || disabled ? 'true' : null);
              assert.equal(option.getAttribute('tabindex'), '-1');
              // The decorative checkbox member: hidden, pointer-transparent,
              // never a tab stop
              const box = option.querySelector('[role="checkbox"]');
              assert.equal(box === null, false);
              assert.equal(box.getAttribute('tabindex'), '-1');
              assert.equal(box.getAttribute('aria-checked'), String(chosen));
              assert.equal(box.closest('[aria-hidden="true"]') === null, false);
              // The option block carries its marker and the one-line label
              // at the checkbox text inset
              const content = option.querySelector('[data-part="option-content"]');
              assert.equal(content === null, false);
              const text = content.querySelector('[dir="auto"]');
              assert.equal(text.textContent, item.label);
              assert.equal(text.style.marginLeft || text.style.marginInlineStart,
                (t['control.multi_select_checkbox_inset'] + t['spacing.spacing_03'] + t['spacing.spacing_01']) + 'px');
            });
          }

          // Disabled: the control reports it; a disabled field is never invalid
          assert.equal(parts.trigger.getAttribute('aria-disabled'), disabled ? 'true' : null);
          assert.equal(parts.trigger.getAttribute('aria-invalid'), invalid ? 'true' : null);

          // The live region mounts hidden but readable
          assert.equal(parts.live === null, false);
          assert.equal(parts.live.style.opacity, '0');
          assert.equal(parts.live.style.display, '');
        });
      }
    }
  }

});


describe('MultiSelect: the list through the DOM', function () {

  test('a press opens the listbox; an option press toggles once and stays open', async function () {
    const calls = [];
    const parts = await renderField(registryFor('carbon'), 'MultiSelect', {
      label: 'Choice', placeholder: 'Choose', items: ITEMS,
      onChange: function (next) { calls.push(next); }
    });
    await act(async function () {
      parts.trigger.click();
    });
    const list = parts.list();
    assert.equal(list === null, false);
    assert.equal(parts.trigger.getAttribute('aria-controls'), list.id);
    await act(async function () {
      parts.options()[0].click();
    });
    assert.deepEqual(calls, [['alpha']]);
    assert.equal(parts.list() === null, false, 'the list stays open after a toggle');
    assert.equal(parts.options()[0].getAttribute('aria-checked'), 'true');
    assert.equal(parts.count.querySelector('[dir="auto"]').textContent, '1');
    await act(async function () {
      parts.options()[0].click();
    });
    assert.deepEqual(calls, [['alpha'], []], 'a second press unchecks the same row');
    assert.equal(parts.count, null);
  });

  test('the count member clears every selected value and refocuses the field', async function () {
    const calls = [];
    const parts = await renderField(registryFor('carbon'), 'MultiSelect', {
      label: 'Choice', items: ITEMS, defaultValue: ['alpha', 'beta'],
      onChange: function (next) { calls.push(next); }
    });
    assert.equal(parts.count.querySelector('[dir="auto"]').textContent, '2');
    await act(async function () {
      parts.count.querySelector('[role="button"]').click();
    });
    assert.deepEqual(calls, [[]]);
    assert.equal(parts.count, null);
    assert.equal(parts.live.textContent, 'All items cleared');
    assert.equal(parts.root.ownerDocument.activeElement, parts.trigger);
  });

  test('a controlled clear refusal leaves the count and its member up', async function () {
    const calls = [];
    const parts = await renderField(registryFor('carbon'), 'MultiSelect', {
      label: 'Choice', items: ITEMS, value: ['alpha'],
      onChange: function (next) { calls.push(next); }
    });
    await act(async function () {
      parts.count.querySelector('[role="button"]').click();
    });
    await act(async function () {
      parts.count.querySelector('[role="button"]').click();
    });
    assert.deepEqual(calls, [[], []], 'each clear requests while the parent holds its answer');
    assert.equal(parts.count.querySelector('[dir="auto"]').textContent, '1');
  });

  test('a numeric zero value selects, counts and clears', async function () {
    const calls = [];
    const parts = await renderField(registryFor('carbon'), 'MultiSelect', {
      label: 'Choice', items: [{ value: 0, label: 'Zero' }, { value: 1, label: 'One' }],
      value: [0],
      onChange: function (next) { calls.push(next); }
    });
    assert.equal(parts.count.querySelector('[dir="auto"]').textContent, '1');
    await act(async function () {
      parts.count.querySelector('[role="button"]').click();
    });
    assert.deepEqual(calls, [[]]);
  });

  test('a closed Backspace clears the selection', async function () {
    const calls = [];
    const parts = await renderField(registryFor('carbon'), 'MultiSelect', {
      label: 'Choice', items: ITEMS, defaultValue: ['alpha'],
      onChange: function (next) { calls.push(next); }
    });
    await act(async function () {
      parts.trigger.focus();
    });
    await press(parts.trigger, 'Backspace');
    assert.deepEqual(calls, [[]]);
    assert.equal(parts.count, null);
  });

  test('arrow keys move the highlight; the first highlighted row draws the mounted border', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderField(registryFor('carbon'), 'MultiSelect', {
      label: 'Choice', items: ITEMS, value: ['beta']
    });
    await act(async function () {
      parts.trigger.click();
    });
    // On open the nav answer rests on the first selected-enabled value -
    // the partitioned first row - so it draws the mounted border at once
    let options = parts.options();
    const ringOf = function (option) {
      return Array.from(option.children).find(function (child) {
        return child.style.borderTopWidth !== '' && child.style.borderTopWidth !== undefined && child.style.position === 'absolute';
      });
    };
    assert.equal(options[0].getAttribute('aria-checked'), 'true');
    assert.equal(options[0].style.outlineStyle, 'none', 'the first highlighted row draws no generic outline');
    const ring = ringOf(options[0]);
    assert.equal(ring === undefined, false, 'the mounted border is drawn');
    assert.equal(ring.style.borderTopWidth, t['border.width_01'] + 'px');
    assert.equal(ring.style.borderBottomWidth, t['control.field_focus_width'] + 'px');
    assert.equal(ring.style.borderTopColor, cssValue('borderTopColor', t['color.field_focus_ring']));
    assert.equal(ring.style.borderBottomColor, cssValue('borderBottomColor', t['color.field_focus_ring']));
    assert.equal(parts.root.ownerDocument.defaultView.getComputedStyle(ring).pointerEvents, 'none');
    // Moving the highlight returns the first row to a plain option and the
    // new highlighted row to the generic field ring
    await press(parts.trigger, 'ArrowDown');
    options = parts.options();
    assert.equal(ringOf(options[0]), undefined);
    assert.equal(options[1].style.outlineStyle, 'solid');
    assert.equal(options[1].style.outlineColor, cssValue('outlineColor', t['color.field_focus_ring']));
  });

  test('the decorative checkbox takes no press and no focus', async function () {
    const calls = [];
    const parts = await renderField(registryFor('carbon'), 'MultiSelect', {
      label: 'Choice', items: ITEMS, open: true,
      onChange: function (next) { calls.push(next); }
    });
    const option = parts.options()[0];
    const box = option.querySelector('[role="checkbox"]');
    await act(async function () {
      box.click();
    });
    assert.deepEqual(calls, [], 'the member itself answers no input');
    assert.equal(option.getAttribute('aria-checked'), 'false');
    assert.equal(box.getAttribute('aria-disabled'), null);
    assert.equal(box.getAttribute('aria-checked'), 'false');
  });

  test('a disabled option reports and cannot be toggled', async function () {
    const calls = [];
    const parts = await renderField(registryFor('carbon'), 'MultiSelect', {
      label: 'Choice', items: ITEMS, open: true,
      onChange: function (next) { calls.push(next); }
    });
    const options = parts.options();
    const delta = options.find(function (option) {
      return option.getAttribute('aria-label') === 'Delta';
    });
    assert.equal(delta.getAttribute('aria-disabled'), 'true');
    await act(async function () {
      delta.click();
    });
    assert.deepEqual(calls, []);
  });

  test('a committed toggle announces the committed count', async function () {
    const parts = await renderField(registryFor('carbon'), 'MultiSelect', {
      label: 'Choice', items: ITEMS, defaultValue: ['alpha']
    });
    await act(async function () {
      parts.trigger.click();
    });
    await act(async function () {
      parts.options().find(function (option) {
        return option.getAttribute('aria-label') === 'Gamma';
      }).click();
    });
    assert.equal(parts.live.textContent, '2 selected');
  });

  test('a filtered first row keeps its selection answer and draws the mounted border', async function () {
    const t = buildNative('carbon').tokens;
    const parts = await renderField(registryFor('carbon'), 'FilterableMultiSelect', {
      label: 'Choice', items: ITEMS, defaultValue: ['beta']
    });
    await act(async function () {
      parts.trigger.click();
    });
    await type(parts.trigger, 'ga');
    // Beta stays selected though the query hides it; the only visible row is
    // the unselected highlighted Gamma, drawing the mounted border while the
    // generic outline stays suppressed
    const options = parts.options();
    assert.equal(options.length, 1);
    assert.equal(options[0].getAttribute('aria-label'), 'Gamma');
    assert.equal(options[0].getAttribute('aria-checked'), 'false');
    assert.equal(options[0].getAttribute('aria-selected'), 'false');
    assert.equal(options[0].style.outlineStyle, 'none');
    assert.equal(options[0].style.backgroundColor, '');
    const ring = Array.from(options[0].children).find(function (child) {
      return child.style.borderTopWidth !== '' && child.style.borderTopWidth !== undefined && child.style.position === 'absolute';
    });
    assert.equal(ring === undefined, false, 'the mounted border draws on the highlighted first row');
    assert.equal(ring.style.borderBottomWidth, t['control.field_focus_width'] + 'px');
    const text = options[0].querySelector('[data-part="option-content"] [dir="auto"]');
    assert.equal(text.style.color, cssValue('color', t['color.list_item_label']));
    assert.equal(parts.count.querySelector('[dir="auto"]').textContent, '1', 'the hidden selection still counts');
  });

  test('the count member tracks the field size and keeps the raw close gap', async function () {
    const t = buildNative('carbon').tokens;
    // The selection-count member is sized by the field: 18/24/32, its close
    // face the same square, and the legacy count keeps the raw base gap at
    // every size - never the standalone small's half-height adjustment
    const expected = { sm: 18, md: 24, lg: 32 };
    for (const size of ['sm', 'md', 'lg']) {
      const parts = await renderField(registryFor('carbon'), 'MultiSelect', {
        label: 'Choice', items: ITEMS, size: size, value: ['alpha'], testID: 'count-' + size
      });
      const face = parts.count.querySelector('[data-testid="tag-close-face"]');
      assert.equal(parts.count.style.height, expected[size] + 'px', size + ' count height');
      assert.equal(parts.count.style.paddingLeft, t['control.tag_padding_inline'] + 'px',
        size + ' count keeps the legacy base leading padding');
      assert.equal(face.style.height, expected[size] + 'px', size + ' close face height');
      assert.equal(face.style.marginLeft || face.style.marginInlineStart,
        t['control.tag_close_gap'] + 'px', size + ' close keeps the raw base gap');
    }
  });

  test('a disabled field opens nothing and answers nothing', async function () {
    const calls = [];
    const parts = await renderField(registryFor('carbon'), 'MultiSelect', {
      label: 'Choice', items: ITEMS, disabled: true,
      onChange: function (next) { calls.push(next); }
    });
    await act(async function () {
      parts.trigger.click();
      parts.caret.click();
    });
    assert.equal(parts.list(), null);
    assert.deepEqual(calls, []);
  });

  test('the press-only wrapper spans the field height; the editable form ends at the content edge', async function () {
    // The source's content-plus-resting-edge calc lands on exactly the
    // field height for the press-only owner - 40px at md under an
    // underline field - while the editable form and every outline row
    // ends at the content edge, 39px under the same field
    for (const template of TEMPLATE_NAMES) {
      const t = buildNative(template).tokens;
      const underline = t['feedback.field'] === 'underline';
      const height = t[HEIGHTS.md];
      for (const owner of OWNERS) {
        for (const open of [false, true]) {
          const width = open === true && underline !== true
            ? t['control.field_outline_width_focus'] : t['control.field_outline_width'];
          const expected = underline
            ? (owner.name === 'MultiSelect' ? height : height - width)
            : height - 2 * width;
          const parts = await renderField(registryFor(template), owner.name, {
            label: 'Choice', items: ITEMS, open: open
          });
          const wrapper = parts.frame.firstElementChild;
          assert.equal(wrapper.style.height, expected + 'px',
            owner.name + ' / ' + template + ' / open:' + open + ' wrapper');
          if (open === true) {
            assert.equal(parts.list().style.top, expected + 'px',
              owner.name + ' / ' + template + ' popup seats at the wrapper edge');
          }
        }
      }
    }
  });

  test('the hover fill paints only on the press-only owner', async function () {
    // The editable anatomy carries focus, text and press but keeps its
    // field fill under the pointer; the press-only owner's frame paints
    // the field's hover cell
    for (const template of TEMPLATE_NAMES) {
      const t = buildNative(template).tokens;
      for (const owner of OWNERS) {
        const parts = await renderField(registryFor(template), owner.name, {
          label: 'Choice', items: ITEMS
        });
        const base = parts.frame.style.backgroundColor;
        await act(async function () {
          parts.frame.dispatchEvent(new Event('pointerover', { bubbles: true }));
        });
        const hovered = parts.frame.style.backgroundColor;
        if (owner.name === 'MultiSelect') {
          assert.equal(hovered, cssValue('backgroundColor', t['color.field_container_hover']),
            template + ' press-only hover paints the hover cell');
        } else {
          assert.equal(hovered, base, template + ' editable frame keeps its field fill');
          assert.equal(hovered, cssValue('backgroundColor', t['color.field_container']));
        }
        await act(async function () {
          parts.frame.dispatchEvent(new Event('pointerout', { bubbles: true }));
        });
      }
    }
  });

  test('the press-only caret rides inside its trigger as the one activation', async function () {
    // The source seats the caret inside the primary button, so a mouse
    // down on it is the trigger's own press and focuses the real control;
    // ours is a pointer-transparent View inside the same trigger
    const opens = [];
    const parts = await renderField(registryFor('carbon'), 'MultiSelect', {
      label: 'Choice', items: ITEMS,
      onOpenChange: function (next) { opens.push(next); }
    });
    assert.equal(parts.trigger.contains(parts.caret), true, 'the caret seat sits inside the trigger');
    assert.equal(parts.caret.querySelector('[role="button"]'), null, 'the caret nests no second toggle');
    assert.equal(parts.root.ownerDocument.defaultView.getComputedStyle(parts.caret).pointerEvents, 'none');
    await act(async function () {
      parts.trigger.focus();
    });
    await act(async function () {
      parts.caret.click();
    });
    assert.deepEqual(opens, [true], 'one toggle request arrives through the trigger');
    assert.equal(parts.list() === null, false);
    assert.equal(parts.root.ownerDocument.activeElement, parts.trigger, 'the real control keeps focus');
  });

  test('the editable caret stays a sibling toggle beside its input', async function () {
    const opens = [];
    const parts = await renderField(registryFor('carbon'), 'FilterableMultiSelect', {
      label: 'Choice', items: ITEMS,
      onOpenChange: function (next) { opens.push(next); }
    });
    assert.equal(parts.trigger.contains(parts.caret), false, 'an input cannot hold the caret');
    const toggle = parts.caret.querySelector('[role="button"]');
    assert.equal(toggle === null, false, 'the editable caret keeps its own toggle');
    await act(async function () {
      toggle.click();
    });
    assert.deepEqual(opens, [true]);
    assert.equal(parts.list() === null, false);
  });

  test('the open field keeps the source ring: normal without a descendant, partial with one', async function () {
    const t = buildNative('carbon').tokens;
    // A focused editable pointer-open with an empty query and no
    // selection: the source keeps its empty active descendant and the
    // normal field focus ring
    const plain = await renderField(registryFor('carbon'), 'FilterableMultiSelect', {
      label: 'Choice', items: ITEMS
    });
    await act(async function () {
      plain.trigger.focus();
    });
    await act(async function () {
      plain.trigger.click();
    });
    assert.equal(plain.trigger.getAttribute('aria-activedescendant'), null,
      'a fresh pointer open invents no descendant');
    assert.equal(plain.frame.style.outlineStyle, 'solid');
    assert.equal(plain.frame.style.outlineWidth, t['control.field_focus_width'] + 'px',
      'the normal ring width stays with no descendant');
    assert.equal(plain.frame.style.outlineColor, cssValue('outlineColor', t['color.field_focus_ring']));

    // A focused selected pointer-open carries the active descendant: the
    // present ring drops to the partial width at its own negative offset,
    // keeping the focus color
    const selected = await renderField(registryFor('carbon'), 'MultiSelect', {
      label: 'Choice', items: ITEMS, value: ['beta']
    });
    await act(async function () {
      selected.trigger.focus();
    });
    await act(async function () {
      selected.trigger.click();
    });
    assert.equal(selected.trigger.getAttribute('aria-activedescendant') === null, false,
      'the open press-only owner carries its descendant');
    assert.equal(selected.frame.style.outlineStyle, 'solid');
    assert.equal(selected.frame.style.outlineWidth, t['border.width_01'] + 'px', 'partial width');
    assert.equal(selected.frame.style.outlineOffset, '-' + t['border.width_01'] + 'px', 'partial offset');
    assert.equal(selected.frame.style.outlineColor, cssValue('outlineColor', t['color.field_focus_ring']),
      'the ring keeps the focus color');

    // An invalid focused open frame with the descendant keeps the FOCUS
    // color partial ring, never the red invalid ring the rest paints
    const invalid = await renderField(registryFor('carbon'), 'MultiSelect', {
      label: 'Choice', items: ITEMS, value: ['beta'], invalid: true, invalidText: 'Invalid value'
    });
    await act(async function () {
      invalid.trigger.focus();
    });
    await act(async function () {
      invalid.trigger.click();
    });
    assert.equal(invalid.frame.style.outlineWidth, t['border.width_01'] + 'px');
    assert.equal(invalid.frame.style.outlineOffset, '-' + t['border.width_01'] + 'px');
    assert.equal(invalid.frame.style.outlineColor, cssValue('outlineColor', t['color.field_focus_ring']),
      'invalid keeps the focus color, not red');

    // Unfocused and closed keeps the ordinary rest answer - no ring; a
    // closed invalid keeps its ordinary invalid ring
    const rest = await renderField(registryFor('carbon'), 'MultiSelect', {
      label: 'Choice', items: ITEMS
    });
    assert.equal(rest.frame.style.outlineStyle, '');
    const invalidRest = await renderField(registryFor('carbon'), 'MultiSelect', {
      label: 'Choice', items: ITEMS, invalid: true, invalidText: 'Invalid value'
    });
    assert.equal(invalidRest.frame.style.outlineColor, cssValue('outlineColor', t['color.field_ring_invalid']));
    assert.equal(invalidRest.frame.style.outlineWidth, t['control.field_invalid_ring_width'] + 'px');
  });

  test('a pointer option press returns focus to the control', async function () {
    // Accepted through the onSelect seam: the row toggles and focus comes
    // back to the input or trigger the ref names, never strands on the row
    const editable = await renderField(registryFor('carbon'), 'FilterableMultiSelect', {
      label: 'Choice', items: ITEMS
    });
    await act(async function () {
      editable.trigger.click();
    });
    await act(async function () {
      editable.options()[0].click();
    });
    assert.equal(editable.root.ownerDocument.activeElement, editable.trigger,
      'focus returns to the editable field');

    const pressOnly = await renderField(registryFor('carbon'), 'MultiSelect', {
      label: 'Choice', items: ITEMS
    });
    await act(async function () {
      pressOnly.trigger.click();
    });
    await act(async function () {
      pressOnly.options()[0].click();
    });
    assert.equal(pressOnly.root.ownerDocument.activeElement, pressOnly.trigger,
      'focus returns to the trigger');
  });

});
