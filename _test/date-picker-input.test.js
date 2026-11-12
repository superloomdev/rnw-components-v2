// Info: DatePickerInput node gates. The width answers to the picker's
// type (single 288, range 143.5 with the one-gap on the first, simple 120
// with the 152 message and 91.2 short forms), the icon answers to every
// type but simple, and the member refuses an unparented render.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as factories from 'rnw-components/all';
import { buildSystem } from './harness/system.js';
import { React, render } from './harness/render.js';

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
