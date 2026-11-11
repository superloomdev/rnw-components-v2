// Info: DatePickerSkeleton node gates. The bars measure off the spec sheet:
// the single bar the short input cell, the range bars the range input cell
// with the 1px end margin upstream carries; `hideLabel` drops the label
// placeholders.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as factories from 'rnw-components/all';
import { buildSystem } from './harness/system.js';
import { React, render } from './harness/render.js';

const Registry = buildSystem('default', factories);

async function skeleton (props) {
  return render(React.createElement(Registry.DatePickerSkeleton, props));
}

test('DatePickerSkeleton: the single bar is the short input width and field height', async function () {
  const c = await skeleton({});
  const input = c.querySelector('[data-testid="date-picker-skeleton-input"]');
  assert.equal(input.style.width, '91.2px');
  assert.equal(input.style.height, '40px');
  assert.equal(input.style.backgroundColor, 'rgb(224, 224, 224)');
});

test('DatePickerSkeleton: the label bar reads the field skeleton label cells', async function () {
  const c = await skeleton({});
  const label = c.querySelector('[data-testid="date-picker-skeleton-label"]');
  assert.equal(label.style.width, '75px');
  assert.equal(label.style.height, '14px');
});

test('DatePickerSkeleton: range draws two pickers at the range width with the one gap', async function () {
  const c = await skeleton({ range: true });
  const containers = c.querySelectorAll('[data-part="container"]');
  assert.equal(containers.length, 2);
  assert.equal(containers[0].style.width, '143.5px');
  assert.equal(containers[0].style.marginRight, '1px');
  assert.equal(containers[1].style.width, '143.5px');
  const inputs = c.querySelectorAll('[data-testid="date-picker-skeleton-input"]');
  assert.equal(inputs.length, 2);
  assert.equal(inputs[0].style.width, '143.5px');
});

test('DatePickerSkeleton: hideLabel drops the label placeholders only', async function () {
  const c = await skeleton({ hideLabel: true });
  assert.equal(c.querySelector('[data-testid="date-picker-skeleton-label"]'), null);
  assert.notEqual(c.querySelector('[data-testid="date-picker-skeleton-input"]'), null);
});
