// Info: HeaderName member. Every sample state under every template: a link
// across the header's height, `control.header_name_padding_start` and
// `control.header_name_padding_end` (`_sm` below `breakpoint.md`), the
// `control.header_name_focus_width` border in `color.focus` under focus,
// the name in `type.header_name` and `color.header_name_label`, the prefix
// in `type.header_name_prefix` before a no-break space.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import SAMPLE from '../component/composite/header/sample.header-name.js';
import { buildNative } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';
import { inBar, TEMPLATE_NAMES, atWindow, registryFor, renderSample, sides } from './header-shared.js';

afterEach(cleanup);

// react-native-web writes the `transparent` keyword as a zero-alpha color
const CLEAR = 'rgba(0, 0, 0, 0)';

const MD = sides('md');

describe('HeaderName: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the name comes from the theme', async function () {
        const t = buildNative(template).tokens;
        await atWindow(MD.above, async function () {
          const container = await renderSample(registryFor(template), 'HeaderName', state);
          const link = container.querySelector(inBar('> a'));
          assert.equal(link !== null, true, 'the name is a link');
          assert.equal(link.getAttribute('href'), '#');
          assert.equal(link.style.paddingLeft, t['control.header_name_padding_start'] + 'px');
          assert.equal(link.style.paddingRight, t['control.header_name_padding_end'] + 'px');
          assert.equal(link.style.borderBottomWidth, t['control.header_name_focus_width'] + 'px');
          assert.equal(link.style.borderBottomColor, CLEAR);
          assert.equal(link.style.alignSelf, 'stretch');
          const line = link.querySelector('[dir="auto"]');
          assert.equal(line.style.fontWeight, String(t['type.header_name'].fontWeight));
          assert.equal(line.style.color, cssValue('color', t['color.header_name_label']));
          const prefix = line.querySelector('span');
          const prefixed = state.props.prefix !== undefined;
          assert.equal(prefix !== null, prefixed, 'the prefix span');
          if (prefixed) {
            assert.equal(prefix.style.fontWeight, String(t['type.header_name_prefix'].fontWeight));
            assert.equal(line.textContent, 'Acme\u00a0Platform');
          } else {
            assert.equal(line.textContent, 'Platform');
          }
          await act(async function () {
            link.focus();
          });
          assert.equal(link.style.borderBottomColor, cssValue('borderBottomColor', t['color.focus']), 'the focus border');
        });
      });
    }
  }

});


describe('HeaderName: the window and a shown toggle', function () {

  test('below md the end padding is the small cell', async function () {
    const t = buildNative('carbon').tokens;
    await atWindow(MD.below, async function () {
      const container = await renderSample(registryFor('carbon'), 'HeaderName', SAMPLE[0]);
      assert.equal(container.querySelector(inBar('> a')).style.paddingRight, t['control.header_name_padding_end_sm'] + 'px');
    });
  });

  test('after a shown toggle the name starts at the toggle cell', async function () {
    const t = buildNative('carbon').tokens;
    const Registry = registryFor('carbon');
    const container = await render(React.createElement(Registry.HeaderName, { afterToggle: true, children: 'Platform' }));
    assert.equal(container.querySelector('[role="link"], a').style.paddingLeft, t['control.header_name_padding_start_toggle'] + 'px');
  });

});
