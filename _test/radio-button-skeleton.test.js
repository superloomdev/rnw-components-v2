// Info: RadioButtonSkeleton molecule. Every template renders the radio's
// loading shape: exactly one label-width placeholder bar at the row's own
// height and no circle, all of it hidden from the accessibility tree.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

const SKELETON_FACTORIES = { RadioButtonSkeleton: factories.RadioButtonSkeleton, SkeletonPlaceholder: factories.SkeletonPlaceholder };

afterEach(cleanup);


describe('RadioButtonSkeleton: the label block alone, under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': one bar of the label cell at the row height, no circle', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, SKELETON_FACTORIES);
      const container = await render(React.createElement(Registry.RadioButtonSkeleton, null));
      const root = container.firstElementChild;

      // Exactly one skeleton label: the placeholder the spec sheets name
      const bars = container.querySelectorAll('[data-testid="radio-skeleton-label"]');
      assert.equal(bars.length, 1, template + ': exactly one skeleton label');
      assert.equal(container.querySelectorAll('[aria-hidden="true"]').length, 1, template + ': one hidden placeholder');
      const bar = bars[0];

      // The bar and the row height come from the spec's dedicated cells
      assert.equal(Number.parseFloat(bar.style.width), t['control.selection_skeleton_label_width'], template);
      assert.equal(Number.parseFloat(bar.style.height), t['control.radio_skeleton_label_height'], template);
      assert.equal(Number.parseFloat(root.style.height), t['control.radio_skeleton_label_height'], template);
      assert.equal(root.style.alignSelf, 'stretch', template);

      // The bar seats at the row's start/top edge: zero is structural
      assert.equal(bar, root.firstElementChild, template);
      assert.equal(bar.style.left, '', template);
      assert.equal(bar.style.top, '', template);

      // No control and no text: a skeleton paints only
      assert.equal(container.querySelector('[role="radio"]'), null, template);
      assert.equal(container.querySelector('button'), null, template);
      assert.equal(container.querySelector('input'), null, template);
      assert.equal(container.querySelector('[role]'), null, template);
      assert.equal(container.querySelector('[tabindex]'), null, template);
      assert.equal(container.querySelector('[aria-label]'), null, template);
      assert.equal(container.textContent.trim(), '', template);
    });
  }

});

describe('RadioButtonSkeleton: brand layers', function () {

  test('a brand override on the label-width cell changes the rendered width', async function () {
    const layers = [{ name: 'brand', tokens: { 'control.selection_skeleton_label_width': 144 } }];
    const Registry = buildSystem('default', SKELETON_FACTORIES, { layers: layers });
    const container = await render(React.createElement(Registry.RadioButtonSkeleton, null));
    const bar = container.querySelector('[data-testid="radio-skeleton-label"]');
    assert.equal(bar.style.width, '144px');
  });

});
