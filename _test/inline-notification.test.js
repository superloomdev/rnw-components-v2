// Info: InlineNotification molecule. Every sample state renders under
// all three themes with the container, marker, icon, text and close read
// from the `notification` cells; `lowContrast` draws the kind fill, the
// 1 px kind outline and primary text. The close calls
// `onCloseButtonClick` then `onClose`, a `false` return vetoes, and a
// closed notification unmounts.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/notification/sample.inline-notification.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES).concat('shapes');

afterEach(cleanup);

function closeButton (seat) {
  return seat !== null && seat.matches('[role="button"]') ? seat : seat.querySelector('[role="button"]');
}


async function fire (element, event) {
  await act(async function () {
    element.dispatchEvent(event);
  });
}

function registryFor (template) {
  return buildSystem(template, factories);
}

const GLYPHS = { error: 'error_filled', info: 'information_filled', 'info-square': 'information_square_filled', success: 'success', warning: 'warning_filled', 'warning-alt': 'warning_alt_filled' };

async function renderInline (Registry, props) {
  const rendered = await render(React.createElement(Registry.InlineNotification, props));
  const root = rendered.firstElementChild;
  return {
    container: root,
    details: root === null ? null : root.children[0],
    icon: function () {
      return root === null ? null : root.children[0].children[0];
    },
    text: function () {
      return root === null ? null : root.children[0].children[1];
    },
    close: function () {
      return root === null ? null : root.children[1] || null;
    },
    rendered: rendered
  };
}

describe('InlineNotification: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the band comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const kind = props.kind || 'info';
        const cellKind = kind === 'info-square' ? 'info' : (kind === 'warning-alt' ? 'warning' : kind);
        const low = props.lowContrast === true;
        const parts = await renderInline(registryFor(template), props);

        // The container: width, min height, the marker, the fill and the low-contrast outline
        const container = parts.container;
        assert.notEqual(container, null);
        assert.equal(container.getAttribute('role'), 'status');
        assert.equal(container.style.width, '100%');
        assert.equal(container.style.maxWidth, t['control.notification_inline_width'] + 'px');
        assert.equal(container.style.minHeight, t['control.notification_min_height'] + 'px');
        assert.equal(container.style.borderLeftWidth, t['control.notification_marker_width'] + 'px');
        assert.equal(container.style.borderLeftColor, cssValue('borderLeftColor', t['color.notification_marker_' + cellKind]));
        assert.equal(container.style.backgroundColor, cssValue('backgroundColor', t[low ? 'color.notification_background_' + cellKind : 'color.notification_container']));
        if (low) {
          // Upstream draws the low-contrast outline as an inset box-shadow
          assert.equal(container.style.boxShadow, 'inset 0px 0px 0px ' + t['control.notification_outline_width'] + 'px ' + t['color.notification_outline_' + kind]);
        } else {
          assert.equal(container.style.boxShadow, '');
        }

        // The details inset cells
        const details = parts.details;
        assert.equal(details.style.marginLeft, t['control.notification_details_inset'] + 'px');
        assert.equal(details.style.marginRight, t['control.notification_details_inset_end'] + 'px');

        // The icon: the kind's glyph at the icon cells
        const icon = parts.icon();
        assert.equal(icon.style.marginTop, t['control.notification_icon_top'] + 'px');
        assert.equal(icon.style.marginRight, t['control.notification_icon_gap'] + 'px');
        const svg = icon.querySelector('svg');
        assert.equal(svg.getAttribute('width'), String(t['control.notification_icon_size']));
        const glyph = t['icon.' + GLYPHS[kind]];
        const glyphPaths = glyph.sizes !== undefined && glyph.sizes[String(t['control.notification_icon_size'])] !== undefined ? glyph.sizes[String(t['control.notification_icon_size'])].paths : glyph.paths;
        assert.equal(svg.querySelector('path').getAttribute('d'), glyphPaths[0].d);

        // The text: the title with its gap and the subtitle
        const text = parts.text();
        assert.equal(text.style.paddingTop, t['control.notification_text_padding_block'] + 'px');
        const rows = text.querySelectorAll('[dir="auto"]');
        assert.equal(rows[0].textContent, props.title);
        assert.equal(rows[0].style.color, cssValue('color', t[low ? 'color.text_primary' : 'color.notification_text']));
        assert.equal(rows[0].style.marginRight, t['control.notification_title_gap'] + 'px');
        if (props.subtitle !== undefined) {
          assert.equal(rows[1].textContent, props.subtitle);
        }

        // The close: in flow at the end unless hidden, the 48 seat
        const close = parts.close();
        if (props.hideCloseButton === true) {
          assert.equal(close, null);
        } else {
          assert.notEqual(close, null);
          const closeSvg = close.querySelector('svg');
          assert.notEqual(closeSvg, null);
        }
      });
    }
  }

});

describe('InlineNotification: the close chain', function () {

  test('the close calls onCloseButtonClick then onClose; a false vetoes and keeps the band', async function () {
    const calls = [];
    const Registry = registryFor('carbon');
    const parts = await renderInline(Registry, {
      onCloseButtonClick: function () {
        calls.push('button');
      },
      onClose: function () {
        calls.push('close');
        return false;
      },
      title: 'T'
    });
    await fire(closeButton(parts.close()), new MouseEvent('click', { bubbles: true }));
    assert.deepEqual(calls, ['button', 'close']);
    assert.notEqual(parts.rendered.querySelector('[role="status"]'), null, 'the vetoed band stays mounted');
  });

  test('a close without a veto unmounts the band', async function () {
    const parts = await renderInline(registryFor('carbon'), { title: 'T' });
    await fire(closeButton(parts.close()), new MouseEvent('click', { bubbles: true }));
    assert.equal(parts.rendered.querySelector('[role="status"]'), null);
  });

});
