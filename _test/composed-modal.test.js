// Info: ComposedModal composite. Every sample state renders under all
// three themes with the scrim, container, header, body and footer read
// from the `dialog` cells; the width is the size's
// `control.dialog_width_ratio*` of the layer space and the max height the
// size's `control.dialog_height_ratio*`. The scrolling body is a region
// with the end space; the bottom fade draws only where
// `anatomy.dialog_scroll_fade` says `shown`. Danger lands the initial
// focus on the secondary button, `onClose` returning `false` vetoes a
// close, and outside press closes only a passive dialog.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/modal/sample.composed-modal.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES).concat('shapes');

afterEach(cleanup);


/********************************************************************
Dispatch one DOM event on an element inside act.

@param {HTMLElement} element - Target
@param {Event}       event   - Event
*********************************************************************/
async function fire (element, event) {

  await act(async function () {
    element.dispatchEvent(event);
  });

}

function registryFor (template) {
  return buildSystem(template, factories);
}

async function renderComposed (Registry, props) {
  const rendered = await render(React.createElement(Registry.ComposedModal, props));
  const dialog = rendered.querySelector('[role="dialog"]');
  return {
    rendered: rendered,
    scrim: rendered.querySelector('[data-testid="composed-modal-scrim"]'),
    dialog: dialog,
    header: dialog === null ? null : dialog.children[0],
    close: dialog === null ? null : dialog.children[1],
    body: dialog === null ? null : dialog.children[2],
    footer: dialog === null ? null : dialog.children[3] || null
  };
}

describe('ComposedModal: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the dialog comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const parts = await renderComposed(registryFor(template), props);

        // The scrim fills with the scrim cell at the overlay stacking
        assert.notEqual(parts.scrim, null);
        assert.equal(parts.scrim.style.backgroundColor, cssValue('backgroundColor', t['color.dialog_scrim']));
        assert.equal(parts.scrim.style.zIndex, String(t['stacking.overlay']));

        // The container: surface cells, the size's width and height ratios of the layer space
        const dialog = parts.dialog;
        assert.notEqual(dialog, null);
        assert.equal(dialog.getAttribute('aria-modal'), 'true');
        assert.equal(dialog.style.backgroundColor, cssValue('backgroundColor', t['color.dialog_container']));
        assert.equal(dialog.style.borderTopWidth, t['control.dialog_border_width'] + 'px');
        assert.equal(dialog.style.borderTopColor, cssValue('borderTopColor', t['color.dialog_border']));
        const suffix = { xs: '_xs', sm: '_sm', md: '', lg: '_lg' }[props.size || 'md'];
        assert.equal(dialog.style.width, (window.innerWidth * t['control.dialog_width_ratio' + suffix]) + 'px', 'width ratio');
        assert.equal(dialog.style.maxHeight, (window.innerHeight * t['control.dialog_height_ratio' + suffix]) + 'px', 'height ratio');

        // The header: the eyebrow label, the heading and the close seat
        const header = parts.header;
        assert.equal(header.style.paddingTop, t['control.dialog_padding_top'] + 'px');
        assert.equal(header.style.paddingLeft, t['control.dialog_padding_inline'] + 'px');
        const heading = header.children[1];
        assert.equal(heading.textContent, props.header.title);
        assert.equal(heading.style.fontSize, t['type.dialog_heading'].fontSize + 'px');
        assert.equal(heading.style.color, cssValue('color', t['color.dialog_heading']));
        const eyebrow = header.children[0];
        assert.equal(eyebrow.textContent, props.header.label);
        assert.equal(eyebrow.style.fontSize, t['type.label01'].fontSize + 'px');
        assert.equal(eyebrow.style.display, t['anatomy.dialog_label'] === 'shown' ? '' : 'none');
        // The heading's end gutter: the ratio of the dialog width minus the close seat, md/lg only
        const gutter = t['control.dialog_text_gutter_ratio'] * window.innerWidth * t['control.dialog_width_ratio' + suffix] - t['control.icon_button_size'];
        const gutters = props.size === 'xs' || props.size === 'sm' ? '' : (gutter > 0 ? gutter + 'px' : '');
        assert.equal(heading.style.paddingRight, gutters, 'heading end gutter');
        const close = parts.close;
        assert.equal(close.style.display, t['anatomy.dialog_close'] === 'shown' ? 'flex' : 'none');
        const closeSvg = close.querySelector('svg');
        assert.equal(closeSvg.getAttribute('width'), String(t['control.dialog_close_icon_size']));

        // The body: the padding cells, the prose type and its end gutter
        const body = parts.body;
        assert.equal(body.style.paddingTop, t['control.dialog_body_padding_top'] + 'px');
        assert.equal(body.style.paddingBottom, t['control.dialog_body_padding_bottom'] + 'px');
        const bodyGutter = t['control.dialog_text_gutter_ratio'] * window.innerWidth * t['control.dialog_width_ratio' + suffix] - t['spacing.spacing_07'];
        const bodyGutters = props.size === 'xs' || props.size === 'sm' || (props.body !== undefined && props.body.hasForm === true) ? '' : (bodyGutter > 0 ? bodyGutter + 'px' : '');
        const prose = body.querySelector('[dir="auto"]');
        assert.equal(prose.style.fontSize, t['type.dialog_body'].fontSize + 'px');
        assert.equal(prose.style.color, cssValue('color', t['color.dialog_body']));
        assert.equal(prose.style.paddingRight, bodyGutters, 'body prose gutter');

        // The footer: absent when passive, else the actions height and the ratio widths
        if (props.footer === undefined) {
          assert.equal(parts.footer, null);
        } else {
          const footer = parts.footer;
          assert.notEqual(footer, null);
          assert.equal(footer.style.height, t['control.dialog_actions_height'] + 'px');
          const seats = Array.from(footer.children);
          const three = props.footer.secondaryButtons !== undefined;
          const ratio = three ? t['control.dialog_action_ratio_three'] : t['control.dialog_action_ratio'];
          const count = three ? 3 : (props.footer.secondaryButtonText !== undefined ? 2 : 1);
          assert.equal(seats.length, count);
          for (const seat of seats) {
            assert.equal(seat.style.flexBasis, (ratio * 100) + '%', 'button ratio');
          }
          const button = footer.querySelector('[role="button"]');
          assert.equal(button.style.paddingTop, t['control.dialog_action_padding_top'] + 'px');
          assert.equal(button.style.paddingBottom, t['control.dialog_action_padding_bottom'] + 'px');
        }
      });
    }
  }

});

