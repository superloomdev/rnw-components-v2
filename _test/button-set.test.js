// Info: ButtonSet molecule. A row - or a stacked column - of Buttons built
// from item data, each sharing the row up to the item ceiling with the
// theme's separator between; a fluid set sorts the items by kind, holds
// them to the row's end and stacks when the measured row is narrower than
// the items' floor.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

// The ResizeObserver the layout callback flows through is stubbed: the test
// feeds the row's width itself
let layoutCallback = null;
window.ResizeObserver = function (callback) {
  layoutCallback = callback;
  return { observe: function () {}, unobserve: function () {}, disconnect: function () {} };
};

afterEach(cleanup);


/********************************************************************
Render one ButtonSet and return its root and seats.

@param {Object} Registry - Registry
@param {Object} props    - ButtonSet props

@return {Promise<Object>} - { root, seats }
*********************************************************************/
async function renderSet (Registry, props) {

  const container = await render(React.createElement(Registry.ButtonSet, props));
  const root = container.firstChild;

  return { root: root, seats: Array.prototype.slice.call(root.children) };

}


/********************************************************************
Feed the row a layout width, as the platform's layout pass reports it.

@param {HTMLElement} root  - The set's root
@param {Number}    width  - The width to report

@return {Promise<void>}
*********************************************************************/
async function layOut (root, width) {

  // The platform's measure reads offset metrics, not getBoundingClientRect
  Object.defineProperty(root, 'offsetWidth', { configurable: true, value: width });
  Object.defineProperty(root, 'offsetHeight', { configurable: true, value: 48 });
  await act(async function () {
    layoutCallback([{ target: root }]);
    await new Promise(function (resolve) {
      setTimeout(resolve, 0);
    });
  });

}


const ITEMS = [
  { children: 'Cancel', kind: 'secondary' },
  { children: 'Save', kind: 'primary' }
];

const THREE = [
  { children: 'Save', kind: 'primary' },
  { children: 'Cancel', kind: 'secondary' },
  { children: 'Help', kind: 'ghost' }
];


