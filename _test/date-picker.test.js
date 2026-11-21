// Info: DatePicker node gates. The open calendar draws at the theme's
// geometry and colors (288 x 336, padding 4 / 4 / 8 / 4, the 246 day grid
// of 42 cells, the selected and in-range fills); a day press selects in
// `m/d/Y` and closes, a range takes its start then its end; the keyboard
// moves the tab stop by day and month and Escape closes; typed text sets
// the value; `simple`, read-only and disabled pickers never open; on a
// native platform under a `system` widget the host's adapter replaces the
// calendar, and a missing adapter draws the calendar and reports it.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import { Lib, TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

afterEach(cleanup);

const DATE = Object.freeze({ labelText: 'Date', placeholder: 'mm/dd/yyyy' });
const PAIR = Object.freeze([{ labelText: 'Start date' }, { labelText: 'End date' }]);


/********************************************************************
Render one DatePicker and return lookups into it.

@param {Object} props      - DatePicker props (one `Date` field by default)
@param {Object} [Registry] - Registry; carbon by default

@return {Promise<Object>} - { container, calendar, input, parts }
*********************************************************************/
async function renderPicker (props, Registry) {

  const registry = Registry || buildSystem('carbon', factories);
  const container = await render(React.createElement(registry.DatePicker, Object.assign({ inputs: [DATE] }, props)));
  return {
    container: container,
    calendar: function () {
      return container.querySelector('[data-part="calendar"]');
    },
    input: function (index) {
      return container.querySelectorAll('[data-part="input"] input')[index || 0];
    },
    parts: function (name) {
      return Array.from(container.querySelectorAll('[data-part="' + name + '"]'));
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


/********************************************************************
Click an element inside act.

@param {HTMLElement} element - Target
*********************************************************************/
async function click (element) {

  await act(async function () {
    element.click();
  });

}


describe('DatePicker: the open calendar', function () {

  test('draws at the theme\'s geometry with the March 2024 grid and the selected day', async function () {
    const t = buildNative('carbon').tokens;
    const p = await renderPicker({ open: true, value: '03/15/2024' });
    const calendar = p.calendar();
    assert.equal(calendar.style.width, t['control.date_picker_calendar_width'] + 'px');
    assert.equal(calendar.style.height, t['control.date_picker_calendar_height'] + 'px');
    assert.equal(calendar.style.height, '336px');
    assert.equal(calendar.style.paddingTop, t['control.date_picker_calendar_padding_top'] + 'px');
    assert.equal(calendar.style.paddingBottom, t['control.date_picker_calendar_padding_bottom'] + 'px');
    assert.equal(calendar.style.paddingLeft, t['control.date_picker_calendar_padding_inline'] + 'px');
    assert.equal(calendar.style.backgroundColor, cssValue('backgroundColor', t['color.date_picker_calendar_container']));
    assert.equal(p.parts('days')[0].style.height, t['control.date_picker_days_height'] + 'px');
    assert.equal(p.parts('monthLabel')[0].textContent, 'March');
    assert.equal(p.parts('monthLabel')[0].style.marginLeft, t['control.date_picker_month_gap'] + 'px');
    assert.equal(p.parts('year')[0].textContent, '2024');
    assert.equal(p.parts('year')[0].style.minWidth, t['control.date_picker_year_width'] + 'px');
    assert.equal(p.parts('year')[0].style.paddingTop, t['control.date_picker_year_padding'] + 'px');
    assert.deepEqual(p.parts('weekday').map(function (node) {
      return node.textContent;
    }), ['S', 'M', 'T', 'W', 'Th', 'F', 'S']);
    // March 2024 opens on a Friday: five February days lead, six April days close the six weeks
    const cells = p.container.querySelectorAll('[role="gridcell"]');
    assert.equal(cells.length, 42);
    assert.equal(cells[0].textContent, '25');
    assert.equal(p.parts('outside').length, 11);
    assert.equal(cells[5].style.width, t['control.date_picker_day_size'] + 'px');
    const selected = p.parts('selected');
    assert.deepEqual(selected.map(function (node) {
      return node.textContent;
    }), ['15']);
    assert.equal(selected[0].style.backgroundColor, cssValue('backgroundColor', t['color.date_picker_day_container_selected']));
    assert.equal(selected[0].querySelector('[dir="auto"]').style.color, cssValue('color', t['color.date_picker_day_label_selected']));
    assert.equal(p.parts('outside')[0].querySelector('[dir="auto"]').style.color, cssValue('color', t['color.date_picker_day_label_outside']));
  });

  test('a range draws its two ends selected and the days between in the range fill', async function () {
    const t = buildNative('carbon').tokens;
    const p = await renderPicker({ datePickerType: 'range', inputs: PAIR, open: true, value: ['03/12/2024', '03/18/2024'] });
    assert.deepEqual(p.parts('selected').map(function (node) {
      return node.textContent;
    }), ['12', '18']);
    const between = p.parts('inRange');
    assert.deepEqual(between.map(function (node) {
      return node.textContent;
    }), ['13', '14', '15', '16', '17']);
    assert.equal(between[0].style.backgroundColor, cssValue('backgroundColor', t['color.date_picker_day_container_range']));
  });

});


describe('DatePicker: selection and keyboard', function () {

  test('focus opens; a day press reports m/d/Y, fills the field and closes', async function () {
    const calls = [];
    const p = await renderPicker({ defaultValue: '03/15/2024', onChange: function (value) {
      calls.push(value);
    } });
    assert.equal(p.calendar() === null, true);
    await act(async function () {
      p.input().focus();
    });
    assert.equal(p.calendar() === null, false);
    await click(p.container.querySelector('[aria-label="March 20, 2024"]'));
    assert.deepEqual(calls, ['03/20/2024']);
    assert.equal(p.calendar() === null, true);
    assert.equal(p.input().value, '03/20/2024');
  });

  test('a range takes its start, then its end in date order, and closes', async function () {
    const calls = [];
    const p = await renderPicker({ datePickerType: 'range', inputs: PAIR, defaultValue: ['03/12/2024', ''], open: true, onChange: function (value) {
      calls.push(value);
    } });
    await click(p.container.querySelector('[aria-label="March 8, 2024"]'));
    assert.deepEqual(calls, [['03/08/2024', '03/12/2024']]);
  });

  test('arrows move the tab stop, PageDown turns the month, Escape closes', async function () {
    const p = await renderPicker({ defaultValue: '03/15/2024' });
    await act(async function () {
      p.input().focus();
    });
    const stop = function () {
      return p.container.querySelector('[role="gridcell"][tabindex="0"]');
    };
    assert.equal(stop().getAttribute('aria-label'), 'March 15, 2024');
    await press(stop(), 'ArrowRight');
    assert.equal(stop().getAttribute('aria-label'), 'March 16, 2024');
    await press(stop(), 'ArrowDown');
    assert.equal(stop().getAttribute('aria-label'), 'March 23, 2024');
    await press(stop(), 'PageDown');
    assert.equal(p.parts('monthLabel')[0].textContent, 'April');
    assert.equal(stop().getAttribute('aria-label'), 'April 23, 2024');
    await press(stop(), 'Escape');
    assert.equal(p.calendar() === null, true);
  });

  test('typed text sets the value once it parses', async function () {
    const calls = [];
    const p = await renderPicker({ onChange: function (value) {
      calls.push(value);
    } });
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    await act(async function () {
      setter.call(p.input(), '3/5/202');
      p.input().dispatchEvent(new Event('input', { bubbles: true }));
    });
    assert.deepEqual(calls, []);
    await act(async function () {
      setter.call(p.input(), '3/5/2024');
      p.input().dispatchEvent(new Event('input', { bubbles: true }));
    });
    assert.deepEqual(calls, ['03/05/2024']);
  });

  test('simple, read-only and disabled pickers never open', async function () {
    for (const props of [{ datePickerType: 'simple' }, { 'isReadOnly': true }, { disabled: true }]) {
      const p = await renderPicker(Object.assign({ open: true }, props));
      assert.equal(p.calendar() === null, true, JSON.stringify(props));
      await cleanup();
    }
  });

});


describe('DatePicker: the native system widget', function () {

  // A stub OS date picker that records the props it receives
  function StubPicker (props) {
    StubPicker.calls.push(props);
    return React.createElement('div', { 'data-stub': 'date-picker' });
  }
  StubPicker.calls = [];

  // carbon on iOS asks for the system widget
  function nativeRegistry (adapters, config) {
    const built = Lib.Themer.buildTheme(TEMPLATES.carbon, [], 'native', { variant: { form: 'expanded', platform: 'ios' } });
    const lib = Object.assign({}, Lib, {
      ReactNative: Object.assign({}, Lib.ReactNative, { Platform: { OS: 'ios' } }),
      adapters: adapters
    });
    return buildSystem('carbon', factories, { built: built, config: config || {}, lib: lib });
  }

  test('the host adapter takes the field\'s seat with the date and no calendar draws', async function () {
    StubPicker.calls = [];
    const p = await renderPicker({ open: true, value: '03/15/2024' }, nativeRegistry({ DatePicker: StubPicker }));
    assert.equal(p.calendar() === null, true);
    assert.equal(p.container.querySelectorAll('[data-stub="date-picker"]').length, 1);
    const last = StubPicker.calls[StubPicker.calls.length - 1];
    assert.equal(last.mode, 'date');
    assert.equal(last.value.getFullYear() + '-' + last.value.getMonth() + '-' + last.value.getDate(), '2024-2-15');
  });

  test('without the adapter the calendar draws and adapter_missing is reported', async function () {
    const records = [];
    const p = await renderPicker({ open: true, value: '03/15/2024' }, nativeRegistry(undefined, { onDiagnostic: function (record) {
      records.push(record);
    } }));
    assert.equal(p.calendar() === null, false);
    assert.deepEqual(records, [{ adapter: 'DatePicker', code: 'adapter_missing', component: 'DatePicker' }]);
  });

});
