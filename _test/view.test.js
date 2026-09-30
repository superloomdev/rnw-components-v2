// Info: View atom. Every sample state renders under all three templates
// drawing exactly the token leaves it names, read from the built theme; a
// box with no props draws nothing; a leaf the theme lacks throws.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/atom/view/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Render one View under a template and return its element.

@param {String} template - Template name
@param {Object} props    - View props

@return {Promise<HTMLElement>} - The box element
*********************************************************************/
async function renderView (template, props) {

  const Registry = buildSystem(template, { View: factories.View });
  const container = await render(React.createElement(Registry.View, props));

  return container.firstElementChild;

}


describe('View: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': draws exactly the named leaves', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const element = await renderView(template, props);
        assert.equal(element.style.paddingTop, t['spacing.' + props.padding] + 'px');
        assert.equal(element.style.paddingLeft, t['spacing.' + props.padding] + 'px');
        assert.equal(element.style.backgroundColor, props.background ? cssValue('backgroundColor', t['color.' + props.background]) : '');
        assert.equal(element.style.borderTopWidth, props.borderWidth ? t['border.' + props.borderWidth] + 'px' : '');
        assert.equal(element.style.borderTopColor, props.borderWidth ? cssValue('borderTopColor', t['color.' + props.borderColor]) : '');
        assert.equal(element.style.borderTopLeftRadius, props.radius ? t['shape.' + props.radius] + 'px' : '');
      });
    }
  }

});


describe('View: defaults and failures', function () {

  test('a box with no props draws no fill, border, radius or padding', async function () {
    const element = await renderView('default', {});
    for (const property of ['backgroundColor', 'borderTopWidth', 'borderTopLeftRadius', 'paddingTop', 'gap']) {
      assert.equal(element.style[property], '', property + ' is drawn without being asked');
    }
  });

  test('a border width alone draws in border_subtle_01; a gap leaf sets the gap', async function () {
    const t = buildNative('carbon').tokens;
    const element = await renderView('carbon', { borderWidth: 'width_02', gap: 'spacing_03' });
    assert.equal(element.style.borderTopWidth, t['border.width_02'] + 'px');
    assert.equal(element.style.borderTopColor, cssValue('borderTopColor', t['color.border_subtle_01']));
    assert.equal(element.style.gap, t['spacing.spacing_03'] + 'px');
  });

  test('a leaf the theme lacks throws', async function () {
    await assert.rejects(renderView('default', { background: 'no_such' }), /color\.no_such/);
    await assert.rejects(renderView('default', { padding: 'no_such' }), /spacing\.no_such/);
    await assert.rejects(renderView('default', { radius: 'no_such' }), /shape\.no_such/);
  });

});
