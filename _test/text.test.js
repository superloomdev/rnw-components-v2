// Info: Text atom. Every sample state renders under all three templates
// with the named type set and color read from the built theme; the break
// mode cuts a single line; a type or color leaf the theme lacks throws.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/atom/text/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Render one Text under a template and return its element.

@param {String} template - Template name
@param {Object} props    - Text props

@return {Promise<HTMLElement>} - The text element
*********************************************************************/
async function renderText (template, props) {

  const Registry = buildSystem(template, { Text: factories.Text });
  const container = await render(React.createElement(Registry.Text, props));

  return container.firstElementChild;

}


describe('Text: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': type set and color come from the theme', async function () {
        const t = buildNative(template).tokens;
        const set = t['type.' + (state.props.type || 'body_compact_02')];
        const element = await renderText(template, state.props);
        assert.equal(element.style.fontSize, set.fontSize + 'px');
        assert.equal(element.style.lineHeight, set.lineHeight + 'px');
        assert.equal(element.style.fontWeight, set.fontWeight);
        assert.equal(element.style.fontFamily, cssValue('fontFamily', t['font.family.' + set.fontFamily]));
        assert.equal(element.style.color, cssValue('color', t['color.' + (state.props.color || 'text_primary')]));
        assert.equal(element.textContent, state.props.text || state.props.children);
      });
    }
  }

});


describe('Text: break mode and failures', function () {

  test('tail cuts one line with an ellipsis; wrap and no break mode wrap', async function () {
    // The single-line cut is emitted as atomic classes for overflow, ellipsis and no wrap
    const cutClasses = function (element) {
      return Array.from(element.classList).filter(function (name) {
        return /^r-(textOverflow|whiteSpace|overflow)-/.test(name);
      }).length;
    };
    assert.equal(cutClasses(await renderText('default', { text: 'Long', breakMode: 'tail' })), 3);
    assert.equal(cutClasses(await renderText('default', { text: 'Long', breakMode: 'wrap' })), 0);
    assert.equal(cutClasses(await renderText('default', { text: 'Long' })), 0);
  });

  test('a type leaf or a color leaf the theme lacks throws', async function () {
    await assert.rejects(renderText('default', { text: 'x', type: 'no_such_type' }), /type\.no_such_type/);
    await assert.rejects(renderText('default', { text: 'x', color: 'no_such_color' }), /color\.no_such_color/);
  });

  test('a header role is announced as a heading', async function () {
    const element = await renderText('default', { text: 'Title', accessibilityRole: 'header' });
    assert.equal(element.getAttribute('role'), 'heading');
  });

});
