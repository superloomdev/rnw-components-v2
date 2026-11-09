// Info: BreadcrumbSkeleton molecule. A plain row of shimmer bars at
// `control.breadcrumb_skeleton_width` x `_height` with the breadcrumb's
// separators at its gap; no landmark, no list roles.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/breadcrumb/sample.breadcrumb-skeleton.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES).concat('shapes');

afterEach(cleanup);

describe('BreadcrumbSkeleton: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the bars come from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const Registry = buildSystem(template, factories);
        const rendered = await render(React.createElement(Registry.BreadcrumbSkeleton, props));
        const root = rendered.firstElementChild;
        const count = props.items !== undefined ? props.items : 3;
        const gap = t[props.size === 'sm' ? 'control.breadcrumb_gap_small' : 'control.breadcrumb_gap'];

        // No landmark, no list roles
        assert.equal(root.getAttribute('role'), null);
        assert.equal(rendered.querySelector('[role="navigation"]'), null);
        assert.equal(root.children.length, count);

        for (let index = 0; index < count; index++) {
          const item = root.children[index];
          assert.equal(item.style.marginRight, gap + 'px');
          const bar = item.children[0];
          assert.equal(bar.style.width, t['control.breadcrumb_skeleton_width'] + 'px');
          assert.equal(bar.style.height, t['control.breadcrumb_skeleton_height'] + 'px');
          const separators = Array.from(item.querySelectorAll('[dir="auto"]')).filter(function (el) {
            return el.textContent === '/';
          });
          const last = index === count - 1 && props.noTrailingSlash === true;
          if (last) {
            assert.equal(separators.length, 0);
          } else {
            assert.equal(separators.length, 1);
            assert.equal(separators[0].style.color, cssValue('color', t['color.breadcrumb_separator']));
            assert.equal(separators[0].style.marginLeft, gap + 'px');
          }
        }
      });
    }
  }

});
