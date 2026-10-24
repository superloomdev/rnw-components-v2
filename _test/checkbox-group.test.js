// Info: CheckboxGroup molecule. Every sample state renders under all three
// templates with its legend, item rows and group message read from the
// theme's field and selection cells; items carry their own checked meaning
// while the group owns invalid presentation, the message and the disabled
// inheritance; the accessibility answer is a named group of checkboxes
// wired to its message.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/checkbox/sample.checkbox-group.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

const ITEMS = [
  { id: 'alpha', label: 'Alpha' },
  { id: 'beta', label: 'Beta' },
  { id: 'gamma', label: 'Gamma' }
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
Render one CheckboxGroup and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - CheckboxGroup props

@return {Promise<Object>} - { root, legend, rows, message, messageIcon }
*********************************************************************/
async function renderGroup (Registry, props) {

  const container = await render(React.createElement(Registry.CheckboxGroup, props));
  const root = container.querySelector('[role="group"]');
  const rows = Array.prototype.slice.call(root.querySelectorAll('[role="checkbox"]'));

  return {
    container: container,
    root: root,
    legend: root.children[0],
    rows: rows,
    rowWrappers: rows.map(function (row) {
      // press layer -> painted row -> member root -> the group's row wrapper
      return row.parentElement.parentElement.parentElement;
    })
  };

}


/********************************************************************
Dispatch one DOM event on an element inside act.

@param {HTMLElement} element - Target
@param {Event}       event   - Event
*********************************************************************/
async function fire (element, event) {

  await act(async function () {
    element.dispatchEvent(event);
  });

}


describe('CheckboxGroup: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': legend, rows and message come from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const items = props.items || [];
        const disabled = props.disabled === true;
        const invalid = props.invalid === true && !disabled;
        const parts = await renderGroup(registryFor(template), props);

        // The group root is a named group wired to its legend
        assert.equal(parts.legend.textContent, props.legendText);
        assert.equal(parts.root.getAttribute('aria-labelledby'), parts.legend.id);
        assert.equal(parts.legend.style.fontSize, t['type.field_label'].fontSize + 'px');
        assert.equal(parts.legend.style.color, cssValue('color', t['color.' + (disabled ? 'field_label_disabled' : 'field_label')]));
        assert.equal(parts.legend.style.marginBottom, t['spacing.spacing_03'] + 'px');
        assert.equal(parts.root.getAttribute('aria-disabled'), disabled ? 'true' : null);
        assert.equal(parts.root.getAttribute('aria-invalid'), props.invalid === true ? 'true' : null);

        // The rows keep the group gap on every row and the first-row overlap
        assert.equal(parts.rows.length, items.length);
        for (let index = 0; index < parts.rowWrappers.length; index = index + 1) {
          assert.equal(parts.rowWrappers[index].style.marginBottom, t['control.checkbox_group_gap'] + 'px');
          assert.equal(parts.rowWrappers[index].style.marginTop, (index === 0 ? -t['spacing.spacing_01'] : 0) + 'px');
          // The members mount no messages of their own: each row wrapper
          // holds exactly the control's root
          assert.equal(parts.rowWrappers[index].children.length, 1);
          assert.equal(parts.rowWrappers[index].children[0].children.length, 1);
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
            assert.equal(icon.getAttribute('width'), t['size.icon_01'] + '');
            assert.equal(icon.parentElement.style.marginLeft, (t['spacing.spacing_01'] + t['border.width_01']) + 'px');
            assert.equal(icon.parentElement.style.marginRight, t['border.width_01'] + 'px');
            assert.equal(icon.parentElement.style.marginTop, t['border.width_01'] + 'px');
            assert.equal(text.style.marginLeft, t['spacing.spacing_03'] + 'px');
          } else {
            assert.equal(icon, null);
            assert.equal(text.style.marginLeft, '0px');
          }
          // The message gap shares the last row's bottom margin when rows precede it
          const expectedTop = items.length === 0 ? t['spacing.spacing_02'] : Math.max(0, t['spacing.spacing_02'] - t['control.checkbox_group_gap']);
          assert.equal(row.style.marginTop, expectedTop + 'px');
        }
      });
    }
  }

});


