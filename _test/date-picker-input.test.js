// Info: DatePickerInput node gates. The width answers to the picker's
// type (single 288, range 143.5 with the one-gap on the first, simple 120
// with the 152 message and 91.2 short forms), the icon answers to every
// type but simple, a disabled field draws its own outline and a read-only
// one its own fill and outline, and the member refuses an unparented render.

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cssValue, render } from './harness/render.js';

const Registry = buildSystem('default', factories);

async function picker (pickerProps, inputProps) {
  return render(React.createElement(Registry.DatePicker, pickerProps,
    React.createElement(Registry.DatePickerInput, Object.assign({ labelText: 'Date', testID: 'dpi' }, inputProps))));
}

test('DatePickerInput: a single picker gives the field the picker width and the calendar icon', async function () {
  const c = await picker({}, {});
  const root = c.querySelector('[data-testid="dpi"]');
  assert.equal(root.style.width, '288px');
});

test('DatePickerInput: range gives both fields the range width and the first the one gap', async function () {
  const c = await render(React.createElement(Registry.DatePicker, { datePickerType: 'range' },
    React.createElement(Registry.DatePickerInput, { labelText: 'Start', testID: 'dpi-s' }),
    React.createElement(Registry.DatePickerInput, { labelText: 'End', testID: 'dpi-e' })));
  assert.equal(c.querySelector('[data-testid="dpi-s"]').style.width, '143.5px');
  assert.equal(c.querySelector('[data-testid="dpi-s"]').style.marginRight, '1px');
  assert.equal(c.querySelector('[data-testid="dpi-e"]').style.marginRight, '0px');
  assert.equal(c.querySelector('[data-testid="dpi-e"]').style.width, '143.5px');
});

test('DatePickerInput: a simple picker gives the simple width, the message width and no icon', async function () {
  const c = await picker({ datePickerType: 'simple' }, {});
  assert.equal(c.querySelector('[data-testid="dpi"]').style.width, '120px');
  const flagged = await picker({ datePickerType: 'simple' }, { invalid: true, invalidText: 'No.' });
  assert.equal(flagged.querySelector('[data-testid="dpi"]').style.width, '152px');
  const short = await picker({ datePickerType: 'simple', short: true }, {});
  assert.equal(short.querySelector('[data-testid="dpi"]').style.width, '91.2px');
});

test('DatePickerInput: renders as a single picker without a parent', async function () {
  const c = await render(React.createElement(Registry.DatePickerInput, { labelText: 'Date', testID: 'dpi' }));
  assert.equal(c.querySelector('[data-testid="dpi"]').style.width, '288px');
});

describe('DatePickerInput: field states', function () {

  test('a disabled field draws its own outline and a read-only field its own fill and outline', async function () {
    for (const template of Object.keys(TEMPLATES)) {
      const t = buildNative(template).tokens;
      const registry = buildSystem(template, factories);
      const frameOf = async function (pickerProps, inputProps) {
        const c = await render(React.createElement(registry.DatePicker, pickerProps,
          React.createElement(registry.DatePickerInput, Object.assign({ labelText: 'Date', testID: 'dpi' }, inputProps))));
        return c.querySelector('[data-testid="dpi"] input').parentElement;
      };
      // _date-picker.scss:116-118 a disabled input's bottom border is transparent
      const disabled = await frameOf({}, { disabled: true });
      assert.equal(disabled.style.borderBottomColor, cssValue('borderBottomColor', t['color.date_picker_input_outline_disabled']), template + ' disabled outline');
      assert.equal(disabled.style.backgroundColor, cssValue('backgroundColor', t['color.field_container_disabled']), template + ' disabled fill');
      // _date-picker.scss:307-309 a read-only input is transparent over a subtle bottom border
      const viewOnly = await frameOf({ 'isReadOnly': true, value: '03/15/2024' }, {});
      assert.equal(viewOnly.style.backgroundColor, cssValue('backgroundColor', t['color.date_picker_input_container_readonly']), template + ' read-only fill');
      assert.equal(viewOnly.style.borderBottomColor, cssValue('borderBottomColor', t['color.date_picker_input_outline_readonly']), template + ' read-only outline');
      // An editable field keeps the family's resting cells
      const resting = await frameOf({}, {});
      assert.equal(resting.style.backgroundColor, cssValue('backgroundColor', t['color.field_container']), template + ' resting fill');
      assert.equal(resting.style.borderBottomColor, cssValue('borderBottomColor', t['color.field_outline']), template + ' resting outline');
    }
  });

});
