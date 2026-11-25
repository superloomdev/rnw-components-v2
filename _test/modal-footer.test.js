// Info: ModalFooter member. Its cells and roles through a standalone
// render: the stretched actions height, the ratio seat per button
// (`control.dialog_action_ratio`, `_three` for the three-button layout
// pushed to the end) with the button's min-content floor, the action padding, the secondary and primary
// kinds, the danger primary and the loading InlineLoading.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES).concat('shapes');

// The ResizeObserver the layout callback flows through is stubbed: the test
// feeds a measured width itself
let layoutCallback = null;
window.ResizeObserver = function (callback) {
  layoutCallback = callback;
  return { observe: function () {}, unobserve: function () {}, disconnect: function () {} };
};

afterEach(cleanup);

describe('ModalFooter: the member draws its cells', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': two actions split the action ratio at the actions height', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const rendered = await render(React.createElement(Registry.ModalFooter, { primaryButtonText: 'Save', secondaryButtonText: 'Cancel' }));
      const footer = rendered.firstElementChild;
      assert.equal(footer.style.minHeight, t['control.dialog_actions_height'] + 'px');
      assert.equal(footer.children.length, 2);
      for (const seat of footer.children) {
        assert.equal(seat.style.flexBasis, (t['control.dialog_action_ratio'] * 100) + '%', 'each action takes the ratio');
        assert.equal(seat.style.flexGrow, '0');
        assert.equal(seat.style.flexShrink, '0');
        assert.equal(seat.style.minWidth, '', 'no floor before the button has measured');
      }
      const buttons = footer.querySelectorAll('[role="button"]');
      // The label a reader gets: the button's hidden min-content copy is not
      const label = function (button) {
        return Array.from(button.children).filter(function (child) {
          return child.getAttribute('aria-hidden') !== 'true';
        }).map(function (child) {
          return child.textContent;
        }).join('');
      };
      assert.equal(label(buttons[0]), 'Cancel');
      assert.equal(label(buttons[1]), 'Save');
      assert.equal(buttons[1].style.backgroundColor, cssValue('backgroundColor', t['color.button_primary_container']), 'the last is the primary');
      assert.equal(buttons[0].style.backgroundColor, cssValue('backgroundColor', t['color.button_secondary_container']), 'the rest are secondaries');
      assert.equal(buttons[1].style.paddingTop, t['control.dialog_action_padding_top'] + 'px');
      assert.equal(buttons[1].style.paddingBottom, t['control.dialog_action_padding_bottom'] + 'px');
      await cleanup();
    });

    test(template + ': every seat but the first draws the button-set separator', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const rendered = await render(React.createElement(Registry.ModalFooter, { primaryButtonText: 'Save', secondaryButtonText: 'Cancel' }));
      const footer = rendered.firstElementChild;
      assert.equal(footer.children[0].children.length, 1, 'the first seat draws no separator');
      const separator = footer.children[1].children[1];
      assert.equal(separator.style.backgroundColor, cssValue('backgroundColor', t['color.button_set_separator']));
      assert.equal(separator.style.left, -t['border.width_01'] + 'px');
      assert.equal(separator.style.width, t['border.width_01'] + 'px');
      const buttons = footer.querySelectorAll('[role="button"]');
      await act(async function () {
        buttons[0].focus();
      });
      assert.equal(separator.style.backgroundColor, 'rgba(0, 0, 0, 0)', 'a focused neighbour suppresses the seam');
      await act(async function () {
        buttons[0].blur();
      });
      assert.equal(separator.style.backgroundColor, cssValue('backgroundColor', t['color.button_set_separator']), 'the seam returns on blur');
      await cleanup();
    });

    test(template + ': the three-button layout takes the three ratio, pushed to the end', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const rendered = await render(React.createElement(Registry.ModalFooter, {
        primaryButtonText: 'Save',
        secondaryButtons: [{ buttonText: 'Keep both' }, { buttonText: 'Cancel' }]
      }));
      const footer = rendered.firstElementChild;
      assert.equal(footer.children.length, 3);
      for (const seat of footer.children) {
        assert.equal(seat.style.flexBasis, (t['control.dialog_action_ratio_three'] * 100) + '%');
        assert.equal(seat.style.flexShrink, '0');
      }
      assert.equal(footer.style.justifyContent, 'flex-end', 'pushed to the end');
      await cleanup();
    });

    test(template + ': a stretched action is never narrower than its min-content width', async function () {
      const Registry = buildSystem(template, factories);
      const rendered = await render(React.createElement(Registry.ModalFooter, {
        primaryButtonText: 'Save',
        secondaryButtons: [{ buttonText: 'Keep both' }, { buttonText: 'Cancel' }]
      }));
      const footer = rendered.firstElementChild;
      const seat = footer.children[0];
      const button = seat.querySelector('[role="button"]');
      // The button's hidden copy lists the label's runs, one per line
      const sizer = button.lastElementChild;
      assert.equal(sizer.getAttribute('aria-hidden'), 'true');
      const runs = sizer.firstElementChild.firstElementChild;
      assert.deepEqual(Array.from(runs.children).map(function (run) {
        return run.textContent;
      }), ['Keep', 'both']);
      // The widest run as the layout pass reports it, then the floor
      Object.defineProperty(runs, 'offsetWidth', { configurable: true, value: 32.5 });
      Object.defineProperty(runs, 'offsetHeight', { configurable: true, value: 36 });
      await act(async function () {
        layoutCallback([{ target: runs }]);
        await new Promise(function (resolve) {
          setTimeout(resolve, 0);
        });
      });
      const chrome = parseFloat(button.style.paddingLeft) + parseFloat(button.style.paddingRight) + parseFloat(button.style.borderLeftWidth) + parseFloat(button.style.borderRightWidth);
      assert.equal(seat.style.minWidth, (32.5 + chrome) + 'px', 'the floor is the widest run, the paddings and the border');
      assert.equal(footer.children[1].style.minWidth, '', 'a button that has not measured keeps the ratio alone');
      await cleanup();
    });

    test(template + ': danger draws the primary as danger; a loadingStatus shows the InlineLoading', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const rendered = await render(React.createElement(Registry.ModalFooter, {
        danger: true,
        loadingStatus: 'active',
        primaryButtonText: 'Delete',
        secondaryButtonText: 'Cancel'
      }));
      const footer = rendered.firstElementChild;
      const buttons = footer.querySelectorAll('[role="button"]');
      assert.equal(buttons[1].style.backgroundColor, cssValue('backgroundColor', t['color.button_danger_container']), 'the danger primary');
      const spinner = buttons[1].querySelector('[role="img"], svg');
      assert.equal(spinner !== null, true, 'the primary shows an InlineLoading');
      await cleanup();
    });
  }

});