for (const template of TEMPLATE_NAMES) {

  describe('ButtonSet / ' + template, function () {

    test('the row shares itself between seats up to the item ceiling, with the theme\'s gap', async function () {
      const t = buildNative(template).tokens;
      const { root, seats } = await renderSet(buildSystem(template, factories), { items: ITEMS });
      assert.equal(root.style.flexDirection, 'row', template);
      assert.equal(root.style.gap, t['control.button_set_gap'] + 'px', template);
      assert.equal(seats.length, 2);
      for (const seat of seats) {
        assert.equal(seat.style.flexGrow, '1', template);
        assert.equal(seat.style.flexBasis, '0px', template);
        assert.equal(seat.style.flexShrink, '1', template);
        assert.equal(seat.style.maxWidth, t['control.button_set_item_max_width'] + 'px', template);
      }
      // The first seat draws no separator
      assert.equal(seats[0].children.length, 1, template);
      assert.equal(seats[1].children.length, 2, template);
    });

    test('every seat but the first carries the separator at its leading edge', async function () {
      const t = buildNative(template).tokens;
      const { seats } = await renderSet(buildSystem(template, factories), { items: ITEMS });
      const separator = seats[1].children[1];
      assert.equal(separator.style.position, 'absolute', template);
      assert.equal(separator.style.left, -t['border.width_01'] + 'px', template);
      assert.equal(separator.style.width, t['border.width_01'] + 'px', template);
      assert.equal(separator.style.backgroundColor, cssValue('backgroundColor', t['color.button_set_separator']), template);
      assert.equal(separator.style.top, '0px', template);
      assert.equal(separator.style.bottom, '0px', template);
    });

    test('a disabled item\'s separator reads the disabled cell', async function () {
      const t = buildNative(template).tokens;
      const { seats } = await renderSet(buildSystem(template, factories), {
        items: [ITEMS[0], Object.assign({}, ITEMS[1], { disabled: true })]
      });
      assert.equal(seats[1].children[1].style.backgroundColor, cssValue('backgroundColor', t['color.button_set_separator_disabled']), template);
      assert.equal(seats[0].children.length, 1, template);
    });

    test('a focused item suppresses its own separator and the next one\'s', async function () {
      const t2 = buildNative(template).tokens;
      const { seats } = await renderSet(buildSystem(template, factories), { items: THREE });
      const second = seats[1].querySelector('[role="button"]');
      await act(async function () {
        second.focus();
      });
      assert.equal(seats[1].children[1].style.backgroundColor, 'rgba(0, 0, 0, 0)', 'focused item suppresses its own, ' + template);
      assert.equal(seats[2].children[1].style.backgroundColor, 'rgba(0, 0, 0, 0)', 'and the next seat\'s, ' + template);
      await act(async function () {
        second.blur();
      });
      assert.equal(seats[1].children[1].style.backgroundColor, cssValue('backgroundColor', t2['color.button_set_separator']), 'the seam returns on blur, ' + template);
    });

    test('a stacked set is a column of stretched seats with the separator across the top', async function () {
      const t = buildNative(template).tokens;
      const { root, seats } = await renderSet(buildSystem(template, factories), { stacked: true, items: ITEMS });
      assert.equal(root.style.flexDirection, 'column', template);
      assert.equal(seats[1].style.alignSelf, 'stretch', template);
      const separator = seats[1].children[1];
      assert.equal(separator.style.top, -t['border.width_01'] + 'px', template);
      assert.equal(separator.style.height, t['border.width_01'] + 'px', template);
      assert.equal(separator.style.left, '0px', template);
      const disabled = await renderSet(buildSystem(template, factories), {
        stacked: true,
        items: [ITEMS[0], Object.assign({}, ITEMS[1], { disabled: true })]
      });
      assert.equal(disabled.seats[1].children[1].style.backgroundColor, cssValue('backgroundColor', t['color.button_set_separator_stacked_disabled']), template);
    });

    test('a fluid set orders its items by kind and end-aligns them', async function () {
      const t = buildNative(template).tokens;
      const { root, seats } = await renderSet(buildSystem(template, factories), { fluid: true, items: THREE });
      assert.equal(root.style.justifyContent, 'flex-end', template);
      const labels = seats.map(function (seat) {
        return seat.textContent;
      });
      // Ghost, secondary, primary - the kind order, whatever the data's order
      assert.deepEqual(labels, ['Help', 'Cancel', 'Save'], template);
      // A fluid seat: a quarter of the row, floored, capped
      assert.equal(seats[0].style.flexBasis, '25%', template);
      assert.equal(seats[0].style.minWidth, t['control.button_set_fluid_min_width'] + 'px', template);
      assert.equal(seats[1].style.maxWidth, t['control.button_set_fluid_max_width'] + 'px', template);
      // The ghost item grows free of the ceiling with its own start padding
      assert.equal(seats[0].style.flexGrow, '1', template);
      assert.equal(seats[0].style.maxWidth, '', template);
      assert.equal(seats[0].querySelector('[role="button"]').style.paddingLeft, t['control.button_set_fluid_ghost_padding_start'] + 'px', template);
      assert.equal(seats[1].style.flexGrow, '0', template);
    });

    test('fluid thresholds: the row stacks under n floors, two items halve under four, one fills under three', async function () {
      const t = buildNative(template).tokens;
      const min = t['control.button_set_fluid_min_width'];
      // Three items: stacked at n floors, a row above
      const three = await renderSet(buildSystem(template, factories), { fluid: true, items: THREE });
      await layOut(three.root, 3 * min);
      assert.equal(three.root.style.flexDirection, 'column', 'n x min stacks, ' + template);
      assert.equal(three.seats[0].style.width, '100%', template);
      // The column reverses the order: the ghost seat is last, padded at the column start
      const ghostSeat = three.root.children[three.root.children.length - 1];
      assert.equal(ghostSeat.textContent, 'Help', 'reversed order, ' + template);
      assert.equal(ghostSeat.querySelector('[role="button"]').style.paddingLeft, t['spacing.spacing_05'] + 'px', 'the column ghost padding, ' + template);
      await layOut(three.root, 3 * min + 1);
      assert.equal(three.root.style.flexDirection, 'row', 'above it a row, ' + template);
      // Two items: 50% each and no ceiling at four floors, a quarter above
      const two = await renderSet(buildSystem(template, factories), { fluid: true, items: ITEMS });
      await layOut(two.root, 4 * min);
      assert.equal(two.seats[0].style.flexBasis, '50%', template);
      assert.equal(two.seats[0].style.maxWidth, '', template);
      await layOut(two.root, 4 * min + 1);
      assert.equal(two.seats[0].style.flexBasis, '25%', template);
      assert.equal(two.seats[0].style.maxWidth, t['control.button_set_fluid_max_width'] + 'px', template);
      // One item: the full row at three floors
      const one = await renderSet(buildSystem(template, factories), { fluid: true, items: [ITEMS[1]] });
      await layOut(one.root, 3 * min);
      assert.equal(one.seats[0].style.flexBasis, '100%', template);
      assert.equal(one.seats[0].style.maxWidth, '', template);
      await layOut(one.root, 3 * min + 1);
      assert.equal(one.seats[0].style.flexBasis, '25%', template);
    });

  });

}
