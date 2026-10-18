// Info: SliderSkeleton molecule. Every template renders the slider's
// loading shape: a label bar over a shrink-wrap row of two endpoint bars
// and the track host painted by the shared slider paint - full fill,
// centered non-interactive handle - all of it hidden from the
// accessibility tree. The endpoint wrappers and the track's full-width
// basis share the row's flex shrink, so the bars follow measured widths
// instead of a fixed number.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/molecule/slider/sample.slider-skeleton.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

const SKELETON_FACTORIES = { SliderSkeleton: factories.SliderSkeleton, SkeletonPlaceholder: factories.SkeletonPlaceholder };

afterEach(cleanup);


describe('SliderSkeleton: the row and its paint, under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': label, endpoint and track placeholders, shared paint, no roles', async function () {
        const t = buildNative(template).tokens;
        const Registry = buildSystem(template, SKELETON_FACTORIES);
        const container = await render(React.createElement(Registry.SliderSkeleton, state.props));
        const root = container.firstElementChild;

        // The whole skeleton is hidden and carries no semantics
        assert.equal(root.getAttribute('aria-hidden'), 'true', template);
        assert.equal(container.querySelectorAll('[role]').length, 0, template + ': no roles');
        assert.equal(container.querySelectorAll('input, button, [tabindex]').length, 0, template + ': nothing interactive');

        // The label bar stands above the row unless hidden
        const label = container.querySelector('[data-testid="slider-skeleton-label"]');
        if (state.props.hideLabel === true) {
          assert.equal(label, null, template + ': hideLabel omits the bar');
        } else {
          assert.equal(Number.parseFloat(label.style.width), t['control.field_skeleton_label_width'], template);
          assert.equal(Number.parseFloat(label.style.height), t['control.field_skeleton_label_height'], template);
          assert.equal(Number.parseFloat(label.parentElement.style.marginBottom), t['spacing.spacing_03'], template);
        }

        // The row is the nominal track plus the two endpoint blocks and gaps
        const row = container.querySelector('[data-testid="slider-skeleton-row"]');
        const rowWidth = t['control.slider_min_width'] + 2 * t['control.slider_skeleton_range_width'] + 2 * t['control.slider_gap'];
        assert.equal(Number.parseFloat(row.style.width), rowWidth, template);
        assert.equal(row.style.flexDirection, 'row', template);
        assert.equal(row.style.alignItems, 'center', template);
        assert.equal(Number.parseFloat(row.style.gap), t['control.slider_gap'], template);

        // Endpoint bars: a nominal-width wrapper that flex-shrinks, whose
        // measured width feeds the placeholder (nominal before layout)
        for (const key of ['minimum', 'maximum']) {
          const bar = container.querySelector('[data-testid="slider-skeleton-' + key + '"]');
          const wrap = bar.parentElement;
          assert.equal(Number.parseFloat(wrap.style.width), t['control.slider_skeleton_range_width'], template + ' ' + key);
          assert.equal(Number.parseFloat(wrap.style.height), t['control.slider_skeleton_range_height'], template + ' ' + key);
          assert.equal(wrap.style.flexShrink, '1', template + ' ' + key);
          assert.equal(Number.parseFloat(bar.style.width), t['control.slider_skeleton_range_width'], template + ' ' + key);
          assert.equal(Number.parseFloat(bar.style.height), t['control.slider_skeleton_range_height'], template + ' ' + key);
        }

        // The track host keeps the live min/max bounds on a full-width
        // basis that flex-shrinks with the endpoints
        const host = container.querySelector('[data-testid="slider-skeleton-track"]');
        assert.equal(host.style.width, '100%', template);
        assert.equal(host.style.flexShrink, '1', template);
        assert.equal(Number.parseFloat(host.style.minWidth), t['control.slider_min_width'], template);
        assert.equal(Number.parseFloat(host.style.maxWidth), t['control.slider_max_width'], template);
        assert.equal(Number.parseFloat(host.style.height), t['control.slider_height'], template);

        // Shared paint: the inactive and fully-filled bars inset by the
        // track cell, the tick mounted, the handle face centered
        const trackHeight = t['control.slider_track_height'];
        const height = t['control.slider_height'];
        const inactive = container.querySelector('[data-testid="slider-skeleton-inactive"]');
        assert.equal(Number.parseFloat(inactive.style.left), t['control.slider_track_inset'], template);
        assert.equal(Number.parseFloat(inactive.style.right), t['control.slider_track_inset'], template);
        assert.equal(Number.parseFloat(inactive.style.top), (height - trackHeight) / 2, template);
        assert.equal(Number.parseFloat(inactive.style.height), trackHeight, template);
        const filled = container.querySelector('[data-testid="slider-skeleton-filled"]');
        assert.equal(Number.parseFloat(filled.style.left), t['control.slider_track_inset'], template + ': full fill');
        assert.equal(Number.parseFloat(filled.style.right), t['control.slider_track_inset'], template + ': full fill');
        const face = container.querySelector('[data-testid="slider-skeleton-thumb-face"]');
        assert.equal(face.style.left, '50%', template + ': centered handle');
        assert.equal(Number.parseFloat(face.style.width), t['control.slider_handle_size'], template);
        assert.equal(Number.parseFloat(face.style.height), t['control.slider_handle_size'], template);
        assert.ok(container.querySelector('[data-testid="slider-skeleton-tick"]') !== null, template + ': tick mounted');

        // Skeleton placeholders only: label + two endpoint bars
        const placeholders = container.querySelectorAll('[data-testid^="slider-skeleton-"]');
        const bars = ['slider-skeleton-label', 'slider-skeleton-minimum', 'slider-skeleton-maximum'];
        const painted = ['slider-skeleton-row', 'slider-skeleton-track', 'slider-skeleton-inactive', 'slider-skeleton-tick', 'slider-skeleton-filled', 'slider-skeleton-thumb-face'];
        const expected = (state.props.hideLabel === true ? bars.slice(1) : bars).concat(painted);
        assert.deepEqual(Array.from(placeholders).map(function (node) {
          return node.getAttribute('data-testid');
        }).sort(), expected.sort(), template);
      });
    }
  }

});
