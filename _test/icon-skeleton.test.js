// Info: IconSkeleton molecule. The placeholder drawn at the theme's
// smallest icon size inside a flex-start wrapper; hidden from the
// accessibility tree.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/skeleton/sample.icon-skeleton.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, a11yTree, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


describe('IconSkeleton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': icon size and skeleton colours come from the theme', async function () {
        const t = buildNative(template).tokens;
        const Registry = buildSystem(template, factories);
        const container = await render(React.createElement(Registry.IconSkeleton, state.props));
        const wrapper = container.firstChild;
        const box = wrapper.firstChild;

        // The wrapper hugs the icon; the placeholder draws at the icon size
        assert.equal(wrapper.style.alignSelf, 'flex-start');
        assert.equal(box.style.width, t['size.icon_01'] + 'px');
        assert.equal(box.style.height, t['size.icon_01'] + 'px');
        assert.equal(box.style.backgroundColor, cssValue('backgroundColor', t['color.skeleton_container']));
        assert.equal(box.getAttribute('aria-hidden'), 'true');
        assert.equal(box.firstChild.style.backgroundColor, cssValue('backgroundColor', t['color.skeleton_shimmer']));

        // The accessibility answer: an anonymous wrapper over hidden content
        const tree = a11yTree(container);
        assert.equal(tree.length, 3);
        assert.equal(tree[0], 'div');
        assert.equal(tree[1], '  div aria-hidden=true');
        assert.equal(tree[2], '    div');
      });
    }
  }

});
