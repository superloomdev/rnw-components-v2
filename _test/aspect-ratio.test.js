// Info: AspectRatio molecule. Every sample state renders under all three
// templates with the ratio's exact aspectRatio and a stretch box; a string
// child draws through the Text atom with its type set and color read from
// the built theme; the accessibility answer is a plain container holding
// the text.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/aspect-ratio/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, a11yTree, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
The W / H pair a ratio string names; an unknown name is the square.

@param {String} ratio - `W x H` or anything else

@return {Number} - W / H
*********************************************************************/
function ratioOf (ratio) {

  const parts = typeof ratio === 'string' ? ratio.split('x') : [];
  return parts.length === 2 ? Number(parts[0]) / Number(parts[1]) : 1;

}


describe('AspectRatio: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the box keeps the ratio and the label draws through the Text atom', async function () {
        const t = buildNative(template).tokens;
        const Registry = buildSystem(template, factories);
        const container = await render(React.createElement(Registry.AspectRatio, state.props));
        const root = container.firstChild;
        const set = t['type.body_compact_02'];

        // The box: full width at the named proportion
        assert.equal(root.style.aspectRatio, String(ratioOf(state.props.ratio)));
        assert.equal(root.style.alignSelf, 'stretch');
        assert.equal(root.getAttribute('role'), null);

        // The string child renders through the Text atom: its type set and color
        const text = root.firstChild;
        assert.equal(text.style.fontSize, set.fontSize + 'px');
        assert.equal(text.style.lineHeight, String(set.lineHeight / set.fontSize));
        assert.equal(text.style.fontWeight, set.fontWeight);
        assert.equal(text.style.letterSpacing, set.letterSpacing + 'px');
        assert.equal(text.style.color, cssValue('color', t['color.text_primary']));
        assert.equal(text.textContent, state.props.children);

        // The accessibility answer: a plain container holding the text run
        const tree = a11yTree(container);
        assert.equal(tree.length, 2);
        assert.equal(tree[0], 'div');
        assert.equal(tree[1], '  div text=' + JSON.stringify(state.props.children));
      });
    }
  }

});


describe('AspectRatio: the ratio prop', function () {

  test('an unknown ratio draws the square default', async function () {
    const Registry = buildSystem('default', factories);
    for (const bogus of ['7x8', 'wide', undefined]) {
      const container = await render(React.createElement(Registry.AspectRatio, { ratio: bogus }));
      assert.equal(container.firstChild.style.aspectRatio, '1', JSON.stringify(bogus));
    }
  });

  test('a non-string child renders unchanged, no Text wrapper added', async function () {
    const Registry = buildSystem('default', factories);
    const mark = React.createElement('span', { 'data-mark': 'yes' }, 'inside');
    const container = await render(React.createElement(Registry.AspectRatio, { ratio: '16x9' }, mark));
    const root = container.firstChild;
    assert.equal(root.firstChild.tagName, 'SPAN');
    assert.equal(root.firstChild.getAttribute('data-mark'), 'yes');
  });

});
