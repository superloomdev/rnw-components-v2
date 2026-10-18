// Info: RadioButtonGroup molecule. Every sample state renders under all
// three templates with its legend, item members and group message read
// from the theme's field and selection cells; the group shares one
// selection and one roving tab stop across its members, navigates by
// arrow, Home and End, and owns the message and disabled inheritance;
// the accessibility answer is a named radiogroup of radios wired to its
// message.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/radio-button/sample.radio-button-group.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

const ITEMS = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta' },
  { value: 'gamma', label: 'Gamma' }
];

const mounted = [];

afterEach(async function () {
  await cleanup();
  while (mounted.length > 0) {
    const item = mounted.pop();
    await act(async function () {
      item.root.unmount();
    });
    item.container.remove();
  }
});


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
Render one RadioButtonGroup and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - RadioButtonGroup props

@return {Promise<Object>} - { container, root, legend, rows, itemsContainer }
*********************************************************************/
async function renderGroup (Registry, props) {

  const container = await render(React.createElement(Registry.RadioButtonGroup, props));
  const root = container.querySelector('[role="radiogroup"]');
  const rows = Array.prototype.slice.call(root.querySelectorAll('[role="radio"]'));

  return {
    container: container,
    root: root,
    legend: root.children[0],
    rows: rows,
    itemsContainer: root.children[1]
  };

}


/********************************************************************
Dispatch one DOM event on an element inside act and report whether the
default was prevented.

@param {HTMLElement} element - Target
@param {String}      key     - KeyboardEvent key

@return {Promise<Boolean>} - true when the handler prevented the default
*********************************************************************/
async function keydown (element, key) {

  const event = new KeyboardEvent('keydown', { key: key, bubbles: true, cancelable: true });
  await act(async function () {
    element.dispatchEvent(event);
  });
  return event.defaultPrevented;

}


describe('RadioButtonGroup: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': legend, members and message come from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const items = props.items || [];
        const disabled = props.disabled === true;
        const invalid = props.invalid === true && !disabled;
        const vertical = props.orientation === 'vertical';
        const parts = await renderGroup(registryFor(template), props);

        // The group root is a named radiogroup wired to its legend
        assert.equal(parts.legend.textContent, props.legendText);
        assert.equal(parts.root.getAttribute('aria-labelledby'), parts.legend.id);
        assert.equal(parts.legend.style.fontSize, t['type.field_label'].fontSize + 'px');
        assert.equal(parts.legend.style.color, cssValue('color', t['color.' + (disabled ? 'field_label_disabled' : 'field_label')]));
        assert.equal(parts.legend.style.marginBottom, t['spacing.spacing_03'] + 'px');
        assert.equal(parts.root.getAttribute('aria-disabled'), disabled ? 'true' : null);
        assert.equal(parts.root.getAttribute('aria-invalid'), props.invalid === true ? 'true' : null);

        // The members: orientation layout, the one roving tab stop and the
        // shared selection by value
        assert.equal(parts.rows.length, items.length);
        const selectedValue = props.value !== undefined ? props.value : props.defaultValue;
        if (vertical) {
          assert.notEqual(parts.itemsContainer.style.alignItems, undefined);
          const wrappers = Array.prototype.slice.call(parts.itemsContainer.children);
          for (const wrapper of wrappers) {
            assert.equal(wrapper.style.marginBottom, t['control.radio_group_gap_vertical'] + 'px');
          }
          // The vertical member is the shorter row: the row pads the top
          // and the ring keeps no top or bottom inset of its own
          const ring = parts.rows[0].querySelector('div > div');
          assert.equal(parts.rows[0].style.paddingTop, t['border.width_02'] + 'px');
          assert.equal(ring.style.marginTop, '0px');
          assert.equal(ring.style.marginBottom, '0px');
        } else {
          assert.equal(parts.itemsContainer.style.flexDirection, 'row');
          assert.equal(parts.itemsContainer.style.columnGap, t['control.radio_group_gap_horizontal'] + 'px');
        }
        const enabledIndex = items.findIndex(function (item) {
          return item.value === selectedValue && item.disabled !== true;
        });
        const focusIndex = disabled ? -1 : enabledIndex !== -1 ? enabledIndex : items.findIndex(function (item) {
          return item.disabled !== true;
        });
        for (let index = 0; index < parts.rows.length; index = index + 1) {
          const item = items[index];
          const memberDisabled = disabled || item.disabled === true;
          assert.equal(parts.rows[index].getAttribute('aria-checked'), String(item.value === selectedValue), 'member ' + index);
          assert.equal(parts.rows[index].getAttribute('aria-disabled'), memberDisabled ? 'true' : null, 'member ' + index);
          assert.equal(parts.rows[index].getAttribute('tabindex'), memberDisabled || index !== focusIndex ? '-1' : '0', 'member ' + index + ' tabindex');
        }

        // The group's message: the error icon and text while invalid, else the helper
        const expected = invalid && typeof props.invalidText === 'string' ? [props.invalidText, 'field_message_invalid', true]
          : !invalid && typeof props.helperText === 'string' ? [props.helperText, disabled ? 'field_helper_disabled' : 'field_helper', false]
            : null;
        const describedby = parts.root.getAttribute('aria-describedby');
        if (expected === null) {
          assert.equal(describedby, null);
        } else {
          const text = document.getElementById(describedby);
          assert.notEqual(text, null, 'aria-describedby points at the rendered message');
          assert.equal(text.textContent, expected[0]);
          assert.equal(text.style.fontSize, t['type.field_helper'].fontSize + 'px');
          assert.equal(text.style.color, cssValue('color', t['color.' + expected[1]]));
          const row = text.parentElement;
          const icon = row.querySelector('svg');
          if (expected[2]) {
            assert.notEqual(icon, null);
            assert.equal(icon.getAttribute('fill'), t['color.selection_invalid_icon']);
            assert.equal(icon.parentElement.style.marginLeft, (t['spacing.spacing_01'] + t['border.width_01']) + 'px');
            assert.equal(icon.parentElement.style.marginRight, t['border.width_01'] + 'px');
            assert.equal(icon.parentElement.style.marginTop, '');
            assert.equal(text.style.marginLeft, t['spacing.spacing_03'] + 'px');
          } else {
            assert.equal(icon, null);
            assert.equal(text.style.marginLeft, '0px');
          }
          const expectedTop = vertical && items.length > 0 ? Math.max(0, t['spacing.spacing_01'] + t['spacing.spacing_02'] - t['control.radio_group_gap_vertical']) : t['spacing.spacing_01'] + t['spacing.spacing_02'];
          assert.equal(row.style.marginTop, expectedTop + 'px');
        }
      });
    }
  }

});


