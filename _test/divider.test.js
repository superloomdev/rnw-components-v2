// Info: Divider atom. Every sample state renders under all three templates
// as a row with a single line child of the theme's divider width and color,
// indented at either end by the theme's divider inset per the flags; the
// accessibility answer is a separator.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/atom/divider/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, a11yTree, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


describe('Divider: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': line width, color and insets come from the theme', async function () {
        const t = buildNative(template).tokens;
        const Registry = buildSystem(template, factories);
        const container = await render(React.createElement(Registry.Divider, state.props));
        const root = container.firstChild;
        const line = root.firstChild;
        const props = state.props || {};

        // The row: a separator stretched across its container, indented per the flags
        assert.equal(root.getAttribute('role'), 'separator');
        assert.equal(root.style.alignSelf, 'stretch');
        assert.equal(root.style.flexDirection, 'row');
        const start = props.inset === true || props.insetStart === true;
        const end = props.inset === true || props.insetEnd === true;
        assert.equal(root.style.paddingLeft, (start ? t['control.divider_inset'] : 0) + 'px');
        assert.equal(root.style.paddingRight, (end ? t['control.divider_inset'] : 0) + 'px');

        // The line: the theme's divider color and width, filling the unpadded span
        assert.equal(line.style.backgroundColor, cssValue('backgroundColor', t['color.divider']));
        assert.equal(line.style.height, t['control.divider_width'] + 'px');
        assert.equal(line.style.flexGrow, '1');
        assert.equal(line.style.flexShrink, '1');
        assert.equal(line.style.flexBasis, 'auto');

        // The accessibility answer: a separator holding one undrawn child
        const tree = a11yTree(container);
        assert.equal(tree.length, 2);
        assert.equal(tree[0], 'div role=separator');
        assert.equal(tree[1], '  div');
      });
    }
  }

});
