// Info: TimePickerSelect composite member. It mounts only inside a
// TimePicker - alone it fails loudly - and inside it is a compact select
// named `Choose time option` unless the owner says otherwise, uncontrolled
// at the first item, reporting `onChange`; the parent's label names the
// trigger and the parent's disabled and size flow to it.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/text-input/sample.time-picker-select.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

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
Mount a TimePickerSelect inside its TimePicker parent.

@param {Object} Registry    - Registry
@param {Object} memberProps - TimePickerSelect props
@param {Object} parentProps - TimePicker props

@return {Promise<HTMLElement>} - The container
*********************************************************************/
async function renderMember (Registry, memberProps, parentProps) {

  return render(React.createElement(Registry.TimePicker, Object.assign({ label: 'Time', value: '12:00' }, parentProps || {}),
    React.createElement(Registry.TimePickerSelect, memberProps)));

}


describe('TimePickerSelect: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': a compact combobox inside the parent', async function () {
        const Registry = registryFor(template);
        const wrapper = state.wrappers[0];
        const container = await renderMember(Registry, state.props, wrapper.props);
        const trigger = container.querySelector('[role="combobox"]');
        assert.ok(trigger, 'the member is a combobox trigger');
        assert.equal(trigger.getAttribute('aria-label'), state.props.accessibilityLabel || 'Choose time option');
        // The member keeps its own accessible name; no labelledby reaches for
        // the field's label and overrides it
        assert.equal(trigger.getAttribute('aria-labelledby'), null, 'no overriding labelledby');
        assert.equal(/NaN/.test(container.innerHTML), false, 'compact geometry never emits NaN');
        const parentDisabled = state.props.disabled === true || wrapper.props.disabled === true;
        assert.equal(trigger.getAttribute('aria-disabled'), parentDisabled ? 'true' : null);
      });
    }
  }

});

describe('TimePickerSelect: the member contract', function () {

  test('standalone it fails loudly, naming the missing parent', async function () {
    const Registry = registryFor('carbon');
    await assert.rejects(
      render(React.createElement(Registry.TimePickerSelect, { items: [{ value: 'AM', label: 'AM' }] })),
      /TimePicker.*inside a TimePicker Provider/
    );
  });

  test('uncontrolled it selects the first item, like a native select', async function () {
    const container = await renderMember(registryFor('carbon'), {
      items: [{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }]
    });
    const trigger = container.querySelector('[role="combobox"]');
    assert.ok(trigger.textContent.includes('AM'), 'first item selected');
  });

  test('defaultValue applies once; onChange reports the picked value', async function () {
    const calls = [];
    const container = await renderMember(registryFor('carbon'), {
      defaultValue: 'PM',
      items: [{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }],
      onChange: function (next) { calls.push(next); }
    });
    const trigger = container.querySelector('[role="combobox"]');
    assert.ok(trigger.textContent.includes('PM'), 'defaultValue shown');
    await act(async function () {
      trigger.click();
    });
    const option = Array.from(container.querySelectorAll('[role="option"]')).find(function (el) {
      return el.textContent.includes('AM');
    });
    assert.ok(option, 'list opened');
    await act(async function () {
      option.click();
    });
    assert.deepEqual(calls, ['AM']);
    assert.ok(trigger.textContent.includes('AM'));
  });

  test('a disabled member announces it; a disabled parent disables it', async function () {
    const own = await renderMember(registryFor('material'), { disabled: true, items: [{ value: 'AM', label: 'AM' }] });
    assert.equal(own.querySelector('[role="combobox"]').getAttribute('aria-disabled'), 'true');
    const inherited = await renderMember(registryFor('material'), { items: [{ value: 'AM', label: 'AM' }] }, { disabled: true });
    assert.equal(inherited.querySelector('[role="combobox"]').getAttribute('aria-disabled'), 'true');
  });

  test('two members keep distinct names under one parent label', async function () {
    const Registry = registryFor('carbon');
    const container = await render(React.createElement(Registry.TimePicker, { label: 'Time', value: '12:00' },
      React.createElement(Registry.TimePickerSelect, { accessibilityLabel: 'Period', items: [{ value: 'AM', label: 'AM' }] }),
      React.createElement(Registry.TimePickerSelect, { accessibilityLabel: 'Time zone', items: [{ value: 'UTC', label: 'UTC' }] })));
    const triggers = Array.from(container.querySelectorAll('[role="combobox"]'));
    assert.equal(triggers.length, 2);
    assert.equal(triggers[0].getAttribute('aria-label'), 'Period');
    assert.equal(triggers[1].getAttribute('aria-label'), 'Time zone');
    for (const trigger of triggers) {
      assert.equal(trigger.getAttribute('aria-labelledby'), null, 'no labelledby overrides the member name');
    }
  });

});