describe('CheckboxGroup: item state through the DOM', function () {

  test('an uncontrolled defaultChecked item toggles on press and calls its callback once', async function () {
    const calls = [];
    const items = [
      { id: 'alpha', label: 'Alpha', defaultChecked: true, onChange: function (next) { calls.push(next); } },
      { id: 'beta', label: 'Beta' }
    ];
    const parts = await renderGroup(registryFor('carbon'), { legendText: 'Options', items: items });
    assert.equal(parts.rows[0].getAttribute('aria-checked'), 'true');
    await act(async function () {
      parts.rows[0].click();
    });
    assert.equal(parts.rows[0].getAttribute('aria-checked'), 'false');
    assert.deepEqual(calls, [false]);
  });

  test('a controlled item keeps its checked answer until the parent rerenders', async function () {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container: container, root: root });
    const Registry = registryFor('carbon');
    await act(async function () {
      root.render(React.createElement(Registry.CheckboxGroup, {
        legendText: 'Options',
        items: [{ id: 'alpha', label: 'Alpha', checked: true }]
      }));
    });
    const row = container.querySelector('[role="checkbox"]');
    await act(async function () {
      row.click();
    });
    assert.equal(row.getAttribute('aria-checked'), 'true', 'a controlled item does not toggle itself');
  });

  test('an indeterminate item announces mixed; the group still names itself', async function () {
    const parts = await renderGroup(registryFor('carbon'), {
      legendText: 'Options',
      items: [
        { id: 'alpha', label: 'Alpha', indeterminate: true },
        { id: 'beta', label: 'Beta' }
      ]
    });
    assert.equal(parts.rows[0].getAttribute('aria-checked'), 'mixed');
    assert.equal(parts.rows[1].getAttribute('aria-checked'), 'false');
  });

  test('a disabled group suppresses every item callback, even an item passing disabled: false', async function () {
    const calls = [];
    const parts = await renderGroup(registryFor('carbon'), {
      legendText: 'Options',
      disabled: true,
      items: [
        { id: 'alpha', label: 'Alpha', disabled: false, onChange: function (next) { calls.push('alpha:' + next); } },
        { id: 'beta', label: 'Beta', onChange: function (next) { calls.push('beta:' + next); } }
      ]
    });
    assert.equal(parts.rows[0].getAttribute('aria-disabled'), 'true');
    assert.equal(parts.rows[1].getAttribute('aria-disabled'), 'true');
    await act(async function () {
      parts.rows[0].click();
      parts.rows[1].click();
    });
    assert.deepEqual(calls, []);
    assert.equal(parts.rows[0].getAttribute('aria-checked'), 'false');
  });

  test('reordering stable ids preserves the uncontrolled checked state', async function () {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container: container, root: root });
    const Registry = registryFor('carbon');
    const element = function (items) {
      return React.createElement(Registry.CheckboxGroup, { legendText: 'Options', items: items });
    };
    await act(async function () {
      root.render(element(ITEMS));
    });
    const rows = function () {
      return Array.prototype.slice.call(container.querySelectorAll('[role="checkbox"]'));
    };
    await act(async function () {
      rows()[1].click();
    });
    // Reorder: gamma, beta, alpha - beta stays checked under its own id
    await act(async function () {
      root.render(element([ITEMS[2], ITEMS[1], ITEMS[0]]));
    });
    const reordered = rows();
    assert.equal(reordered[0].getAttribute('aria-checked'), 'false');
    assert.equal(reordered[1].getAttribute('aria-checked'), 'true');
    assert.equal(reordered[2].getAttribute('aria-checked'), 'false');
  });

  test('an id of __proto__ behaves like any stable id', async function () {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    mounted.push({ container: container, root: root });
    const Registry = registryFor('carbon');
    const calls = [];
    const proto = { id: '__proto__', label: 'Proto', defaultChecked: true, onChange: function (next) { calls.push(next); } };
    const other = { id: 'other', label: 'Other' };
    const element = function (items) {
      return React.createElement(Registry.CheckboxGroup, { legendText: 'Options', items: items });
    };
    await act(async function () {
      root.render(element([proto, other]));
    });
    const rows = function () {
      return Array.prototype.slice.call(container.querySelectorAll('[role="checkbox"]'));
    };
    assert.equal(rows()[0].getAttribute('data-testid'), 'checkbox-group-__proto__');
    assert.equal(rows()[0].getAttribute('aria-checked'), 'true');
    await act(async function () {
      rows()[0].click();
    });
    assert.equal(rows()[0].getAttribute('aria-checked'), 'false');
    assert.deepEqual(calls, [false]);
    // Reorder: the __proto__ item keeps its own unchecked state
    await act(async function () {
      root.render(element([other, proto]));
    });
    assert.equal(rows()[1].getAttribute('data-testid'), 'checkbox-group-__proto__');
    assert.equal(rows()[1].getAttribute('aria-checked'), 'false');
  });

  test('an empty group renders the named group with no controls', async function () {
    const parts = await renderGroup(registryFor('carbon'), { legendText: 'Options' });
    assert.notEqual(parts.root, null);
    assert.equal(parts.root.getAttribute('aria-labelledby'), parts.legend.id);
    assert.equal(parts.rows.length, 0);
  });

  test('duplicate or malformed item ids throw a useful TypeError', async function () {
    const Registry = registryFor('carbon');
    await assert.rejects(async function () {
      await renderGroup(Registry, { legendText: 'Options', items: [{ id: 'alpha', label: 'A' }, { id: 'alpha', label: 'B' }] });
    }, /TypeError/);
    await assert.rejects(async function () {
      await renderGroup(Registry, { legendText: 'Options', items: [{ label: 'A' }] });
    }, /TypeError/);
    await assert.rejects(async function () {
      await renderGroup(Registry, { legendText: 'Options', items: [{ id: 'alpha' }] });
    }, /TypeError/);
  });

  test('a nested disabled FormGroup wins over the group and its items', async function () {
    const Registry = registryFor('carbon');
    const calls = [];
    const container = await render(React.createElement(Registry.FormGroup, { legendText: 'Outer', disabled: true },
      React.createElement(Registry.CheckboxGroup, {
        legendText: 'Options',
        disabled: false,
        items: [{ id: 'alpha', label: 'Alpha', disabled: false, onChange: function (next) { calls.push(next); } }]
      })));
    const row = container.querySelector('[role="checkbox"]');
    assert.equal(row.getAttribute('aria-disabled'), 'true');
    await act(async function () {
      row.click();
    });
    assert.deepEqual(calls, []);
  });

});


describe('CheckboxGroup: the group gap is a theme answer', function () {

  test('a brand layer overriding the group gap changes the row spacing only', async function () {
    const t = buildNative('carbon').tokens;
    const custom = t['control.checkbox_group_gap'] + 10;
    const parts = await renderGroup(registryFor('carbon', { 'control.checkbox_group_gap': custom }), { legendText: 'Options', items: ITEMS });
    for (const wrapper of parts.rowWrappers) {
      assert.equal(wrapper.style.marginBottom, custom + 'px');
    }
    // The first-row overlap is its own metric, unaffected by the gap override
    assert.equal(parts.rowWrappers[0].style.marginTop, -t['spacing.spacing_01'] + 'px');
  });

});
