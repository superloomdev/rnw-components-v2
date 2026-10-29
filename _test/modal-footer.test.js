// Info: ModalFooter member. Its cells and roles through a standalone
// render: the stretched actions height, the ratio seat per button
// (`control.dialog_action_ratio`, `_three` for the three-button layout
// pushed to the end), the action padding, the secondary and primary
// kinds, the danger primary and the loading InlineLoading.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES).concat('shapes');

afterEach(cleanup);

describe('ModalFooter: the member draws its cells', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': two actions split the action ratio at the actions height', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const rendered = await render(React.createElement(Registry.ModalFooter, { primaryButtonText: 'Save', secondaryButtonText: 'Cancel' }));
      const footer = rendered.firstElementChild;
      assert.equal(footer.style.height, t['control.dialog_actions_height'] + 'px');
      assert.equal(footer.children.length, 2);
      for (const seat of footer.children) {
        assert.equal(seat.style.flexBasis, (t['control.dialog_action_ratio'] * 100) + '%', 'each action takes the ratio');
      }
      const buttons = footer.querySelectorAll('[role="button"]');
      assert.equal(buttons[0].textContent, 'Cancel');
      assert.equal(buttons[1].textContent, 'Save');
      assert.equal(buttons[1].style.backgroundColor, cssValue('backgroundColor', t['color.button_primary_container']), 'the last is the primary');
      assert.equal(buttons[0].style.backgroundColor, cssValue('backgroundColor', t['color.button_secondary_container']), 'the rest are secondaries');
      assert.equal(buttons[1].style.paddingTop, t['control.dialog_action_padding_top'] + 'px');
      assert.equal(buttons[1].style.paddingBottom, t['control.dialog_action_padding_bottom'] + 'px');
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
      }
      assert.equal(footer.style.justifyContent, 'flex-end', 'pushed to the end');
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
      assert.notEqual(spinner, null, 'the primary shows an InlineLoading');
      await cleanup();
    });
  }

});
