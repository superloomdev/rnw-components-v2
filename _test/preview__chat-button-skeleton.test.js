// Info: preview__ChatButtonSkeleton molecule. The skeleton placeholder in
// the chat button's pill: the button's height for the size, half of it as
// the corner and the skeleton button width.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


for (const template of TEMPLATE_NAMES) {

  describe('preview__ChatButtonSkeleton / ' + template, function () {

    test('draws the pill: the button\'s height for the size, half of it as the corner', async function () {
      const t = buildNative(template).tokens;
      const heights = { sm: 'size.size_small', md: 'size.size_medium', lg: 'control.button_height' };
      for (const size of Object.keys(heights)) {
        const container = await render(React.createElement(buildSystem(template, factories).preview__ChatButtonSkeleton, { size: size }));
        const root = container.firstChild;
        assert.equal(root.style.height, t[heights[size]] + 'px', size + ' height, ' + template);
        assert.equal(root.style.width, t['control.button_skeleton_width'] + 'px', size + ' width, ' + template);
        assert.equal(root.style.borderTopLeftRadius, t[heights[size]] / 2 + 'px', size + ' pill, ' + template);
        assert.equal(root.style.borderBottomRightRadius, t[heights[size]] / 2 + 'px', size + ' pill, ' + template);
      }
    });

    test('the default is the large height', async function () {
      const t = buildNative(template).tokens;
      const container = await render(React.createElement(buildSystem(template, factories).preview__ChatButtonSkeleton, null));
      assert.equal(container.firstChild.style.height, t['control.button_height'] + 'px', template);
      assert.equal(container.firstChild.style.backgroundColor, cssValue('backgroundColor', t['color.skeleton_container']), template);
    });

  });

}
