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
        assert.notEqual(container, null);

        // No role, no close: the band is plain content
        assert.equal(container.getAttribute('role'), null);
        assert.equal(container.querySelectorAll('[role="button"]').length, props.actionButtonLabel !== undefined ? 1 : 0);

        // The container and the marker draw the GIVEN kind - `error` stays error
        assert.equal(container.style.borderLeftColor, cssValue('borderLeftColor', t['color.notification_marker_' + cellKind]), 'the given kind, never mapped');
        assert.equal(container.style.backgroundColor, cssValue('backgroundColor', t[low ? 'color.notification_background_' + cellKind : 'color.notification_container']));
        const icon = container.children[0].children[0];
        const svg = icon.querySelector('svg');
        const glyph = t['icon.' + GLYPHS[kind]];
        const glyphPaths = glyph.sizes !== undefined && glyph.sizes[String(t['control.notification_icon_size'])] !== undefined ? glyph.sizes[String(t['control.notification_icon_size'])].paths : glyph.paths;
        assert.equal(svg.querySelector('path').getAttribute('d'), glyphPaths[0].d);

        // The action is the inline ghost at the cells
        if (props.actionButtonLabel !== undefined) {
          const button = container.querySelector('[role="button"]');
          assert.equal(button.parentElement.style.height, t['control.notification_action_height'] + 'px');
          const seat = button.parentElement.parentElement;
          assert.equal(seat.style.marginLeft, t['control.notification_action_inset'] + 'px');
        }
      });
    }
  }

});
