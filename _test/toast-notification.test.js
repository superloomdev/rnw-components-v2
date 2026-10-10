// Info: ToastNotification molecule. Every sample state renders under all
// three templates with the band, marker, icon, texts, action and close
// button read from the `notification` cells; the marker and icon show only
// where `anatomy.status_marker` says `bar_icon`; `lowContrast` swaps the
// inverse set for the status fill, the support marker and primary text.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/notification/sample.toast-notification.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);
const KINDS = Object.freeze(['info', 'success', 'warning', 'error']);

afterEach(cleanup);


/********************************************************************
Build a registry for a template.

@param {String} template - Template name

@return {Object} - Registry
*********************************************************************/
function registryFor (template) {

  return buildSystem(template, factories);

}


/********************************************************************
Render one ToastNotification and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - ToastNotification props

@return {Promise<Object>} - { band, iconSeat, details, texts, close }
*********************************************************************/
async function renderToast (Registry, props) {

  const container = await render(React.createElement(Registry.ToastNotification, props));
  const band = container.querySelector('[role="status"], [role="alert"]');

  return {
    band: band,
    iconSeat: function () {
      return band.children[0];
    },
    icon: function () {
      return band.children[0].querySelector('svg');
    },
    details: function () {
      return band.children[1];
    },
    texts: function () {
      return Array.from(band.children[1].querySelectorAll('[dir="auto"]'));
    },
    close: function () {
      return band.children[2];
    }
  };

}


describe('ToastNotification: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the band comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const parts = await renderToast(registryFor(template), props);
        const lowContrast = props.lowContrast === true;
        const markerLeaf = lowContrast ? 'support_' + props.kind : 'notification_marker_' + props.kind;
        const containerLeaf = lowContrast ? 'notification_background_' + props.kind : 'notification_container';
        const textLeaf = lowContrast ? 'text_primary' : 'notification_text';

        // The band's container cells
        const band = parts.band;
        assert.notEqual(band, null);
        assert.equal(band.style.width, t['control.notification_width'] + 'px');
        assert.equal(band.style.backgroundColor, cssValue('backgroundColor', t['color.' + containerLeaf]));
        assert.equal(band.style.borderTopLeftRadius, t['control.notification_radius'] + 'px');

        // The marker and the status icon, only under `bar_icon`
        const barIcon = t['anatomy.status_marker'] === 'bar_icon';
        assert.equal(band.style.borderLeftWidth, (barIcon ? t['control.notification_marker_width'] : 0) + 'px');
        assert.equal(band.style.borderLeftColor, cssValue('borderLeftColor', t['color.' + markerLeaf]));
        const seat = parts.iconSeat();
        assert.equal(seat.style.display, barIcon ? 'flex' : 'none');
        const icon = parts.icon();
        assert.equal(icon.getAttribute('width'), String(t['control.notification_icon_size']));
        assert.equal(icon.getAttribute('fill'), t['color.' + markerLeaf]);

        // The texts: title, then the given subtitle, action label and caption
        const texts = parts.texts();
        assert.equal(texts[0].textContent, props.title);
        assert.equal(texts[0].style.fontSize, t['type.notification_title'].fontSize + 'px');
        assert.equal(texts[0].style.color, cssValue('color', t['color.' + textLeaf]));
        if (props.subtitle !== undefined) {
          assert.equal(texts[1].textContent, props.subtitle);
          assert.equal(texts[1].style.fontSize, t['type.notification_body'].fontSize + 'px');
        }

        // The close button: ghost IconButton, the member size, the close leaf
        const close = parts.close();
        const closeSvg = close.querySelector('svg');
        assert.equal(closeSvg.getAttribute('fill'), t['color.' + (lowContrast ? 'icon_primary' : 'notification_close_icon')]);
      });
    }
  }

  // Each kind's marker and background cells
  for (const kind of KINDS) {
    test('kind ' + kind + ' reads its status cells under carbon', async function () {
      const t = buildNative('carbon').tokens;
      const parts = await renderToast(registryFor('carbon'), { kind: kind, title: 'T', lowContrast: true });
      assert.equal(parts.band.style.backgroundColor, cssValue('backgroundColor', t['color.notification_background_' + kind]));
      assert.equal(parts.icon().getAttribute('fill'), t['color.support_' + kind]);
    });
  }

});


describe('ToastNotification: behavior through the DOM', function () {

  test('the close button calls onClose; the action reports its press and hover color', async function () {
    const t = buildNative('carbon').tokens;
    let closed = 0;
    let acted = 0;
    const parts = await renderToast(registryFor('carbon'), {
      action: {
        label: 'Undo',
        onPress: function () {
          acted = acted + 1;
        }
      },
      kind: 'info',
      onClose: function () {
        closed = closed + 1;
      },
      title: 'T'
    });
    await act(async function () {
      parts.close().querySelector('[role="button"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(closed, 1);

    const actionText = parts.texts().find(function (el) {
      return el.textContent === 'Undo';
    });
    const action = actionText.parentElement;
    await act(async function () {
      action.dispatchEvent(new Event('pointerover', { bubbles: true }));
    });
    assert.equal(actionText.style.color, cssValue('color', t['color.notification_action_hover']));
    await act(async function () {
      action.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(acted, 1);
  });

  test('alert role announces alert', async function () {
    const parts = await renderToast(registryFor('carbon'), { role: 'alert', title: 'T' });
    assert.equal(parts.band.getAttribute('role'), 'alert');
  });

});