describe('RadioButtonGroup: selection through the DOM', function () {

  test('no selection starts with nothing checked and the first enabled member in the tab order', async function () {
    const parts = await renderGroup(registryFor('carbon'), { legendText: 'Options', items: ITEMS });
    for (let index = 0; index < parts.rows.length; index = index + 1) {
      assert.equal(parts.rows[index].getAttribute('aria-checked'), 'false');
      assert.equal(parts.rows[index].getAttribute('tabindex'), index === 0 ? '0' : '-1');
    }
  });

  test('a default value selects its member and gives it the tab stop', async function () {
    const parts = await renderGroup(registryFor('carbon'), { legendText: 'Options', defaultValue: 'beta', items: ITEMS });
    assert.equal(parts.rows[1].getAttribute('aria-checked'), 'true');
    assert.equal(parts.rows[1].getAttribute('tabindex'), '0');
    assert.equal(parts.rows[0].getAttribute('tabindex'), '-1');
    assert.equal(parts.rows[2].getAttribute('tabindex'), '-1');
  });

  test('an unknown controlled value checks nothing and invents no selection', async function () {
    const parts = await renderGroup(registryFor('carbon'), { legendText: 'Options', value: 'delta', items: ITEMS });
    for (const row of parts.rows) {
      assert.equal(row.getAttribute('aria-checked'), 'false');
    }
    // The tab stop falls back to the first enabled member
    assert.equal(parts.rows[0].getAttribute('tabindex'), '0');
  });

  test('a controlled group reports the next value but keeps its answer until the parent rerenders', async function () {
    const calls = [];
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container: container, root: root });
    const Registry = registryFor('carbon');
    await act(async function () {
      root.render(React.createElement(Registry.RadioButtonGroup, {
        legendText: 'Options',
        value: 'beta',
        onChange: function (next) { calls.push(next); },
        items: ITEMS
      }));
    });
    const rows = function () {
      return Array.prototype.slice.call(container.querySelectorAll('[role="radio"]'));
    };
    await act(async function () {
      rows()[2].click();
    });
    assert.deepEqual(calls, ['gamma'], 'the press reports gamma');
    assert.equal(rows()[1].getAttribute('aria-checked'), 'true', 'beta stays selected before the parent answers');
    assert.equal(rows()[2].getAttribute('aria-checked'), 'false');
    await act(async function () {
      root.render(React.createElement(Registry.RadioButtonGroup, {
        legendText: 'Options',
        value: 'gamma',
        onChange: function (next) { calls.push(next); },
        items: ITEMS
      }));
    });
    assert.equal(rows()[2].getAttribute('aria-checked'), 'true', 'the parent answer selects gamma');
    assert.equal(rows()[2].getAttribute('tabindex'), '0');
  });

  test('a numeric zero value selects and reports', async function () {
    const calls = [];
    const items = [{ value: 0, label: 'Zero' }, { value: 1, label: 'One' }];
    const parts = await renderGroup(registryFor('carbon'), { legendText: 'Options', defaultValue: 1, onChange: function (next) { calls.push(next); }, items: items });
    assert.equal(parts.rows[1].getAttribute('aria-checked'), 'true');
    await act(async function () {
      parts.rows[0].click();
    });
    assert.deepEqual(calls, [0]);
    assert.equal(parts.rows[0].getAttribute('aria-checked'), 'true');
    assert.equal(parts.rows[0].getAttribute('data-testid'), 'radio-group-number-0');
  });

  test('pressing the already-selected member reports nothing', async function () {
    const calls = [];
    const parts = await renderGroup(registryFor('carbon'), { legendText: 'Options', defaultValue: 'beta', onChange: function (next) { calls.push(next); }, items: ITEMS });
    await act(async function () {
      parts.rows[1].click();
    });
    assert.deepEqual(calls, []);
    assert.equal(parts.rows[1].getAttribute('aria-checked'), 'true');
  });

});


