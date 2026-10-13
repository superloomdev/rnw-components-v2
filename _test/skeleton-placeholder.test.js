// Info: SkeletonPlaceholder atom. Every sample state renders under all
// three templates as an aria-hidden box of the theme's skeleton container
// colour and radius, with a full-cover shimmer child in the skeleton
// shimmer colour sweeping on the theme's skeleton cycle; under reduced
// motion the shimmer rests.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { AccessibilityInfo } from 'react-native-web';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/atom/skeleton/sample.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, a11yTree, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

// The behaviors' reduced-motion hook reads `AccessibilityInfo`, a singleton:
// stub its answer so a state render sees the motion level under test (in
// jsdom there is no matchMedia, so the real answer is always "reduced")
const REAL_IS_REDUCED = AccessibilityInfo.isReduceMotionEnabled;

function stubReducedMotion (value) {
  AccessibilityInfo.isReduceMotionEnabled = function () {
    return Promise.resolve(value);
  };
}

afterEach(function () {
  AccessibilityInfo.isReduceMotionEnabled = REAL_IS_REDUCED;
});
afterEach(cleanup);


describe('SkeletonPlaceholder: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': box, colours and sweep come from the theme', async function () {
        stubReducedMotion(false);
        const t = buildNative(template).tokens;
        const Registry = buildSystem(template, factories);
        const container = await render(React.createElement(Registry.SkeletonPlaceholder, state.props));
        const root = container.firstChild;
        const shimmer = root.firstChild;
        const props = state.props || {};
        const size = t['control.skeleton_placeholder_size'];

        // The box: prop size or the placeholder size, container colour, radius
        assert.equal(root.getAttribute('aria-hidden'), 'true');
        assert.equal(root.style.width, (props.width === undefined ? size : props.width) + 'px');
        assert.equal(root.style.height, (props.height === undefined ? size : props.height) + 'px');
        assert.equal(root.style.backgroundColor, cssValue('backgroundColor', t['color.skeleton_container']));
        // The platform expands the radius and overflow shorthands per edge
        assert.equal(root.style.borderTopLeftRadius, t['control.skeleton_radius'] + 'px');
        assert.equal(root.style.borderBottomRightRadius, t['control.skeleton_radius'] + 'px');
        assert.equal(root.style.overflowX, 'hidden');
        assert.equal(root.style.overflowY, 'hidden');
        assert.equal(root.style.position, 'relative');

        // The shimmer: full cover in the shimmer colour, sweeping on the cycle
        assert.equal(shimmer.style.backgroundColor, cssValue('backgroundColor', t['color.skeleton_shimmer']));
        assert.equal(shimmer.style.position, 'absolute');
        assert.equal(shimmer.style.width, '100%');
        assert.equal(shimmer.style.animationDuration, t['motion.skeleton_cycle'] + 'ms');
        assert.equal(shimmer.style.animationIterationCount, 'infinite');
        assert.equal(shimmer.style.animationTimingFunction, 'ease-in-out');

        // The accessibility answer: hidden, holding one undrawn child
        const tree = a11yTree(container);
        assert.equal(tree.length, 2);
        assert.equal(tree[0], 'div aria-hidden=true');
        assert.equal(tree[1], '  div');
      });
    }
  }

  test('a radius prop overrides the skeleton radius', async function () {
    stubReducedMotion(true);
    const t = buildNative('default').tokens;
    const Registry = buildSystem('default', factories);
    const container = await render(React.createElement(Registry.SkeletonPlaceholder, { radius: 24 }));
    assert.equal(container.firstChild.style.borderTopLeftRadius, '24px');
    const plain = await render(React.createElement(Registry.SkeletonPlaceholder, {}));
    assert.equal(plain.firstChild.style.borderTopLeftRadius, t['control.skeleton_radius'] + 'px');
  });

  test('under reduced motion the shimmer rests without an animation', async function () {
    stubReducedMotion(true);
    const Registry = buildSystem('default', factories);
    const container = await render(React.createElement(Registry.SkeletonPlaceholder, {}));
    const shimmer = container.firstChild.firstChild;
    assert.equal(shimmer.style.animationDuration, '');
    assert.equal(shimmer.style.animationIterationCount, '');
    assert.equal(shimmer.style.animationTimingFunction, '');
    assert.equal(shimmer.style.animationName, '');
    assert.equal(shimmer.style.backgroundColor.length > 0, true);
  });

});
