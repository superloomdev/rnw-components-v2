// Info: Callout molecule. The actionable inline layout - marker, kind
// glyph, title and subtitle, the ghost action - with no close button, no
// role and no trap; the given `kind` is drawn as given, including
// `error` (the deprecation only warns).

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/notification/sample.callout.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES).concat('shapes');

afterEach(cleanup);

const GLYPHS = { error: 'error_filled', info: 'information_filled', 'info-square': 'information_square_filled', success: 'success', warning: 'warning_filled', 'warning-alt': 'warning_alt_filled' };

// Run a body in a window of the given width, restoring the window after
async function inWindow (width, body) {
  const before = window.innerWidth;
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width, writable: true });
  try {
    await body();
  } finally {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: before, writable: true });
  }
}

describe('Callout: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the band draws the given kind with no close', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const kind = props.kind || 'info';
        const cellKind = kind === 'info-square' ? 'info' : (kind === 'warning-alt' ? 'warning' : kind);
        const low = props.lowContrast === true;
        const Registry = buildSystem(template, factories);
        const rendered = await render(React.createElement(Registry.Callout, props));
        const container = rendered.firstElementChild;
        assert.equal(container !== null, true);

        // No role, no close: the band is plain content
        assert.equal(container.getAttribute('role'), null);
        assert.equal(container.querySelectorAll('[role="button"]').length, props.actionButtonLabel !== undefined ? 1 : 0);

        // The container and the marker draw the GIVEN kind - `error` stays error
        assert.equal(container.style.borderLeftColor, cssValue('borderLeftColor', t[low ? 'color.support_' + cellKind : 'color.notification_marker_' + cellKind]), 'the given kind, never mapped');
        assert.equal(container.style.backgroundColor, cssValue('backgroundColor', t[low ? 'color.notification_background_' + cellKind : 'color.notification_container']));
        const icon = container.children[0].children[0];
        const svg = icon.querySelector('svg');
        const glyph = t['icon.' + GLYPHS[kind]];
        const glyphPaths = glyph.sizes !== undefined && glyph.sizes[String(t['control.notification_icon_size'])] !== undefined ? glyph.sizes[String(t['control.notification_icon_size'])].paths : glyph.paths;
        assert.equal(svg.querySelector('path').getAttribute('d'), glyphPaths[0].d);

        // The action is the inline ghost at the cells
        if (props.actionButtonLabel !== undefined) {
          const button = container.querySelector('[role="button"]');
          assert.equal(button.parentElement.style.minHeight, t['control.notification_action_height'] + 'px');
          const seat = button.parentElement.parentElement;
          assert.equal(seat.style.marginLeft, t['control.notification_action_inset'] + 'px');
          assert.equal(seat.style.marginRight, t['control.notification_action_end_space'] + 'px', 'a band with no close keeps the end space after its action');
        }
      });
    }

    test(template + ': the low-contrast marker reads the support color', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const low = await render(React.createElement(Registry.Callout, { kind: 'info', lowContrast: true, title: 'Title' }));
      assert.equal(low.firstElementChild.style.borderLeftColor, cssValue('borderLeftColor', t['color.support_info']), 'the low-contrast marker');
      const high = await render(React.createElement(Registry.Callout, { kind: 'info', title: 'Title' }));
      assert.equal(high.firstElementChild.style.borderLeftColor, cssValue('borderLeftColor', t['color.notification_marker_info']), 'the high-contrast marker');
      await cleanup();
    });

    test(template + ': the band is fluid inside its width cell', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const rendered = await render(React.createElement(Registry.Callout, { actionButtonLabel: 'Go to page', title: 'Title' }));
      const container = rendered.firstElementChild;
      assert.equal(container.style.width, '100%', 'the band fills its container');
      assert.equal(container.style.maxWidth, t['control.notification_inline_width'] + 'px', 'capped at the inline width cell');
      await cleanup();
    });
  }

});

describe('Callout: below md the details measure their text', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': below md the details measure their text, grow along their line and never shrink', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, factories);
      const props = SAMPLE[0].props;
      let narrowBasis = null;
      let narrowDetailsBasis = null;
      let narrowDetailsWrap = null;
      let narrowDetailsGrow = null;
      let narrowDetailsShrink = null;
      let narrowDetailsCap = null;
      let narrowGrow = null;
      await inWindow(t['breakpoint.md'] - 1, async function () {
        const rendered = await render(React.createElement(Registry.Callout, props));
        const details = rendered.firstElementChild.children[0];
        narrowDetailsBasis = details.style.flexBasis;
        narrowDetailsWrap = details.style.flexWrap;
        narrowDetailsGrow = details.style.flexGrow;
        narrowDetailsShrink = details.style.flexShrink;
        narrowDetailsCap = details.style.maxWidth;
        narrowBasis = details.children[1].style.flexBasis;
        narrowGrow = details.children[1].style.flexGrow;
        await cleanup();
      });
      let wideBasis = null;
      let wideGrow = null;
      let wideCap = null;
      await inWindow(t['breakpoint.md'], async function () {
        const rendered = await render(React.createElement(Registry.Callout, props));
        const details = rendered.firstElementChild.children[0];
        wideBasis = details.children[1].style.flexBasis;
        wideGrow = details.children[1].style.flexGrow;
        wideCap = details.style.maxWidth;
        await cleanup();
      });
      const line = t['control.notification_width'] - t['control.notification_marker_width'] - t['control.notification_details_inset'] - t['spacing.spacing_09'];
      assert.equal(narrowDetailsBasis, 'auto', 'below md the details take their content width');
      assert.equal(narrowDetailsGrow, '1', 'below md the details grow, so an action that fits beside a short text ends at the band\'s end');
      assert.equal(narrowDetailsShrink, '0', 'the details never shrink: a native row never breaks after its one item that both grows and shrinks');
      assert.equal(narrowDetailsCap, line + 'px', 'below md the details are capped at their line: the band\'s floor less the marker and their two insets');
      assert.equal(narrowDetailsWrap, 'nowrap', 'below md the glyph and the text share one line, as the upstream details do not wrap');
      assert.equal(narrowBasis, 'auto', 'below md the text block is its content, so a native layout measures the text');
      assert.equal(narrowGrow, '0', 'below md the text block does not grow: a native layout measures a growing block at the whole line');
      assert.equal(wideBasis === 'auto', false, 'from md the text block shares the row from a zero basis');
      assert.equal(wideGrow, '1', 'from md the text block grows across the details');
      assert.equal(wideCap, '', 'from md the details have no cap');
    });
  }

});