describe('RadioButtonGroup: keyboard navigation', function () {

  test('all four arrows move selection and focus, skipping disabled members and wrapping', async function () {
    const calls = [];
    const items = [ITEMS[0], { value: 'beta', label: 'Beta', disabled: true }, ITEMS[2]];
    const parts = await renderGroup(registryFor('carbon'), { legendText: 'Options', defaultValue: 'alpha', onChange: function (next) { calls.push(next); }, items: items });
    const rows = parts.rows;

    // ArrowDown from alpha skips disabled beta and selects gamma
    assert.equal(await keydown(rows[0], 'ArrowDown'), true);
    assert.equal(rows[2].getAttribute('aria-checked'), 'true');
    assert.equal(document.activeElement, rows[2]);

    // ArrowRight from gamma wraps to alpha
    assert.equal(await keydown(rows[2], 'ArrowRight'), true);
    assert.equal(rows[0].getAttribute('aria-checked'), 'true');
    assert.equal(document.activeElement, rows[0]);

    // ArrowLeft from alpha wraps and skips beta to land on gamma
    assert.equal(await keydown(rows[0], 'ArrowLeft'), true);
    assert.equal(rows[2].getAttribute('aria-checked'), 'true');
    assert.equal(document.activeElement, rows[2]);

    // ArrowUp from gamma skips beta to land on alpha
    assert.equal(await keydown(rows[2], 'ArrowUp'), true);
    assert.equal(rows[0].getAttribute('aria-checked'), 'true');
    assert.deepEqual(calls, ['gamma', 'alpha', 'gamma', 'alpha']);
  });

  test('Home and End jump to the first and last enabled members', async function () {
    const calls = [];
    const parts = await renderGroup(registryFor('carbon'), { legendText: 'Options', defaultValue: 'beta', onChange: function (next) { calls.push(next); }, items: ITEMS });
    assert.equal(await keydown(parts.rows[1], 'Home'), true);
    assert.equal(parts.rows[0].getAttribute('aria-checked'), 'true');
    assert.equal(document.activeElement, parts.rows[0]);
    assert.equal(await keydown(parts.rows[0], 'End'), true);
    assert.equal(parts.rows[2].getAttribute('aria-checked'), 'true');
    assert.equal(document.activeElement, parts.rows[2]);
    assert.deepEqual(calls, ['alpha', 'gamma']);
  });

  test('an unhandled key never prevents the default', async function () {
    const parts = await renderGroup(registryFor('carbon'), { legendText: 'Options', defaultValue: 'alpha', items: ITEMS });
    assert.equal(await keydown(parts.rows[0], 'x'), false);
    assert.equal(parts.rows[0].getAttribute('aria-checked'), 'true');
  });

  test('Tab focus alone records the member without selecting it', async function () {
    const calls = [];
    const parts = await renderGroup(registryFor('carbon'), { legendText: 'Options', onChange: function (next) { calls.push(next); }, items: ITEMS });
    await act(async function () {
      parts.rows[0].focus();
    });
    assert.equal(parts.rows[0].getAttribute('aria-checked'), 'false');
    assert.deepEqual(calls, []);
    // And focus movement by arrow then moves from the focused member
    await keydown(parts.rows[0], 'ArrowRight');
    assert.equal(parts.rows[1].getAttribute('aria-checked'), 'true');
  });

  test('a disabled group has no tab stop and reports nothing', async function () {
    const calls = [];
    const parts = await renderGroup(registryFor('carbon'), { legendText: 'Options', disabled: true, onChange: function (next) { calls.push(next); }, items: ITEMS });
    for (const row of parts.rows) {
      assert.equal(row.getAttribute('tabindex'), '-1');
    }
    assert.equal(await keydown(parts.rows[0], 'ArrowRight'), false);
    await act(async function () {
      parts.rows[0].click();
    });
    assert.deepEqual(calls, []);
    assert.equal(parts.rows[0].getAttribute('aria-checked'), 'false');
  });

  test('an all-disabled item set has no tab stop', async function () {
    const items = ITEMS.map(function (item) {
      return Object.assign({}, item, { disabled: true });
    });
    const parts = await renderGroup(registryFor('carbon'), { legendText: 'Options', items: items });
    for (const row of parts.rows) {
      assert.equal(row.getAttribute('tabindex'), '-1');
    }
    assert.equal(await keydown(parts.rows[0], 'ArrowDown'), false);
  });

  test('switching orientation keeps the checked value', async function () {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container: container, root: root });
    const Registry = registryFor('carbon');
    const element = function (orientation) {
      return React.createElement(Registry.RadioButtonGroup, {
        legendText: 'Options', defaultValue: 'beta', orientation: orientation, items: ITEMS
      });
    };
    await act(async function () {
      root.render(element('horizontal'));
    });
    assert.equal(container.querySelectorAll('[role="radio"]')[1].getAttribute('aria-checked'), 'true');
    await act(async function () {
      root.render(element('vertical'));
    });
    const rows = container.querySelectorAll('[role="radio"]');
    assert.equal(rows[1].getAttribute('aria-checked'), 'true');
    assert.equal(rows[1].getAttribute('tabindex'), '0');
  });

  test('reordering and removing items keeps the selection by value and a valid tab stop', async function () {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container: container, root: root });
    const Registry = registryFor('carbon');
    const element = function (items) {
      return React.createElement(Registry.RadioButtonGroup, { legendText: 'Options', defaultValue: 'beta', items: items });
    };
    await act(async function () {
      root.render(element(ITEMS));
    });
    const rows = function () {
      return Array.prototype.slice.call(container.querySelectorAll('[role="radio"]'));
    };
    // Reorder: beta still checked and still the tab stop at its new index
    await act(async function () {
      root.render(element([ITEMS[2], ITEMS[1], ITEMS[0]]));
    });
    assert.equal(rows()[0].getAttribute('aria-checked'), 'false');
    assert.equal(rows()[1].getAttribute('aria-checked'), 'true');
    assert.equal(rows()[1].getAttribute('tabindex'), '0');
    // Remove the selected member: nothing checked, the tab stop falls to the first enabled
    await act(async function () {
      root.render(element([ITEMS[2], ITEMS[0]]));
    });
    assert.equal(rows()[0].getAttribute('aria-checked'), 'false');
    assert.equal(rows()[1].getAttribute('aria-checked'), 'false');
    assert.equal(rows()[0].getAttribute('tabindex'), '0');
    // Arrow still moves and focuses the live members only: keydown arrives
    // from the member holding DOM focus, which is the first enabled row
    await act(async function () {
      rows()[0].focus();
    });
    await keydown(rows()[0], 'ArrowRight');
    assert.equal(rows()[1].getAttribute('aria-checked'), 'true');
    assert.equal(document.activeElement, rows()[1]);
  });

  test('typed member values keep distinct keys, generated ids and callback types through a reorder', async function () {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container: container, root: root });
    const Registry = registryFor('carbon');
    const calls = [];
    const items = [
      { value: 0, label: 'Number zero' },
      { value: '0', label: 'String zero' },
      { value: 'number-0', label: 'String number zero' }
    ];
    const element = function (list) {
      return React.createElement(Registry.RadioButtonGroup, { legendText: 'Options', onChange: function (next) { calls.push(next); }, items: list });
    };
    const rows = function () {
      return Array.prototype.slice.call(container.querySelectorAll('[role="radio"]'));
    };
    // A duplicate React key would warn through console.error - capture it
    const errors = [];
    const originalError = console.error;
    console.error = function (...args) {
      errors.push(args.join(' '));
    };
    try {
      await act(async function () {
        root.render(element(items));
      });
      await act(async function () {
        root.render(element([items[2], items[1], items[0]]));
      });
    } finally {
      console.error = originalError;
    }
    assert.deepEqual(errors.filter(function (entry) {
      return /same key|two children/i.test(entry);
    }), [], 'number 0 and string "0" must not collide as keys');
    // The typed generated ids stay distinct after the reorder
    const byId = function (id) {
      return rows().find(function (row) {
        return row.getAttribute('data-testid') === id;
      });
    };
    assert.deepEqual(rows().map(function (row) {
      return row.getAttribute('data-testid');
    }), ['radio-group-string-number-0', 'radio-group-string-0', 'radio-group-number-0']);
    // Selecting each reports its value with its own strict type
    await act(async function () {
      byId('radio-group-number-0').click();
      byId('radio-group-string-0').click();
      byId('radio-group-string-number-0').click();
    });
    assert.deepEqual(calls, [0, '0', 'number-0']);
    assert.equal(typeof calls[0], 'number');
    assert.equal(typeof calls[1], 'string');
    // Focus a member, then reorder again: selection and focus follow the
    // value's key, not the ordinal
    await act(async function () {
      byId('radio-group-number-0').focus();
    });
    assert.equal(byId('radio-group-number-0').getAttribute('aria-checked'), 'false', 'focus alone never selects');
    await act(async function () {
      root.render(element(items));
    });
    assert.equal(rows()[2].getAttribute('data-testid'), 'radio-group-string-number-0');
    assert.equal(rows()[2].getAttribute('aria-checked'), 'true', 'the selection followed string "number-0" through the reorder');
    assert.equal(document.activeElement.getAttribute('data-testid'), 'radio-group-number-0', 'DOM focus followed its member key');
  });

  test('an empty group is named and safe', async function () {
    const parts = await renderGroup(registryFor('carbon'), { legendText: 'Options' });
    assert.notEqual(parts.root, null);
    assert.equal(parts.root.getAttribute('aria-labelledby'), parts.legend.id);
    assert.equal(parts.rows.length, 0);
    assert.equal(await keydown(parts.root, 'ArrowDown'), false);
  });

  test('duplicate or invalid values throw a useful TypeError', async function () {
    const Registry = registryFor('carbon');
    await assert.rejects(async function () {
      await renderGroup(Registry, { legendText: 'Options', items: [{ value: 'alpha', label: 'A' }, { value: 'alpha', label: 'B' }] });
    }, /TypeError/);
    await assert.rejects(async function () {
      await renderGroup(Registry, { legendText: 'Options', items: [{ label: 'A' }] });
    }, /TypeError/);
    await assert.rejects(async function () {
      await renderGroup(Registry, { legendText: 'Options', items: [{ value: NaN, label: 'A' }] });
    }, /TypeError/);
    await assert.rejects(async function () {
      await renderGroup(Registry, { legendText: 'Options', items: [{ value: 'alpha' }] });
    }, /TypeError/);
  });

  test('a nested disabled FormGroup wins over the group and its items', async function () {
    const Registry = registryFor('carbon');
    const calls = [];
    const container = await render(React.createElement(Registry.FormGroup, { legendText: 'Outer', disabled: true },
      React.createElement(Registry.RadioButtonGroup, {
        legendText: 'Options',
        disabled: false,
        onChange: function (next) { calls.push(next); },
        items: [{ value: 'alpha', label: 'Alpha', disabled: false }]
      })));
    const row = container.querySelector('[role="radio"]');
    assert.equal(row.getAttribute('aria-disabled'), 'true');
    assert.equal(row.getAttribute('tabindex'), '-1');
    await act(async function () {
      row.click();
    });
    assert.deepEqual(calls, []);
  });

});


describe('RadioButtonGroup: the group gaps are theme answers', function () {

  test('a brand layer overriding the vertical gap changes the item spacing only', async function () {
    const t = buildNative('carbon').tokens;
    const custom = t['control.radio_group_gap_vertical'] + 10;
    const parts = await renderGroup(registryFor('carbon', { 'control.radio_group_gap_vertical': custom }), { legendText: 'Options', orientation: 'vertical', items: ITEMS });
    const wrappers = Array.prototype.slice.call(parts.itemsContainer.children);
    for (const wrapper of wrappers) {
      assert.equal(wrapper.style.marginBottom, custom + 'px');
    }
    // The horizontal gap is untouched
    const horizontal = await renderGroup(registryFor('carbon', { 'control.radio_group_gap_vertical': custom }), { legendText: 'Options', items: ITEMS });
    assert.equal(horizontal.itemsContainer.style.columnGap, t['control.radio_group_gap_horizontal'] + 'px');
  });

});
