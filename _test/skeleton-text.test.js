// Info: SkeletonText molecule. Every sample state renders under all three
// templates as a stretched column of skeleton lines at the theme's text or
// heading height, each followed by the text gap; a paragraph's widths step
// back by the fixed sequence, a point width per the primary's formula.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/skeleton/sample.skeleton-text.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, a11yTree, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

// The upstream sequence the paragraph's per-line step-back is built from;
// expected widths are derived from it, so a production swap fails here
const RANDOMS = [0.973051493507435, 0.15334737213558558, 0.5671034553053769];

function step (min, max, n) {
  return Math.floor(RANDOMS[n % 3] * (max - min + 1)) + min;
}

// The width a state gives line `index` in Node (no layout pass, so a
// percent width is the plain percent)
function expectedWidth (props, index) {
  const width = props.width === undefined ? '100%' : props.width;
  if (props.paragraph === true && typeof width === 'number') {
    return step(Math.max(width - 75, 0), width, index);
  }
  return width;
}

afterEach(cleanup);


describe('SkeletonText: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': line heights, gaps and widths step back by the sequence', async function () {
        const t = buildNative(template).tokens;
        const Registry = buildSystem(template, factories);
        const container = await render(React.createElement(Registry.SkeletonText, state.props));
        const root = container.firstChild;
        const props = state.props || {};
        const paragraph = props.paragraph === true;
        const count = paragraph ? (props.lineCount === undefined ? 3 : props.lineCount) : 1;
        const height = t[props.heading === true ? 'control.skeleton_heading_height' : 'control.skeleton_text_height'];

        // The root stretches to the frame
        assert.equal(root.style.alignSelf, 'stretch');

        // One line wrapper per line, each with the text gap under it
        assert.equal(root.childNodes.length, count);
        for (let index = 0; index < count; index++) {
          const wrapper = root.childNodes[index];
          const line = wrapper.firstChild;
          assert.equal(wrapper.style.marginBottom, t['control.skeleton_text_gap'] + 'px');
          assert.equal(line.style.height, height + 'px');
          const expected = expectedWidth(props, index);
          assert.equal(line.style.width, typeof expected === 'number' ? expected + 'px' : expected);
          assert.equal(line.style.backgroundColor, cssValue('backgroundColor', t['color.skeleton_container']));
          assert.equal(line.getAttribute('aria-hidden'), 'true');
        }

        // The accessibility answer: an anonymous column over hidden lines
        const tree = a11yTree(container);
        assert.equal(tree[0], 'div');
        assert.equal(tree.length, 1 + count * 3);
      });
    }
  }

});
