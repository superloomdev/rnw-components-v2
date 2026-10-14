// Info: ButtonSkeleton molecule. The skeleton placeholder at a button's
// height for the size, in the button's corner and the skeleton button
// width, standing in for a loading button. Upstream's `href` form is not
// carried: a placeholder is not a link.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


for (const template of TEMPLATE_NAMES) {

  describe('ButtonSkeleton / ' + template, function () {

    test('renders as the skeleton placeholder at the skeleton width and the button\'s corner', async function () {
      const t = buildNative(template).tokens;
      const container = await render(React.createElement(buildSystem(template, factories).ButtonSkeleton, null));
      const root = container.firstChild;
      assert.equal(root.style.width, t['control.button_skeleton_width'] + 'px', template);
      assert.equal(root.style.height, t['control.button_height'] + 'px', 'the default lg height, ' + template);
      assert.equal(root.style.borderTopLeftRadius, t['control.button_radius'] + 'px', 'the button\'s corner, ' + template);
      assert.equal(root.style.backgroundColor, cssValue('backgroundColor', t['color.skeleton_container']), template);
    });

    test('maps the size prop through the button size scale', async function () {
      const t = buildNative(template).tokens;
      const cases = { xs: 'size.size_xsmall', sm: 'size.size_small', md: 'size.size_medium', lg: 'control.button_height', xl: 'size.size_xlarge', '2xl': 'size.size_2xlarge' };
      for (const size of Object.keys(cases)) {
        const container = await render(React.createElement(buildSystem(template, factories).ButtonSkeleton, { size: size }));
        assert.equal(container.firstChild.style.height, t[cases[size]] + 'px', size + ' / ' + template);
      }
    });

  });

}
