// Info: ActionableNotification molecule. Every sample state renders
// under all three themes: inline the ghost action at the inline cells,
// as a toast the tertiary-inverse action under `shadow.notification` at
// `control.notification_width` with the toast insets. The default role
// `alertdialog` traps focus and Escape asks for the close while
// `closeOnEscape`; the close chain vetoes on `false`.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/notification/sample.actionable-notification.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES).concat('shapes');

afterEach(cleanup);

async function fire (element, event) {
  await act(async function () {
    element.dispatchEvent(event);
  });
}

function registryFor (template) {
  return buildSystem(template, factories);
}

async function renderActionable (Registry, props) {
  const rendered = await render(React.createElement(Registry.ActionableNotification, props));
  const band = rendered.querySelector('[role="alertdialog"], [role="alert"], [role="status"]');
  return {
    band: band,
    action: function () {
      // The action is the labelled Button; the close's pressable carries no text
      const buttons = band === null ? [] : Array.from(band.querySelectorAll('[role="button"]'));
      const labelled = buttons.filter(function (button) {
        return button.querySelector('[dir="auto"]') !== null;
      });
      return labelled.length > 0 ? labelled[0] : null;
    },
    close: function () {
      if (band === null) {
        return null;
      }
      // The close is the icon-only button: the action seat is a labelled
      // Button, the close's pressable carries no text
      const buttons = Array.from(band.querySelectorAll('[role="button"]'));
      const iconOnly = buttons.filter(function (button) {
        return button.querySelector('[dir="auto"]') === null;
      });
      return iconOnly.length > 0 ? iconOnly[iconOnly.length - 1] : null;
    },
    rendered: rendered
  };
}

describe('ActionableNotification: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the band comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const kind = props.kind || 'info';
        const low = props.lowContrast === true;
        const inline = props.inline === true;
        const parts = await renderActionable(registryFor(template), props);

        // The container: role, the layout width and the toast shadow
        const band = parts.band;
        assert.notEqual(band, null);
        assert.equal(band.getAttribute('role'), 'alertdialog');
        assert.equal(band.style.width, (inline ? t['control.notification_inline_width'] : t['control.notification_width']) + 'px');
        assert.equal(band.style.borderLeftWidth, t['control.notification_marker_width'] + 'px');
        assert.equal(band.style.borderLeftColor, cssValue('borderLeftColor', t['color.notification_marker_' + kind]));
        assert.equal(band.style.backgroundColor, cssValue('backgroundColor', t[low ? 'color.notification_background_' + kind : 'color.notification_container']));
        if (inline) {
          // The inline band draws no elevation; a low-contrast one draws
          // the kind outline as upstream's inset box-shadow
          assert.equal(band.style.boxShadow, low ? 'inset 0px 0px 0px ' + t['control.notification_outline_width'] + 'px ' + t['color.notification_outline_' + kind] : '');
        } else {
          assert.equal(band.style.boxShadow, t['shadow.notification'].boxShadow);
        }

        // The action: the inline ghost or the toast tertiary-inverse
        const action = parts.action();
        assert.notEqual(action, null);
        assert.equal(action.parentElement.style.height, t['control.notification_action_height'] + 'px');
        const seat = action.parentElement.parentElement;
        assert.equal(seat.style.marginLeft, (inline ? t['control.notification_action_inset'] : t['control.notification_toast_action_inset']) + 'px');
        if (inline) {
          assert.equal(action.style.backgroundColor, 'rgba(0, 0, 0, 0)', 'the ghost rests transparent');
          assert.equal(action.style.boxShadow, '0px 0px 0px rgba(0, 0, 0, 0)', 'the ghost draws no elevation');
        } else {
          // The toast action is upstream's tertiary button: tertiary-inverse
          // on the dark band, the standard tertiary map under lowContrast
          const labelLeaf = low ? 'button_tertiary' : 'notification_action_tertiary_inverse';
          assert.equal(action.querySelector('[dir="auto"]').style.color, cssValue('color', t['color.' + labelLeaf]), 'the action label');
          assert.equal(action.style.borderTopColor, cssValue('borderColor', t['color.' + labelLeaf]), 'the action border');
        }

        // The toast insets: icon top and text bottom padding
        const details = band.children[0];
        const icon = details.children[0];
        assert.equal(icon.style.marginTop, (inline ? t['control.notification_icon_top'] : t['control.notification_toast_icon_top']) + 'px');

        // The close: in flow at the end unless hidden; the toast then
        // takes the action's end space
        const close = parts.close();
        if (props.hideCloseButton === true) {
          assert.equal(close, null);
          if (!inline) {
            assert.equal(seat.style.marginRight, t['control.notification_action_end_space'] + 'px');
          }
        } else {
          assert.notEqual(close, null);
        }
      });
    }
  }

});

describe('ActionableNotification: trap, Escape and the close chain', function () {

  test('Escape asks for the close while closeOnEscape; false disables it', async function () {
    let calls = 0;
    const Registry = registryFor('carbon');
    await renderActionable(Registry, {
      actionButtonLabel: 'Retry',
      onClose: function () {
        calls = calls + 1;
      },
      title: 'T'
    });
    await act(async function () {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    assert.equal(calls, 1, 'Escape asks for the close by default');
    await cleanup();
    await renderActionable(Registry, {
      actionButtonLabel: 'Retry',
      closeOnEscape: false,
      onClose: function () {
        calls = calls + 1;
      },
      title: 'T'
    });
    await act(async function () {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    assert.equal(calls, 1, 'closeOnEscape: false holds');
  });

  test('the close calls onCloseButtonClick then onClose; a false vetoes and keeps the band', async function () {
    const calls = [];
    const parts = await renderActionable(registryFor('carbon'), {
      actionButtonLabel: 'Retry',
      onCloseButtonClick: function () {
        calls.push('button');
      },
      onClose: function () {
        calls.push('close');
        return false;
      },
      title: 'T'
    });
    await fire(parts.close(), new MouseEvent('click', { bubbles: true }));
    assert.deepEqual(calls, ['button', 'close']);
    assert.notEqual(parts.rendered.querySelector('[role="alertdialog"]'), null);
  });

  test('a close without a veto unmounts the band', async function () {
    const parts = await renderActionable(registryFor('carbon'), { actionButtonLabel: 'Retry', title: 'T' });
    await fire(parts.close(), new MouseEvent('click', { bubbles: true }));
    assert.equal(parts.rendered.querySelector('[role="alertdialog"]'), null);
  });

});
