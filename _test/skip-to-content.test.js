// Info: SkipToContent molecule. A link hidden in a one-pixel clipped box
// until focus, then drawn on every skip-link cell; native renders
// nothing.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/skip-to-content/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

function registryFor (template) {
  return buildSystem(template, factories);
}

describe('SkipToContent: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the link rests hidden and draws focused', async function () {
        const t = buildNative(template).tokens;
        const container = await render(React.createElement(registryFor(template).SkipToContent, state.props));
        const link = container.querySelector('a[href]');
        assert.notEqual(link, null, 'the link mounts');
        assert.equal(link.style.width, '1px', 'rest: one pixel wide');
        assert.equal(link.style.height, '1px', 'rest: one pixel tall');
        assert.equal(link.style.overflowX, 'hidden', 'rest: clipped');
        assert.equal(link.style.overflowY, 'hidden', 'rest: clipped');
        assert.equal(link.style.position, 'absolute', 'rest: absolutely placed');
        await act(async function () {
          link.focus();
        });
        assert.equal(link.style.height, t['control.skip_link_height'] + 'px', 'focused: the height cell');
        assert.equal(link.style.paddingLeft, t['control.skip_link_padding_inline'] + 'px', 'focused: the inline padding');
        assert.equal(link.style.borderTopWidth, t['control.skip_link_border_width'] + 'px', 'focused: the border cell');
        assert.equal(link.style.borderTopColor, cssValue('color', t['color.skip_link_border']), 'focused: the border color');
        assert.equal(link.style.backgroundColor, cssValue('backgroundColor', t['color.skip_link_container']), 'focused: the fill');
        assert.equal(link.style.zIndex, String(t['stacking.skip_link']), 'focused: the stacking');
        const text = link.querySelector('div');
        assert.notEqual(text, null);
        assert.equal(text.style.fontSize, t['type.skip_link'].fontSize + 'px', 'focused: the type set');
        assert.equal(text.style.textDecoration, 'underline', 'focused: the link text is underlined, as the reference draws it');
      });
    }
  }

});

describe('SkipToContent: the web-only rule', function () {

  test('a native platform renders nothing', async function () {
    const { Platform } = await import('react-native-web');
    const real = Platform.OS;
    try {
      Platform.OS = 'ios';
      const container = await render(React.createElement(registryFor('carbon').SkipToContent, {}));
      assert.equal(container.querySelector('a[href]'), null, 'no link mounts on ios');
    } finally {
      Platform.OS = real;
    }
  });

});