describe('ComposedModal: the scrolling body and the fade', function () {

  test('the scrolling body is a named region; the fade draws only where the anatomy says shown', async function () {
    for (const template of TEMPLATE_NAMES) {
      const t = buildNative(template).tokens;
      const parts = await renderComposed(registryFor(template), {
        body: { hasScrollingContent: true },
        children: 'Long.',
        header: { title: 'T' },
        open: true
      });
      const region = parts.body.querySelector('[role="region"]');
      assert.notEqual(region, null, template + ': the scrolling body is a region');
      // The fade seat draws only where `anatomy.dialog_scroll_fade` is `shown`
      const fade = parts.body.querySelector('svg');
      if (t['anatomy.dialog_scroll_fade'] === 'shown') {
        assert.notEqual(fade, null, template + ': the shown fade draws');
      } else {
        assert.equal(fade, null, template + ': no fade under hidden');
      }
      await cleanup();
    }
  });

  test('a body without hasScrollingContent stays a plain box', async function () {
    const parts = await renderComposed(registryFor('carbon'), { children: 'B', header: { title: 'T' }, open: true });
    assert.equal(parts.body.querySelector('[role="region"]'), null);
  });

});

describe('ComposedModal: behavior through the DOM', function () {

  test('danger lands the initial focus on the secondary button', async function () {
    const parts = await renderComposed(registryFor('carbon'), {
      danger: true,
      footer: { primaryButtonText: 'Delete', secondaryButtonText: 'Cancel' },
      header: { title: 'T' },
      open: true
    });
    const buttons = parts.footer.querySelectorAll('[role="button"]');
    assert.equal(buttons.length, 2);
    assert.equal(document.activeElement, buttons[0], 'the secondary holds the initial focus');
    // And a non-danger dialog lands it on the close button
    const plain = await renderComposed(registryFor('carbon'), {
      footer: { primaryButtonText: 'Save', secondaryButtonText: 'Cancel' },
      header: { title: 'T' },
      open: true
    });
    assert.equal(document.activeElement, plain.close.querySelector('[role="button"]'), 'the close holds the initial focus');
  });

  test('onClose returning false vetoes the close', async function () {
    let called = 0;
    const parts = await renderComposed(registryFor('carbon'), {
      header: { title: 'T' },
      onClose: function () {
        called = called + 1;
        return false;
      },
      open: true
    });
    await fire(parts.close.querySelector('[role="button"]'), new MouseEvent('click', { bubbles: true }));
    assert.equal(called, 1);
    assert.notEqual(parts.rendered.querySelector('[role="dialog"]'), null, 'the vetoed dialog stays mounted');
  });

  test('outside press closes only a passive dialog; preventCloseOnClickOutside blocks it', async function () {
    let calls = 0;
    const onClose = function () {
      calls = calls + 1;
    };
    // Passive: outside press asks for the close
    const passive = await renderComposed(registryFor('carbon'), { header: { title: 'T' }, onClose: onClose, open: true });
    await fire(passive.scrim, new MouseEvent('click', { bubbles: true }));
    assert.equal(calls, 1, 'passive outside press closes');
    await cleanup();
    // With a footer: outside press is ignored by default
    calls = 0;
    const composed = await renderComposed(registryFor('carbon'), {
      footer: { primaryButtonText: 'Save' },
      header: { title: 'T' },
      onClose: onClose,
      open: true
    });
    await fire(composed.scrim, new MouseEvent('click', { bubbles: true }));
    assert.equal(calls, 0, 'a footer keeps outside presses from closing');
    await cleanup();
    // Passive + preventCloseOnClickOutside: ignored
    const prevented = await renderComposed(registryFor('carbon'), {
      header: { title: 'T' },
      onClose: onClose,
      open: true,
      preventCloseOnClickOutside: true
    });
    await fire(prevented.scrim, new MouseEvent('click', { bubbles: true }));
    assert.equal(calls, 0, 'prevented');
  });

  test('isFullWidth spans the layer space', async function () {
    const parts = await renderComposed(registryFor('carbon'), {
      header: { title: 'T' },
      isFullWidth: true,
      open: true
    });
    assert.equal(parts.dialog.style.width, window.innerWidth + 'px');
    assert.equal(parts.scrim.style.justifyContent, 'flex-start');
  });

  test('Escape asks for the close', async function () {
    let calls = 0;
    await renderComposed(registryFor('carbon'), {
      header: { title: 'T' },
      onClose: function () {
        calls = calls + 1;
      },
      open: true
    });
    await act(async function () {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    assert.equal(calls, 1);
  });

});
