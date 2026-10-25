// Info: CheckboxSkeleton molecule. Every template renders the checkbox's
// loading shape: exactly one label-width placeholder bar seated where the
// live row's text would start, the box's space left empty, all of it
// hidden from the accessibility tree.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

const SKELETON_FACTORIES = { CheckboxSkeleton: factories.CheckboxSkeleton, SkeletonPlaceholder: factories.SkeletonPlaceholder };

afterEach(cleanup);


describe('CheckboxSkeleton: the label block alone, under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': one bar of the label cell, inset where the text would start', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, SKELETON_FACTORIES);
      const container = await render(React.createElement(Registry.CheckboxSkeleton, null));
      const root = container.firstElementChild;

      // Exactly one skeleton label: the placeholder the spec sheets name
      const bars = container.querySelectorAll('[data-testid="checkbox-skeleton-label"]');
      assert.equal(bars.length, 1, template + ': exactly one skeleton label');
      assert.equal(container.querySelectorAll('[aria-hidden="true"]').length, 1, template + ': one hidden placeholder');
      const bar = bars[0];

      // The bar and the row geometry come from the spec's tokens and sums
      const insetStart = t['spacing.spacing_05'] + t['spacing.spacing_03'] + t['spacing.spacing_01'];
      const rootHeight = t['spacing.spacing_05'] + t['spacing.spacing_02'];
      const marginBottom = t['spacing.spacing_01'] + t['border.width_01'];
      assert.equal(Number.parseFloat(bar.style.width), t['control.selection_skeleton_label_width'], template);
      assert.equal(Number.parseFloat(bar.style.height), t['spacing.spacing_05'], template);
      assert.equal(Number.parseFloat(root.style.height), rootHeight, template);
      assert.equal(Number.parseFloat(root.style.marginBottom), marginBottom, template);
      assert.equal(root.style.alignSelf, 'stretch', template);

      // The seat anchors the bar at the start/top the spec sums describe
      const seat = bar.parentElement;
      assert.equal(seat === root.firstElementChild, true, template);
      assert.equal(seat.style.position, 'absolute', template);
      assert.equal(Number.parseFloat(seat.style.left), insetStart, template);
      assert.equal(Number.parseFloat(seat.style.top), t['spacing.spacing_01'], template);

      // No control and no text: a skeleton paints only
      assert.equal(container.querySelector('[role="checkbox"]'), null, template);
      assert.equal(container.querySelector('button'), null, template);
      assert.equal(container.querySelector('input'), null, template);
      assert.equal(container.querySelector('[role]'), null, template);
      assert.equal(container.querySelector('[tabindex]'), null, template);
      assert.equal(container.querySelector('[aria-label]'), null, template);
      assert.equal(container.textContent.trim(), '', template);
    });
  }

});

describe('CheckboxSkeleton: brand layers', function () {

  test('a brand override on the label-width cell changes the rendered width', async function () {
    const layers = [{ name: 'brand', tokens: { 'control.selection_skeleton_label_width': 144 } }];
    const Registry = buildSystem('default', SKELETON_FACTORIES, { layers: layers });
    const container = await render(React.createElement(Registry.CheckboxSkeleton, null));
    const bar = container.querySelector('[data-testid="checkbox-skeleton-label"]');
    assert.equal(bar.style.width, '144px');
  });

});
