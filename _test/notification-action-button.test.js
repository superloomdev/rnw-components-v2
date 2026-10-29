// Info: NotificationActionButton member. The notification's action
// through a standalone render: size `sm` at
// `control.notification_action_height` - inline the ghost re-coloured
// (ink `notification_action`, hover `notification_action_container_hover`,
// `notification_action_hover` under lowContrast), toast the
// tertiary-inverse map (transparent rest, label and border
// `notification_action_tertiary_inverse`, fills `_hover` / `_active`
// with label `_text`).

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES).concat('shapes');

afterEach(cleanup);
function paintedFill (t, button) {
  return t['feedback.press'] === 'ripple' ? button.children[0].style.backgroundColor : button.style.backgroundColor;
}


async function fire (element, event) {
  await act(async function () {
    element.dispatchEvent(event);
  });
}

describe('NotificationActionButton: the two colour maps', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': the inline ghost reads the notification cells', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const rendered = await render(React.createElement(Registry.NotificationActionButton, { label: 'Retry', variant: 'inline' }));
      const seat = rendered.firstElementChild;
      const button = seat.querySelector('[role="button"]');
      assert.notEqual(button, null);
      assert.equal(seat.style.marginLeft, t['control.notification_action_inset'] + 'px');
      assert.equal(button.querySelector('[dir="auto"]').style.color, cssValue('color', t['color.notification_action']), 'the ghost ink');
      await fire(button, new Event('pointerover', { bubbles: true }));
      assert.equal(paintedFill(t, button), cssValue('backgroundColor', t['color.notification_action_container_hover']), 'the inline hover fill');
      await fire(button, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
      await fire(button, new MouseEvent('mouseup', { bubbles: true, button: 0 }));
      await cleanup();
    });

    test(template + ': lowContrast swaps the inline hover fill', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const rendered = await render(React.createElement(Registry.NotificationActionButton, { label: 'Retry', lowContrast: true, variant: 'inline' }));
      const button = rendered.querySelector('[role="button"]');
      await fire(button, new Event('pointerover', { bubbles: true }));
      assert.equal(paintedFill(t, button), cssValue('backgroundColor', t['color.notification_action_hover']), 'the low-contrast hover fill');
      await fire(button, new Event('pointerout', { bubbles: true }));
      await cleanup();
    });

    test(template + ': the toast action is the tertiary-inverse map', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const rendered = await render(React.createElement(Registry.NotificationActionButton, { label: 'Retry', variant: 'toast' }));
      const seat = rendered.firstElementChild;
      const button = seat.querySelector('[role="button"]');
      assert.equal(seat.style.marginLeft, t['control.notification_toast_action_inset'] + 'px');
      // Rest: transparent fill, the inverse label and border
      assert.equal(button.querySelector('[dir="auto"]').style.color, cssValue('color', t['color.notification_action_tertiary_inverse']));
      assert.equal(button.style.borderTopColor, cssValue('borderColor', t['color.notification_action_tertiary_inverse']));
      await fire(button, new Event('pointerover', { bubbles: true }));
      assert.equal(paintedFill(t, button), cssValue('backgroundColor', t['color.notification_action_tertiary_inverse_hover']), 'the hover fill');
      assert.equal(button.querySelector('[dir="auto"]').style.color, cssValue('color', t['color.notification_action_tertiary_inverse_text']), 'the label over the fill');
      await fire(button, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
      assert.equal(paintedFill(t, button), cssValue('backgroundColor', t['color.notification_action_tertiary_inverse_active']), 'the active fill');
      await fire(button, new MouseEvent('mouseup', { bubbles: true, button: 0 }));
      await cleanup();
    });
  }

});
