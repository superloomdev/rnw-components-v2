// Info: TagSkeleton molecule. A skeleton placeholder in the tag's height
// and corner at the theme's skeleton tag width, in every template.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/tag/sample.tag-skeleton.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


describe('TagSkeleton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the tag\'s height and corner at the skeleton width', async function () {
        const t = buildNative(template).tokens;
        const Registry = buildSystem(template, factories);
        const container = await render(React.createElement(Registry.TagSkeleton, state.props));
        const root = container.firstElementChild;

        const height = state.props.size === 'sm' ? t['control.tag_height_small'] : t['control.tag_height'];
        assert.equal(root.style.width, t['control.tag_skeleton_width'] + 'px');
        assert.equal(root.style.height, height + 'px');
        assert.equal(root.style.borderTopLeftRadius, t['control.tag_radius'] + 'px');
      });
    }
  }

});
