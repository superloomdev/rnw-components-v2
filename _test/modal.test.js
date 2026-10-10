// Info: Modal composite. Every sample state renders under all three
// templates with the scrim, container, header, body and actions read from
// the `dialog` cells; the close seat shows only where
// `anatomy.dialog_close` says `shown` and the actions row stretches or
// trails by `anatomy.dialog_actions`; Escape and outside press call
// `onClose`.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/modal/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

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
Render one Modal and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Modal props

@return {Promise<Object>} - { container, dialog, header, body, close, actions }
*********************************************************************/
async function renderModal (Registry, props) {

  const rendered = await render(React.createElement(Registry.Modal, props));
  const dialog = rendered.querySelector('[role="dialog"], [role="alertdialog"]');

  return {
    scrim: rendered.querySelector('[data-testid="modal-scrim"]'),
    dialog: dialog,
    header: function () {
      return dialog === null ? null : dialog.children[0];
    },
    body: function () {
      return dialog === null ? null : dialog.children[1];
    },
    close: function () {
      return dialog === null ? null : dialog.children[2];
    },
    actionsRow: function () {
      return dialog === null ? null : dialog.children[3] || null;
    }
  };

}


describe('Modal: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the dialog comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const parts = await renderModal(registryFor(template), props);

        // The scrim fills with the scrim cell at the overlay stacking
        assert.notEqual(parts.scrim, null);
        assert.equal(parts.scrim.style.backgroundColor, cssValue('backgroundColor', t['color.dialog_scrim']));
        assert.equal(parts.scrim.style.zIndex, String(t['stacking.overlay']));

        // The container's surface cells and a11y
        const dialog = parts.dialog;
        assert.notEqual(dialog, null);
        assert.equal(dialog.getAttribute('aria-modal'), 'true');
        assert.equal(dialog.style.backgroundColor, cssValue('backgroundColor', t['color.dialog_container']));
        assert.equal(dialog.style.borderTopLeftRadius, t['control.dialog_radius'] + 'px');
        assert.equal(dialog.style.borderTopWidth, t['control.dialog_border_width'] + 'px');
        if (t['control.dialog_min_width'] > 0 || t['control.dialog_max_width'] > 0) {
          assert.equal(dialog.style.minWidth, t['control.dialog_min_width'] + 'px');
          assert.equal(dialog.style.maxWidth, t['control.dialog_max_width'] + 'px');
          assert.equal(dialog.style.minHeight, t['control.dialog_min_height'] + 'px');
          assert.equal(dialog.style.width, '');
        } else {
          assert.equal(dialog.style.width, { xs: '32%', sm: '42%', md: '60%', lg: '84%' }[props.size || 'md']);
        }

        // The header: label when given, heading always, close seat gated by the anatomy
        const header = parts.header();
        assert.equal(header.style.paddingTop, t['control.dialog_padding_top'] + 'px');
        assert.equal(header.style.marginBottom, t['control.dialog_header_space'] + 'px');
        const heading = header.children[props.label === undefined ? 0 : 1];
        assert.equal(heading.textContent, props.title);
        assert.equal(heading.style.fontSize, t['type.dialog_heading'].fontSize + 'px');
        assert.equal(heading.style.color, cssValue('color', t['color.dialog_heading']));
        if (props.label !== undefined) {
          const eyebrow = header.children[0];
          assert.equal(eyebrow.textContent, props.label);
          assert.equal(eyebrow.style.fontSize, t['type.label01'].fontSize + 'px');
          assert.equal(eyebrow.style.color, cssValue('color', t['color.text_secondary']));
          assert.equal(eyebrow.style.display, t['anatomy.dialog_label'] === 'shown' ? '' : 'none');
        }
        const close = parts.close();
        assert.equal(close.style.display, t['anatomy.dialog_close'] === 'shown' ? 'flex' : 'none');
        const closeSvg = close.querySelector('svg');
        assert.equal(closeSvg.getAttribute('width'), String(t['control.dialog_close_icon_size']));

        // The body's padding cells
        const body = parts.body();
        assert.equal(body.style.paddingTop, t['control.dialog_body_padding_top'] + 'px');
        const actions = Array.isArray(props.actions) && props.passive !== true ? props.actions : [];
        const expectedBodyBottom = actions.length > 0 && t['anatomy.dialog_actions'] !== 'stretched'
          ? t['control.dialog_header_gap'] : t['control.dialog_body_padding_bottom'];
        assert.equal(body.style.paddingBottom, expectedBodyBottom + 'px');
        const bodyText = body.querySelector('[dir="auto"]');
        assert.equal(bodyText.style.fontSize, t['type.dialog_body'].fontSize + 'px');
        assert.equal(bodyText.style.color, cssValue('color', t['color.dialog_body']));

        // The actions row: stretched fills the height, trailing rows right
        const row = parts.actionsRow();
        if (actions.length === 0) {
          assert.equal(row, null);
          return;
        }
        assert.notEqual(row, null);
        const stretched = t['anatomy.dialog_actions'] === 'stretched';
        assert.equal(row.style.height, t['control.dialog_actions_height'] > 0 ? t['control.dialog_actions_height'] + 'px' : '');
        if (stretched) {
          assert.equal(row.style.justifyContent, 'flex-start');
        } else {
          assert.equal(row.style.justifyContent, 'flex-end');
          assert.equal(row.style.paddingTop, t['spacing.spacing_05'] + 'px');
          assert.equal(row.style.paddingBottom, t['control.dialog_actions_padding'] + 'px');
        }
        const buttons = Array.from(row.querySelectorAll('[role="button"]'));
        assert.equal(buttons.length, actions.length);
      });
    }
  }

});


describe('Modal: behavior through the DOM', function () {

  test('closed renders nothing; Escape, the close button and outside press close', async function () {
    let closed = 0;
    const onClose = function () {
      closed = closed + 1;
    };
    const Registry = registryFor('carbon');
    const container = await render(React.createElement(Registry.Modal, { open: false, onClose: onClose, title: 'T' }));
    assert.equal(container.querySelector('[role="dialog"]'), null);

    const parts = await renderModal(Registry, { open: true, onClose: onClose, title: 'T', children: 'Body', actions: [{ label: 'OK' }] });
    await act(async function () {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    assert.equal(closed, 1);

    await act(async function () {
      parts.close().querySelector('[role="button"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(closed, 2);

    await act(async function () {
      parts.scrim.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(closed, 3);
  });

  test('outside press is ignored under preventCloseOnClickOutside', async function () {
    let closed = 0;
    const parts = await renderModal(registryFor('carbon'), {
      open: true,
      preventCloseOnClickOutside: true,
      onClose: function () {
        closed = closed + 1;
      },
      title: 'T'
    });
    await act(async function () {
      parts.scrim.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(closed, 0);
  });

});
