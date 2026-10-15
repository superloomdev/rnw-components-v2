// Info: ToggleSkeleton. The toggle's loading shape is the handle's circle
// and a short bar one spacing step after it, both skeleton placeholders.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);

const SKELETON_FACTORIES = { SkeletonPlaceholder: factories.SkeletonPlaceholder, ToggleSkeleton: factories.ToggleSkeleton };


describe('ToggleSkeleton: the circle and bar pair', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': 18-point circle, bar a spacing step later', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, SKELETON_FACTORIES);
      const container = await render(React.createElement(Registry.ToggleSkeleton, null));
      const row = container.firstElementChild;
      const circle = row.children[0];
      const bar = row.children[1];
      const circleSize = t['control.toggle_skeleton_circle_size'];
      assert.equal(circleSize, 18, template + ': the skeleton circle is its own cell, not the live handle');
      assert.equal(circle.style.width, circleSize + 'px');
      assert.equal(circle.style.height, circleSize + 'px');
      assert.equal(getComputedStyle(circle).borderTopLeftRadius, t['shape.radius_max'] + 'px');
      assert.equal(bar.style.width, t['control.toggle_skeleton_bar_width'] + 'px');
      assert.equal(bar.style.height, t['control.toggle_skeleton_bar_height'] + 'px');
      assert.equal(row.style.gap, t['spacing.spacing_03'] + 'px');
      assert.equal(row.style.alignItems, 'center');
      // Both are skeleton placeholders, hidden from the reader
      assert.equal(circle.getAttribute('aria-hidden'), 'true');
      assert.equal(bar.getAttribute('aria-hidden'), 'true');
    });
  }

});
